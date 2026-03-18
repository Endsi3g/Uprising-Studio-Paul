 tous les **outils/technos clés** de ton système Paul, avec: lien officiel + à quoi ils servent + comment les installer/configurer dans TON contexte (VPS + monorepo). [github](https://github.com/qwibitai/nanoclaw)

## 1. NanoClaw (cœur de Paul)

- Lien GitHub: https://github.com/qwibitai/nanoclaw [links.aschen](https://links.aschen.tech/shaare/Owoj0g)
- Description: assistant IA léger, open‑source, qui tourne dans des containers, avec mémoire, tâches planifiées, intégrations (Discord, WhatsApp…), basé sur l’Agents SDK. [ht-x](https://ht-x.com/posts/2026/02/github-qwibitai-nanoclaw-a-lightweight-alternative/)

### Installation dans ton app

1. Dans ton repo `paul-jarvis/`:
   - Ajouter `nanoclaw` comme submodule ou simple clone:

     ```bash
     git submodule add https://github.com/qwibitai/nanoclaw.git nanoclaw
     ```

2. En local (pour tests):
   - Suivre le `setup.sh` officiel (ou l’adapter):

     ```bash
     cd nanoclaw
     ./setup.sh
     ```

     (Ce script installe les dépendances nécessaires et configure NanoClaw.) [github](https://github.com/qwibitai/nanoclaw/blob/main/setup.sh)

3. En Docker (sur VPS):
   - Créer `infra/docker/Dockerfile.nanoclaw` qui:
     - Part d’une image Node supportée.
     - Copie le code de `nanoclaw`.
     - Installe les dépendances (ce que fait `setup.sh`, mais dans le Dockerfile). [linkedin](https://www.linkedin.com/pulse/running-nanoclaw-docker-shell-sandbox-docker-fxdzc)
   - Ajouter le service `nanoclaw` dans `infra/docker/docker-compose.yml` avec volumes pour:
     - `nanoclaw/memory`
     - `nanoclaw/logs`

4. Config:
   - Fichier `.env` (dans `nanoclaw/` ou au root selon le projet) avec:
     - clés LLM (si besoin)
     - config Ollama (URL backend)
   - `nanoclaw/config/discord.config.json` pour les IDs Discord.

***

## 2. Discord (canal principal)

- Vidéo setup NanoClaw + Discord: https://www.youtube.com/watch?v=_LCXdvE8nw0 [youtube](https://www.youtube.com/watch?v=_LCXdvE8nw0)

### Étapes principales

1. Créer un bot sur le portail Discord (via la vidéo):
   - Aller dans le portail développeur Discord.  
   - Créer une application > ajouter un bot.  
   - Activer les **intents** nécessaires (messages, guilds).  
   - Générer un token (à mettre dans `.env`). [youtube](https://www.youtube.com/watch?v=_LCXdvE8nw0)

2. Inviter le bot sur ton serveur:
   - Utiliser l’URL OAuth2 générée comme dans la vidéo (scopes “bot”, permissions send/read). [youtube](https://www.youtube.com/watch?v=_LCXdvE8nw0)

3. Lier NanoClaw au salon:
   - Récupérer l’ID du salon Discord.  
   - Le mettre dans `discord.config.json` ou un fichier équivalent décrit dans la doc NanoClaw.  
   - Lancer NanoClaw: Paul doit répondre dans ce salon et créer sa mémoire de groupe.

***

## 3. Ollama (backend LLM)

- Guide Linux: https://www.hostinger.com/tutorials/how-to-install-ollama [hostinger](https://www.hostinger.com/tutorials/how-to-install-ollama)

### Installation sur VPS (version simple)

1. SSH sur ton VPS.  
2. Installer Ollama (via script ou package selon doc Ollama / guide).  
3. Créer un service systemd (si tu ne passes pas par Docker) ou container (si tu passes par Docker):
   - Écouter sur `0.0.0.0:11434` pour être accessible depuis NanoClaw. [hostinger](https://www.hostinger.com/tutorials/how-to-install-ollama)

4. Tirer tes modèles:
   - `ollama pull <nom_model>` (Kimi, GLM‑5, etc.). [hostinger](https://www.hostinger.com/tutorials/how-to-install-ollama)

5. Config NanoClaw:
   - Dans `.env` ou config NanoClaw, définir l’URL du backend LLM (host + port).  
   - Vérifier en posant une question à Paul depuis Discord → il doit utiliser Ollama.

***

## 4. Postgres + Prisma (pipeline clients)

- Prisma Postgres Quickstart: https://www.prisma.io/docs/v6/postgres/getting-started [prisma](https://www.prisma.io/docs/v6/postgres/getting-started)

### Postgres dans ton app

1. Ajouter service `postgres` dans `infra/docker/docker-compose.yml`:
   - Port interne (ex: 5432).  
   - Volume pour les données.

2. Prisma:

   - Dans `paul-jarvis/`:

     ```bash
     npm install prisma @prisma/client
     npx prisma init
     ```

   - Mettre la connexion Postgres dans `DATABASE_URL` (via docker network).  
   - Définir le schéma dans `db/schema.prisma` (clients, projects, invoices, activities).  
   - Générer et appliquer les migrations:

     ```bash
     npx prisma migrate dev --name init
     ```

3. Utilisation dans `services/actions-service`:
   - Importer `@prisma/client`.  
   - Créer les endpoints REST pour manipuler pipeline et activités.

***

## 5. Web console Next.js + Shadcn UI

- Shadcn + Next.js: https://ui.shadcn.com/docs/rtl/next [ui.shadcn](https://ui.shadcn.com/docs/rtl/next)
- Tutoriel Shadcn + Next: https://peerlist.io/blog/engineering/how-to-use-shadcn-ui-with-nextjs [peerlist](https://peerlist.io/blog/engineering/how-to-use-shadcn-ui-with-nextjs)

### Setup

1. Dans `web-console/`:
   - Créer une app Next.js (app router):

     ```bash
     npx create-next-app@latest .
     ```

2. Installer Shadcn UI:
   - Suivre la doc officielle:  

     - Installer le CLI Shadcn.  
     - Lancer la config (choisir style, etc.). [peerlist](https://peerlist.io/blog/engineering/how-to-use-shadcn-ui-with-nextjs)

3. Ajouter Tailwind:
   - Le CLI Shadcn guide sur l’intégration Tailwind. [ui.shadcn](https://ui.shadcn.com/docs/rtl/next)

4. Construire les pages:
   - `/` (Dashboard), `/clients`, `/projects`, `/activities`, `/briefings`, `/settings`.  
   - Consommer l’API `actions-service` pour afficher pipeline + briefings.

***

## 6. Cloudflare (DNS + protection)

- Guide général Cloudflare DNS (exemple type): docs Cloudflare ou tutoriels communs. [hostinger](https://www.hostinger.com/tutorials/how-to-install-ollama)

### Intégration

1. Acheter/configurer ton domaine (ex: `uprising-studio.com` si ce n’est pas déjà fait).  
2. Pointer les DNS vers Cloudflare (changer les nameservers).  
3. Dans Cloudflare:
   - Créer un enregistrement A: `jarvis.uprising-studio.com` → IP de ton VPS.  
   - Activer proxy (orange) si tu veux la protection Cloudflare.

4. Reverse proxy sur le VPS:
   - Config Nginx/Caddy pour servir la console web sur le port 80/443 et utiliser Let’s Encrypt.  
   - Accéder via `https://jarvis.uprising-studio.com`.

***

## 7. Sentry (observabilité front + back)

- Docs JS: https://docs.sentry.io/platforms/javascript/ [docs.sentry](https://docs.sentry.io/platforms/javascript/)

### Front (Next.js)

1. Installer Sentry dans `web-console`:

   ```bash
   npm install @sentry/nextjs
   npx sentry wizard -i nextjs
   ```

2. Mettre le DSN Sentry dans `.env`.  
3. Suivre la doc (init dans `sentry.client.config.ts` / `sentry.server.config.ts`). [docs.sentry](https://docs.sentry.io/platforms/javascript/)

### Back (actions-service)

1. Installer SDK Node:

   ```bash
   npm install @sentry/node
   ```

2. Initialiser Sentry dans `actions-service` (au bootstrap du serveur):

   ```ts
   import * as Sentry from "@sentry/node";
   Sentry.init({ dsn: process.env.SENTRY_DSN });
   ```

3. Ajouter middleware pour capturer les erreurs.

***

## 8. GitHub (CI/CD + repo)

- Tu utiliseras GitHub comme repo principal.  
- CI:
  - Fichier `.github/workflows/ci.yml` avec jobs:
    - `npm install && npm run lint && npm run test && npm run build` pour `web-console` et `services`.  
- Optionnel: pipeline de déploiement (SSH vers VPS, `docker compose pull && docker compose up -d`).

***

## 9. Récap rapide des liens

- NanoClaw: https://github.com/qwibitai/nanoclaw [github](https://github.com/qwibitai/nanoclaw)
- Vidéo NanoClaw + Discord (full setup): https://www.youtube.com/watch?v=_LCXdvE8nw0 [youtube](https://www.youtube.com/watch?v=_LCXdvE8nw0)
- Ollama (guide Linux/VPS): https://www.hostinger.com/tutorials/how-to-install-ollama [hostinger](https://www.hostinger.com/tutorials/how-to-install-ollama)
- Prisma + Postgres: https://www.prisma.io/docs/v6/postgres/getting-started [prisma](https://www.prisma.io/docs/v6/postgres/getting-started)
- Shadcn UI + Next.js: https://ui.shadcn.com/docs/rtl/next et https://peerlist.io/blog/engineering/how-to-use-shadcn-ui-with-nextjs [peerlist](https://peerlist.io/blog/engineering/how-to-use-shadcn-ui-with-nextjs)
- Sentry JS: https://docs.sentry.io/platforms/javascript/ [docs.sentry](https://docs.sentry.io/platforms/javascript/)

Tu peux donner ce message directement à ton AI dev comme “référentiel outillage”. Si tu veux, je peux t’écrire un petit fichier `docs/ARCHITECTURE.md` tout rédigé, prêt à mettre dans ton repo.