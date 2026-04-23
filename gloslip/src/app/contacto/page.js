import Link from "next/link";

export default function Contacto() {
  return (
    <>
      <div className="nav-wrap sticky-nav">
        <div className="nav-inner">
          <div className="brand"><span className="brand-g">G</span>loslip</div>
          <nav>
            <Link href="/">Inicio</Link>
            <Link href="/#catalogo">Catálogo</Link>
            <Link href="/contacto">Contacto</Link>
          </nav>
        </div>
      </div>

      <main style={{ paddingTop: "100px" }}>
        <section className="contact-section">
          <div className="section-header">
            <h2>Hablemos</h2>
            <p>¿Tenés dudas sobre algún tono o venta mayorista? Dejanos tu mensaje y te respondemos a la brevedad.</p>
          </div>

          <div className="contact-form">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo</label>
                <input type="text" id="nombre" placeholder="Ana López" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="ana@ejemplo.com" required />
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea id="mensaje" placeholder="Hola, me gustaría saber sobre..." required></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Enviar Mensaje
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand"><span className="brand-g">G</span>loslip</span>
          </div>
          <p className="footer-copy">© 2026 Gloslip · Todos los derechos reservados</p>
        </div>
      </footer>
    </>
  );
}