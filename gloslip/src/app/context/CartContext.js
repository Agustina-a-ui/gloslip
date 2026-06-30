"use client";

import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const cargadoRef = useRef(false);

  useEffect(() => {
    let montado = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!montado) return;
      
      const user = session?.user ?? null;
      
      // GUARDiÁN DE RENDERS: Comparamos estrictamente por ID.
      // Si el ID es igual, retornamos 'prev' (mismo objeto en memoria).
      // Esto congela instantáneamente cualquier bucle infinito antes de que rompa la app.
      setUsuario((prev) => {
        if (prev?.id === user?.id) {
          return prev; 
        }
        if (!user) {
          setCarrito([]);
        }
        return user;
      });
    });

    // Cargar usuario inicial de forma segura
    if (!cargadoRef.current) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (montado && user) {
          setUsuario(user);
        }
        cargadoRef.current = true;
      });
    }

    return () => {
      montado = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, []);

  // Este efecto aislado SOLO se ejecutará si el ID del usuario cambia de VERDAD
  // Evitando ejecuciones duplicadas o congelamientos al cambiar de pestaña
  useEffect(() => {
    if (usuario?.id) {
      cargarCarritoDeSupabase(usuario.id);
    }
  }, [usuario?.id]);

  const cargarCarritoDeSupabase = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('carrito')
        .select('*, producto:productos(*)')
        .eq('usuario_id', userId);

      if (!error && data) {
        const items = data
          .filter(item => item.producto)
          .map(item => ({
            ...item.producto,
            cantidad: item.cantidad,
            imagen: item.producto.imagen_url
          }));
        setCarrito(items);
      }
    } catch (err) {
      console.error("Error al cargar carrito:", err);
    }
  };

  const agregarAlCarrito = async (producto, cantidadAgregada = 1) => {
    const itemExistente = carrito.find(item => item.id === producto.id);
    const cantidadActual = itemExistente?.cantidad || 0;
    const cantidadTotal = cantidadActual + cantidadAgregada;

    if (cantidadTotal > producto.stock) {
      alert(`Solo hay ${producto.stock} unidades disponibles de ${producto.nombre}`);
      return false;
    }

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

    if (usuario) {
      try {
        await supabase.from('carrito').upsert({
          usuario_id: usuario.id,
          producto_id: producto.id,
          cantidad: cantidadTotal
        }, { onConflict: 'usuario_id,producto_id' });
      } catch (err) {
        console.error("Error al guardar en carrito:", err);
      }
    }
    return true;
  };

  const eliminarDelCarrito = async (id) => {
    setCarrito((prev) => prev.filter(item => item.id !== id));

    if (usuario) {
      try {
        await supabase
          .from('carrito')
          .delete()
          .eq('usuario_id', usuario.id)
          .eq('producto_id', id);
      } catch (err) {
        console.error("Error al eliminar del carrito:", err);
      }
    }
  };

  const vaciarCarrito = async () => {
    setCarrito([]);
    if (usuario) {
      try {
        await supabase
          .from('carrito')
          .delete()
          .eq('usuario_id', usuario.id);
      } catch (err) {
        console.error("Error al vaciar carrito:", err);
      }
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