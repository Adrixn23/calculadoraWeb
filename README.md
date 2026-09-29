# CalcNova - Calculadora Minimalista & Moderna

CalcNova es una aplicación web de calculadora con diseño minimalista, efectos visuales de desenfoque (glassmorphism), animaciones fluidas y consumo en tiempo real de servicios web mediante la API nativa `fetch`.

## Características

- **Diseño Moderno & Minimalista**: Paleta estética oscura y clara, tipografía Plus Jakarta Sans y efectos sutiles de neón.
- **Micro-interacciones y Animaciones**:
  - Efecto de presión y onda en las teclas.
  - Transiciones suaves entre pestañas y modos.
  - Notificaciones flotantes tipo Toast para retroalimentación instantánea.
  - Indicador de estado sincronizado con el Web Service.
  - Panel lateral deslizable para el historial.
- **Tres Modos de Operación**:
  - **Básica**: Operaciones aritméticas estándar, porcentajes, inversión de signo y borrado paso a paso.
  - **Científica**: Funciones trigonométricas (seno, coseno, tangente), constante Pi (π), constante Euler (e), potencias cuadradas y libres, logaritmos (base 10 y natural), raíz cuadrada, recíproco, valor absoluto, factorial y alternador angular (DEG / RAD).
  - **Divisas (Web Service)**: Conversor de divisas internacional con tasas en vivo actualizadas al instante mediante `fetch`.
- **Integración con Servicios Web (`fetch`)**:
  - **Open Exchange Rates API**: Consulta automática y bajo demanda de tasas cambiarias de divisas globales (USD, EUR, GBP, MXN, COP, ARS, CLP, BRL, JPY, etc.).
  - **Frankfurter API**: Servicio secundario de respaldo en caso de contingencia.
  - **MathJS Cloud Engine**: Evaluación y verificación remota de expresiones matemáticas complejas en la nube.
- **Soporte Completo de Teclado**:
  - Números del `0` al `9` y punto decimal (`.` o `,`).
  - Operadores `+`, `-`, `*`, `/`, `^`, `%`.
  - Cálculo con `Enter` o `=`.
  - Borrado paso a paso con `Backspace`.
  - Limpieza total con `Escape`.
- **Persistencia**: Guarda el historial de cálculos y la preferencia de tema (oscuro/claro) en `localStorage`.

## Cómo Ejecutar

No requiere dependencias ni instalación previa. Puedes abrir directamente el archivo `index.html` en cualquier navegador moderno:

1. Haz doble clic en `index.html` o ábrelo desde tu navegador web preferido (Chrome, Edge, Firefox, Safari).
2. Opcionalmente, puedes servir la carpeta con cualquier servidor estático local (como Live Server en VS Code).
