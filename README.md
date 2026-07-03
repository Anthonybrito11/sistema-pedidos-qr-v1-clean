# Sistema de pedidos QR V1

Webapp de menu digital y pedidos por QR para cafeteria/restaurante.

## Stack

- React + Vite
- TypeScript
- Tailwind CSS
- Supabase Auth, Database y Storage
- Fallback a datos locales si Supabase no esta configurado o falla
- Envio de pedido por WhatsApp Click-to-Chat

## Instalacion

```bash
npm install
npm run dev
```

Comandos disponibles:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxx
```

Usa la Project URL sin `/rest/v1/`.

No uses Secret Key ni Service Role Key en el frontend.

## Supabase

1. Abre tu proyecto en Supabase.
2. Ve a SQL Editor.
3. Copia y ejecuta el contenido de `supabase/schema.sql`.
4. Verifica que el bucket publico `products` exista en Storage.
5. Verifica que exista el usuario admin en Supabase Auth:
   `anthonyjuniorbritoabreu11@gmail.com`

El SQL crea:

- `business_settings`
- `categories`
- `products`
- `orders`
- `order_items`
- indices
- triggers de `updated_at`
- RLS
- policies para tablas
- policies para Storage bucket `products`
- configuracion inicial minima del negocio

## Rutas

- `/`: app publica de pedidos.
- `/admin/login`: login del admin.
- `/admin`: dashboard protegido.
- `/admin/products`: CRUD de productos.
- `/admin/categories`: CRUD de categorias.
- `/admin/orders`: pedidos.
- `/admin/settings`: configuracion del negocio.

## Flujo publico

1. Cliente abre `/` o `/?table=3`.
2. La app intenta cargar negocio, categorias y productos desde Supabase.
3. Si Supabase no esta configurado o falla, usa `src/data/businessConfig.ts` y `src/data/menuData.ts`.
4. Cliente agrega productos al carrito.
5. Completa checkout.
6. Al finalizar, la app intenta guardar el pedido y sus items en Supabase.
7. Si se guarda, el mensaje de WhatsApp incluye un codigo tipo `QR-20260702-AB12`.
8. Si falla Supabase, permite continuar por WhatsApp sin bloquear al cliente.

## Admin

Entra a `/admin/login` con el usuario creado en Supabase Auth.

Desde el panel puedes:

- Crear, editar, activar y desactivar categorias.
- Crear, editar, activar/desactivar y marcar disponible/no disponible productos.
- Subir imagenes al bucket publico `products`.
- Editar configuracion del negocio.
- Ver pedidos y cambiar estados.

Productos y categorias no se eliminan fisicamente desde el panel; se marcan como inactivos.

## Estados de pedido

- `pending_whatsapp`
- `confirmed`
- `preparing`
- `completed`
- `cancelled`

## Archivos importantes

- `src/lib/supabaseClient.ts`: cliente Supabase con env vars opcionales.
- `src/services`: capa de servicios reutilizable.
- `src/types/supabase.ts`: tipos y mappers de Supabase.
- `supabase/schema.sql`: SQL completo para la base de datos.
- `.env.example`: variables requeridas sin secretos reales.

## Pruebas manuales recomendadas

App publica:

- Cargar menu.
- Filtrar categorias.
- Agregar al carrito.
- Cambiar cantidades.
- Completar checkout.
- Confirmar pedido.
- Ver WhatsApp con codigo de orden si Supabase esta activo.

Admin:

- Login y logout.
- Ver bloqueo de `/admin` sin sesion.
- Crear/editar/desactivar categoria.
- Crear/editar producto.
- Subir imagen.
- Marcar producto no disponible.
- Ver pedido creado.
- Cambiar estado de pedido.
- Editar configuracion del negocio.

## Nota de deploy

La app usa rutas como `/admin`. En hosting estatico, configura fallback SPA hacia `index.html` para que recargar `/admin` no devuelva 404.
