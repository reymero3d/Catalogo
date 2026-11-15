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

## Alojamiento gratuito (GitHub Pages — recomendado)

El proyecto ya incluye un workflow de GitHub Actions (`.github/workflows/deploy.yml`) que despliega automáticamente.

1. Subí el repo a GitHub (si no lo hiciste).
2. En GitHub: **Settings → Pages → Source: GitHub Actions**.
3. Cada `git push` a `main` dispara el deploy automáticamente.
4. Tu sitio queda en `https://TU_USUARIO.github.io/Catalogo/` (o con dominio custom).

### Otras opciones gratuitas

- **Vercel:** https://vercel.com → Import Git Repository. Preset Vite, build `npm run build`, output `dist`.
- **Cloudflare Pages:** https://pages.cloudflare.com → conectá repo. Build `npm run build`, output `dist`.
- **Netlify:** gratuito pero con límite de build minutes (300/mes). Si se exceden, los deploys se pausan.

## Panel de administración (`/admin`)

El sitio incluye una página `/admin` (protegida por login de Netlify Identity en Netlify, o accesible directamente en otros hosts) para agregar productos con calculadora de precios integrada.

### Funcionalidades

- **Calculadora de costos 3D** integrada (material, luz, desgaste, margen, insumos, multiplicador).
- **Importar desde MakerWorld** con la extensión de navegador (extrae nombre, imagen, peso, tiempo).
- **Guardar directo a GitHub** vía API (requiere un Personal Access Token con scope `repo`).
- **Copiar JSON** para pegar en el admin de Decap CMS (si lo usás).

### Configurar el token de GitHub

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token.
2. Seleccioná scope `repo` → Generate.
3. Entrá a `/admin` en tu sitio → pegá el token en el campo "GitHub Personal Access Token" → "Guardar token".
4. El token se guarda en tu navegador (localStorage). Solo se configura una vez.

### Extensión de navegador para MakerWorld

La carpeta `extension/` contiene una extensión de Chrome/Edge que extrae datos de modelos de MakerWorld.

1. Abrí `chrome://extensions/` → activá "Modo de desarrollador".
2. "Cargar descomprimida" → seleccioná la carpeta `extension/`.
3. Abrí un modelo en MakerWorld → clic en el icono de la extensión → "Abrir en catálogo".
4. Se abre `/agregar` con los datos pre-rellenados y el precio calculado.

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
