"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

const listaProductos = [
  { id: 1, nombre: "Velvet Mate Cherry", tipo: "labial", precio: 15000, imagen: "/labial-pa.jpg", desc: "Un rojo cereza intenso con acabado mate aterciopelado..." },
  { id: 2, nombre: "Gloss Crystal Clear", tipo: "gloss", precio: 12000, imagen: "/labial-cherry.png", desc: "Brillo de alto impacto sin sensación pegajosa..." },
  { id: 3, nombre: "Nude Chic Mate", tipo: "labial", precio: 14000, imagen: "/labial-cerrado.jpg", desc: "El tono nude ideal para el día a día..." },
  { id: 4, nombre: "Berry Bomb Gloss", tipo: "gloss", precio: 13000, imagen: "/labial-pa.jpg", desc: "Un toque de color frambuesa con un brillo espectacular..." },
  { id: 5, nombre: "Rose Gold Shimmer", tipo: "labial", precio: 15500, imagen: "/labial-cherry.png", desc: "Labial cremoso con destellos dorados súper sutiles..." }
];

export default function ProductoDetalle() {
  const params = useParams();
  const { agregarAlCarrito } = useCart();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  // NUEVO ESTADO PARA LA CANTIDAD
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    if (params?.id) {
      const encontrado = listaProductos.find((p) => p.id === parseInt(params.id));
      setProducto(encontrado);
      setCargando(false);
    }
  }, [params.id]);

  // Funciones para sumar y restar cantidad
  const restarCantidad = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };
  const sumarCantidad = () => {
    setCantidad(cantidad + 1);
  };

  if (cargando) return <div className="detail-msg">Cargando...</div>;
  if (!producto) return <div className="detail-msg"><h2>Producto no encontrado</h2><Link href="/catalogo">Volver</Link></div>;

  return (
    <>
      <main className="detail-main" style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="detail-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
          <Link href="/catalogo" className="back-link" style={{ textDecoration: 'none', color: '#666', marginBottom: '20px', display: 'inline-block' }}>
            ← Volver al catálogo
          </Link>

          <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
            <div className="detail-image-box">
              <img src={producto.imagen} alt={producto.nombre} style={{ width: '100%', borderRadius: '12px' }} />
            </div>
            
            <div className="detail-info">
              <span style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>{producto.tipo}</span>
              <h1 style={{ fontSize: '2.5rem', margin: '10px 0' }}>{producto.nombre}</h1>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>${producto.precio}</p>
              
              <p style={{ marginTop: '20px', lineHeight: '1.6', color: '#666' }}>{producto.desc}</p>

              {/* SELECTOR DE CANTIDAD Y BOTÓN */}
              <div style={{ display: 'flex', gap: '15px', marginTop: '30px', alignItems: 'center' }}>
                
                {/* Control de cantidad */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '30px', overflow: 'hidden' }}>
                  <button onClick={restarCantidad} style={{ padding: '12px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                  <span style={{ padding: '0 15px', fontWeight: 'bold' }}>{cantidad}</span>
                  <button onClick={sumarCantidad} style={{ padding: '12px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                </div>

                {/* Botón Agregar al Carrito */}
                <button 
                  style={{ flex: 1, padding: '15px', background: '#000', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                  onClick={() => {
                    agregarAlCarrito(producto, cantidad); // <-- PASAMOS LA CANTIDAD ACÁ
                    alert(`¡Agregaste ${cantidad} ${producto.nombre} al carrito! ✨`);
                    setCantidad(1); // Reseteamos a 1 después de agregar
                  }}
                >
                  Agregar al carrito
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </main>
    </>
  );
}