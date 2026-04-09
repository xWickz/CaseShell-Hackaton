<div align="center">

![Banner](https://i.imgur.com/vkRW4hU.png)

# CaseShell

**The Ultimate Terminal Puzzle**

Hackea el sistema. Resuelve el caso.

CaseShell es un juego narrativo-investigativo que simula un sistema operativo corporativo minimalista dentro de una experiencia web interactiva.

El jugador toma el rol de un analista SOC y debe inspeccionar archivos, ejecutar comandos en la terminal, descubrir pistas ocultas y remediar incidentes antes de que escalen.

</div>

---

> [!NOTE]
> ¡Gracias por jugar! El proyecto quedó de **4to lugar**! 🏆

## ⚡ Demo

**Live demo:** [CaseShell | The Ultimate Terminal Puzzle](https://case-shell-app-xjvxbi-1c69b9-45-90-237-156.traefik.me/)

> [!IMPORTANT]
> El dominio de demo puede mostrar una advertencia de certificado al estar servido con un dominio gratuito de infraestructura. Eso no implica por sí solo que la app sea maliciosa; simplemente es una limitación del entorno de despliegue usado para la hackathon.

> [!TIP]
> Issue: [Issue #68](https://github.com/midudev/hackaton-cubepath-2026/issues/68)

## 💡 ¿De qué trata?

CaseShell mezcla una interfaz tipo escritorio con una terminal funcional para recrear un incidente técnico dentro de una infraestructura ficticia inspirada en CubePath.

La experiencia gira alrededor de:

- exploración de archivos y ventanas
- análisis de pistas visuales y textuales
- ejecución de comandos en terminal
- resolución progresiva de incidentes según dificultad
- envío de tiempos a un ranking global **opcional**

## ✨ Características

- **Simulación de escritorio:** ventanas, archivos, textos, imágenes y terminal dentro de una UI estilo OS.
- **Ventanas arrastrables y redimensionables:** experiencia más inmersiva tipo sistema operativo clásico.
- **Terminal con motor de casos:** comandos como `diag`, `fix`, `kill` y otros disparan progresión real del caso.
- **OPS Chat contextual:** hints dinámicos que reaccionan al avance del jugador.
- **Panel de objetivos:** seguimiento de progreso por dificultad.
- **Ranking global:** guarda tiempos de partida para usuarios autenticados.
- **Autosave local:** persistencia de sesión y sincronización posterior de score.
- **Narrativa progresiva:** cada dificultad agrega más pasos, pistas y cadenas de remediación.

## 🎮 Gameplay

1. **Briefing:** Es la pantalla inicial, aquí recibirás información básica del caso y de lo que debes hacer, en pocas palabras
2. **Exploración Mixta:** Navega con la terminal (`ls`, `cat`, `diag`, comandos custom) o abre íconos del escritorio (carpetas, texto, imágenes)
3. **Análisis:** Cruza logs, notas y artefactos multimedia para desbloquear comandos de recuperación
4. **Remediación:** Ejecuta la secuencia correcta según la dificultad
5. **Reporte Final:** Envía tu score al ranking global y documenta el incidente (opcional)

## 📸 Capturas & GIFs

## Preview

![GIF](./public/demo_gif_02.gif)

### Capturas

![CAP 1](https://i.imgur.com/5ro0Kmv.png)
![CAP 2](https://i.imgur.com/ytcD8Wk.png)
![CAP 3](https://i.imgur.com/k73DQZS.png)
![CAP 4](https://i.imgur.com/7vVkAa8.png)
![CAP 5](https://i.imgur.com/gLsJKeS.png)
![CAP 6](https://i.imgur.com/rwJsrnU.png)

## Stack tecnológico

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand
- Framer Motion
- Lucide React

### Backend / Data

- Prisma ORM
- PostgreSQL

### Auth

- Auth.js / NextAuth
- GitHub OAuth

### Infraestructura

- Dokploy
- CubePath VPS

## 🧩 Uso de CubePath

- **Nube CubePath + Dokploy:** hosteamos Base de Datos PostgreSQL y runtime de Next.js dentro de la VPS de CubePath
- **Infra Observability:** Configuramos Health Checks y logs en Dokploy para presentar métricas durante el pitch
- **Experiencia temática:** Toda la narrativa del juego recrea incidentes dentro de la red CubePath (nombres de hosts, dominios, comandos internos)

**CubePath VPS**
![CAP 7](https://i.imgur.com/5VyRXXi.png)

**Dokploy**
![CAP 8](https://i.imgur.com/V7dUxPK.png)
![CAP 9](https://i.imgur.com/nmumEdI.png)
