"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const listaProductos = [
  { id: 1, nombre: "Velvet Mate Cherry", tipo: "labial", precio: 15000, imagen: "/labial-pa.jpg" },
  { id: 2, nombre: "Gloss Crystal Clear", tipo: "gloss", precio: 12000, imagen: "/labial-cherry.png" },
  { id: 3, nombre: "Nude Chic Mate", tipo: "labial", precio: 14000, imagen: "/labial-cerrado.jpg" },
  { id: 4, nombre: "Berry Bomb Gloss", tipo: "gloss", precio: 13000, imagen: "/labial-pa.jpg" },
  { id: 5, nombre: "Rose Gold Shimmer", tipo: "labial", precio: 15500, imagen: "/labial-cherry.png" }
];

export default function CatalogoCompleto() {
  const [busqueda, setBusqueda] = useState('');
  const [filtrados, setFiltrados] = useState(listaProductos);

  const manejarBusqueda = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);
    const resultados = listaProductos.filter((p) =>
      p.nombre.toLowerCase().includes(valor) || p.tipo.toLowerCase().includes(valor)
    );
    setFiltrados(resultados);
  };

  return (
    <>
      <div className="noise-overlay" />
      
      {/* HEADER (El mismo que en todas las páginas) */}
      <div className="nav-wrap sticky-nav">
        <div className="nav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Link href="/" className="brand" style={{ textDecoration: 'none' }}>
            <span className="brand-g">G</span>loslip
          </Link>
          <nav className="header-nav">
            <Link href="/#inicio">Inicio</Link>
            <Link href="/catalogo">Catálogo</Link>
            <Link href="/contacto">Contacto</Link>
          </nav>
          <div className="header-search-right">
            <input
              type="text"
              placeholder="🔍 Buscar en todo el catálogo..."
              value={busqueda}
              onChange={manejarBusqueda}
            />
          </div>
        </div>
      </div>

      <main className="catalogo-page-main" style={{ paddingTop: '120px', minHeight: '100vh' }}>
        <section className="catalogo-section">
          <div className="section-header">
            <h1>Colección Completa</h1>
            <p>Explora todos nuestros tonos y acabados disponibles.</p>
          </div>

          <div className="catalog-grid">
            {filtrados.map((prod) => (
              <article key={prod.id} className="product-card visible"> {/* 'visible' para que no dependa del scroll aquí */}
                <div className="product-image">
                  <img src={prod.imagen} alt={prod.nombre} />
                  <Link href={`/producto/${prod.id}`} className="hover-overlay">
                    <span className="ver-detalle-btn">Ver detalle</span>
                  </Link>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{prod.nombre}</h3>
                  <p className="product-desc">{prod.tipo.toUpperCase()}</p>
                  <p className="product-price">${prod.precio}</p>
                </div>
              </article>
            ))}
          </div>
          
          {filtrados.length === 0 && (
            <p className="text-center">No se encontraron productos con ese nombre.</p>
          )}
        </section>
      </main>

      <footer style={{ marginTop: '4rem' }}>
        <div className="footer-content">
          <p className="footer-copy">© 2026 Gloslip · Catálogo Completo</p>
        </div>
      </footer>
    </>
  );
}
