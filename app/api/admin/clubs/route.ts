import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import initialClubs from "@/data/clubs.json";

const CLUBS_FILE_PATH = path.join(process.cwd(), "data", "clubs.json");

// GET: Return current clubs data from disk
export async function GET() {
  try {
    if (fs.existsSync(CLUBS_FILE_PATH)) {
      const fileData = fs.readFileSync(CLUBS_FILE_PATH, "utf-8");
      return NextResponse.json(JSON.parse(fileData));
    }
    return NextResponse.json(initialClubs);
  } catch (error) {
    console.error("Error reading clubs file:", error);
    return NextResponse.json(initialClubs);
  }
}

// POST: Save updated clubs data directly to data/clubs.json on disk
export async function POST(req: NextRequest) {
  try {
    const updatedClubs = await req.json();

    if (!Array.isArray(updatedClubs)) {
      return NextResponse.json(
        { error: "Invalid payload: Must be an array of clubs." },
        { status: 400 }
      );
    }

    // Validate that each club has required fields
    for (const club of updatedClubs) {
      if (!club.id || !club.name || !club.category || !club.traits) {
        return NextResponse.json(
          { error: `Invalid club item: ${JSON.stringify(club)}` },
          { status: 400 }
        );
      }
    }

    fs.writeFileSync(CLUBS_FILE_PATH, JSON.stringify(updatedClubs, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "동아리 데이터가 성공적으로 저장되었습니다.",
      count: updatedClubs.length,
    });
  } catch (error) {
    console.error("Error writing clubs file:", error);
    return NextResponse.json(
      { error: "Failed to write clubs data to disk." },
      { status: 500 }
    );
  }
}
