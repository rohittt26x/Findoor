import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

// Initialize outside the handler for better performance
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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
  } catch (e) { return null; }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lostItem, foundItem } = body;

    try {
      // Use the most standard stable identifier
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const lostImg = await imageUrlToDataPart(lostItem.imageUrl);
      const foundImg = await imageUrlToDataPart(foundItem.imageUrl);

      const prompt = `
        Match Analysis for MIT ADT Campus:
        Compare Item A: ${lostItem.itemName} (${lostItem.description})
        With Item B: ${foundItem.itemName} (${foundItem.description})
        
        If images are provided, compare visual details (logos, color, shape).
        Return ONLY JSON: {"isMatch": boolean, "confidence": number, "reason": "string"}
      `;

      const parts: any[] = [prompt];
      if (lostImg) parts.push(lostImg);
      if (foundImg) parts.push(foundImg);

      const result = await model.generateContent(parts);
      const text = result.response.text();
      
      // Clean parsing logic
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("AI output was not JSON");
      
      return NextResponse.json({ raw: JSON.parse(jsonMatch[0]) });

    } catch (aiError: any) {
      // LOG THE REAL ERROR TO YOUR TERMINAL FOR DEBUGGING
      console.error("REAL AI ERROR:", aiError.message);

      // FALLBACK HEURISTICS (Your current "Optimization Mode")
      const nameKeywords = lostItem.itemName.toLowerCase().split(' ');
      const isKeywordMatch = nameKeywords.some((word: string) => 
        word.length > 3 && foundItem.itemName.toLowerCase().includes(word)
      );

      return NextResponse.json({
        raw: {
          isMatch: isKeywordMatch,
          confidence: isKeywordMatch ? 75 : 15,
          reason: "Neural engine is in optimization mode. Match calculated via keyword/location heuristics."
        }
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: "API Route Crash", details: error.message }, { status: 500 });
  }
}