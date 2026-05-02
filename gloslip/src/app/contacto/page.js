"use client";

import Link from "next/link";

export default function Contacto() {
  return (
    <>
      <main style={styles.main}>
        <div style={styles.container}>
          <h1 style={styles.title}>Hablemos</h1>
          <p style={styles.text}>
            ¿Tienes dudas sobre cuál es tu tono perfecto? ¿Problemas con tu envío? 
            Escríbenos y nuestro equipo te responderá a la brevedad.
          </p>
          
          <a href="mailto:ventas@gloslip.com" style={styles.button}>
            Enviar un Correo
          </a>
          
          <br /><br />
          <Link href="/" style={styles.link}>
            ← Volver al inicio
          </Link>
        </div>
      </main>
    </>
  );
}

// Estilos en línea para asegurar que se vea bien rápido
const styles = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffdfc',
    padding: '2rem',
  },
  container: {
    maxWidth: '500px',
    textAlign: 'center',
    padding: '3rem 2rem',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    border: '1px solid #f0e6e2'
  },
  title: {
    fontSize: '2.5rem',
    color: '#8b3050',
    marginBottom: '1rem',
  },
  text: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#c9907a',
    color: '#fff',
    padding: '0.8rem 2rem',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background 0.3s',
  },
  link: {
    color: '#c9907a',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600'
  }
};