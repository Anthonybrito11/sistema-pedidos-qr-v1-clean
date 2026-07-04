# Cuki Yun Yun - Menu Digital QR

Webapp privada para menu digital, gestion de productos y flujo de pedidos de Cuki Yun Yun, una cafeteria/restaurante con operacion basada en pedidos por QR y confirmacion via WhatsApp.

## Descripcion

El sistema permite a los clientes consultar el menu desde un enlace QR, agregar productos al carrito, elegir modalidad de pedido y enviar la orden al negocio por WhatsApp. Tambien incluye un panel administrativo protegido para gestionar el menu, revisar pedidos y consultar reportes operativos.

## Modulos principales

- Menu publico por QR.
- Navegacion por categorias.
- Catalogo de productos con imagenes, disponibilidad y precios.
- Carrito con cantidades, subtotal y total.
- Checkout para mesa, pickup y delivery.
- Generacion de mensaje estructurado para WhatsApp.
- Registro de pedidos en base de datos.
- Panel administrativo protegido.
- Gestion de productos y categorias.
- Gestion de pedidos y estados operativos.
- Reportes con exportacion de historial.
- Limpieza controlada de pedidos antiguos.

## Stack tecnico

- React
- Vite
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Database
- Supabase Storage
- Netlify
- WhatsApp Click-to-Chat

## Seguridad y administracion

- Rutas administrativas protegidas por autenticacion.
- Row Level Security en Supabase.
- Uso de anon key en frontend.
- Separacion entre flujo publico y panel admin.
- Storage para imagenes de productos.
- Politicas recomendadas para limitar operaciones administrativas a usuarios autorizados.

## Estado del proyecto

MVP funcional orientado a uso privado/comercial. La aplicacion esta preparada para despliegue estatico en Netlify y operacion con Supabase como backend administrado.

## Propiedad y uso

Proyecto desarrollado para uso privado de Cuki Yun Yun. El codigo, estructura y logica de negocio no estan destinados para redistribucion, reventa ni reutilizacion sin autorizacion.
