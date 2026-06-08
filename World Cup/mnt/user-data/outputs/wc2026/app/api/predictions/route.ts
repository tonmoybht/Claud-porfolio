import { NextRequest, NextResponse } from "next/server";
import { savePrediction, getPredictions, deletePrediction } from "@/lib/storage";

function getUserId(req: NextRequest) {
  return req.headers.get("x-user-id") ?? req.nextUrl.searchParams.get("userId") ?? "anon";
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const predictions = await getPredictions(userId);
  return NextResponse.json({ predictions, count: predictions.length });
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json();
  const { fixtureId, homeScore, awayScore } = body;
  if (fixtureId == null || homeScore == null || awayScore == null)
    return NextResponse.json({ error: "fixtureId, homeScore, awayScore required" }, { status: 400 });

  const pred = { userId, fixtureId: Number(fixtureId), homeScore, awayScore, savedAt: Date.now() };
  await savePrediction(pred);
  return NextResponse.json({ prediction: pred, saved: true });
}

export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  const { fixtureId } = await req.json();
  await deletePrediction(userId, Number(fixtureId));
  return NextResponse.json({ deleted: true });
}
