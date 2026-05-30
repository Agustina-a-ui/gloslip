import { supabase } from '../../../lib/supabase';

export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*');

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}