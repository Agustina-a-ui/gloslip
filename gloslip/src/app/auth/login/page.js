"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const mensaje = searchParams.get("mensaje");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Email o contraseña incorrectos");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "420px", background: "#fff", borderRadius: "20px", padding: "2.5rem", boxShadow: "0 8px 32px rgba(0,0,0,0.06)", border: "1px solid #f0e6e2" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2rem", color: "#1a1a1a", marginBottom: "0.4rem" }}>
            <span style={{ color: "#e55a8b" }}>G</span>loslip
          </h1>
          <p style={{ color: "#999", fontSize: "0.9rem" }}>Iniciá sesión en tu cuenta</p>
        </div>

        {mensaje === "confirma-tu-email" && (
          <div style={{ background: "#eefff5", border: "1px solid #b2f0cc", borderRadius: "10px", padding: "0.8rem 1rem", marginBottom: "1.5rem", color: "#2d7a4f", fontSize: "0.85rem" }}>
            ¡Cuenta creada! Revisá tu email para confirmarla antes de iniciar sesión.
          </div>
        )}

        {error && (
          <div style={{ background: "#ffeef2", border: "1px solid #ffccd6", borderRadius: "10px", padding: "0.8rem 1rem", marginBottom: "1.5rem", color: "#c0446a", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", marginBottom: "0.5rem" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              style={{ width: "100%", padding: "0.9rem 1rem", border: "1px solid #ebebeb", borderRadius: "10px", fontSize: "1rem", color: "#1a1a1a", outline: "none", background: "#fafafa", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "1.8rem" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", marginBottom: "0.5rem" }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: "100%", padding: "0.9rem 1rem", border: "1px solid #ebebeb", borderRadius: "10px", fontSize: "1rem", color: "#1a1a1a", outline: "none", background: "#fafafa", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "1rem", background: loading ? "#ccc" : "#ff6b9d", color: "#fff", border: "none", borderRadius: "10px", fontSize: "0.85rem", fontWeight: "500", letterSpacing: "0.1em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.3s" }}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "#999" }}>
          ¿No tenés cuenta?{" "}
          <Link href="/auth/registro" style={{ color: "#e55a8b", fontWeight: "500" }}>
            Registrate acá
          </Link>
        </p>

        <p style={{ textAlign: "center", marginTop: "0.8rem", fontSize: "0.85rem" }}>
          <Link href="/" style={{ color: "#aaa" }}>← Volver al inicio</Link>
        </p>
      </div>
    </main>
  );
}