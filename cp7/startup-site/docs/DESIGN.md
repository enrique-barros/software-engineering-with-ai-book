# Sistema de Diseño y pautas UI/UX

Documento vivo: la Fase 1 lo concreta y las demás lo mantienen. Regla: **todo lo visual sale de aquí o de `@theme`**; no inventar valores en componentes.

## Identidad (definida en Fase 1)
- **Sujeto**: startup de **fintech / pagos** ("el dinero en movimiento").
- **Voz visual**: precisión institucional con calidez. El lenguaje viene del "libro mayor" y los libros de contabilidad: verde petróleo (tinta) + latón (acento), sobre papel casi neutro — no crema, no negro puro, no azul bancario.
- **Dirección tipográfica**: una sola familia variable (Schibsted Grotesk, autoalojada via Fontsource, pesos 400–700). La jerarquía la dan peso y escala, no familias distintas.
- **Marca (añadida en Fase 2, provisional)**: nombre **Corriente** (cuenta corriente / flujo) y logomarca de dos "líneas de asiento" desplazadas en verde petrol sobre papel — el movimiento del dinero saliendo del libro mayor. Sin iconos genéricos de fintech. Pendiente de confirmar con el cliente al redactar el copy (Fase 4).

## Principios
1. **Simple y acabado**: cada sección comunica una idea; menos es más.
2. **Consistente**: componentes y tokens, no valores sueltos.
3. **Accesible desde el diseño**: contraste AA, focus visible, semántica correcta, no solo para "modo texto".
4. **Rápido**: lo visual no debe costar bytes ni fps (no animar `width/left/top`, nada pesado en `@keyframes` globales).

## Tokens (implementados en `src/styles/global.css`)
Toda medida visual vive en el `@theme` de `src/styles/global.css`, comentada y agrupada. Prohibido inventar valores en componentes.

- **Color — neutros**: `bg #f6f6f1`, `surface #ffffff`, `surface-muted #ebece4`, `ink #182623`, `ink-muted #56635d`, `ink-faint #67736c` (≥4.5:1 sobre `surface` y `bg`; ver Fase 7), `border #d8d9cd`, `border-strong #b7bbb0`.
- **Color — primario (petrol)**: `primary #12604a`, `primary-hover #0d4e3c`, `primary-active #0a4031`, `primary-muted #e0ece7`, `on-primary #ffffff` (texto sobre primario: AA/AAA).
- **Color — acento (latón)**: `accent #b08626`, `accent-hover #8f6d1e` (≥4.5:1, usable como texto), `accent-active #755818`, `on-accent #1a1408`. **Uso**: escaso — rellenos, etiquetas, gráficas, resaltes; NO como fondo de texto largo ni en superficies de lectura.
- **Color — semánticos**: `success #1e7a4f`, `danger #ad2e2e`, `warning #8f6a14`, `info #2b5f8e`.
- **Tipografía**: escala fluida con `clamp()` desde `text-2xl`; line-heights por escalón; `tracking-display -0.03em` para títulos display (hero/h1 grandes). Detalle: línea base de lectura `max-w-[var(--measure)]` (62ch).
- **Espaciado**: escala de 4px de Tailwind (default `--spacing`); ritmo vertical de sección = `--section-y: clamp(4rem, 7vw, 6.5rem)` (un único valor, en `:root`).
- **Shell (añadido en Fase 2)**: contenedor del sitio `--container-site: 72rem` (compartido por header/main/footer) y altura de header sticky `--header-h: 4rem`; los destinos de anclas usan `scroll-margin-top: calc(var(--header-h) + 1rem)`. Header fijado con `position: sticky` sobre fondo `bg` sólido y hairline `border` (sin blur: más barato).
- **Radius**: `sm .375rem`, `md .5rem`, `lg .75rem`, `full` (píldoras).
- **Sombra**: `--shadow-*` tintadas con la tinta del sistema (rgb 24 38 35), no gris genérico rgba(0,0,0,.1).
- **Base**: body con fondo `bg`, texto `ink`, family `font-sans` y line-height 1.6; `text-wrap: balance` en headings; `::selection` teñido de primario; `:focus-visible` anillo 2px primario; `prefers-reduced-motion` respetado globalmente en base.

## Componentes del sistema
- Button (primario / secundario / ghost; hover/focus/active; sizes)
- Card / Section (heading de sección + contenido)
- Navigation (desktop + mobile, estado activo)
- Footer
- Form fields (label + input + estado error + focus)
- Badge / Tag, Call-to-action, testimonial/social proof
- Verificación: cada uno debe existir en 320px y en desktop sin romperse.

## Pautas de composición
- Jerarquía clara: H1 por página, headings anidados con sentido; secciones con `aria-labelledby` cuando se repite patrón.
- White space como herramienta de jerarquía, no relleno.
- Máximo de ancho de lectura cómodo para bloques de texto (usar `--measure`).
- Estados hover/focus en **todo** elemento interactivo; `focus-visible` para no molestar al mouse.
- Cero animaciones "decorativas" por defecto; la interacción se comunica con micro-motion sutil (150–250ms, easing suave).
- Acento: mínimo; el "momento memorable" del diseño se gasta en un solo lugar.
- Nunca usar los clichés de plantilla: eyebrow en ALL-CAPS sobre headings, acentos terracota/crema/serif, cards idénticas con sombra gris, flechas `→` decorativas en links/CTAs, marcos de números 01/02/03 salvo procesos reales.

## Lista de control de calidad UI/UX
- [x] Contraste AA verificado (texto y componentes): token `ink-faint` oscurecido en Fase 7 (`#67736c`, ≥4.5:1 sobre `surface` y `bg`); Lighthouse móvil a11y = 100 en las 6 rutas + 404.
- [x] Focus visible en todos los interactivos (teclado entero recorre el site): verified por Lighthouse (a11y 100) y por diseño (`:focus-visible` en base).
- [x] Landmarks y headings correctos; texto de enlaces con sentido fuera de contexto: `heading-order`/`link-name` ✓; un h1 por página por construcción.
- [x] Alt descriptivo en imágenes; aria cuando corresponda: `hero` panel `aria-hidden`; iconos decorativos `aria-hidden`; sin `<img>` de contenido.
- [x] Respeta `prefers-reduced-motion`: regla base + guard `::view-transition-*` (Fase 6).
- [ ] Revisado en móvil (320px) y desktop; sin scroll horizontal ni overflow: revisado por código (Fase 6), pendiente verificación en dispositivo real.
- [x] Sin magia: cualquier decisión nueva de diseño se documenta aquí.

## Assets de lanzamiento (añadido en Fase 7)
- **Favicons**: `public/favicon.ico` (16/32/48/256, PNG-embebidos) y `public/apple-touch-icon.png` (180) regenerados desde `public/favicon.svg` (render Chrome headless → redimensionado → contenedor ICO). El SVG sigue siendo la fuente de la logomarca y el primero en `rel="icon"`.
- **OG/social**: `public/og.png` (1200×630) de marca (papel, logomarca, titular "Pagos en movimiento", regla acento latón). Template editable en `scripts/og/og.html`. Referenciada como `og:image`/`twitter:image` desde `BaseLayout` (URL absoluta por build).
- Estos assets se regeneran solo si cambia la marca: no forman parte del build.

## Landing — home (añadida en Fase 4)

### Secciones
- **Hero**: texto a la izquierda (h1 display `text-5xl`), panel de registro de movimientos a la derecha. El panel es una ilustración de marca (`aria-hidden="true"`, cifras ficticias) y es el "momento memorable" del diseño: créditos con color acento latón, saldo tabular, fila "Cuadra al cierre" en primario. En móvil el panel va debajo del texto.
- **Features (propuesta de valor)**: filas divididas por hairlines dentro de una única superficie `bg-surface` con border (no cards idénticas con sombra gris). Icono lineal `text-primary` por ítem, a la izquierda.
- **Testimonios**: diseño asimétrico — cita destacada a la izquierda con hairline `border-l-4 border-primary` + dos más apiladas a la derecha (una columna en móvil).
- **CTA final**: bloque full-bleed `bg-primary` con h2 y lead a la izquierda, botón variant `on-primary` (superficie papel + texto petrol) a la derecha. En móvil, apilado.

### Tokens usados como decisión de diseño
- El acento latón (`--color-accent-hover`) se gasta solo en los importes de crédito del registro del hero; no aparece más en la home.
- Las sombras (`shadow-md`, `shadow-lg`) usan el sistema tintado del proyecto (`rgb(24 38 35)`), no `rgba(0,0,0,.1)`.

### Anti-clichés aplicados (Fase 4)
- Sin eyebrow ALL-CAPS sobre headings.
- Sin flechas `→` decorativas en CTAs.
- Sin numeración 01/02/03 (features no es un proceso).
- Sin gradient washes ni cards idénticas con sombra gris.

## Páginas secundarias (añadidas en Fase 5)

### Patrón general
- Cada página es contenido puro de `sections` (tipo `content`): la sección principal lleva el h1 (`Section headingLevel="h1"`, `text-4xl`) y sus bloques son h2; si hubiera más secciones `content`, sus títulos serían h2 y sus bloques h3. **Un h1 por página, garantizado por construcción.**
- Sin copy en componentes: ni título de página ni enlaces se hardcodean; todo sale de `pages` (SEO) y `sections` (visible).

### Prosa extensa ("libro mayor")
- Bloques como asientos de contabilidad: separados por hairline `border-t` (solo entre bloques consecutivos), lectura a `--measure`, ritmo `space-y-10`.
- Bullets con `marker:text-primary` (list-disc clásico, no viñetas custom ni numeración salvo procesos reales).
- `meta` para sello institucional ("Última actualización…") en páginas que lo requieran (legal).
- `links[]` de un bloque se renderizan como botones `variant="secondary"` (nunca flechas `→`).

### Decisión de audacia
- La home se queda el momento memorable (panel del hero). Las subpáginas **no repiten** el CTA full-bleed `bg-primary` ni gastan acento latón: terminan con botones secundarios (contacto, legal).
- El 404 es orientación, no lamento: h1 claro, explica qué pasó en la voz del sitio y ofrece salidas concretas (inicio / características).

### Nota
- La página de Contacto usa canales `mailto:` (label = email visible). Sin formulario por ahora: el sitio es estático sin backend; si llega un destino (Fase 6/7), se implementará con el patrón de form fields del sistema.

## Acabado UI/UX (añadido en Fase 6)

### Micro-interacción (pulsado y estados)
- **Un único lenguaje de pulsado en el sistema**: `active:translate-y-px` (deslizamiento 1px) en la base de `Button`, acompañado de color/sombra por variante — `primary` pierde `shadow-sm` al pulsar (`active:shadow-none`); `on-primary` y `ghost` oscurecen el texto a `text-primary-active`. Prohibido el "hover scale" por tarjeta (cliché): el tacto se comunica con deslizamiento + color, no con elevación.
- **Nav/header**: transiciones `transition-colors` en logo, summary y enlaces; logo con hover a `text-primary`; summary del menú móvil con `hover:bg-surface-muted`, `active:bg-border/60` y estado abierto `group-open:bg-surface-muted`.
- **Menú móvil — morph hamburguesa→X** (`group-open`, CSS puro, cero JS): primera/tercera línea rotan ±45° (con `[transform-box:fill-box] [transform-origin:center]`), central se funde a `opacity-0`. Responde a abrir/cerrar: micro-motion que "muestra qué cambió", no decoración.
- Reducción de movimiento: todo lo anterior cae bajo la regla global `prefers-reduced-motion` del base (duraciones a 0.01ms), que en Fase 6 además apaga `::view-transition-group(*)`, `::view-transition-old(*)` y `::view-transition-new(*)`.

### View Transitions (navegación)
- `<ClientRouter />` de `astro:transitions` en `BaseLayout`: navegación con **crossfade nativo** de Astro (default, sin slide ni movimiento extra) — la única mejora JS del sitio, estrictamente progresiva (sin JS degrada a navegación normal; cero islands).
- Coste: un módulo JS de ~16 KB (min, ≈5–6 KB gzip) cacheable tras la primera visita; no bloquea la primera render.
- No asumir que el router gestiona `prefers-reduced-motion` (Astro 7.3.2 no lo hace por defecto): el guard CSS es fuente de verdad.