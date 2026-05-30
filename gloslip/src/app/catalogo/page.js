"use client";

import Link from "next/link";
import { useState, Suspense, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

const paletaFiltros = [
  { id: 'todos', label: 'Todos', bg: 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' },
  { id: 'rojo', label: 'Rojos', bg: '#8b0000' },
  { id: 'nude', label: 'Nudes', bg: '#d2a68d' },
  { id: 'rosa', label: 'Rosas', bg: '#b76e79' },
  { id: 'transparente', label: 'Transp.', bg: '#fce4ec' }
];

const colorHexMap = {
  'Velvet Mate Cherry': { hex: '#8b0000', familia: 'rojo' },
  'Gloss Crystal Clear': { hex: '#fce4ec', familia: 'transparente' },
  'Nude Chic Mate': { hex: '#d2a68d', familia: 'nude' },
  'Berry Bomb Gloss': { hex: '#8e3159', familia: 'rojo' },
  'Rose Gold Shimmer': { hex: '#b76e79', familia: 'rosa' },
};

function TarjetaProducto({ producto }) {
  const { agregarAlCarrito } = useCart();
  const [cantidad, setCantidad] = useState(1);

  const restar = () => { if (cantidad > 1) setCantidad(cantidad - 1); };
  const sumar = () => setCantidad(cantidad + 1);

  const colorInfo = colorHexMap[producto.nombre] || { hex: '#c9907a', familia: 'nude' };

  return (
    <div className="product-card" style={{
      border: '1px solid #f0e6e2', padding: '15px', borderRadius: '16px',
      backgroundColor: '#fff', display: 'flex', flexDirection: 'column',
      boxShadow: '0 4px 15px rgba(0,0,0,0.03)', transition: 'transform 0.2s ease',
    }}>
      <Link href={`/producto/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img src={producto.imagen_url} alt={producto.nombre} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', aspectRatio: '1/1' }} />
      </Link>

      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', margin: '0 0 5px 0', color: '#333' }}>{producto.nombre}</h3>
          <p style={{ color: '#999', fontSize: '0.8rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{producto.tipo}</p>
        </div>
        <div style={{
          width: '22px', height: '22px', backgroundColor: colorInfo.hex,
          borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 0 0 1px #eaeaea', flexShrink: 0
        }} title={`Tono: ${producto.nombre}`} />
      </div>

      <Link href={`/producto/${producto.id}`} className="btn btn-primary" style={{
        display: 'block', textAlign: 'center', margin: '15px 0 0 0',
        padding: '8px', border: '1px solid #8b3050', color: '#8b3050', backgroundColor: 'transparent',
        borderRadius: '30px', textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.3s ease'
      }}>
        Ver detalle
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f9f4f2' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#8b3050' }}>${producto.precio.toLocaleString()}</span>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', border: '1px solid #eee', borderRadius: '30px', overflow: 'hidden', backgroundColor: '#fafafa' }}>
            <button onClick={restar} style={{ padding: '6px 10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#666' }}>-</button>
            <span style={{ padding: '6px 2px', fontSize: '0.9rem', fontWeight: 'bold', minWidth: '16px', textAlign: 'center', color: '#333' }}>{cantidad}</span>
            <button onClick={sumar} style={{ padding: '6px 10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#666' }}>+</button>
          </div>

          <button onClick={() => {
            agregarAlCarrito({ ...producto, imagen: producto.imagen_url }, cantidad);
            alert(`¡Agregaste ${cantidad} ${producto.nombre} al carrito!`);
            setCantidad(1);
          }}
            style={{
              backgroundColor: '#c9907a', color: 'white', border: 'none',
              padding: '8px 16px', borderRadius: '30px', cursor: 'pointer',
              fontWeight: '600', fontSize: '0.85rem'
            }}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

function CatalogoContenido() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [categoria, setCategoria] = useState('todos');
  const [colorFiltro, setColorFiltro] = useState('todos');
  const [orden, setOrden] = useState('defecto');

  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase.from('productos').select('*');
      if (error) {
        console.error('Error al cargar productos:', error);
      } else {
        setProductos(data || []);
      }
      setCargando(false);
    };
    fetchProductos();
  }, []);

  let productosMostrados = productos.filter((prod) => {
    const colorInfo = colorHexMap[prod.nombre] || { hex: '#c9907a', familia: 'nude' };
    const coincideBusqueda = prod.nombre.toLowerCase().includes(query.toLowerCase()) || prod.tipo.toLowerCase().includes(query.toLowerCase());
    const coincideCategoria = categoria === 'todos' || prod.tipo === categoria;
    const coincideColor = colorFiltro === 'todos' || colorInfo.familia === colorFiltro;
    return coincideBusqueda && coincideCategoria && coincideColor;
  });

  if (orden === 'menor') productosMostrados.sort((a, b) => a.precio - b.precio);
  else if (orden === 'mayor') productosMostrados.sort((a, b) => b.precio - a.precio);
  else if (orden === 'az') productosMostrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  else if (orden === 'za') productosMostrados.sort((a, b) => b.nombre.localeCompare(a.nombre));

  return (
    <main style={{ padding: '100px 20px 60px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fffdfc', minHeight: '100vh' }}>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#8b3050', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '10px' }}>
          {query ? `Resultados para "${query}"` : "Catálogo de Tonos"}
        </h1>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: '20px',
        backgroundColor: '#fff', padding: '25px', borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #faece6',
        marginBottom: '40px'
      }}>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['todos', 'labial', 'gloss'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoria(categoria === cat && cat !== 'todos' ? 'todos' : cat)}
                style={{
                  padding: '8px 20px', borderRadius: '30px',
                  border: categoria === cat ? 'none' : '1px solid #eee',
                  backgroundColor: categoria === cat ? '#8b3050' : '#fff',
                  color: categoria === cat ? '#fff' : '#666',
                  fontWeight: categoria === cat ? 'bold' : 'normal',
                  cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s ease',
                  boxShadow: categoria === cat ? '0 4px 10px rgba(139, 48, 80, 0.2)' : 'none'
                }}
              >
                {cat === 'todos' ? 'Todos' : cat === 'labial' ? 'Labiales' : 'Glosses'}
              </button>
            ))}
          </div>

          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            style={{
              padding: '10px 15px', borderRadius: '12px', border: '1px solid #eee',
              backgroundColor: '#fafafa', color: '#555', outline: 'none',
              cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem'
            }}
          >
            <option value="defecto">Ordenar por...</option>
            <option value="menor">Precio: Menor a Mayor</option>
            <option value="mayor">Precio: Mayor a Menor</option>
            <option value="az">Nombre: A - Z</option>
            <option value="za">Nombre: Z - A</option>
          </select>
        </div>

        <div style={{ height: '1px', backgroundColor: '#f0e6e2', width: '100%' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Filtrar por Tono:</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            {paletaFiltros.map((color) => (
              <div
                key={color.id}
                onClick={() => setColorFiltro(colorFiltro === color.id && color.id !== 'todos' ? 'todos' : color.id)}
                title={color.label}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: color.bg, cursor: 'pointer',
                  border: colorFiltro === color.id ? '3px solid #fff' : '2px solid transparent',
                  boxShadow: colorFiltro === color.id ? '0 0 0 2px #8b3050, 0 4px 8px rgba(0,0,0,0.1)' : '0 2px 5px rgba(0,0,0,0.1)',
                  transform: colorFiltro === color.id ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {colorFiltro === color.id && color.id !== 'todos' && (
                  <span style={{ color: '#fff', fontSize: '12px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#c9907a' }}>
          <p>Cargando tonos... 💄</p>
        </div>
      ) : productosMostrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
          <h2>No encontramos productos con esos filtros 😥</h2>
          <p>Intentá borrar tu búsqueda o cambiar las categorías.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {productosMostrados.map((prod) => (
            <TarjetaProducto key={prod.id} producto={prod} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function Catalogo() {
  return (
    <Suspense>
      <CatalogoContenido />
    </Suspense>
  );
}