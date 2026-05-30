"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function Checkout() {
  const { carrito, vaciarCarrito, totalPrecio } = useCart();
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleComprar = async () => {
    setError("");
    setProcesando(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      if (carrito.length === 0) {
        setError("Tu carrito está vacío");
        setProcesando(false);
        return;
      }

      const items = carrito.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad
      }));

      const { data, error: errorRpc } = await supabase.rpc('crear_orden_completa', {
        p_usuario_id: user.id,
        p_items: items,
        p_total: totalPrecio
      });

      if (errorRpc || !data?.[0]?.success) {
        setError(data?.[0]?.error_msg || 'Error al procesar la orden');
        setProcesando(false);
        return;
      }

      vaciarCarrito();
      router.push('/ordenes');

    } catch (err) {
      setError('Error inesperado, intentá de nuevo');
      setProcesando(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <p style={{ fontSize: '3rem' }}>🛍️</p>
        <h2 style={{ fontFamily: 'Georgia, serif', color: '#1a1a1a' }}>Tu carrito está vacío</h2>
        <Link href="/catalogo" style={{ background: '#ff6b9d', color: '#fff', padding: '0.8rem 2rem', borderRadius: '30px', textDecoration: 'none', fontWeight: '500' }}>
          Ver catálogo
        </Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '8rem 1.5rem 4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>
          Checkout
        </h1>
        <p style={{ color: '#999', fontSize: '0.9rem' }}>Revisá tu pedido antes de confirmar</p>
      </div>

      {/* RESUMEN */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0e6e2', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>Resumen del pedido</h2>
        {carrito.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 0', borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={item.imagen_url || item.imagen} alt={item.nombre} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500', color: '#1a1a1a' }}>{item.nombre}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>Cant: {item.cantidad}</p>
              </div>
            </div>
            <span style={{ fontWeight: '600', color: '#8b3050' }}>${(item.precio * item.cantidad).toLocaleString()}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #f0e6e2' }}>
          <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Total</span>
          <span style={{ fontWeight: '700', fontSize: '1.3rem', color: '#8b3050', fontFamily: 'Georgia, serif' }}>${totalPrecio.toLocaleString()}</span>
        </div>
      </div>

      {/* MÉTODO DE PAGO */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0e6e2', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>Método de pago</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', background: '#ffeef2', borderRadius: '10px', border: '2px solid #ff6b9d' }}>
          <span style={{ fontSize: '1.5rem' }}>💳</span>
          <div>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', color: '#1a1a1a' }}>Mercado Pago</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#999' }}>Próximamente disponible</p>
          </div>
        </div>
      </div>

      {/* SEGURIDAD */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: '#999', fontSize: '0.8rem' }}>
        <span>🔒</span>
        <span>Tus datos están protegidos con encriptación SSL</span>
      </div>

      {error && (
        <div style={{ background: '#ffeef2', border: '1px solid #ffccd6', borderRadius: '10px', padding: '0.8rem 1rem', marginBottom: '1rem', color: '#c0446a', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleComprar}
        disabled={procesando}
        style={{ width: '100%', padding: '1.1rem', background: procesando ? '#ccc' : '#ff6b9d', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600', cursor: procesando ? 'not-allowed' : 'pointer', letterSpacing: '0.05em', marginBottom: '1rem' }}
      >
        {procesando ? 'Procesando...' : `Confirmar compra · $${totalPrecio.toLocaleString()}`}
      </button>

      <div style={{ textAlign: 'center' }}>
        <Link href="/carrito" style={{ color: '#aaa', fontSize: '0.85rem', textDecoration: 'none' }}>← Volver al carrito</Link>
      </div>
    </main>
  );
}