'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

const formVacio = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  imagen_url: '',
  tipo: 'labial',
};

export default function AdminPage() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [verificando, setVerificando] = useState(true);

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(formVacio);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verificar = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: perfil } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('id', user.id)
        .single();

      if (perfil?.rol !== 'admin') {
        router.push('/');
        return;
      }

      setAutorizado(true);
      setVerificando(false);
    };
    verificar();
  }, []);

  useEffect(() => {
    if (autorizado) fetchProductos();
  }, [autorizado]);

  function handleLogout() {
    router.push('/');
  }

  async function fetchProductos() {
    setLoading(true);
    const { data } = await supabase.from('productos').select('*').order('id');
    setProductos(data || []);
    setLoading(false);
  }

  function abrirCrear() {
    setForm(formVacio);
    setError('');
    setModal('crear');
  }

  function abrirEditar(producto) {
    setForm({
      id: producto.id,
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: producto.precio || '',
      stock: producto.stock || '',
      imagen_url: producto.imagen_url || '',
      tipo: producto.tipo || 'labial',
    });
    setError('');
    setModal('editar');
  }

  async function handleEliminar(id, nombre) {
    if (!confirm('¿Seguro que querés eliminar "' + nombre + '"?')) return;
    const { error } = await supabase.from('productos').delete().eq('id', id);
    if (error) alert('Error al eliminar: ' + error.message);
    else fetchProductos();
  }

  async function handleGuardar() {
    if (!form.nombre || !form.precio || !form.stock) {
      setError('Nombre, precio y stock son obligatorios.');
      return;
    }
    setGuardando(true);
    setError('');

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      stock: Number(form.stock),
      imagen_url: form.imagen_url,
      tipo: form.tipo,
    };

    if (modal === 'crear') {
      const { error } = await supabase.from('productos').insert([payload]);
      if (error) { setError('Error al crear: ' + error.message); setGuardando(false); return; }
    } else {
      const { error } = await supabase.from('productos').update(payload).eq('id', form.id);
      if (error) { setError('Error al actualizar: ' + error.message); setGuardando(false); return; }
    }

    setGuardando(false);
    setModal(null);
    fetchProductos();
  }

  if (verificando) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8' }}>Verificando acceso...</p>
      </div>
    );
  }

  if (!autorizado) return null;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.titulo}>Panel Admin</h1>
          <p style={s.subtitulo}>Gestión de productos</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={abrirCrear} style={s.btnCrear}>+ Nuevo producto</button>
          <button onClick={handleLogout} style={s.btnSalir}>Salir</button>
        </div>
      </div>

      {loading ? (
        <p style={s.msg}>Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p style={s.msg}>No hay productos todavía.</p>
      ) : (
        <div style={s.tableWrapper}>
          <table style={s.table}>
            <thead>
              <tr style={s.trHead}>
                <th style={s.th}>ID</th>
                <th style={s.th}>Nombre</th>
                <th style={s.th}>Tipo</th>
                <th style={s.th}>Precio</th>
                <th style={s.th}>Stock</th>
                <th style={s.th}>Imagen URL</th>
                <th style={s.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p, i) => (
                <tr key={p.id} style={i % 2 === 0 ? s.trPar : {}}>
                  <td style={s.td}>{p.id}</td>
                  <td style={s.td}><strong>{p.nombre}</strong></td>
                  <td style={s.td}><span style={s.badge(p.tipo)}>{p.tipo}</span></td>
                  <td style={s.td}>${Number(p.precio).toLocaleString()}</td>
                  <td style={s.td}>{p.stock}</td>
                  <td style={{ ...s.td, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.imagen_url}</td>
                  <td style={s.td}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => abrirEditar(p)} style={s.btnEditar}>Editar</button>
                      <button onClick={() => handleEliminar(p.id, p.nombre)} style={s.btnEliminar}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p style={s.counter}>{productos.length} producto{productos.length !== 1 ? 's' : ''}</p>

      {modal && (
        <div style={s.overlay} onClick={() => setModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitulo}>{modal === 'crear' ? '+ Nuevo producto' : 'Editar producto'}</h2>

            <div style={s.campo}>
              <label style={s.label}>Nombre *</label>
              <input style={s.input} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Velvet Mate Cherry" />
            </div>

            <div style={s.campo}>
              <label style={s.label}>Descripción</label>
              <textarea style={{ ...s.input, height: '80px', resize: 'vertical' }} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción del producto" />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ ...s.campo, flex: 1 }}>
                <label style={s.label}>Precio *</label>
                <input style={s.input} type="number" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} placeholder="15000" />
              </div>
              <div style={{ ...s.campo, flex: 1 }}>
                <label style={s.label}>Stock *</label>
                <input style={s.input} type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="50" />
              </div>
            </div>

            <div style={s.campo}>
              <label style={s.label}>Imagen URL</label>
              <input style={s.input} value={form.imagen_url} onChange={e => setForm({ ...form, imagen_url: e.target.value })} placeholder="/imagen.jpg" />
            </div>

            <div style={s.campo}>
              <label style={s.label}>Tipo</label>
              <select style={s.input} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                <option value="labial">Labial</option>
                <option value="gloss">Gloss</option>
              </select>
            </div>

            {error && <p style={s.error}>{error}</p>}

            <div style={s.modalAcciones}>
              <button onClick={() => setModal(null)} style={s.btnCancelar}>Cancelar</button>
              <button onClick={handleGuardar} disabled={guardando} style={s.btnGuardar}>
                {guardando ? 'Guardando...' : modal === 'crear' ? 'Crear' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: '100px 40px 40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', color: '#1e293b' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  titulo: { fontSize: '28px', fontWeight: 800, margin: 0 },
  subtitulo: { color: '#64748b', fontSize: '14px', margin: '4px 0 0' },
  btnCrear: { background: '#8b3050', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' },
  btnSalir: { background: '#f1f5f9', color: '#475569', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' },
  tableWrapper: { background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #f0e6e2' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  trHead: { background: '#fdf2f5' },
  th: { padding: '14px 16px', textAlign: 'left', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8b3050', borderBottom: '2px solid #f0e6e2' },
  td: { padding: '13px 16px', borderBottom: '1px solid #fdf2f5' },
  trPar: { background: '#fffafa' },
  badge: (tipo) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: tipo === 'labial' ? '#fce4ec' : '#e8f5e9', color: tipo === 'labial' ? '#8b3050' : '#2e7d32' }),
  btnEditar: { background: '#f59e0b', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 },
  btnEliminar: { background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 },
  msg: { color: '#64748b', textAlign: 'center', marginTop: '60px', fontSize: '15px' },
  counter: { marginTop: '12px', fontSize: '13px', color: '#94a3b8' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modal: { background: '#fff', borderRadius: '18px', padding: '36px', width: '520px', maxWidth: '95vw', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', maxHeight: '90vh', overflowY: 'auto' },
  modalTitulo: { margin: '0 0 24px', fontSize: '20px', fontWeight: 800 },
  campo: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif' },
  error: { color: '#ef4444', fontSize: '13px', marginBottom: '12px' },
  modalAcciones: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
  btnCancelar: { background: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' },
  btnGuardar: { background: '#8b3050', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '14px' },
};