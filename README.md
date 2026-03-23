<div align="center">

![Banner](https://i.imgur.com/vkRW4hU.png)

# CaseShell

**THE ULTIMATE TERMINAL PUZZLE**

_Hackea el sistema. Resuelve el caso. Un simulador inmersivo de escritorio donde la terminal es la escena del crimen~_

</div>

---

## ⚡ Demo

> [CaseShell | The Ultimate Terminal Puzzle](https://wawa-cases-wickz-hi2ufv-f7affe-157-254-174-56.traefik.me/)

### ⚠️ A la hora de entrar a la página te saldrá **La conexión no es privada**, esto se debe a que es un **dominio gratis** proporcionado por **Dokploy**, por lo tanto no tiene certificado SSL. Esto NO significa que la página no es segura.

![CAP 10](https://i.imgur.com/WySbG6O.png)

## 💡 ¿De qué trata?

**CaseShell** es un juego narrativo-investigativo que simula un OS corporativo ultra minimalista. Combina UI de escritorio interactiva + terminal real para recrear un incidente en la infraestructura de CubePath. El jugador actúa como analista SOC: debe inspeccionar archivos, ejecutar comandos, desbloquear pistas ocultas y cerrar el incidente antes de que escale.

## ✨ Características

- **🖥️ Escritorio:** Simulación de un sistema operativo con archivos, textos, imágenes, terminal y temas personalizables
- **🪟 Ventanas redimensionables:** Cada app (terminal, chat, visor de archivos) tiene marco arrastrable y handle de resize estilo OS antiguo
- **⌨️ Terminal con motor de casos:** Ejecuta comandos reales (`diag`, `fix`, `kill`...) y escucha audio feedback instantáneo
- **📡 OPS Chat con hints:** Conversaciones guionadas reaccionan al progreso y permiten pegar comandos con un click
- **🎯 Panel de objetivos:** Tracker colapsable con checklist por dificultad y acceso rápido desde la barra.
- **🔐 Integración CubePath:** Desplegado 100% en CubePath con Dokploy (Next.js + PostgreSQL para ranking global)
- **🧠 Narrativa progresiva:** Cada dificultad añade archivos, puzzles visuales y cadenas de remediación más largas
- **⚙️ Autosave & Pending Scores:** Guarda tu sesión y sincroniza el tiempo final al ranking aunque cierres la pestaña

## 🎮 Gameplay

1. **Briefing:** Es la pantalla inicial, aquí recibirás información básica del caso y de lo que debes hacer, en pocas palabras
2. **Exploración Mixta:** Navega con la terminal (`ls`, `cat`, `diag`, comandos custom) o abre íconos del escritorio (carpetas, texto, imágenes)
3. **Análisis:** Cruza logs, notas y artefactos multimedia para desbloquear comandos de recuperación
4. **Remediación:** Ejecuta la secuencia correcta según la dificultad
5. **Reporte Final:** Envía tu score al ranking global y documenta el incidente (opcional)

## 📸 Capturas & GIFs

![GIF](https://i.imgur.com/7FUmfbx.gif)

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

**CubePath VPS**
![CAP 7](https://i.imgur.com/AWFEcN5.png)

**Dokploy**
![CAP 8](https://i.imgur.com/OWggXAO.png)
![CAP 9](https://i.imgur.com/49CaCeR.png)
