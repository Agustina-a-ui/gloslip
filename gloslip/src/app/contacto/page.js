"use client";

import { useState } from "react";
import Link from "next/link";

export default function Contacto() {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (mensaje.trim() === "") {
      setError("Por favor, escribe un mensaje antes de enviar.");
      return;
    }

    setError("");
    setEnviado(true);
    setMensaje("");
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <div className="brand-row">
          <div className="brand"><span className="brand-g">G</span>loslip</div>
          <nav className="contact-nav">
            <Link href="/" className="nav-link">Inicio</Link>
            <Link href="/contacto" className="nav-link nav-link-active">Contacto</Link>
          </nav>
        </div>
      </header>

      <main className="contact-main">
        <section className="contact-panel">
          <div className="contact-copy">
            <span className="eyebrow">Contacto</span>
            <h1>Hablemos de tu próximo tono</h1>
            <p>Escribinos para preguntar por stock, tonos nuevos o pedidos especiales. Te respondemos rápido.</p>
          </div>

          {enviado ? (
            <div className="contact-message success">
              ¡Mensaje enviado con éxito! Te responderemos pronto.
            </div>
          ) : (
            <form className="contact-form" onSubmit={manejarEnvio}>
              <textarea
                rows="6"
                placeholder="Escribe tu mensaje aquí..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className="contact-field"
              />
              {error && <p className="contact-error">{error}</p>}
              <button type="submit" className="btn btn-primary contact-submit">
                Enviar mensaje
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}