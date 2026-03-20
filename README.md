<div align="center">

![Banner](https://i.imgur.com/vkRW4hU.png)

# CaseShell

**THE ULTIMATE TERMINAL PUZZLE**

_Hackea el sistema. Resuelve el caso. Un simulador inmersivo de escritorio donde la terminal es la escena del crimen~_

</div>

---

## ⚡ Demo

> [CaseShell | The Ultimate Terminal Puzzle](https://wawa-cases-wickz-hi2ufv-f7affe-157-254-174-56.traefik.me/)

## 💡 ¿De qué trata?

**CaseShell** es un juego narrativo-investigativo que simula un OS corporativo ultra minimalista. Combina UI de escritorio interactiva + terminal real para recrear un incidente en la infraestructura de CubePath. El jugador actúa como analista SOC: debe inspeccionar archivos, ejecutar comandos, desbloquear pistas ocultas y cerrar el incidente antes de que escale.

## ✨ Características

- **🖥️ Escritorio:** Simulación de un sistema operativo con archivos, textos, imágenes, terminal, temas (predeterminados)
- **⌨️ Terminal con motor de casos:** Resolverás los casos en una terminal que trae el juego, en ella podrás ejecutar todos los comandos y resolver los casos
- **🔐 Integración CubePath:** Siguiendo las reglas de la hackatón, el proyecto está alojado 100% en CubePath usando Dokploy para la web y para la base de datos en PostgreSQL para guardar la clasificación
- **🧠 Narrativa progresiva:** Cada modo según su dificultad se vuelve más díficil, pero, contiene más historia y mas archivos lo cuál lo hace mas interesante
- **⚙️ Autosave & Pending Scores:** El progreso es guardado por si quieres abandonar y volver luego, en la misma dificultad

## 🎮 Gameplay Loop

1. **Briefing:** Es la pantalla inicial, aquí recibirás información básica del caso y de lo que debes hacer, en pocas palabras
2. **Exploración Mixta:** Navega con la terminal (`ls`, `cat`, `diag`, comandos custom) o abre íconos del escritorio (carpetas, texto, imágenes)
3. **Análisis:** Cruza logs, notas y artefactos multimedia para desbloquear comandos de recuperación
4. **Remediación:** Ejecuta la secuencia correcta según la dificultad
5. **Reporte Final:** Envía tu score al ranking global y documenta el incidente (opcional)

## 📸 Capturas & GIFs

## ![GIF](https://i.imgur.com/7FUmfbx.gif)

![CAP 1](https://i.imgur.com/FKTtCKb.png)
![CAP 2](https://i.imgur.com/hpK42yd.png)
![CAP 3](https://i.imgur.com/X8OCQz9.png)
![CAP 4](https://i.imgur.com/4fqIwvP.png)
![CAP 5](https://i.imgur.com/w8ApYoh.png)
![CAP 6](https://i.imgur.com/rwJsrnU.png)

## 🧱 Stack Tecnológico

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind + Zustand
- **Auth:** NextAuth v5 (Auth.js) con GitHub OAuth

> ⚠️ La autenticación es totalmente **opcional** no necesitas autenticarte para jugar, esto es solamente si deseas guardar tu tiempo en la tabla de clasificación

- **DB:** PostgreSQL administrado en Dokploy (CubePath) + Prisma ORM
- **Infra:** Build & deploy automatizado desde Dokploy
- **Integraciones adicionales:** Server Actions para ranking, RSC para briefing/desktop, localStorage pending scores

## 🧩 Uso de CubePath

- **Nube CubePath + Dokploy:** hosteamos Base de Datos PostgreSQL y runtime de Next.js dentro de la VPS de CubePath
- **Infra Observability:** Configuramos Health Checks y logs en Dokploy para presentar métricas durante el pitch
- **Experiencia temática:** Toda la narrativa del juego recrea incidentes dentro de la red CubePath (nombres de hosts, dominios, comandos internos)
