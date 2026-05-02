"use client";

import { createContext, useState, useContext } from 'react';

// Creamos el contexto vacío
const CartContext = createContext();

// Creamos el "Proveedor" que va a envolver a toda la app
export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  // Función para agregar productos
  // Buscá tu función agregarAlCarrito en CartContext.js y cambiala por esta:

  const agregarAlCarrito = (producto, cantidadAgregada = 1) => {
    setCarrito((prevCarrito) => {
    // Buscamos si el producto ya está en el carrito
    const productoExistente = prevCarrito.find((item) => item.id === producto.id);

    if (productoExistente) {
      // Si ya existe, le sumamos la NUEVA cantidad a la que ya tenía
        return prevCarrito.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + cantidadAgregada }
          : item
        );
      } else {
      // Si no existe, lo agregamos con la cantidad elegida
        return [...prevCarrito, { ...producto, cantidad: cantidadAgregada }];
      }
    });
  };

  // Función para eliminar
  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter(item => item.id !== id));
  };

  // Matemáticas automáticas
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, totalItems, totalPrecio }}>
      {children}
    </CartContext.Provider>
  );
}

// Un "atajo" para usar el carrito en cualquier página
export const useCart = () => useContext(CartContext);