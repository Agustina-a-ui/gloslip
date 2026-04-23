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
  const [categoria, setCategoria] = useState('todos'); 
  const [orden, setOrden] = useState('defecto'); // <-- NUEVO ESTADO PARA ORDENAR
  const [filtrados, setFiltrados] = useState(listaProductos);

  // Cada vez que cambie la búsqueda, la categoría o el ORDEN, actualizamos la lista
  useEffect(() => {
    // 1. Primero filtramos (por búsqueda y categoría)
    let resultado = listaProductos.filter((p) => {
      const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = categoria === 'todos' || p.tipo === categoria;
      return coincideNombre && coincideCategoria;
    });

    // 2. Después ordenamos esos resultados
    if (orden === 'precio-asc') {
      resultado.sort((a, b) => a.precio - b.precio); // Menor a mayor
    } else if (orden === 'precio-desc') {
      resultado.sort((a, b) => b.precio - a.precio); // Mayor a menor
    } else if (orden === 'abc') {
      resultado.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Alfabético
    }

    setFiltrados(resultado);
  }, [busqueda, categoria, orden]);

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
        
        {/* TÍTULO LIMPIO Y DIRECTO */}
        <header className="catalogo-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Catálogo Completo
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Encontrá tu tono ideal y armá tu look perfecto.</p>
        </header>

        <section className="container">
          
          {/* BARRA DE FILTROS Y ORDENAMIENTO */}
          <div className="controls-bar" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: '1rem', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            paddingBottom: '1rem',
            borderBottom: '1px solid #eee'
          }}>
            
            {/* 1. Categorías */}
            <div className="category-filters" style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setCategoria('todos')}
                className={`filter-btn ${categoria === 'todos' ? 'active' : ''}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setCategoria('labial')}
                className={`filter-btn ${categoria === 'labial' ? 'active' : ''}`}
              >
                Labiales
              </button>
              <button 
                onClick={() => setCategoria('gloss')}
                className={`filter-btn ${categoria === 'gloss' ? 'active' : ''}`}
              >
                Glosses
              </button>
            </div>

            {/* 2. Ordenamiento */}
            <div className="sort-dropdown">
              <select 
                value={orden} 
                onChange={(e) => setOrden(e.target.value)}
                className="sort-select"
              >
                <option value="defecto">Ordenar por...</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="abc">Nombre: A - Z</option>
              </select>
            </div>
          </div>

          {/* CONTADOR DE RESULTADOS */}
          <div style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#666' }}>
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
              <button onClick={() => {setBusqueda(''); setCategoria('todos'); setOrden('defecto');}} style={{ marginTop: '1rem', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}>
                Limpiar filtros
              </button>
            </div>
          )}
        </section>
      </main>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .filter-btn {
          padding: 0.5rem 1.2rem;
          border: 1px solid #e0e0e0;
          background: white;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          color: #333;
        }
        .filter-btn:hover {
          border-color: #000;
        }
        .filter-btn.active {
          background: #000;
          color: white;
          border-color: #000;
        }
        .sort-select {
          padding: 0.6rem 1rem;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          background: white;
          font-size: 0.9rem;
          cursor: pointer;
          outline: none;
          color: #333;
        }
        .sort-select:focus {
          border-color: #000;
        }
      `}</style>
    </>
  );
}