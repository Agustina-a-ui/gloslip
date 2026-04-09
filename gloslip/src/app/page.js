"use client"; // Le dice a Next.js que este componente usa interactividad (estado)

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  // 1. Manejo de Estado (state)
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Refs para animaciones
  const cardsRef = useRef([]);

  // 2. Efecto Secundario (useEffect) y Asincronía (fetch)
  useEffect(() => {
    // Simulamos que traemos los datos de una API externa
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch('/productos.json');
        const datos = await respuesta.json();
        setProductos(datos);
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar los labiales:", error);
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []); // El array vacío [] significa que esto se ejecuta solo una vez al cargar la página

  // Animaciones en scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [productos]);

  return (
    <>
      <header>
        <h1>Gloslip</h1>
        <p>Minimalismo chic para tus labios</p>
        <nav style={{ marginTop: "1rem" }}>
          <Link href="/" style={{ marginRight: "1rem", color: "#333", fontWeight: "bold" }}>Inicio</Link>
          <Link href="/contacto" style={{ marginRight: "1rem", color: "#333" }}>Contacto</Link>
          <Link href="#catalogo" style={{ color: "#333" }}>Catálogo</Link>
        </nav>
      </header>

      <main>
        <section id="catalogo">
          <h2>Nuestro Catálogo</h2>
          
          {/* 3. Renderizado de la lista */}
          {cargando ? (
            <p>Cargando la colección...</p>
          ) : (
            <div className="catalogo-grid">
              {productos.map((prod, index) => (
                <article
                  key={prod.id}
                  className="producto-card"
                  ref={(el) => (cardsRef.current[index] = el)}
                >
                  <img src={prod.imagen} alt={prod.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                  <span className="tag">{prod.tipo}</span>
                  <h3>{prod.nombre}</h3>
                  <p>${prod.precio}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>© 2026 Gloslip - Parcial Programación Web</p>
      </footer>
    </>
  );
}