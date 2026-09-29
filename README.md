# Tarea 2 - Calculadora Web (CalcNova)

**Datos del Estudiante:**
- **Nombre:** Adrian Francisco Brito Nelkitts
- **Matrícula:** 20251150
- **Asignación:** Tarea 2 - Calculadora Web

---

## Descripción del Proyecto

CalcNova es una aplicación web de calculadora desarrollada con un enfoque de diseño minimalista, moderno y elegante. Incorpora efectos visuales de desenfoque (*glassmorphism*), animaciones dinámicas con micro-interacciones táctiles, persistencia de datos local y consumo de servicios web en tiempo real mediante la API nativa `fetch`.

---

## Evidencias de Funcionamiento

### 1. Modo Básica (Tema Oscuro)
Interfaz principal de la calculadora con diseño oscuro, efecto de elevación y cálculo aritmético en ejecución con indicador de sincronización del servicio web.

<p align="center">
  <img src="capturas/Captura%20de%20pantalla%202026-09-29%20174236.png" alt="Modo Básica - Tema Oscuro" width="750">
</p>

---

### 2. Modo Científica (Tema Claro)
Despliegue del teclado científico con funciones trigonométricas (seno, coseno, tangente), alternador angular (DEG / RAD), constantes matemáticas (π, e), potencias, raíces, logaritmos y botón directo de cálculo en la nube (`☁ API`), visualizado en tema claro.

<p align="center">
  <img src="capturas/Captura%20de%20pantalla%202026-09-29%20174319.png" alt="Modo Científica - Tema Claro" width="750">
</p>

---

### 3. Modo Divisas - Consumo de Web Services con `fetch`
Panel de conversión de divisas internacionales en tiempo real. Permite transferir el resultado de una operación aritmética mediante el botón **"Usar Calc"** y calcular la conversión de forma instantánea consultando tasas de cambio en vivo mediante peticiones asíncronas con `fetch`.

<p align="center">
  <img src="capturas/Captura%20de%20pantalla%202026-09-29%20174358.png" alt="Modo Divisas - Web Service Fetch" width="750">
</p>

---

## Características Principales

1. **Diseño & Animaciones:**
   - Estética inspirada en *glassmorphism* con efectos de desenfoque de fondo (*backdrop-filter*).
   - Animación de rebote táctil en cada tecla y micro-animación `animate-pop` en la pantalla principal.
   - Indicador de estado sincronizado con pulso luminoso en tiempo real.
   - Transiciones suaves entre pestañas y soporte para tema oscuro y claro.

2. **Tres Modos de Operación:**
   - **Básica:** Operaciones elementales (+, −, ×, ÷), cálculo de porcentaje, alternador de signo (±) y borrado paso a paso.
   - **Científica:** Funciones trigonométricas con modo DEG/RAD, constantes π y e, exponentes cuadrático y libre (xʸ), logaritmos (log, ln), recíproco (1/x), valor absoluto (|x|) y factorial (n!).
   - **Divisas:** Conversor multidivisa internacional (USD, EUR, GBP, MXN, COP, ARS, CLP, BRL, JPY, CAD, AUD, CHF) conectado a servicios web.

3. **Consumo de Servicios Web (`fetch`):**
   - **Open Exchange Rates API:** Consulta asíncrona de tipos de cambio internacionales en vivo.
   - **Frankfurter API:** Servicio de respaldo automático en caso de fallo de red.
   - **MathJS Cloud Engine:** Evaluación y verificación de expresiones matemáticas en la nube.

4. **Soporte de Teclado & Persistencia:**
   - Atajos completos de teclado (números, operadores, Enter para calcular, Backspace para borrar y Escape para limpiar).
   - Historial de cálculos interactivo con panel lateral deslizable y almacenamiento en `localStorage`.

---

## Estructura del Repositorio

- `index.html`: Estructura semántica de la aplicación y modales.
- `style.css`: Hojas de estilo con variables CSS, animaciones y diseño responsivo.
- `app.js`: Lógica funcional, gestión del estado, controladores de teclado y peticiones `fetch`.
- `capturas/`: Directorio con las capturas de pantalla que evidencian el funcionamiento.
- `README.md`: Documentación completa y presentación de la asignación.

---

## Instrucciones de Ejecución

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Adrixn23/calculadoraWeb.git
   ```
2. Abrir el archivo `index.html` en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
3. No requiere dependencias externas ni procesos de compilación.
