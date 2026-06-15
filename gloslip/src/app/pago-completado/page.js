"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function PagoCompletadoContent() {
  const params = useSearchParams();

  useEffect(() => {
  const limpiarYActualizar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('carrito').delete().eq('usuario_id', user.id);
      const ordenId = params.get("external_reference");
      if (ordenId) {
        await supabase
          .from('ordenes')
          .update({ estado: 'pagada' })
          .eq('id', ordenId)
          .eq('usuario_id', user.id);
      }
    }
  };
  limpiarYActualizar();
}, []);

  return (
    <>
      <div className="noise-overlay" />
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 1.2rem 4rem' }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

          {/* Icono */}
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,107,157,0.08)', border: '1.5px solid rgba(255,107,157,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', fontSize: '2rem' }}>
            ✓
          </div>

          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: '1rem' }}>
            <div style={{ width: 32, height: 1, background: 'var(--rose)', borderRadius: 1 }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Compra confirmada</span>
            <div style={{ width: 32, height: 1, background: 'var(--rose)', borderRadius: 1 }} />
          </div>

          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem', color: 'var(--text)' }}>
            ¡Gracias por tu compra!
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Tu pedido fue procesado exitosamente. Pronto recibirás novedades.
          </p>

          {/* Detalle */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.2rem 1.5rem', marginBottom: '2.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>N° de pago</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{params.get("payment_id")}</span>
            </div>
            <div style={{ height: 1, background: 'var(--border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>N° de orden</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{params.get("external_reference")}</span>
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/ordenes" className="btn btn-primary">
              Ver mis órdenes
            </Link>
            <Link href="/catalogo" className="btn btn-ghost">
              Seguir comprando
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}

export default function PagoCompletado() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <PagoCompletadoContent />
    </Suspense>
  );
}