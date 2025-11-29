"use server";

import { NextResponse } from "next/server";

export async function POST() {
  // Token-based auth handled client-side; respond success for parity.
  return NextResponse.json({ ok: true });
}
