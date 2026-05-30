"use client";

import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [usuario, setUsuario] = useState(null);

  // Escuchar cambios de sesión
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setUsuario(user);
      if (user) {
        cargarCarritoDeSupabase(user.id);
      } else {
        setCarrito([]);
      }
    });

    // Cargar usuario actual al montar
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUsuario(user);
      if (user) cargarCarritoDeSupabase(user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const cargarCarritoDeSupabase = async (userId) => {
    const { data, error } = await supabase
      .from('carrito')
      .select('*, producto:productos(*)')
      .eq('usuario_id', userId);

    if (!error && data) {
      const items = data.map(item => ({
        ...item.producto,
        cantidad: item.cantidad,
        imagen: item.producto.imagen_url
      }));
      setCarrito(items);
    }
  };

  const agregarAlCarrito = async (producto, cantidadAgregada = 1) => {
    // Actualizar estado local
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find((item) => item.id === producto.id);
      if (productoExistente) {
        return prevCarrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidadAgregada }
            : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad: cantidadAgregada }];
      }
    });

    // Guardar en Supabase si está logueado
    if (usuario) {
      const itemExistente = carrito.find(item => item.id === producto.id);
      const nuevaCantidad = (itemExistente?.cantidad || 0) + cantidadAgregada;

      await supabase.from('carrito').upsert({
        usuario_id: usuario.id,
        producto_id: producto.id,
        cantidad: nuevaCantidad
      }, { onConflict: 'usuario_id,producto_id' });
    }
  };

  const eliminarDelCarrito = async (id) => {
    setCarrito((prev) => prev.filter(item => item.id !== id));

    if (usuario) {
      await supabase
        .from('carrito')
        .delete()
        .eq('usuario_id', usuario.id)
        .eq('producto_id', id);
    }
  };

  const vaciarCarrito = async () => {
    setCarrito([]);
    if (usuario) {
      await supabase
        .from('carrito')
        .delete()
        .eq('usuario_id', usuario.id);
    }
  };

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, totalItems, totalPrecio }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);