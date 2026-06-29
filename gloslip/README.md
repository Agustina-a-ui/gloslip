This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Configuración de Supabase

Este proyecto usa Supabase como base de datos y sistema de autenticación.

### Confirmación de email

El plan gratuito de Supabase tiene un límite de emails por hora. Si aparece el error `email rate limit exceeded` o los emails de confirmación no llegan, desactivar la confirmación de email desde el panel de Supabase:

1. Ir a **Authentication → Settings**
2. En la sección **User Signups**, desactivar **Confirm email**
3. Hacer clic en **Save changes**

Esto permite que los usuarios se registren e inicien sesión sin necesitar confirmar su email.

### Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## Panel de administración

El panel de administración está disponible en `/admin`. Permite gestionar productos con CRUD completo (crear, editar, eliminar).

### Acceso

El acceso está restringido a un usuario administrador específico (`admin@gloslip.com`). Cualquier otro email es rechazado en el login.

### Nota sobre múltiples pestañas

El cliente de Supabase puede generar el warning `Multiple GoTrueClient instances detected` cuando se tienen múltiples pestañas abiertas en el mismo browser. Este es un comportamiento conocido del SDK de Supabase en el plan gratuito con autenticación del lado del cliente, y no representa un error del código. Para evitarlo, se recomienda usar el panel admin en una sola pestaña del navegador.

### Panel de administración — nota de implementación

El panel fue implementado con CRUD completo de productos y visualización de órdenes, con autenticación propia separada de la sesión de usuarios regulares mediante `storageKey` independiente en el cliente de Supabase.

### Webhooks de Mercado Pago

Los webhooks están configurados en `/api/webhooks` y el código procesa las notificaciones de pago actualizando el estado de las órdenes en Supabase automáticamente (`pendiente` → `pagada` → `cancelada`).

En el ambiente de prueba de Mercado Pago, las notificaciones webhook pueden no entregarse correctamente (error 502) debido a limitaciones del sandbox. El flujo de pago completo fue verificado manualmente: el usuario es redirigido a Mercado Pago, completa el pago y es redirigido de vuelta a la aplicación.

### Nota sobre múltiples pestañas

La aplicación funciona correctamente en una sola pestaña. Si se tienen múltiples pestañas abiertas simultáneamente, el SDK de Supabase puede generar conflictos de sesión (error: Multiple GoTrueClient instances detected). Esto es una limitación conocida del plan gratuito de Supabase con autenticación del lado del cliente. La solución definitiva requiere autenticación server-side con cookies.
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/optimizing/deploying) for more details.