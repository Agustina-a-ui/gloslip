"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const listaProductos = [
  { id: 1, nombre: "Velvet Mate Cherry", tipo: "labial", precio: 15000, imagen: "/labial-pa.jpg", desc: "Un rojo cereza intenso con acabado mate aterciopelado. Fórmula de larga duración que no reseca los labios." },
  { id: 2, nombre: "Gloss Crystal Clear", tipo: "gloss", precio: 12000, imagen: "/labial-cherry.png", desc: "Brillo de alto impacto sin sensación pegajosa. Úsalo solo para un look natural o sobre tu labial." },
  { id: 3, nombre: "Nude Chic Mate", tipo: "labial", precio: 14000, imagen: "/labial-cerrado.jpg", desc: "El tono nude ideal para el día a día. Fórmula súper hidratante enriquecida con vitamina E." },
  { id: 4, nombre: "Berry Bomb Gloss", tipo: "gloss", precio: 13000, imagen: "/labial-pa.jpg", desc: "Un toque de color frambuesa con un brillo espectacular que da un efecto visual de volumen." },
  { id: 5, nombre: "Rose Gold Shimmer", tipo: "labial", precio: 15500, imagen: "/labial-cherry.png", desc: "Labial cremoso con destellos dorados súper sutiles para un look radiante y elegante." }
];

export default function ProductoDetalle() {
  const params = useParams();
  const router = useRouter();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (params?.id) {
      const encontrado = listaProductos.find((p) => p.id === parseInt(params.id));
      setProducto(encontrado);
      setCargando(false);
    }
  }, [params.id]);

  // Lógica del buscador: si escribe, lo mandamos al inicio
  const manejarBusquedaEnDetalle = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    // Redirigimos al inicio pasando la búsqueda por la URL (opcional) 
    // o simplemente volvemos al inicio para que use el buscador de allá
    router.push(`/#catalogo`); 
  };

  if (cargando) return <div className="detail-msg">Cargando...</div>;

  if (!producto) {
    return (
      <div className="detail-msg">
        <h2>Producto no encontrado</h2>
        <Link href="/#catalogo" className="btn btn-primary">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <>
      <div className="noise-overlay" />
      
      {/* HEADER COMPLETO (IGUAL AL INICIO) */}
      <div className="nav-wrap sticky-nav">
        <div className="nav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          
          <Link href="/" className="brand" style={{ textDecoration: 'none' }}>
            <span className="brand-g">G</span>loslip
          </Link>
          
          <nav className="header-nav">
            <Link href="/#inicio">Inicio</Link>
            <Link href="/#catalogo">Catálogo</Link>
            <Link href="/contacto">Contacto</Link>
          </nav>

          <div className="header-search-right">
            <input
              type="text"
              placeholder="🔍 Buscar tono..."
              value={busqueda}
              onChange={manejarBusquedaEnDetalle}
            />
          </div>
        </div>
      </div>

      <main className="detail-main">
        <div className="detail-container">
          <Link href="/#catalogo" className="back-link">
            ← Volver al catálogo
          </Link>

          <div className="detail-grid">
            <div className="detail-image-box">
              <img src={producto.imagen} alt={producto.nombre} />
            </div>
            
            <div className="detail-info">
              <span className="detail-type">{producto.tipo.toUpperCase()}</span>
              <h1 className="detail-name">{producto.nombre}</h1>
              <p className="detail-price">${producto.precio}</p>
              
              <div className="detail-description">
                <p>{producto.desc}</p>
              </div>

              <div className="detail-benefits">
                <span>✨ Fórmula de larga duración</span>
                <span>🌱 100% Vegano y natural</span>
                <span>🐰 Cruelty Free</span>
              </div>

              <button className="btn btn-primary add-to-cart-btn">
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
