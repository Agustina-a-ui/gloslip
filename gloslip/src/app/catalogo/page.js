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
  const [categoria, setCategoria] = useState('todos'); // Nuevo estado para el filtro
  const [filtrados, setFiltrados] = useState(listaProductos);

  // Cada vez que cambie la búsqueda O la categoría, filtramos la lista
  useEffect(() => {
    let resultado = listaProductos.filter((p) => {
      const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = categoria === 'todos' || p.tipo === categoria;
      return coincideNombre && coincideCategoria;
    });
    setFiltrados(resultado);
  }, [busqueda, categoria]);

  return (
    <>
      <div className="noise-overlay" />
      
      {/* HEADER */}
      <div className="nav-wrap sticky-nav">
        <div className="nav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Link href="/" className="brand" style={{ textDecoration: 'none' }}>
            <span className="brand-g">G</span>loslip
          </Link>
          <nav className="header-nav">
            <Link href="/#inicio">Inicio</Link>
            <Link href="/catalogo" className="active">Catálogo</Link>
            <Link href="/contacto">Contacto</Link>
          </nav>
          <div className="header-search-right">
            <input
              type="text"
              placeholder="🔍 Buscar tono..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main className="catalogo-page-main" style={{ paddingTop: '140px', minHeight: '100vh', paddingBottom: '80px' }}>
        
        {/* SECCIÓN DE TÍTULO ESTÉTICO */}
        <header className="catalogo-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ letterSpacing: '4px', fontSize: '0.9rem', color: '#888', textTransform: 'uppercase' }}>Nuestra Colección</span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '300', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Explora <span style={{ fontStyle: 'italic', fontFamily: 'serif' }}>tus tonos</span>
          </h1>
          <div style={{ width: '60px', height: '2px', background: '#000', margin: '0 auto' }}></div>
        </header>

        <section className="container">
          
          {/* BARRA DE FILTROS */}
          <div className="filter-bar" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem', 
            marginBottom: '3rem',
            flexWrap: 'wrap' 
          }}>
            <button 
              onClick={() => setCategoria('todos')}
              className={`filter-btn ${categoria === 'todos' ? 'active' : ''}`}
            >
              Todos los productos
            </button>
            <button 
              onClick={() => setCategoria('labial')}
              className={`filter-btn ${categoria === 'labial' ? 'active' : ''}`}
            >
              Labiales Mate
            </button>
            <button 
              onClick={() => setCategoria('gloss')}
              className={`filter-btn ${categoria === 'gloss' ? 'active' : ''}`}
            >
              Glosses & Brillos
            </button>
          </div>

          {/* CONTADOR DE RESULTADOS */}
          <div style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
            Mostrando {filtrados.length} {filtrados.length === 1 ? 'producto' : 'productos'}
          </div>

          {/* GRILLA DE PRODUCTOS */}
          <div className="catalog-grid">
            {filtrados.map((prod) => (
              <article key={prod.id} className="product-card visible">
                <div className="product-image">
                  <img src={prod.imagen} alt={prod.nombre} />
                  <Link href={`/producto/${prod.id}`} className="hover-overlay">
                    <span className="ver-detalle-btn">Ver detalle</span>
                  </Link>
                </div>
                <div className="product-info">
                  <span style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase' }}>{prod.tipo}</span>
                  <h3 className="product-name" style={{ marginTop: '5px' }}>{prod.nombre}</h3>
                  <p className="product-price">${prod.precio}</p>
                </div>
              </article>
            ))}
          </div>

          {/* MENSAJE SI NO HAY RESULTADOS */}
          {filtrados.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <p style={{ fontSize: '1.2rem', color: '#888' }}>No encontramos ningún tono que coincida con tu búsqueda.</p>
              <button onClick={() => {setBusqueda(''); setCategoria('todos');}} style={{ marginTop: '1rem', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}>
                Ver todos los productos
              </button>
            </div>
          )}
        </section>
      </main>

      {/* ESTILOS EXTRA PARA ESTA PÁGINA (Podés moverlos a tu CSS) */}
      <style jsx>{`
        .filter-btn {
          padding: 0.6rem 1.5rem;
          border: 1px solid #eee;
          background: white;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        .filter-btn:hover {
          border-color: #000;
        }
        .filter-btn.active {
          background: #000;
          color: white;
          border-color: #000;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
      `}</style>
    </>
  );
}