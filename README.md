# Uprising AI "Assistant" — AI Co-founder & Agency Pipeline

<div align="center">
  <img src="https://img.shields.io/badge/version-1.1.3-blue.svg" alt="Version 1.1.3">
  <img src="https://img.shields.io/badge/Next.js-14-black.svg?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/Ollama-Local_LLM-white.svg" alt="Ollama">
  <img src="https://img.shields.io/badge/Discord-Bot-5865F2.svg?logo=discord" alt="Discord">
</div>

<br>

**Uprising AI "Assistant"** est un cofondateur IA virtuel construit pour **Uprising Studio**. Alimenté par le moteur d'agents [NanoClaw](https://github.com/mizvekov/nanoclaw), des modèles LLM locaux (Ollama) et une architecture microservices full-stack, l'Assistant gère le pipeline des clients, génère des briefings quotidiens et s'intègre directement au flux de l'équipe sur Discord.

---

## 🌟 Fonctionnalités

- **Système d'Agent IA (NanoClaw)** : Exécute des flux de travail autonomes et se souvient des contextes d'Uprising Studio.
- **Intégration Discord** : Interagis avec l'Assistant dans ton serveur (envoi/réception de requêtes et actions).
- **Backend LLM Local (Ollama)** : Sans frais d'API cloud. Génère des brouillons d'emails, résume les données et chat avec une IA hébergée localement.
- **Web Dashboard (Next.js)** : Interface premium "dark theme" pour gérer tes clients, projets, factures et suivre l'activité IA.
- **Pipeline de CRM** : Base de données PostgreSQL structurée via Prisma pour tracker tes leads.

## 🏗️ Architecture

Le projet est divisé en plusieurs sous-systèmes :
- `/nanoclaw` : Le moteur d'agent IA (sous-module Git).
- `/services/actions-service` : L'API backend (Express/Prisma) reliant NanoClaw, Ollama, et la BDD.
- `/web-console` : Front-end d'administration (React/Next.js).
- `/db` : Schéma de base de données PostgreSQL.
- `/infra` : Fichiers Docker et scripts VPS.

*(Voir `docs/ARCHITECTURE.md` pour le diagramme complet)*

## 🚀 Lancement Rapide

### Prérequis
- Docker & Docker Compose
- Node.js 20+
- Un Token Bot Discord
- Ollama (Optionnel si tu utilises le conteneur Docker inclus)

### 1. Variables d'environnement
Copie le modèle et remplis tes secrets :
```bash
cp .env.example .env
cp nanoclaw/.env.example nanoclaw/.env
```

### 2. Démarrage Docker Local
```bash
docker-compose --profile dev up -d
```
Cela démarrera Postgres, Ollama, et l'API. (Note : Le premier téléchargement d'Ollama peut être long).

### 3. Migrations de base de données
```bash
cd services/actions-service
npm install
npx prisma migrate dev --schema=../../db/schema.prisma
```

### 4. Démarrer les interfaces
```bash
# Dans un terminal : API
cd services/actions-service && npm run dev

# Dans le deuxième terminal : Web Console
cd web-console && npm install && npm run dev

# Dans le troisième terminal : NanoClaw (bot Discord)
cd nanoclaw && npm install && npm run dev
```

La console web sera disponible sur [http://localhost:3000](http://localhost:3000).

---

## 📚 Documentation
- [Configuration de NanoClaw & Discord](docs/INSTALL_NANOCLAW.md)
- [Déploiement VPS & Cloudflare](docs/INSTALL_INFRA.md)
- [Architecture](docs/ARCHITECTURE.md)

## 🔖 Licence
Propriété intellectuelle de **Uprising Studio**. Tous droits réservés.
