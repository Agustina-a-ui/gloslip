"use client";

import { useState } from "react";
import Link from "next/link";

export default function Contacto() {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  const manejarEnvio = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Validación básica
    if (mensaje.trim() === "") {
      setError("Por favor, escribe un mensaje antes de enviar.");
      return;
    }

    // Si pasa la validación
    setError("");
    setEnviado(true);
    setMensaje("");
  };

  return (
    <>
      <header>
        <h1>Gloslip</h1>
        <nav style={{ marginTop: "1rem" }}>
          {/* Usamos Link de Next.js para navegar sin recargar la página */}
          <Link href="/" style={{ marginRight: "1rem", color: "#333" }}>Inicio</Link>
          <Link href="/contacto" style={{ color: "#333", fontWeight: "bold" }}>Contacto</Link>
        </nav>
      </header>

      <main>
        <section style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
          <h2>Escríbenos</h2>
          <p>¿Dudas sobre algún gloss? ¡Estamos para ayudarte!</p>

          {enviado ? (
            <p style={{ color: "green", marginTop: "2rem" }}>¡Mensaje enviado con éxito! Te responderemos pronto.</p>
          ) : (
            <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
              <textarea 
                rows="5"
                placeholder="Escribe tu mensaje aquí..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                style={{ padding: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
              />
              {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
              
              <button type="submit" style={{ padding: "0.8rem", backgroundColor: "#333", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                Enviar Mensaje
              </button>
            </form>
          )}
        </section>
      </main>
    </>
  );
}