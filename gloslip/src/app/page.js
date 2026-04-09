"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const cardsRef = useRef([]);
  const heroWrapperRef = useRef(null);
  const [scrollVal, setScrollVal] = useState(0);
  const [openVal, setOpenVal] = useState(0);

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

  const translateY = scrollVal * -32;
  const rotateZ   = scrollVal * 9;
  const capMotion = openVal;
  const bulletTY  = capMotion * -22;
  const capRotate = capMotion * -62;
  const capTX     = capMotion * 70;
  const capTY     = capMotion * -45;

  return (
    <>
      <header className="site-header">
        <div className="noise-overlay" />

        <div className="nav-wrap">
          <div className="brand"><span className="brand-g">G</span>loslip</div>
          <nav>
            <Link href="#inicio">Inicio</Link>
            <Link href="#catalogo">Catálogo</Link>
            <Link href="/contacto">Contacto</Link>
          </nav>
          <div className="nav-cta">
            <Link href="#catalogo" className="btn btn-nav">Ver colección</Link>
          </div>
        </div>

        <section className="hero" id="inicio">
          <div className="hero-copy">
            <div className="eyebrow-wrap">
              <span className="eyebrow-line" />
              <p className="eyebrow">Edición limitada · 2026</p>
            </div>
            <h1>
              <span className="h1-sub">El color que</span>
              <span className="h1-main">te define</span>
            </h1>
            <p className="hero-desc">
              Labiales de acabado sedoso con fórmula de larga duración.
              Cada tono, una declaración.
            </p>
            <div className="hero-actions">
              <Link href="#catalogo" className="btn btn-primary">
                <span>Explorar colección</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/contacto" className="btn btn-ghost">Contacto</Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-num">24</span>
                <span className="stat-label">Tonos</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">12h</span>
                <span className="stat-label">Duración</span>
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
              {/* ── LABIAL SVG GIRLY ── */}
              <svg
                className="lipstick-svg"
                viewBox="0 0 220 420"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* cuerpo — rosado nude */}
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
                  {/* detalles dorado rosado */}
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
                  {/* bullet — rosa profundo */}
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
                  {/* tapa — blanco marfil */}
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

                {/* ── CUERPO ── */}
                <g>
                  <rect x="62" y="358" width="96" height="18" rx="9" fill="url(#goldG)"/>
                  <rect x="58" y="190" width="104" height="172" rx="10" fill="url(#bodyG)"/>
                  <rect x="58" y="190" width="104" height="172" rx="10" fill="url(#bodyShine)"/>
                  <rect x="58" y="348" width="104" height="14" rx="4" fill="url(#goldG)"/>
                  {/* líneas decorativas */}
                  <rect x="74" y="268" width="72" height="1.2" rx="1" fill="#c9907a" opacity="0.4"/>
                  <rect x="82" y="276" width="56" height="0.8" rx="1" fill="#c9907a" opacity="0.22"/>
                  {/* inicial */}
                  <text x="110" y="325" textAnchor="middle"
                    fontFamily="Georgia, serif" fontSize="20" fontStyle="italic"
                    fill="#b07060" opacity="0.55" letterSpacing="2">G</text>
                </g>

                {/* ── COLLAR ── */}
                <g>
                  <rect x="54" y="178" width="112" height="22" rx="5" fill="url(#goldG)"/>
                  <rect x="58" y="183" width="104" height="12" rx="3" fill="url(#gold2G)"/>
                </g>

                {/* ── BULLET (sube con scroll) ── */}
                <g
                  style={{
                    transform: `translateY(${bulletTY}px)`,
                    transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                  filter="url(#bulletGlow)"
                >
                  <rect x="68" y="110" width="84" height="74" fill="url(#bulG)"/>
                  <rect x="68" y="110" width="84" height="74" fill="url(#bulShine)"/>
                  {/* punta curva */}
                  <path d="M68 110 Q68 62 110 44 Q152 62 152 110 Z" fill="url(#bulG)"/>
                  <path d="M68 110 Q68 62 110 44 Q152 62 152 110 Z" fill="url(#bulShine)"/>
                  {/* reflejo diagonal */}
                  <path d="M80 98 Q85 70 100 56" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
                  <rect x="64" y="176" width="92" height="10" rx="3" fill="url(#goldG)"/>
                </g>

                {/* ── TAPA (gira con scroll) ── */}
                <g
                  style={{
                    transform: `translate(${capTX}px, ${capTY}px) rotate(${capRotate}deg)`,
                    transformOrigin: '110px 310px',
                    transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                >
                  <rect x="56" y="22" width="108" height="162" rx="14" fill="url(#capG)"/>
                  <rect x="56" y="22" width="108" height="162" rx="14" fill="url(#capShine)"/>
                  <ellipse cx="110" cy="22" rx="54" ry="10" fill="#f0e6e2"/>
                  {/* anillo inferior tapa */}
                  <rect x="56" y="168" width="108" height="16" rx="4" fill="url(#goldG)"/>
                  {/* líneas decorativas tapa */}
                  <rect x="72" y="78" width="76" height="1.2" rx="1" fill="#c9907a" opacity="0.3"/>
                  <rect x="80" y="88" width="60" height="0.8" rx="1" fill="#c9907a" opacity="0.15"/>
                  {/* logo tapa */}
                  <text x="110" y="138" textAnchor="middle"
                    fontFamily="Georgia, serif" fontSize="26" fontStyle="italic"
                    fill="#c9907a" opacity="0.55" letterSpacing="3">G</text>
                </g>
              </svg>

              <div className="particle p1" />
              <div className="particle p2" />
              <div className="particle p3" />
            </div>
          </div>
        </section>

        <div className="scroll-hint">
          <div className="scroll-hint-line" />
          <span>scroll</span>
        </div>
      </header>

      <main>
        <div className="marquee-strip">
          {[...Array(6)].map((_, i) => (
            <span key={i}>GLOSLIP · EDICIÓN LIMITADA · 2026 · </span>
          ))}
        </div>

        <section id="catalogo" className="catalogo-section">
          <div className="section-header">
            <div className="eyebrow-wrap center">
              <span className="eyebrow-line" />
              <p className="eyebrow">Colección</p>
              <span className="eyebrow-line" />
            </div>
            <h2>Nuestros tonos favoritos</h2>
            <p>Tonos curados con acabados confortables, pensados para destacar sin esfuerzo.</p>
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
                  style={{ '--delay': `${index * 0.1}s` }}
                >
                  <div className="producto-media">
                    <img src={prod.imagen} alt={`Foto de ${prod.nombre}`} />
                    <div className="producto-overlay"><span>Ver detalle →</span></div>
                  </div>
                  <div className="producto-info">
                    <span className="tag">{prod.tipo}</span>
                    <h3>{prod.nombre}</h3>
                    <p className="precio">${prod.precio}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="benefits-section">
          <div className="benefit">
            <div className="benefit-icon">✦</div>
            <h4>Fórmula premium</h4>
            <p>Ingredientes de origen natural que nutren e hidratan mientras colorean.</p>
          </div>
          <div className="benefit">
            <div className="benefit-icon">◈</div>
            <h4>Larga duración</h4>
            <p>Hasta 12 horas de color intenso sin retoques ni tacto graso.</p>
          </div>
          <div className="benefit">
            <div className="benefit-icon">❋</div>
            <h4>100% vegano</h4>
            <p>Sin crueldad animal, libre de parabenos y dermatológicamente testeado.</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-inner">
          <div className="brand footer-brand"><span className="brand-g">G</span>loslip</div>
          <p>© 2026 Gloslip · Todos los derechos reservados</p>
          <div className="footer-links">
            <Link href="/contacto">Contacto</Link>
            <Link href="#">Instagram</Link>
          </div>
        </div>
      </footer>
    </>
  );
}