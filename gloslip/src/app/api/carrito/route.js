import { supabase } from '../../../lib/supabase';

export async function GET(request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('carrito')
      .select('*, producto:productos(*)')
      .eq('usuario_id', user.id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: 'Error al obtener carrito' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { producto_id, cantidad } = body;

    if (!producto_id || !cantidad || cantidad < 1 || cantidad > 100) {
      return Response.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const { data: producto, error: errorProducto } = await supabase
      .from('productos')
      .select('*')
      .eq('id', producto_id)
      .single();

    if (errorProducto || !producto) {
      return Response.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    if (producto.stock < cantidad) {
      return Response.json({ error: 'Stock insuficiente' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('carrito')
      .upsert({ usuario_id: user.id, producto_id, cantidad }, { onConflict: 'usuario_id,producto_id' })
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, data }, { status: 201 });
  } catch (err) {
    return Response.json({ error: 'Error al agregar al carrito' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { producto_id } = await request.json();

    const { error } = await supabase
      .from('carrito')
      .delete()
      .eq('usuario_id', user.id)
      .eq('producto_id', producto_id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: 'Error al eliminar del carrito' }, { status: 500 });
  }
}