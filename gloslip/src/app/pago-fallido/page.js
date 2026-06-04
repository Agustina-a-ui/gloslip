"use client";
import Link from "next/link";

export default function PagoFallido() {
  return (
    <div style={{
      maxWidth: 500,
      margin: "80px auto",
      textAlign: "center",
      borderTop: "6px solid #e74c3c",
      padding: 32,
      borderRadius: 12,
      boxShadow: "0 2px 12px #0001",
      background: "#fff"
    }}>
      <h1>❌ Pago rechazado</h1>
      <p>Posibles causas:</p>
      <ul style={{ textAlign: "left", display: "inline-block" }}>
        <li>Fondos insuficientes</li>
        <li>Tarjeta rechazada</li>
        <li>Cancelación manual</li>
      </ul>
      <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
        <Link href="/ordenes" style={{ padding: "10px 20px", background: "#e74c3c", color: "#fff", borderRadius: 8, textDecoration: "none" }}>
          Volver a mis órdenes
        </Link>
        <Link href="/catalogo" style={{ padding: "10px 20px", background: "#eee", color: "#333", borderRadius: 8, textDecoration: "none" }}>
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}