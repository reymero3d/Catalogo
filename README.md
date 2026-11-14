# reymero3d — Catálogo de impresiones 3D

Catálogo web de impresiones 3D con carrito y checkout por WhatsApp. Diseñado para alojarse de forma **gratuita**.

## Características

- Catálogo de productos con categorías, búsqueda y ordenamiento.
- Carrito de compras con personalización (color, notas).
- Checkout por WhatsApp con el detalle del pedido.
- Sección de destacados, nosotros y contacto.
- Responsive (mobile-first).

## Desarrollo local

```bash
npm install
npm run dev
```

Abrí http://localhost:5173

## Build de producción

```bash
npm run build
```

Los archivos estáticos quedan en `dist/`.

## Alojamiento gratuito (elegí uno)

### Opción 1 — Netlify (más fácil, recomendado)
1. Creá cuenta en https://netlify.com
2. "Add new site → Import an existing project" conectando tu repo de GitHub, **o** arrastrá la carpeta `dist/` a https://app.netlify.com/drop
3. Build command: `npm run build` · Publish directory: `dist`
4. Listo, te da una URL `https://reymero3d.netlify.app` (podés cambiar el nombre).

### Opción 2 — Vercel
1. https://vercel.com → Import Git Repository.
2. Framework preset: Vite. Build command `npm run build`, output `dist`.

### Opción 3 — GitHub Pages
1. Subí el repo a GitHub.
2. En Settings → Pages → Source: GitHub Actions.
3. Usá el workflow de Vite (https://vitejs.dev/guide/static-deploy.html#github-pages).
4. O deploy manual: `npm run build` y subí `dist/` a la rama `gh-pages`.

### Opción 4 — Cloudflare Pages
1. https://pages.cloudflare.com → Create project → conectá repo.
2. Build command `npm run build`, output `dist`.

## Panel de administración (subir productos desde la web)

El sitio incluye **Decap CMS** en `/admin` para que puedas agregar/editar productos (imagen, precio, descripción, stock, etc.) desde el navegador, sin tocar código.

### Activarlo en Netlify (una sola vez)

1. Subí el proyecto a un repositorio de GitHub (si aún no lo hiciste).
2. En Netlify: **Site settings → Build & deploy → Link to Git repository** y seleccioná tu repo.
   - Build command: `npm run build` · Publish directory: `dist`.
3. **Site settings → Identity → Enable Identity**.
4. En la misma sección, **Services → Git Gateway → Enable Git Gateway**.
5. **Identity → Invite users** → ingresá tu email y aceptá la invitación que te llega.

### Usarlo

- Entrá a `https://reymero3d.netlify.app/admin/` e iniciá sesión.
- En "Productos" podés **agregar, editar o eliminar** productos, subir imágenes (se guardan en `public/productos/`), cambiar precio, descripción, stock, etc.
- Cada cambio genera un commit en tu repo y Netlify **redeploya automáticamente** el sitio.

> Sin conectar el repo a Netlify y activar Identity + Git Gateway, el panel `/admin` no podrá guardar cambios.

## Personalización importante

Editá estos valores antes de publicar:

- **Número de WhatsApp**: en `src/components/CartDrawer.jsx` y `src/components/Contact.jsx` cambiá `WHATSAPP_NUMBER` por tu número (formato internacional sin +, ej. `5491123456789`).
- **Productos**: editá `src/data/products.js` (nombre, precio, descripción, imagen, stock).
- **Colores/marca**: Tailwind. El color principal es `indigo`; podés cambiarlo en los componentes.

## Estructura

```
src/
  components/   # Header, Hero, Catalog, ProductCard, ProductModal, CartDrawer, About, Contact, Footer
  context/      # CartContext
  data/         # products.js
  App.jsx
  main.jsx
  index.css
```
