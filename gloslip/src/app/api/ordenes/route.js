import { supabase } from '../../../lib/supabase';

export async function GET(request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('ordenes')
      .select('*')
      .eq('usuario_id', user.id)
      .order('creado_en', { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: 'Error al obtener órdenes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { data: carritoItems, error: errorCarrito } = await supabase
      .from('carrito')
      .select('*, producto:productos(*)')
      .eq('usuario_id', user.id);

    if (errorCarrito || !carritoItems || carritoItems.length === 0) {
      return Response.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    for (const item of carritoItems) {
      if (item.producto.stock < item.cantidad) {
        return Response.json({ error: `Stock insuficiente para ${item.producto.nombre}` }, { status: 400 });
      }
    }

    const total = carritoItems.reduce(
      (sum, item) => sum + item.producto.precio * item.cantidad, 0
    );

    const { data: orden, error: errorOrden } = await supabase
      .from('ordenes')
      .insert({ usuario_id: user.id, total, estado: 'pendiente' })
      .select()
      .single();

    if (errorOrden) {
      return Response.json({ error: errorOrden.message }, { status: 500 });
    }

    for (const item of carritoItems) {
      await supabase
        .from('productos')
        .update({ stock: item.producto.stock - item.cantidad })
        .eq('id', item.producto.id);
    }

    await supabase
      .from('carrito')
      .delete()
      .eq('usuario_id', user.id);

    return Response.json({ success: true, orden }, { status: 201 });
  } catch (err) {
    return Response.json({ error: 'Error al crear la orden' }, { status: 500 });
  }
}