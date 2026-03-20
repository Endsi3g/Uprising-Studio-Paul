# Historique des versions (CHANGELOG)

Toutes les modifications notables apportées à ce projet seront documentées dans ce fichier.

## [v1.1.3] - 2026-03-18

**Rebranding — Uprising AI Assistant**

Refonte complète de l'identité de l'assistant, passant de "Paul" à **Uprising AI Assistant**.

### Changé
- **Identité** : L'assistant s'appelle désormais "Uprising AI Assistant" ou "L'Assistant" dans toutes les interfaces (Web-Console, Discord, Prompts).
- **Console Web** : Logo mis à jour de "P" vers "U", titres et messages d'état mis à jour pour refléter le nouveau branding.
- **Prompts Système** : Mise à jour des prompts Ollama pour que l'IA se présente correctement.
- **Infrastructure** : Noms d'images Docker et credentials SQL mis à jour pour plus de cohérence.
- **Documentation** : Tous les guides d'installation et README mis à jour avec le nouveau nom.
- **Sécurité** : `.env` retiré du tracking Git et ajouté au `.gitignore` pour protéger les secrets.

## [v1.0.0] - 2026-03-17

**Release Initiale — Pipeline Paul AI**

Premier déploiement complet de l'infrastructure de Paul en tant que cofondateur virtuel d'Uprising Studio.

### Ajouté
- **NanoClaw Core** configuré comme sous-module.
- **Canal Discord** (`nanoclaw/src/channels/discord.ts`) avec support de messages, indicateurs de frappe et splitting > 2000 chars.
- **Mémoire de Paul** (`CLAUDE.md`) pour définir l'identité, les stratégies de décision et l'utilisation de la langue française.
- **Schema Prisma** (`db/schema.prisma`) avec gestion des Clients, Projets, Factures, Activités et Briefings.
- **Actions Service (API)** :
  - Pipeline de requêtes (CRUD complet).
  - Intégration **Ollama** (`lib/ollama.ts`) pour la génération de texte, chat et brouillons d'emails.
  - Logging automatique des conversations IA dans la base de données (`AiConversation`).
  - Génération de Briefings quotidiens IA avec les données réelles du pipeline.
- **Web Console (Next.js + Shadcn)** :
  - Dashboard interactif des statistiques et timeline d'activités.
  - Vues de gestion des clients, projets, factures.
  - Page dédiée aux Briefings et interface de **Chat en temps réel** avec l'IA.
- **Infrastructure (Docker)** :
  - `docker-compose.yml` orchestrant l'API, le conteneur NanoClaw, le web-console, Ollama et Postgres.
  - Scripts d'automatisation pour les serveurs VPS.
- **Documentation et CI/CD** :
  - `docs/ARCHITECTURE.md`, `INSTALL_INFRA.md`.
  - Intégration GitHub Actions (`ci.yml`).
