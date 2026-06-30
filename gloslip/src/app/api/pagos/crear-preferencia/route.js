import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Preference } from "mercadopago";
import client from "@/lib/mercadopago";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { orden_id } = await request.json();

    if (!orden_id) {
      return NextResponse.json({ error: "Falta el ID de la orden" }, { status: 400 });
    }

    // 1. Obtener la orden
    const { data: orden, error: ordenError } = await supabase
      .from("ordenes")
      .select("*")
      .eq("id", orden_id)
      .single();

    if (ordenError || !orden) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    if (orden.estado === "pagada") {
      return NextResponse.json({ error: "La orden ya fue pagada" }, { status: 400 });
    }

    // 2. Como no hay tabla intermedia, leemos el carrito del usuario actual en este momento
    const { data: items, error: itemsError } = await supabase
      .from("carrito")
      .select("*, productos(*)")
      .eq("usuario_id", orden.usuario_id);

    if (itemsError || !items || items.length === 0) {
      return NextResponse.json({ error: "Carrito vacío. Si ya pagaste, ignora este mensaje." }, { status: 400 });
    }

    // 3. Mapear al formato de Mercado Pago
    const mpItems = items.map((item) => ({
      id: String(item.producto_id),
      title: item.productos.nombre,
      description: item.productos.descripcion || item.productos.nombre,
      quantity: Number(item.cantidad),
      unit_price: Number(item.productos.precio),
      currency_id: "ARS",
    }));

    // 4. Forzamos la URL sin guiones para que coincida con tu endpoint
    const webhookUrl = "https://gloslip1.vercel.app/api/webhooks/mercadopago";

    // 5. Crear la preferencia
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: mpItems,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/pago-completado`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/pago-fallido`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/pago-pendiente`,
        },
        auto_return: "approved",
        external_reference: String(orden_id),
        notification_url: webhookUrl,
      },
    });

    return NextResponse.json({ init_point: result.init_point });

  } catch (error) {
    console.error("Error creando preferencia:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}