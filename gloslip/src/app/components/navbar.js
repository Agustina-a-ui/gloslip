"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { carrito } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');

  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const manejarBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    if (valor.trim() !== '') {
      router.push(`/catalogo?q=${valor}`);
    } else {
      router.push('/catalogo');
    }
  };

  return (
    <>
      <div className="nav-wrap sticky-nav">
        <div className="nav-inner">
          <Link href="/" className="brand">
            <span className="brand-g">G</span>loslip
          </Link>

          {/* NAV DESKTOP */}
          <nav className="header-nav">
            <Link href="/#inicio">Inicio</Link>
            <Link href="/catalogo">Catálogo</Link>
            <Link href="/contacto">Contacto</Link>
          </nav>

          {/* DERECHA DESKTOP */}
          <div className="header-right-side" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="header-search-right">
              <input
                type="text"
                placeholder="🔍 Buscar tono..."
                value={busqueda}
                onChange={manejarBusqueda}
              />
            </div>

            <div
              className="cart-container-hover"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ position: 'relative', cursor: 'pointer', paddingBottom: '15px' }}
            >
              <Link href="/carrito" className="cart-icon-link" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>🛒</span>
                {cantidadTotal > 0 && (
                  <span className="cart-badge" style={{
                    position: 'absolute', top: '-5px', right: '-10px',
                    background: '#8b3050', color: 'white', borderRadius: '50%',
                    padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold'
                  }}>
                    {cantidadTotal}
                  </span>
                )}
              </Link>

              {isHovered && (
                <div className="mini-cart-dropdown" style={{
                  position: 'absolute', top: '100%', right: '0', width: '300px',
                  backgroundColor: '#fff', boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  borderRadius: '12px', padding: '1.5rem', zIndex: 9999, border: '1px solid #f0e6e2'
                }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#8b3050', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Mi carrito</h4>
                  {carrito.length === 0 ? (
                    <p style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>No hay productos aún ✨</p>
                  ) : (
                    <>
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {carrito.map((item) => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img src={item.imagen} alt={item.nombre} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                              <div>
                                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600' }}>{item.nombre}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>Cant: {item.cantidad}</p>
                              </div>
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>${(item.precio * item.cantidad).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ borderTop: '1px solid #eee', marginTop: '10px', paddingTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '15px' }}>
                          <span>Subtotal:</span>
                          <span>${subtotal.toLocaleString()}</span>
                        </div>
                        <Link href="/carrito" style={{
                          display: 'block', backgroundColor: '#c9907a', color: '#fff',
                          textAlign: 'center', padding: '10px', borderRadius: '25px',
                          textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold'
                        }}>
                          Completar compra
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* BOTONES MOBILE: carrito + hamburguesa */}
          <div className="mobile-nav-right">
            <Link href="/carrito" className="mobile-cart-btn">
              <span>🛒</span>
              {cantidadTotal > 0 && (
                <span className="mobile-cart-badge">{cantidadTotal}</span>
              )}
            </Link>
            <button
              className={`hamburger-btn ${menuAbierto ? 'is-open' : ''}`}
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            >
              <span className="ham-bar" />
              <span className="ham-bar" />
              <span className="ham-bar" />
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MOBILE OVERLAY */}
      <div className={`mobile-menu-overlay ${menuAbierto ? 'mobile-menu-open' : ''}`}>
        <div className="mobile-menu-inner">

          <div className="mobile-menu-search">
            <input
              type="text"
              placeholder="🔍 Buscar tono..."
              value={busqueda}
              onChange={(e) => {
                manejarBusqueda(e);
                setMenuAbierto(false);
              }}
            />
          </div>

          <nav className="mobile-menu-nav">
            <Link href="/#inicio" className="mobile-menu-link" onClick={() => setMenuAbierto(false)}>
              <span className="mobile-menu-icon">🏠</span>
              <span className="mobile-menu-label">Inicio</span>
              <span className="mobile-menu-arrow">›</span>
            </Link>
            <Link href="/catalogo" className="mobile-menu-link" onClick={() => setMenuAbierto(false)}>
              <span className="mobile-menu-icon">💄</span>
              <span className="mobile-menu-label">Catálogo</span>
              <span className="mobile-menu-arrow">›</span>
            </Link>
            <Link href="/carrito" className="mobile-menu-link" onClick={() => setMenuAbierto(false)}>
              <span className="mobile-menu-icon">🛒</span>
              <span className="mobile-menu-label">Carrito</span>
              {cantidadTotal > 0 && <span className="mobile-menu-badge">{cantidadTotal}</span>}
            </Link>
            <Link href="/contacto" className="mobile-menu-link" onClick={() => setMenuAbierto(false)}>
              <span className="mobile-menu-icon">✉️</span>
              <span className="mobile-menu-label">Contacto</span>
              <span className="mobile-menu-arrow">›</span>
            </Link>
          </nav>

          <div className="mobile-menu-social">
            <a href="#">Instagram</a>
            <a href="#">TikTok</a>
          </div>
        </div>
      </div>

      {/* FONDO OSCURO al abrir menú */}
      {menuAbierto && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setMenuAbierto(false)}
        />
      )}
    </>
  );
}