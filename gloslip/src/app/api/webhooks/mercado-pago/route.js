import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Forzamos a Next.js a tratar esto como una API dinámica para evitar cacheos de Vercel
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    // 1. Evitamos el crash de parseo: leemos como texto plano primero
    const rawBody = await request.text();
    
    if (!rawBody || rawBody.trim() === "") {
      console.log("Webhook recibido con cuerpo vacío (Ping de prueba).");
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("Error al parsear el JSON de MP:", parseError);
      return NextResponse.json({ ok: true }, { status: 200 }); // Retornamos 200 para frenar a MP
    }

    console.log("Webhook estructurado recibido:", body);

    const topic = body.type || body.topic;
    const id = body.data?.id || body.id;

    // Si es un evento que no nos interesa (o no tiene ID), respondemos OK y salimos de inmediato
    if (!topic || topic !== "payment" || !id) {
      console.log(`Evento ignorado o sin ID válido. Topic: ${topic}`);
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // 2. Inicializamos Supabase JUSTO cuando lo necesitamos para evitar problemas de conexión Serverless
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: { persistSession: false } // Evita fugas de memoria en funciones de backend
      }
    );

    // 3. Consultamos a Mercado Pago
    console.log(`Consultando pago ID #${id} en Mercado Pago...`);
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    });

    if (!mpRes.ok) {
      console.error(`Error en la API de MP al buscar pago ${id}:`, mpRes.statusText);
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const pago = await mpRes.json();
    const ordenId = pago.external_reference;
    const estado = pago.status;

    if (!ordenId) {
      console.log("El pago de MP no contiene una external_reference (ID de orden).");
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Mapeamos los estados
    let nuevoEstado;
    if (estado === "approved") nuevoEstado = "pagada";
    else if (estado === "rejected") nuevoEstado = "cancelada";
    else nuevoEstado = "pendiente";

    console.log(`Modificando Orden #${ordenId} a estado: ${nuevoEstado}`);

    // 4. Actualizamos la orden en Supabase
    const { data: ordenActualizada, error: errorOrden } = await supabase
      .from("ordenes")
      .update({ estado: nuevoEstado })
      .eq("id", ordenId)
      .select("usuario_id")
      .single();

    if (errorOrden) {
      console.error("Error de Supabase al actualizar la orden:", errorOrden);
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // 5. Si el pago fue aprobado, borramos el carrito usando el usuario_id de la orden
    if (estado === "approved" && ordenActualizada?.usuario_id) {
      console.log(`Vaciando carrito para el usuario: ${ordenActualizada.usuario_id}`);
      
      const { error: errorCarrito } = await supabase
        .from("carrito")
        .delete()
        .eq("usuario_id", ordenActualizada.usuario_id);

      if (errorCarrito) {
        console.error("Error al borrar el carrito en Supabase:", errorCarrito);
      } else {
        console.log("Carrito vaciado perfectamente desde el Servidor.");
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error) {
    // CAPTURA ABSOLUTA: Esto evita que Vercel rompa la petición con 502 si algo falla internamente
    console.error("Crash controlado en el Webhook:", error);
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "webhook activo" });
}