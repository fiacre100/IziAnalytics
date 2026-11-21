import { NextRequest, NextResponse } from "next/server";
import { generateStatsDigest } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const statsData = await req.json();
    const digest = await generateStatsDigest(statsData);
    return NextResponse.json({ digest });
  } catch (err) {
    return NextResponse.json({ error: "Erreur analyse IA" }, { status: 500 });
  }
}
