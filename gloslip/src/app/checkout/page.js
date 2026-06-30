"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orden_id = searchParams.get("orden_id");
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagando, setPagando] = useState(false);

  useEffect(() => {
    if (!orden_id) {
      setLoading(false);
      return;
    }

    let montado = true;

    const fetchOrden = async () => {
      try {
        // 1. Validamos quién es el usuario actual
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          if (montado) {
            setLoading(false);
            router.push("/"); // Si no está logueado, al inicio
          }
          return;
        }

        // 2. Traemos la orden PERO asegurando que pertenezca al usuario logueado
        const { data, error } = await supabase
          .from("ordenes")
          .select("*")
          .eq("id", orden_id)
          .eq("usuario_id", user.id)
          .single();

        if (error || !data) {
          console.error("Orden no encontrada o acceso denegado");
          if (montado) {
            setOrden(null);
            setLoading(false);
          }
          return;
        }

        if (montado) {
          setOrden(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error en la validación del checkout:", err);
        if (montado) setLoading(false);
      }
    };

    fetchOrden();

    return () => {
      montado = false;
    };
  }, [orden_id, router]);

  const handlePagar = async () => {
    if (pagando) return; // Doble candado por si acaso
    setPagando(true);
    try {
      const res = await fetch("/api/pagos/crear-preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orden_id }),
      });
      const result = await res.json();
      if (result.init_point) {
        window.location.href = result.init_point;
      } else {
        alert("Error al crear el pago: " + (result.error || "desconocido"));
        setPagando(false);
      }
    } catch (err) {
      console.error(err);
      alert("Hubo un problema de conexión al procesar el pago.");
      setPagando(false);
    }
  };

  if (loading) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontWeight: "500" }}>Cargando orden... 💄</p>
    </main>
  );

  if (!orden) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Orden no encontrada o no tienes acceso.</p>
    </main>
  );

  return (
    <>
      <div className="noise-overlay" />
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 1.2rem 4rem' }}>
        <div style={{ maxWidth: 480, width: '100%' }}>

          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
            <div style={{ width: 32, height: 1, background: 'var(--rose)', borderRadius: 1 }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Resumen de compra</span>
          </div>

          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '2rem', color: 'var(--text)' }}>
            Tu orden
          </h1>

          {/* Card orden */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>N° de orden</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>#{orden.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Estado</span>
              <span style={{ background: '#fff8e1', color: '#f59e0b', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>{orden.estado}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total</span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--rose-deep)' }}>${Number(orden.total).toLocaleString()}</span>
            </div>
          </div>

          {/* Botón */}
          <button
            onClick={handlePagar}
            disabled={pagando}
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              opacity: pagando ? 0.5 : 1, 
              pointerEvents: pagando ? 'none' : 'auto', 
              cursor: pagando ? 'not-allowed' : 'pointer', 
              fontSize: '0.85rem' 
            }}
          >
            {pagando ? "Redirigiendo..." : "Pagar con Mercado Pago"}
          </button>

          {/* Seguridad */}
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            🔒 Pago seguro procesado por Mercado Pago
          </p>

        </div>
      </main>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Cargando...</p></main>}>
      <CheckoutContent />
    </Suspense>
  );
}