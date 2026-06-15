"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../../context/CartContext";

function PagoCompletadoContent() {
  const params = useSearchParams();
  const { vaciarCarrito } = useCart();

  useEffect(() => {
    vaciarCarrito();
  }, []);

  return (
    <div style={{
      maxWidth: 500,
      margin: "80px auto",
      textAlign: "center",
      borderTop: "6px solid #27ae60",
      padding: 32,
      borderRadius: 12,
      boxShadow: "0 2px 12px #0001",
      background: "#fff"
    }}>
      <h1>✅ ¡Pago aprobado!</h1>
      <p>Tu compra fue procesada exitosamente.</p>
      <p>ID de pago: <strong>{params.get("payment_id")}</strong></p>
      <p>Orden: <strong>{params.get("external_reference")}</strong></p>
      <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
        <Link href="/ordenes" style={{ padding: "10px 20px", background: "#3498db", color: "#fff", borderRadius: 8, textDecoration: "none" }}>
          Ver mis órdenes
        </Link>
        <Link href="/catalogo" style={{ padding: "10px 20px", background: "#eee", color: "#333", borderRadius: 8, textDecoration: "none" }}>
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}

export default function PagoCompletado() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <PagoCompletadoContent />
    </Suspense>
  );
}