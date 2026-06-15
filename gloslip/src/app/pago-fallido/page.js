"use client";
import Link from "next/link";

export default function PagoFallido() {
  return (
    <>
      <div className="noise-overlay" />
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 1.2rem 4rem' }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

          {/* Icono */}
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,0,0,0.03)', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', fontSize: '2rem' }}>
            ✕
          </div>

          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: '1rem' }}>
            <div style={{ width: 32, height: 1, background: 'var(--blush-deep)', borderRadius: 1 }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Pago no procesado</span>
            <div style={{ width: 32, height: 1, background: 'var(--blush-deep)', borderRadius: 1 }} />
          </div>

          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem', color: 'var(--text)' }}>
            Algo salió mal
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            No pudimos procesar tu pago. Podés intentarlo nuevamente o contactarnos si el problema persiste.
          </p>

          {/* Causas */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.2rem 1.5rem', marginBottom: '2.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {['Fondos insuficientes en la tarjeta', 'Tarjeta rechazada por el banco', 'Cancelación manual del pago'].map((causa, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem', color: 'var(--text-mid)' }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--blush-deep)', flexShrink: 0 }} />
                {causa}
              </div>
            ))}
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/carrito" className="btn btn-primary">
              Reintentar pago
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