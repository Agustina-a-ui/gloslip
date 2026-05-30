"use client";

import Link from "next/link";
import { useState } from "react";

export default function Contacto() {
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <main className="contact-section">
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="eyebrow-wrap">
            <span className="eyebrow-line" />
            <p className="eyebrow">Estamos para ayudarte</p>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)', marginBottom: '1rem' }}>
            <span className="h1-sub">Escribinos,</span>
            <span className="h1-main">hablemos</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', maxWidth: '480px' }}>
            ¿Dudas sobre tu tono perfecto? ¿Problemas con tu pedido? Nuestro equipo responde dentro de las 24hs.
          </p>
        </div>

        {/* INFO CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          <div style={cardStyle}>
            <span style={iconStyle}>✉️</span>
            <p style={cardLabel}>Email</p>
            <a href="mailto:ventas@gloslip.com" style={cardValue}>ventas@gloslip.com</a>
          </div>
          <div style={cardStyle}>
            <span style={iconStyle}>📸</span>
            <p style={cardLabel}>Instagram</p>
            <a href="#" style={cardValue}>@gloslip.oficial</a>
          </div>
          <div style={cardStyle}>
            <span style={iconStyle}>🎵</span>
            <p style={cardLabel}>TikTok</p>
            <a href="#" style={cardValue}>@gloslip</a>
          </div>
        </div>

        {/* FORMULARIO */}
        {!enviado ? (
          <div className="contact-form">
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text)' }}>
              Mandanos un mensaje
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
              Completá el formulario y te respondemos a la brevedad.
            </p>

            <form onSubmit={manejarEnvio}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    id="nombre" name="nombre" type="text"
                    placeholder="Tu nombre"
                    value={form.nombre} onChange={manejarCambio} required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email" name="email" type="email"
                    placeholder="tu@email.com"
                    value={form.email} onChange={manejarCambio} required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="asunto">Asunto</label>
                <select
                  id="asunto" name="asunto"
                  value={form.asunto} onChange={manejarCambio} required
                  style={{ width: '100%', padding: '1rem', border: '1px solid var(--border-soft)', borderRadius: '8px', fontFamily: 'var(--sans)', fontSize: '1rem', color: 'var(--text)', background: 'var(--surface)', outline: 'none' }}
                >
                  <option value="">Seleccioná un motivo</option>
                  <option value="consulta">Consulta sobre productos</option>
                  <option value="pedido">Problema con mi pedido</option>
                  <option value="tono">Asesoramiento de tono</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                  id="mensaje" name="mensaje"
                  placeholder="Contanos en qué podemos ayudarte..."
                  value={form.mensaje} onChange={manejarCambio} required
                  rows={5}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ minWidth: '180px' }}>
                  Enviar mensaje ✨
                </button>
                <Link href="/" className="btn btn-ghost">
                  ← Volver al inicio
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div className="contact-form" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💌</div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: 'var(--text)', marginBottom: '1rem' }}>
              ¡Mensaje enviado!
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.7' }}>
              Gracias por escribirnos, <strong>{form.nombre}</strong>. Te respondemos a <strong>{form.email}</strong> dentro de las 24hs.
            </p>
            <Link href="/" className="btn btn-primary">
              Volver al inicio
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

const cardStyle = {
  background: '#fff',
  border: '1px solid rgba(0,0,0,0.06)',
  borderRadius: '16px',
  padding: '1.5rem',
  textAlign: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
};

const iconStyle = {
  fontSize: '1.8rem',
  display: 'block',
  marginBottom: '0.8rem',
};

const cardLabel = {
  fontSize: '0.7rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#999',
  marginBottom: '0.4rem',
};

const cardValue = {
  fontSize: '0.85rem',
  color: '#e55a8b',
  fontWeight: '500',
  textDecoration: 'none',
  display: 'block',
};