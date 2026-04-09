"use client"; // Le dice a Next.js que este componente usa interactividad (estado)

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const cardsRef = useRef([]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [productos]);

  return (
    <>
      <header className="site-header">
        <div className="nav-wrap">
          <div className="brand">Gloslip</div>
          <nav>
            <Link href="#inicio">Inicio</Link>
            <Link href="#catalogo">Catálogo</Link>
            <Link href="/contacto">Contacto</Link>
          </nav>
        </div>

        <section className="hero" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow">Brillo que enamora</p>
            <h1>Labiales suaves y elegantes para tu estilo diario</h1>
            <p>Descubrí tonos con acabado sedoso, presentación premium y una experiencia visual que enamora.</p>
            <div className="hero-actions">
              <Link href="#catalogo" className="btn btn-primary">Ver colección</Link>
              <Link href="/contacto" className="btn btn-secondary">Contacto</Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image">
              <img src="/labial-cherry..png" alt="Labial Gloslip" />
            </div>
          </div>
        </section>
      </header>

      <main>
        <section id="catalogo" className="catalogo-section">
          <div className="section-header">
            <span className="eyebrow">Colección</span>
            <h2>Nuestros labiales favoritos</h2>
            <p>Un catálogo curado con tonos versátiles y acabados confortables, pensado para destacar sin esfuerzo.</p>
          </div>

          {cargando ? (
            <p className="loading-text">Cargando la colección...</p>
          ) : (
            <div className="catalogo-grid">
              {productos.map((prod, index) => (
                <article
                  key={prod.id}
                  className="producto-card"
                  ref={(el) => (cardsRef.current[index] = el)}
                >
                  <div className="producto-media">
                    <img src={prod.imagen} alt={prod.nombre} />
                  </div>
                  <span className="tag">{prod.tipo}</span>
                  <h3>{prod.nombre}</h3>
                  <p className="precio">${prod.precio}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>© 2026 Gloslip</p>
      </footer>
    </>
  );
}
