import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Set max duration for Vercel (allows time for AI and image processing)
export const maxDuration = 60;

// 2. Initialize the AI with your secure Server-Side Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Helper: Converts a Cloudinary/External URL to a Gemini-readable Data Part
 */
async function imageUrlToDataPart(url: string | undefined) {
  if (!url || !url.startsWith("http")) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    return {
      inlineData: {
        data: Buffer.from(buffer).toString("base64"),
        mimeType: "image/jpeg",
      },
    };
  } catch (e) {
    console.warn("Vision System: Could not process image pixels.");
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lostItem, foundItem } = body;

    if (!lostItem || !foundItem) {
      return NextResponse.json({ error: "Insufficient data provided" }, { status: 400 });
    }

    try {
      // 3. ATTEMPT NEURAL MATCHING (AI Vision + Text)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const lostImg = await imageUrlToDataPart(lostItem.imageUrl);
      const foundImg = await imageUrlToDataPart(foundItem.imageUrl);

      const prompt = `
        System: Campus Lost & Found Assistant (MIT ADT University)
        Task: Compare these two reports to determine if they refer to the same physical object.
        
        ITEM A (Lost): "${lostItem.itemName}" - ${lostItem.description || "No description"}
        ITEM B (Found): "${foundItem.itemName}" - ${foundItem.description || "No description"}
        
        Analysis Instructions:
        - Use location proximity and visual traits (color, brand, logos, shape).
        - If photos are provided, they take priority in the decision.
        
        Return ONLY a JSON object: {"isMatch": boolean, "confidence": number, "reason": "string"}
      `;

      const parts: any[] = [prompt];
      if (lostImg) parts.push(lostImg);
      if (foundImg) parts.push(foundImg);

      const result = await model.generateContent(parts);
      const text = result.response.text();
      
      // Extract valid JSON from potential markdown response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("AI output was not in JSON format");
      
      const analysis = JSON.parse(jsonMatch[0]);

      return NextResponse.json({ raw: analysis });

    } catch (aiError: any) {
      // 4. SMART FALLBACK (Triggered if API fails or quota is hit)
      console.error("AI Logic Failed. Switching to Heuristics:", aiError.message);

      const nameKeywords = lostItem.itemName.toLowerCase().split(' ');
      const isKeywordMatch = nameKeywords.some((word: string) => 
        word.length > 3 && foundItem.itemName.toLowerCase().includes(word)
      );
      
      const locationMatch = lostItem.location.toLowerCase() === foundItem.location.toLowerCase();

      return NextResponse.json({
        raw: {
          isMatch: isKeywordMatch || locationMatch,
          confidence: (isKeywordMatch && locationMatch) ? 80 : isKeywordMatch ? 60 : 30,
          reason: "Neural engine is in optimization mode. Match calculated via keyword/location heuristics."
        }
      });
    }
  } catch (error: any) {
    console.error("Critical API Route Crash:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}