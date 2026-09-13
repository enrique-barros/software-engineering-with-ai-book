# Sistema de Diseño y pautas UI/UX

Documento vivo: la Fase 1 lo concreta y las demás lo mantienen. Regla: **todo lo visual sale de aquí o de `@theme`**; no inventar valores en componentes.

## Identidad

Pendiente: se define en la Fase 1 (sujeto del proyecto, voz visual, dirección tipográfica y marca).

## Principios
1. **Simple y acabado**: cada sección comunica una idea; menos es más.
2. **Consistente**: componentes y tokens, no valores sueltos.
3. **Accesible desde el diseño**: contraste AA, focus visible, semántica correcta, no solo para "modo texto".
4. **Rápido**: lo visual no debe costar bytes ni fps (no animar `width/left/top`, nada pesado en `@keyframes` globales).

## Tokens

Pendiente: se implementan en `src/styles/global.css` desde la Fase 1. Toda medida visual vivirá en el `@theme`, comentada y agrupada. Prohibido inventar valores en componentes.

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
- [ ] Contraste AA verificado (texto y componentes)
- [ ] Focus visible en todos los interactivos (teclado entero recorre el site)
- [ ] Landmarks y headings correctos; texto de enlaces con sentido fuera de contexto
- [ ] Alt descriptivo en imágenes; aria cuando corresponda
- [ ] Respeta `prefers-reduced-motion`
- [ ] Revisado en móvil (320px) y desktop; sin scroll horizontal ni overflow
- [ ] Sin magia: cualquier decisión nueva de diseño se documenta aquí