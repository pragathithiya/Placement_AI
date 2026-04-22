import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const placements = db.prepare("SELECT * FROM placements ORDER BY created_at DESC").all();
    return NextResponse.json(placements);
  } catch (error: any) {
    console.error("Failed to fetch placements:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, company_name, extraction } = body;
    const db = getDb();
    
    db.prepare(`
      INSERT INTO placements (id, image_path, company_name, extracted_data)
      VALUES (?, ?, ?, ?)
    `).run(id, "", company_name, JSON.stringify(extraction));

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Failed to create placement:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
