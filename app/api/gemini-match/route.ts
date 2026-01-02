import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  let lostItem: any = null;
  let foundItems: any[] = [];

  try {
    const body = await req.json();
    lostItem = body.lostItem;
    foundItems = body.foundItems;

    if (!lostItem || !foundItems || !Array.isArray(foundItems)) {
      return NextResponse.json({ error: "Insufficient data" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      System: MIT ADT Campus Lost & Found Assistant.
      
      USER LOST ITEM:
      Name: "${lostItem.itemName}"
      Location: "${lostItem.location}"
      Description: "${lostItem.description || "N/A"}"

      DATABASE OF FOUND ITEMS:
      ${foundItems.map((item: any) => `ID: ${item.id}, Name: ${item.itemName}, Location: ${item.location}`).join("\n")}

      TASK:
      1. Compare the Lost Item against the database.
      2. Use semantic matching (e.g., "blue" is similar to "navy").
      3. Identify likely matches based on item type and location proximity.
      
      Return ONLY a JSON array of the "id" strings. Do not include markdown formatting or extra text.
      Example: ["id123", "id456"]
    `;

    const result = await model.generateContent(prompt);
    
    // Safety check: Ensure the AI actually returned a response
    if (!result.response) throw new Error("AI Safety Filter blocked the response");

    const text = result.response.text();
    
    // Robust extraction: Finds the array even if Gemini adds markdown code blocks
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("AI output was not in the correct JSON format");
    
    const matches = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ matches });

  } catch (error: any) {
    console.error("AI Route Error:", error.message);
    
    // Fallback: Basic Keyword Matching
    if (lostItem && foundItems) {
      const lostWords = lostItem.itemName.toLowerCase().split(' ').filter((w: string) => w.length > 2);
      const fallbacks = foundItems
        .filter((f: any) => {
          const foundName = f.itemName.toLowerCase();
          return lostWords.some((word: string) => foundName.includes(word)) || 
                 f.location.toLowerCase() === lostItem.location.toLowerCase();
        })
        .map((f: any) => f.id);

      return NextResponse.json({ matches: fallbacks });
    }

    return NextResponse.json({ matches: [], error: error.message });
  }
}