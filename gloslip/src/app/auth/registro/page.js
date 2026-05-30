"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nombre } }
      });

      if (error) {
        setError(error.message);
      } else {
        await supabase.from("usuarios").insert({
          id: data.user.id,
          email,
          nombre,
          rol: "cliente"
        });
        router.push("/");
      }
    } catch (err) {
      setError("Error al registrarse");
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
          <p style={{ color: "#999", fontSize: "0.9rem" }}>Creá tu cuenta gratis</p>
        </div>

        {error && (
          <div style={{ background: "#ffeef2", border: "1px solid #ffccd6", borderRadius: "10px", padding: "0.8rem 1rem", marginBottom: "1.5rem", color: "#c0446a", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegistro}>
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", marginBottom: "0.5rem" }}>
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              required
              style={{ width: "100%", padding: "0.9rem 1rem", border: "1px solid #ebebeb", borderRadius: "10px", fontSize: "1rem", color: "#1a1a1a", outline: "none", background: "#fafafa", boxSizing: "border-box" }}
            />
          </div>

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

          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", marginBottom: "0.5rem" }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              style={{ width: "100%", padding: "0.9rem 1rem", border: "1px solid #ebebeb", borderRadius: "10px", fontSize: "1rem", color: "#1a1a1a", outline: "none", background: "#fafafa", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "1.8rem" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", marginBottom: "0.5rem" }}>
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="Repetí tu contraseña"
              required
              style={{ width: "100%", padding: "0.9rem 1rem", border: "1px solid #ebebeb", borderRadius: "10px", fontSize: "1rem", color: "#1a1a1a", outline: "none", background: "#fafafa", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "1rem", background: loading ? "#ccc" : "#ff6b9d", color: "#fff", border: "none", borderRadius: "10px", fontSize: "0.85rem", fontWeight: "500", letterSpacing: "0.1em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.3s" }}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "#999" }}>
          ¿Ya tenés cuenta?{" "}
          <Link href="/auth/login" style={{ color: "#e55a8b", fontWeight: "500" }}>
            Iniciá sesión
          </Link>
        </p>

        <p style={{ textAlign: "center", marginTop: "0.8rem", fontSize: "0.85rem" }}>
          <Link href="/" style={{ color: "#aaa" }}>← Volver al inicio</Link>
        </p>
      </div>
    </main>
  );
}