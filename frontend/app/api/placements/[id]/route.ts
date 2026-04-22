import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    
    const placement = db.prepare("SELECT * FROM placements WHERE id = ?").get(id);
    if (!placement) {
      return NextResponse.json({ error: "Placement not found" }, { status: 404 });
    }

    const messages = db.prepare("SELECT * FROM messages WHERE placement_id = ? ORDER BY created_at ASC").all(id);
    
    return NextResponse.json({ placement, messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { company_name, extraction } = body;

    const db = getDb();
    const result = db.prepare(`
      UPDATE placements 
      SET company_name = ?, extracted_data = ?
      WHERE id = ?
    `).run(company_name, JSON.stringify(extraction), id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Placement not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
