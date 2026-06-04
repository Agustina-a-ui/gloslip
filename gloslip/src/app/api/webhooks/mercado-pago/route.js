import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  console.log("Webhook recibido:", body);
  // Implementación completa en Semana 14
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ status: "webhook activo" });
}