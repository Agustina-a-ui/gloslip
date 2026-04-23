"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

// Reutilizamos tus datos acá para que la página sepa qué mostrar. 
// ¡Le agregué una descripción a cada uno para que se vea más real!
const listaProductos = [
  { id: 1, nombre: "Velvet Mate Cherry", tipo: "labial", precio: 15000, imagen: "/labial-pa.jpg", desc: "Un rojo cereza intenso con acabado mate aterciopelado. Fórmula de larga duración que no reseca los labios. Perfecto para la noche." },
  { id: 2, nombre: "Gloss Crystal Clear", tipo: "gloss", precio: 12000, imagen: "/labial-cherry.png", desc: "Brillo de alto impacto sin sensación pegajosa. Úsalo solo para un look natural o sobre tu labial favorito para darle dimensión." },
  { id: 3, nombre: "Nude Chic Mate", tipo: "labial", precio: 14000, imagen: "/labial-cerrado.jpg", desc: "El tono nude ideal para el día a día. Fórmula súper hidratante enriquecida con vitamina E que cuida tus labios mientras les da color." },
  { id: 4, nombre: "Berry Bomb Gloss", tipo: "gloss", precio: 13000, imagen: "/labial-pa.jpg", desc: "Un toque de color frambuesa con un brillo espectacular que da un efecto visual de volumen a tus labios al instante." },
  { id: 5, nombre: "Rose Gold Shimmer", tipo: "labial", precio: 15500, imagen: "/labial-cherry.png", desc: "Labial cremoso con destellos dorados súper sutiles para un look radiante y elegante." }
];

export default function ProductoDetalle() {
  const params = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Buscamos el labial cuyo ID coincida con el número en la URL
    if (params?.id) {
      const encontrado = listaProductos.find((p) => p.id === parseInt(params.id));
      setProducto(encontrado);
      setCargando(false);
    }
  }, [params.id]);

  if (cargando) {
    return <div className="detail-msg">Cargando tu tono...</div>;
  }

  // Si el usuario pone un ID que no existe (ej: producto/99)
  if (!producto) {
    return (
      <div className="detail-msg">
        <h2>¡Ups! Tono no encontrado</h2>
        <p>Parece que este labial ya no está en nuestra colección.</p>
        <Link href="/#catalogo" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="noise-overlay" />
      
      {/* Header súper minimalista solo con el logo para no distraer */}
      <div className="nav-wrap sticky-nav">
        <div className="nav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Link href="/" className="brand" style={{ textDecoration: 'none' }}>
            <span className="brand-g">G</span>loslip
          </Link>
        </div>
      </div>

      <main className="detail-main">
        <div className="detail-container">
          <Link href="/#catalogo" className="back-link">
            ← Volver al catálogo
          </Link>

          <div className="detail-grid">
            {/* IZQUIERDA: Foto del producto */}
            <div className="detail-image-box">
              <img src={producto.imagen} alt={`Foto de ${producto.nombre}`} />
            </div>
            
            {/* DERECHA: Toda la info y botón de comprar */}
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
                <span>🐰 Cruelty Free (Libre de crueldad)</span>
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