"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtrados, setFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const cardsRef = useRef([]);
  const heroWrapperRef = useRef(null);
  const [scrollVal, setScrollVal] = useState(0);
  const [openVal, setOpenVal] = useState(0);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const datos = [
          { id: 1, nombre: "Velvet Mate Cherry", tipo: "labial", precio: 15000, imagen: "/labial-pa.jpg" },
          { id: 2, nombre: "Gloss Crystal Clear", tipo: "gloss", precio: 12000, imagen: "/labial-cherry.png" },
          { id: 3, nombre: "Nude Chic Mate", tipo: "labial", precio: 14000, imagen: "/labial-cerrado.jpg" },
          { id: 4, nombre: "Berry Bomb Gloss", tipo: "gloss", precio: 13000, imagen: "/labial-pa.jpg" },
          { id: 5, nombre: "Rose Gold Shimmer", tipo: "labial", precio: 15500, imagen: "/labial-cherry.png" }
        ];
        setProductos(datos);
        setFiltrados(datos);
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
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    cardsRef.current.forEach((card) => { if (card) observer.observe(card); });
    return () => observer.disconnect();
  }, [productos]);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / window.innerHeight, 1);
      const openProgress = Math.max(
        0,
        Math.min((scrollY - window.innerHeight * 0.005) / (window.innerHeight * 0.18), 1)
      );
      setScrollVal(progress);
      setOpenVal(openProgress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const manejarBusqueda = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);
    if (valor.trim() === '') {
      setFiltrados(productos);
    } else {
      const resultados = productos.filter((p) =>
        p.nombre.toLowerCase().includes(valor) ||
        p.tipo.toLowerCase().includes(valor)
      );
      setFiltrados(resultados);
    }
  };

  const translateY = scrollVal * -32;
  const rotateZ   = scrollVal * 9;
  const capMotion = openVal;
  const bulletTY  = capMotion * -18;
  const capRotate = capMotion * -35;
  const capTX     = capMotion * 40;
  const capTY     = capMotion * -25;

  return (
    <>
      <div className="noise-overlay" />

      {/* HEADER STICKY (Independiente del hero) */}
      <div className="nav-wrap sticky-nav">
        <div className="nav-inner">
          <div className="brand"><span className="brand-g">G</span>loslip</div>
          <nav>
            <Link href="#inicio">Inicio</Link>
            <Link href="#catalogo">Catálogo</Link>
            <Link href="/contacto">Contacto</Link>
          </nav>
          <div className="nav-cta">
            <Link href="#catalogo" className="btn btn-nav">Descubrir</Link>
          </div>
        </div>
      </div>

      <header className="site-header" id="inicio">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow-wrap">
              <span className="eyebrow-line" />
              <p className="eyebrow">Colección Primavera · 2026</p>
            </div>
            <h1 className="h1-hero">
              <span className="h1-sub">Descubre tu</span>
              <span className="h1-main">tono perfecto</span>
            </h1>
            <p className="hero-desc">
              Labiales de alta pigmentación con fórmula enriquecida con vitamina E.
              Color intenso y duradero que realza tu belleza natural.
            </p>
            <div className="hero-actions">
              <Link href="#catalogo" className="btn btn-primary">
                Descubrir colección
              </Link>
              <Link href="/contacto" className="btn btn-ghost">Contáctanos</Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-num">24</span>
                <span className="stat-label">Colores</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">12h</span>
                <span className="stat-label">Pigmentación</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">100%</span>
                <span className="stat-label">Vegano</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-glow" />
            <div
              className="hero-image-wrap"
              ref={heroWrapperRef}
              style={{ transform: `translateY(${translateY}px) rotate(${rotateZ}deg)` }}
            >
              {/* ── LABIAL SVG GIRLY (Con overflow: visible) ── */}
              <svg
                className="lipstick-svg"
                viewBox="0 0 220 420"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible' }} 
              >
                <defs>
                  <linearGradient id="bodyG" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#e8c0b4"/>
                    <stop offset="40%"  stopColor="#f5d8d0"/>
                    <stop offset="100%" stopColor="#d9a898"/>
                  </linearGradient>
                  <linearGradient id="bodyShine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#fff" stopOpacity="0"/>
                    <stop offset="35%"  stopColor="#fff" stopOpacity="0.22"/>
                    <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="goldG" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#c9907a"/>
                    <stop offset="40%"  stopColor="#e8b8a8"/>
                    <stop offset="70%"  stopColor="#f5d0c4"/>
                    <stop offset="100%" stopColor="#c0887a"/>
                  </linearGradient>
                  <linearGradient id="gold2G" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#be8070"/>
                    <stop offset="50%"  stopColor="#dca898"/>
                    <stop offset="100%" stopColor="#be8070"/>
                  </linearGradient>
                  <linearGradient id="bulG" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#8b3050"/>
                    <stop offset="30%"  stopColor="#c0486a"/>
                    <stop offset="60%"  stopColor="#d4748a"/>
                    <stop offset="100%" stopColor="#8b3050"/>
                  </linearGradient>
                  <linearGradient id="bulShine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#fff" stopOpacity="0"/>
                    <stop offset="38%"  stopColor="#fff" stopOpacity="0.22"/>
                    <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="capG" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#f0e4e0"/>
                    <stop offset="40%"  stopColor="#fdf6f4"/>
                    <stop offset="100%" stopColor="#e8d8d4"/>
                  </linearGradient>
                  <linearGradient id="capShine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#fff" stopOpacity="0"/>
                    <stop offset="35%"  stopColor="#fff" stopOpacity="0.28"/>
                    <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
                  </linearGradient>
                  <filter id="bulletGlow">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#d4748a" floodOpacity="0.38"/>
                  </filter>
                </defs>

                <g>
                  <rect x="62" y="358" width="96" height="18" rx="9" fill="url(#goldG)"/>
                  <rect x="58" y="190" width="104" height="172" rx="10" fill="url(#bodyG)"/>
                  <rect x="58" y="190" width="104" height="172" rx="10" fill="url(#bodyShine)"/>
                  <rect x="58" y="348" width="104" height="14" rx="4" fill="url(#goldG)"/>
                  <rect x="74" y="268" width="72" height="1.2" rx="1" fill="#c9907a" opacity="0.4"/>
                  <rect x="82" y="276" width="56" height="0.8" rx="1" fill="#c9907a" opacity="0.22"/>
                  <text x="110" y="325" textAnchor="middle" fontFamily="Georgia, serif" fontSize="20" fontStyle="italic" fill="#b07060" opacity="0.55" letterSpacing="2">G</text>
                </g>

                <g>
                  <rect x="54" y="178" width="112" height="22" rx="5" fill="url(#goldG)"/>
                  <rect x="58" y="183" width="104" height="12" rx="3" fill="url(#gold2G)"/>
                </g>

                <g style={{ transform: `translateY(${bulletTY}px)`, transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)' }} filter="url(#bulletGlow)">
                  <rect x="68" y="110" width="84" height="74" fill="url(#bulG)"/>
                  <rect x="68" y="110" width="84" height="74" fill="url(#bulShine)"/>
                  <path d="M68 110 Q68 62 110 44 Q152 62 152 110 Z" fill="url(#bulG)"/>
                  <path d="M68 110 Q68 62 110 44 Q152 62 152 110 Z" fill="url(#bulShine)"/>
                  <path d="M80 98 Q85 70 100 56" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
                  <rect x="64" y="176" width="92" height="10" rx="3" fill="url(#goldG)"/>
                </g>

                <g style={{ transform: `translate(${capTX}px, ${capTY}px) rotate(${capRotate}deg)`, transformOrigin: '110px 310px', transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)' }}>
                  <rect x="56" y="22" width="108" height="162" rx="14" fill="url(#capG)"/>
                  <rect x="56" y="22" width="108" height="162" rx="14" fill="url(#capShine)"/>
                  <ellipse cx="110" cy="22" rx="54" ry="10" fill="#f0e6e2"/>
                  <rect x="56" y="168" width="108" height="16" rx="4" fill="url(#goldG)"/>
                  <rect x="72" y="78" width="76" height="1.2" rx="1" fill="#c9907a" opacity="0.3"/>
                  <rect x="80" y="88" width="60" height="0.8" rx="1" fill="#c9907a" opacity="0.15"/>
                  <text x="110" y="138" textAnchor="middle" fontFamily="Georgia, serif" fontSize="26" fontStyle="italic" fill="#c9907a" opacity="0.55" letterSpacing="3">G</text>
                </g>
              </svg>
            </div>
          </div>
        </section>

        <div className="scroll-hint">
          <div className="scroll-hint-line" />
          <span>scroll</span>
        </div>
      </header>

      <main>
        <section id="catalogo" className="catalogo-section">
          <div className="section-header">
            <h2>Nuestros tonos favoritos</h2>
            <p>Tonos curados con acabados confortables, pensados para destacar sin esfuerzo.</p>
            <br />
            <div className="form-group">
              <input
                type="text"
                placeholder="Buscar labial por nombre o tipo..."
                value={busqueda}
                onChange={manejarBusqueda}
              />
            </div>
          </div>

          {cargando ? (
            <p className="text-center text-muted">Cargando la colección...</p>
          ) : filtrados.length === 0 ? (
            <p className="text-center text-muted">No encontramos resultados para "{busqueda}"</p>
          ) : (
            <div className="catalog-grid">
              {filtrados.map((prod, index) => (
                <article
                  key={prod.id}
                  className="product-card"
                  ref={(el) => (cardsRef.current[index] = el)}
                >
                  <div className="product-image">
                    <img src={prod.imagen} alt={`Foto de ${prod.nombre}`} />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{prod.nombre}</h3>
                    <p className="product-desc">Tipo: {prod.tipo}</p>
                    <p className="product-price">${prod.precio}</p>
                    <div className="product-actions">
                      <a
                        href={`mailto:ventas@gloslip.com?subject=Compra%20${encodeURIComponent(prod.nombre)}`}
                        className="btn btn-ghost"
                      >Comprar</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand"><span className="brand-g">G</span>loslip</span>
          </div>
          <div className="footer-links">
            <Link href="/contacto">Contacto</Link>
            <Link href="#">Instagram</Link>
            <Link href="#">TikTok</Link>
          </div>
          <p className="footer-copy">© 2026 Gloslip · Todos los derechos reservados</p>
        </div>
      </footer>
    </>
  );
}