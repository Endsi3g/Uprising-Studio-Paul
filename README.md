# Paul — AI Co-founder & Agency Pipeline

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version 1.0.0">
  <img src="https://img.shields.io/badge/Next.js-14-black.svg?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/Ollama-Local_LLM-white.svg" alt="Ollama">
  <img src="https://img.shields.io/badge/Discord-Bot-5865F2.svg?logo=discord" alt="Discord">
</div>

<br>

**Paul** est un cofondateur IA virtuel construit pour **Uprising Studio**. Alimenté par le moteur d'agents [NanoClaw](https://github.com/mizvekov/nanoclaw), des modèles LLM locaux (Ollama) et une architecture microservices full-stack, Paul gère le pipeline des clients, génère des briefings quotidiens et s'intègre directement au flux de l'équipe sur Discord.

---

## 🌟 Fonctionnalités

- **Système d'Agent IA (NanoClaw)** : Exécute des flux de travail autonomes et se souvient des contextes d'Uprising Studio.
- **Intégration Discord** : Interagis avec Paul dans ton serveur (envoi/réception de requêtes et actions).
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
- [Ollama](https://ollama.com) installé localement (pour la commande `ollama launch`)

### 1. Variables d'environnement
Copie le modèle et remplis tes secrets :
```bash
cp .env.example .env
cp nanoclaw/.env.example nanoclaw/.env
```

### 2. Démarrage de la Stack (dev.ps1)
Utilise le script interactif pour démarrer les services et choisir ton agent :
```powershell
./dev.ps1
```

Le script vous proposera de choisir entre **NanoClaw** (Agent Discord local) et **OpenClaw** (Agent Cloud).

---

## 🐳 Ollama & Docker

Le projet utilise Ollama comme backend LLM. Vous pouvez le faire tourner via Docker :

### CPU Only
```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

### NVIDIA GPU
```bash
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

---

## 💎 Onyx (Web UI)

Onyx est la plateforme Web UI principale du projet, remplaçant Open WebUI. Elle est située dans `/web-console`.

### Installation d'Onyx
```bash
cd web-console
curl -fsSL https://raw.githubusercontent.com/onyx-dot-app/onyx/main/deployment/docker_compose/install.sh > install.sh
chmod +x install.sh
./install.sh
```

### Configuration
Onyx est configuré pour communiquer avec Ollama via `http://localhost:11434`. Assurez-vous que le conteneur Ollama est démarré.

---

## 🤖 OpenClaw (Agent IA)

OpenClaw est un assistant IA personnel puissant. Le projet est configuré pour l'utiliser avec les modèles Cloud d'Ollama pour une performance optimale.

### Commande de lancement (via dev.ps1 ou CLI)
```bash
ollama launch openclaw --model kimi-k2.5:cloud
```

### Fonctionnalités Cloud & Web Search
- **Modèles Cloud** : Accédez à des modèles comme `kimi-k2.5:cloud` sans GPU local. (Nécessite `ollama signin`).
- **Web Search & Fetch** : OpenClaw et Onyx peuvent utiliser les APIs Ollama pour la recherche web via `https://ollama.com/api/web_search`.
- **Skills** : Les compétences additionnelles sont disponibles dans `/awesome-openclaw-skills`.

---

## 🏗️ Architecture
- `/nanoclaw` : Moteur d'agent local (Discord).
- `/openclaw` : Moteur d'agent cloud.
- `/web-console` : Interface Onyx.
- `/services/actions-service` : API backend.
- `/awesome-openclaw-skills` : Bibliothèque de skills OpenClaw.

---

## 🔖 Licence
Propriété intellectuelle de **Uprising Studio**. Tous droits réservés.
