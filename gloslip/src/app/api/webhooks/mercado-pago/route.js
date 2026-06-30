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

    console.log("Webhook recibido de MP:", body);

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

    if (!mpRes.ok) {
      console.error(`Error al consultar pago ${id} en MP:`, mpRes.statusText);
      return NextResponse.json({ ok: true });
    }

    const pago = await mpRes.json();
    const ordenId = pago.external_reference;
    const estado = pago.status;

    if (!ordenId) {
      return NextResponse.json({ ok: true });
    }

    let nuevoEstado;
    if (estado === "approved") nuevoEstado = "pagada";
    else if (estado === "rejected") nuevoEstado = "cancelada";
    else nuevoEstado = "pendiente";

    // 1. Actualizamos la orden y recuperamos el usuario_id asociado
    const { data: ordenActualizada, error: errorOrden } = await supabase
      .from("ordenes")
      .update({ estado: nuevoEstado })
      .eq("id", ordenId)
      .select("usuario_id")
      .single();

    if (errorOrden) {
      console.error("Error al actualizar la orden:", errorOrden);
      return NextResponse.json({ ok: true });
    }

    // 2. Si se aprobó el pago, vaciamos el carrito usando ese usuario_id
    if (estado === "approved" && ordenActualizada?.usuario_id) {
      console.log(`Vaciando carrito para el usuario: ${ordenActualizada.usuario_id}`);
      await supabase
        .from("carrito")
        .delete()
        .eq("usuario_id", ordenActualizada.usuario_id);
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Error crítico en el webhook:", error);
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "webhook activo" });
}