"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const orden_id = searchParams.get("orden_id");
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagando, setPagando] = useState(false);

  useEffect(() => {
    if (!orden_id) return;
    const fetchOrden = async () => {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      const { data } = await supabase
        .from("ordenes")
        .select("*")
        .eq("id", orden_id)
        .single();
      setOrden(data);
      setLoading(false);
    };
    fetchOrden();
  }, [orden_id]);

  const handlePagar = async () => {
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
      setPagando(false);
    }
  };

  if (loading) return <p>Cargando orden...</p>;
  if (!orden) return <p>Orden no encontrada.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 20px" }}>
      <h1>Resumen de tu orden</h1>
      <div style={{
        borderLeft: "4px solid #3498db",
        padding: "16px",
        background: "#fff",
        borderRadius: 8,
        marginBottom: 24,
        boxShadow: "0 2px 8px #0001"
      }}>
        <p><strong>Orden #:</strong> {orden.id}</p>
        <p><strong>Estado:</strong> {orden.estado}</p>
        <p><strong>Total:</strong> ${orden.total}</p>
      </div>
      <button
        onClick={handlePagar}
        disabled={pagando}
        style={{
          width: "100%",
          padding: "14px",
          background: pagando ? "#ccc" : "#27ae60",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: pagando ? "not-allowed" : "pointer",
        }}
      >
        {pagando ? "Redirigiendo a Mercado Pago..." : "Pagar con Mercado Pago"}
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <CheckoutContent />
    </Suspense>
  );
}