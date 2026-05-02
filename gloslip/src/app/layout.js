import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
// 1. AGREGAMOS ESTA IMPORTACIÓN:
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/navbar";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Gloslip",
  description: "Gloslip - Tubos de labiales elegantes con estilo premium.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable}`}>
      <body>
        {/* 2. ENVOLVEMOS A CHILDREN CON EL PROVEEDOR DEL CARRITO */}
        <CartProvider>
          {/* 2. Ponemos el Navbar acá, así sale en TODAS las páginas */}
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}