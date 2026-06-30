"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { supabase } from "../../lib/supabase";

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const router = useRouter(); 

  useEffect(() => {
    let montado = true;

    // Centralizamos la carga de órdenes para llamarla de forma segura
    const cargarOrdenesDelUsuario = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('ordenes')
          .select('*')
          .eq('usuario_id', userId)
          .order('creado_en', { ascending: false });

        if (!error && montado) {
          setOrdenes(data || []);
        }
      } catch (err) {
        console.error("Error al pedir las órdenes:", err);
      } finally {
        if (montado) setCargando(false);
      }
    };

    // EL GUARDiÁN TOTAL: Escuchamos el estado de autenticación real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!montado) return;

      const user = session?.user ?? null;

      if (!user) {
        // Si no hay sesión activa, limpiamos todo y expulsamos de inmediato
        setUsuario(null);
        setOrdenes([]);
        setCargando(false);
        router.push("/");
        return;
      }

      // Evitamos re-peticiones si el usuario en memoria es exactamente el mismo
      setUsuario((prevUser) => {
        if (prevUser?.id !== user.id) {
          cargarOrdenesDelUsuario(user.id);
          return user;
        }
        // Si el ID es idéntico, ya cargamos las órdenes correspondientes; frenamos el loading
        if (montado) setCargando(false);
        return prevUser;
      });
    });

    return () => {
      montado = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, [router]);

  const estadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return { bg: '#fff8e1', color: '#f59e0b' };
      case 'pagada': return { bg: '#e8f5e9', color: '#22c55e' };
      case 'enviada': return { bg: '#e3f2fd', color: '#3b82f6' };
      case 'entregada': return { bg: '#f3e8ff', color: '#a855f7' };
      case 'cancelada': return { bg: '#ffeef2', color: '#ef4444' };
      default: return { bg: '#f5f5f5', color: '#999' };
    }
  };

  if (cargando) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#c9907a', fontWeight: '500' }}>Cargando órdenes... 💄</p>
      </main>
    );
  }

  if (!usuario) return null;

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '8rem 1.5rem 4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>
          Mis órdenes
        </h1>
        <p style={{ color: '#999', fontSize: '0.9rem' }}>Historial de todas tus compras</p>
      </div>

      {ordenes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: '20px', border: '1px solid #f0e6e2' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍️</p>
          <h2 style={{ color: '#1a1a1a', marginBottom: '0.5rem', fontFamily: 'Georgia, serif' }}>Todavía no hiciste ninguna compra</h2>
          <p style={{ color: '#999', marginBottom: '2rem', fontSize: '0.9rem' }}>Explorá nuestro catálogo y encontrá tu tono perfecto</p>
          <Link href="/catalogo" style={{ background: '#ff6b9d', color: '#fff', padding: '0.8rem 2rem', borderRadius: '30px', textDecoration: 'none', fontWeight: '500', fontSize: '0.85rem' }}>
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {ordenes.map((orden) => {
            const { bg, color } = estadoColor(orden.estado);
            return (
              <div key={orden.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0e6e2', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                      Orden #{orden.id}
                    </p>
                    <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: '600', color: '#8b3050' }}>
                      ${Number(orden.total).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span style={{ background: bg, color: color, padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'capitalize' }}>
                      {orden.estado}
                    </span>
                    <p style={{ fontSize: '0.8rem', color: '#aaa' }}>
                      {new Date(orden.creado_en).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <Link href="/" style={{ color: '#aaa', fontSize: '0.85rem', textDecoration: 'none' }}>← Volver al inicio</Link>
      </div>
    </main>
  );
}