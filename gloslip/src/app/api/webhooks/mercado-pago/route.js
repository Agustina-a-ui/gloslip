import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ ok: true });
    }

    console.log("Webhook recibido:", body);

    const topic = body.type || body.topic;
    const id = body.data?.id || body.id;

    if (!topic || topic !== "payment" || !id) {
      return NextResponse.json({ ok: true });
    }

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    });

    const pago = await mpRes.json();
    console.log("Pago:", pago);

    const ordenId = pago.external_reference;
    const estado = pago.status;

    if (!ordenId) {
      return NextResponse.json({ ok: true });
    }

    let nuevoEstado;
    if (estado === "approved") nuevoEstado = "pagada";
    else if (estado === "rejected") nuevoEstado = "cancelada";
    else nuevoEstado = "pendiente";

    await supabase
      .from("ordenes")
      .update({ estado: nuevoEstado })
      .eq("id", ordenId);

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Error en webhook:", error);
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "webhook activo" });
}