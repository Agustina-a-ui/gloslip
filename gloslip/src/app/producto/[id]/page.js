"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { supabase } from "../../../lib/supabase";

export default function ProductoDetalle() {
  const params = useParams();
  const { agregarAlCarrito } = useCart();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const fetchProducto = async () => {
      if (params?.id) {
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          console.error('Error al cargar producto:', error);
        } else {
          setProducto(data);
        }
        setCargando(false);
      }
    };
    fetchProducto();
  }, [params.id]);

  const restarCantidad = () => { if (cantidad > 1) setCantidad(cantidad - 1); };
  const sumarCantidad = () => setCantidad(cantidad + 1);

  if (cargando) return <div className="detail-msg">Cargando... 💄</div>;
  if (!producto) return (
    <div className="detail-msg">
      <h2>Producto no encontrado</h2>
      <Link href="/catalogo">Volver al catálogo</Link>
    </div>
  );

  return (
    <main className="detail-main" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="detail-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <Link href="/catalogo" className="back-link" style={{ textDecoration: 'none', color: '#666', marginBottom: '20px', display: 'inline-block' }}>
          ← Volver al catálogo
        </Link>

        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
          <div className="detail-image-box">
            <img src={producto.imagen_url} alt={producto.nombre} style={{ width: '100%', borderRadius: '12px' }} />
          </div>

          <div className="detail-info">
            <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>{producto.tipo}</span>
            <h1 style={{ fontSize: '2.5rem', margin: '10px 0' }}>{producto.nombre}</h1>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>${producto.precio.toLocaleString()}</p>
            <p style={{ marginTop: '20px', lineHeight: '1.6', color: '#666' }}>{producto.descripcion}</p>

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '30px', overflow: 'hidden' }}>
                <button onClick={restarCantidad} style={{ padding: '12px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                <span style={{ padding: '0 15px', fontWeight: 'bold' }}>{cantidad}</span>
                <button onClick={sumarCantidad} style={{ padding: '12px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
              </div>

              <button
                style={{ flex: 1, padding: '15px', background: '#000', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                onClick={() => {
                  agregarAlCarrito({ ...producto, imagen: producto.imagen_url }, cantidad);
                  alert(`¡Agregaste ${cantidad} ${producto.nombre} al carrito! ✨`);
                  setCantidad(1);
                }}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}