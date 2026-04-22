import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Groq } from "groq-sdk";
import { getDb } from "@/lib/db";

// Initialize Groq AI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { placementId, message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const db = getDb();
    
    // Get placement context
    let context = "";
    if (placementId) {
      const placement = db.prepare("SELECT extracted_data FROM placements WHERE id = ?").get(placementId) as any;
      if (placement) {
        context = `You are a helpful placement assistant. Here is the information extracted from the job poster: ${placement.extracted_data}\n\n`;
      }
    }

    // Get previous messages for history
    const historyData = db.prepare("SELECT role, content FROM messages WHERE placement_id = ? ORDER BY created_at ASC").all(placementId) as any[];

    // Map history to Groq format
    const groqMessages = [
      { role: "system", content: `${context}Instructions: Answer questions based on the provided context only. If the info is missing, say you don't know. Always be professional and concise. Keep answers short and formatted nicely.` },
      ...historyData.map(h => ({ role: h.role, content: h.content })),
      { role: "user", content: message }
    ];

    const completion = await groq.chat.completions.create({
      messages: groqMessages as any,
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.3,
    });

    const assistantMessage = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";

    // Save messages to DB
    const userMsgId = uuidv4();
    const assistantMsgId = uuidv4();
    
    db.prepare("INSERT INTO messages (id, placement_id, role, content) VALUES (?, ?, ?, ?)").run(userMsgId, placementId, "user", message);
    db.prepare("INSERT INTO messages (id, placement_id, role, content) VALUES (?, ?, ?, ?)").run(assistantMsgId, placementId, "assistant", assistantMessage);

    return NextResponse.json({ reply: assistantMessage });
  } catch (error: any) {
    console.error("Groq Chat error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
