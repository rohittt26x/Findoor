import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  // Define variables outside try block so catch can see them
  let lostItem: any = null;
  let foundItems: any[] = [];

  try {
    const body = await req.json();
    lostItem = body.lostItem;
    foundItems = body.foundItems;

    // 1. FIXED: Changed Array.now to Array.isArray
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
      Compare the Lost Item against the database. 
      Identify which Found Items are likely to be the same object based on name similarity and location proximity.
      
      Return ONLY a JSON array of the matching IDs. 
      Example: ["id1", "id4"]
      If no matches, return [].
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Invalid AI format");
    
    const matches = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ matches });

  } catch (error: any) {
    console.error("AI Error:", error.message);
    
    // 2. FIXED: Fallback logic now uses the local variables correctly
    if (lostItem && foundItems) {
      const lostName = lostItem.itemName.toLowerCase();
      const fallbacks = foundItems
        .filter((f: any) => f.itemName.toLowerCase().includes(lostName.split(' ')[0]))
        .map((f: any) => f.id);

      return NextResponse.json({ matches: fallbacks });
    }

    return NextResponse.json({ matches: [] });
  }
}