"use client";
import Link from "next/link";

export default function PagoPendiente() {
  return (
    <div style={{
      maxWidth: 500,
      margin: "80px auto",
      textAlign: "center",
      borderTop: "6px solid #f39c12",
      padding: 32,
      borderRadius: 12,
      boxShadow: "0 2px 12px #0001",
      background: "#fff"
    }}>
      <h1>⏳ Pago pendiente</h1>
      <p>Tu pago está siendo procesado.</p>
      <p>Las transferencias pueden tardar <strong>1-2 días hábiles</strong>.</p>
      <p>Te notificaremos cuando se confirme.</p>
      <div style={{ marginTop: 24 }}>
        <Link href="/ordenes" style={{ padding: "10px 20px", background: "#f39c12", color: "#fff", borderRadius: 8, textDecoration: "none" }}>
          Ver mis órdenes
        </Link>
      </div>
    </div>
  );
}