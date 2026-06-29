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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
### Panel de administración

El panel de administración (`/admin`) no fue implementado en esta entrega dado que el docente indicó que no era un requisito obligatorio. De haberse implementado, consistiría en una ruta protegida por rol (`rol = 'admin'` en la tabla `usuarios`) con CRUD de productos, visualización de órdenes y gestión de usuarios, consumiendo directamente la API de Supabase.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/optimizing/docs/app/building-your-application/deploying) for more details.