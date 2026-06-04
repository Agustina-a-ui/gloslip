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

    // 1. Obtener la orden
    const { data: orden, error: ordenError } = await supabase
      .from("ordenes")
      .select("*")
      .eq("id", orden_id)
      .single();

    if (ordenError || !orden) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    if (orden.estado !== "pendiente") {
      return NextResponse.json({ error: "La orden no está pendiente" }, { status: 400 });
    }

    // 2. Obtener items del carrito del usuario con datos del producto
    const { data: items, error: itemsError } = await supabase
      .from("carrito")
      .select("*, productos(*)")
      .eq("usuario_id", orden.usuario_id);

    if (itemsError || !items || items.length === 0) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    // 3. Mapear al formato de Mercado Pago
    const mpItems = items.map((item) => ({
      id: String(item.producto_id),
      title: item.productos.nombre,
      description: item.productos.descripcion || item.productos.nombre,
      quantity: item.cantidad,
      unit_price: Number(item.productos.precio),
      currency_id: "ARS",
    }));

    // 4. Crear la preferencia
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
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercado-pago`,
      },
    });

    return NextResponse.json({ init_point: result.init_point });

  } catch (error) {
    console.error("Error creando preferencia:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}