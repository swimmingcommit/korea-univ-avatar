import { NextResponse } from "next/server";
import { getClubs } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const clubs = await getClubs();
    return NextResponse.json({
      success: true,
      count: clubs.length,
      clubs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
