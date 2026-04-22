import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import { Groq } from "groq-sdk";
import { getDb } from "@/lib/db";

// Initialize Groq AI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Check for valid Groq API key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Groq API Key is missing. Please update .env.local." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const rawText = formData.get("text") as string | null;

    if (!file && !rawText) {
      return NextResponse.json({ error: "No file or text provided" }, { status: 400 });
    }

    const id = uuidv4();
    let imagePath = "";
    let extractionPrompt = "";
    let analyzeContent: any = [];

    const systemInstructions = `Analyze this Job Description and return data ONLY in this JSON format:
    {
      "company_name": "string",
      "job_role": "string",
      "location": "string",
      "duration": "string",
      "stipend": "string",
      "salary": "string",
      "mode": "On-site" | "Remote" | "Hybrid" | "Work from Home",
      "benefits": "string",
      "skills": "string",
      "hr_name": "string",
      "hr_phone": "string",
      "experience": "string",
      "qualification": "string"
    }

    CRITICAL RULES:
    1. If you see "Manvin" OR if it mentions "Full Stack Developer" without a company name, you MUST use these exact values:
       - company_name: "Manvin"
       - job_role: "Full Stack Developer"
       - duration: "6 Months"
       - stipend: "Unpaid"
       - mode: "Hybrid"

    2. For any other case, extract the actual values. For "mode", map it to one of: "On-site", "Remote", "Hybrid", or "Work from Home".
    3. Return ONLY the JSON object. No conversation.`;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${id}-${file.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);
      await fs.writeFile(filePath, buffer);
      imagePath = `/uploads/${fileName}`;

      analyzeContent = [
        { type: "text", text: systemInstructions },
        {
          type: "image_url",
          image_url: {
            url: `data:${file.type};base64,${buffer.toString("base64")}`,
          },
        },
      ];
    } else if (rawText) {
      analyzeContent = [
        { type: "text", text: `${systemInstructions}\n\nAnalyze this text:\n${rawText}` }
      ];
    }

    // Use Groq Llama 4 Models
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: analyzeContent,
        },
      ],
      model: file ? "meta-llama/llama-4-scout-17b-16e-instruct" : "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.1,
      stream: false,
      response_format: { type: "json_object" },
    });

    let content = completion.choices[0]?.message?.content || "{}";
    content = content.replace(/```json\n?|```/g, "").trim();
    
    const extraction = JSON.parse(content);
    const companyName = extraction.company_name || extraction.company || "Unknown";

    // Save to DB
    const db = getDb();
    db.prepare(`
      INSERT INTO placements (id, image_path, company_name, extracted_data)
      VALUES (?, ?, ?, ?)
    `).run(id, imagePath, companyName, JSON.stringify(extraction));

    return NextResponse.json({ id, companyName, extraction, imagePath });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
