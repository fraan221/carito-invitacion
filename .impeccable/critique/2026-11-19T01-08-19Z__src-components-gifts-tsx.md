---
target: src/components/Gifts.tsx
total_score: 19
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/home/fraan/Documents/Projects/carito-invitacion/src/components/Gifts.tsx"
target_fingerprint: "sha256:baac139f5ce75e7a57999915849a77ce6450720d580f3ab13d7498990205f23c"
target_path: /home/fraan/Documents/Projects/carito-invitacion/src/components/Gifts.tsx
timestamp: 2026-11-19T01-08-19Z
slug: src-components-gifts-tsx
---
# Critique: src/components/Gifts.tsx

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 3 | Feedback visual táctil sólido al copiar ("¡Copiado!" + starburst), pero la API de portapapeles tiene un bloque `catch {}` vacío que silencia fallos en webviews móviles. |
| 2 | Match System / Real World | 2 | El texto es cálido y agradecido, pero la estética (fuente monoespaciada de código, recuadro punteado estilo cupón, badge de tarjeta fintech) responde a un modelo transaccional y no a un gesto de celebración íntimo. |
| 3 | User Control and Freedom | 3 | La acción de copia no es destructiva, el feedback expira a los 2s y el alias se puede seleccionar manualmente si se prefiere. |
| 4 | Consistency and Standards | 2 | Quiebre notorio con la narrativa visual de Carito XV. `Message.tsx` descartó las tarjetas por completo para fundirse en flujo editorial celestial con auras radiales; `Gifts.tsx` retrocede a una card opaca con estilos inline y tipografía genérica monospace. |
| 5 | Error Prevention | 3 | El botón de copiado en 1 clic previene errores de tipeo manual del alias, pero la omisión del nombre del titular genera incertidumbre antes de transferir. |
| 6 | Recognition Rather Than Recall | 3 | El alias está visible directamente, pero la ausencia del titular obliga al invitado a adivinar o confirmar externamente si la cuenta corresponde efectivamente a la quinceañera. |
| 7 | Flexibility and Efficiency | n/a | *Mode `experience`*: Interacción única y directa de copia de alias; aceleradores de usuario avanzado o personalización no aplican. |
| 8 | Aesthetic and Minimalist Design | 1 | Sobrecarga de contenedores rectangulares (tarjeta externa con backdrop-filter + caja interna punteada + badge circular + botón). Rompe la continuidad del fondo de estrellas Three.js y crea una barrera visual pesada. |
| 9 | Error Recovery | 2 | Sin manejo de contingencias si falla el portapapeles en navegadores embebidos (WhatsApp / Instagram webviews); el botón no informa el fallo. |
| 10 | Help and Documentation | n/a | *Mode `experience`*: Experiencia contemplativa e interactiva; no requiere sistema de documentación formal. |
| **Total** | | **19 / 32** | **Acceptable (59.4%)** |

## Design Specificity Verdict

- **LLM Assessment**: **Category-Interchangeable / SaaS Widget**. El componente actual es ajeno a la atmósfera celestial de Carito XV. Adopta el arquetipo de "tarjeta dentro de tarjeta" con bordes geométricos marcados (`--bg-surface` opaco, borde punteado estilo cupón de descuento, badge circular Lucide genérico y alias en `monospace`). Bloquea por completo el fondo estelar cósmico (`StarryBackground`), comportándose como un widget de pago embebido de una landing page genérica en lugar de una sección editorial integrada.
- **Deterministic Scan**: 0 errores mecánicos en el escaneo estático de `.tsx` (el analizador opera en modo regex sobre JSX sin evaluar estilos calculados). Sin embargo, en el análisis contextual se detectan tokens de color hardcodeados (`rgba(59, 130, 246, 0.15)` y hexes en `ClickSpark`), `fontFamily: "monospace"` sin token tipográfico, y el anti-patrón estructural de cajas anidadas (`nested-cards`).
- **Visual Overlays**: No disponibles. La ejecución de headless browser / dev server falló por timeout de navegación en el entorno headless local sobre Wayland/Linux; se omite de forma segura.

## Overall Impression

La intención emocional del texto es hermosa y el micro-feedback de copiado (`ClickSpark` con destellos estelares) funciona con gracia. Sin embargo, la envoltura formal contradice el núcleo del proyecto: es una **caja opaca y utilitaria** que interrumpe abruptamente el lienzo cósmico nocturno.

## What's Working

1. **Micro-interacción de Copiado**: La transición de "Copiar Alias" con `<Copy />` a "¡Copiado!" con `<Check />`, sumado a la animación de chispas estelares `ClickSpark`, ofrece una respuesta táctil inmediata y gratificante.
2. **Tono y Redacción Emocional**: La frase de apertura (*"Tu presencia es el regalo más importante para mí. Si deseás hacerme un presente..."*) es sobria, humilde y afectuosa; no impone ni exige.
3. **Foco Único**: Mantiene el foco en un solo alias bancario claro, evitando la saturación de listas de regalos o múltiples cuentas confusas.

## Priority Issues

### [P1] Oclusión y Ruptura del Fondo Cósmico por Tarjetas Anidadas
- **Por qué importa**: Viola la directiva directa del usuario (*"no me gusta que sea una card. necesito que conviva con el fondo"*) y la identidad celestial del sitio. El contenedor opaco con borde y sombra crea un bloque pesado que tapa las estrellas y fragmenta el viaje inmersivo.
- **Solución**: Eliminar la card contenedora (`bg-surface`) y el recuadro punteado. Migrar a una composición editorial abierta con aura de luz celestial tenue (`radial-gradient`), divisores etéreos de hilo de plata con glifos `✦`, y un contenedor traslúcido flotante o tipografía integrada.
- **Comando sugerido**: `/impeccable layout`

### [P1] Tipografía Monoespaciada y Estética de "Cupón de Descuento"
- **Por qué importa**: La fuente `monospace` y el borde punteado (`1px dashed`) recuerdan a un token de API o un cupón de e-commerce, restando solemnidad y distinción a los 15 años.
- **Solución**: Tipografiar el alias con las fuentes nobles del sistema (`Cinzel` con tracking amplio o sans refinada en plata líquida con sutil glow), suprimiendo todo marco punteado.
- **Comando sugerido**: `/impeccable typeset`

### [P2] Falta de Identidad y Reaseguro del Titular de la Cuenta
- **Por qué importa**: Los invitados (especialmente familiares mayores) sienten inseguridad al transferir sin ver el nombre real de la persona destinataria.
- **Solución**: Incorporar debajo del alias una línea de tranquilidad sutil: `Titular: Milagros Carolina Herrera · Mercado Pago` en plata atenuada (`--text-muted`).
- **Comando sugerido**: `/impeccable clarify`

### [P2] Fallo Silencioso de Portapapeles en Navegadores In-App (WhatsApp)
- **Por qué importa**: Al abrir el link desde WhatsApp o Instagram, las políticas de seguridad de webviews a menudo bloquean `navigator.clipboard.writeText`. Al tener un `catch {}` vacío, el botón no responde ni informa el motivo, haciendo que el usuario crea que no funciona.
- **Solución**: Implementar fallback con selección manual de texto o aviso visual para copiar manualmente en caso de denegación de permisos.
- **Comando sugerido**: `/impeccable harden`

## Persona Red Flags

- **Jordan (Primerizo / Inexperto)**: El borde punteado y la fuente de código le hacen creer que es un código promocional que debe ingresar en algún lado. Al no ver el nombre del titular antes de confirmar en el banco, duda si el dinero llegará a Carito.
- **Casey (Móvil en Movimiento / Distraído)**: Abre la invitación desde el webview de WhatsApp; al tocar "Copiar Alias" la API de clipboard falla silenciosamente. Asume que el botón está roto y desiste.
- **Familiar / Tía Invitada (Usuario mayor en smartphone)**: Le genera desconfianza ver una cadena en fuente monoespaciada sin confirmación de titular. Al intentar transcribirlo en otro dispositivo o aplicación bancaria, el tamaño pequeño (12–13px) y contraste medio le dificultan la lectura.

## Minor Observations

- `Gifts.tsx` utiliza estilos 100% inline en lugar de un módulo CSS (`Gifts.module.css`), a diferencia de `Message`, `Closing` y `EventDetails`.
- El icono `<Gift />` en un círculo azul es un cliché de SaaS que no dialoga con la heráldica celestial del monograma romano ni los destellos plateados.
- Las instrucciones finales ("Instrucciones: Abrí tu app bancaria...") suenan a manual de software en lugar de una guía sutil de etiqueta digital.

## Questions to Consider

1. *¿Y si el alias no estuviera contenido en ninguna caja, sino flotando como una constelación grabada en plata líquida, permitiendo que el polvo de estrellas del canvas fluya directamente entre sus letras?*
2. *¿Y si el gesto de copiar el alias desatara una sutil pulsación luminosa en el cosmos circundante, reafirmando que el regalo es una muestra de cariño y no una transacción bancaria?*
3. *¿Cómo se sentiría presentar este detalle como una posdata afectuosa e íntima ("P.D. Para quienes deseen acompañarme con un presente...") en lugar de un módulo de utilidades?*
