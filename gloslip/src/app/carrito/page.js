"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CarritoPage() {
  const { carrito, eliminarDelCarrito, totalPrecio, totalItems } = useCart();
  const router = useRouter();

  const handleFinalizarCompra = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Tenés que estar logueado para comprar");
        router.push("/auth/login");
        return;
      }

      const { data: orden, error } = await supabase
        .from("ordenes")
        .insert({
          usuario_id: user.id,
          total: totalPrecio,
          estado: "pendiente",
          metodo_pago: "mercadopago",
        })
        .select()
        .single();

      if (error || !orden) {
        alert("Error al crear la orden");
        console.error(error);
        return;
      }

      router.push(`/checkout?orden_id=${orden.id}`);

    } catch (err) {
      console.error(err);
      alert("Error inesperado");
    }
  };

  return (
    <>
      <div className="noise-overlay" />

      <main style={{ paddingTop: '160px', minHeight: '100vh', maxWidth: '900px', margin: '0 auto', padding: '160px 20px 80px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '300', marginBottom: '2rem', textAlign: 'center' }}>Tu Carrito</h1>

        {carrito.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '2rem' }}>Tu carrito está vacío actualmente.</p>
            <Link href="/catalogo" className="btn btn-primary">
              Ver Catálogo
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {carrito.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <img src={item.imagen} alt={item.nombre} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px' }} />
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{item.nombre}</h3>
                      <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>Cantidad: {item.cantidad}</p>
                      <p style={{ fontWeight: '500', marginTop: '5px' }}>${item.precio}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px' }}>${item.precio * item.cantidad}</p>
                    <button
                      onClick={() => eliminarDelCarrito(item.id)}
                      style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '3rem', padding: '2rem', background: '#fcfcfc', borderRadius: '15px', border: '1px solid #eee', textAlign: 'right' }}>
              <p style={{ fontSize: '1.1rem', color: '#666' }}>Subtotal ({totalItems} productos)</p>
              <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 2rem 0' }}>Total: ${totalPrecio}</h2>
              <button
                onClick={handleFinalizarCompra}
                className="btn btn-primary"
                style={{ width: '100%', maxWidth: '300px', padding: '1.2rem', textAlign: 'center', cursor: 'pointer' }}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}