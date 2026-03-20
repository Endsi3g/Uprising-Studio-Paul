# Installation de NanoClaw & Discord

Ce guide explique comment configurer le bot Discord pour l'Assistant Uprising AI.

## 1. Création du Bot Discord

1. Rendez-vous sur le [Portail Développeur Discord](https://discord.com/developers/applications).
2. Créez une nouvelle application appelée "Uprising AI Assistant".
3. Dans la section **Bot** :
    - Récupérez votre **Token**.
    - Activez les **Privileged Gateway Intents** (Presence, Server Members, Message Content).
4. Dans **OAuth2** -> **URL Generator** :
    - Sélectionnez `bot` et `applications.commands`.
    - Permissions : `Administrator` (ou permissions spécifiques de gestion de messages/salons).
5. Utilisez l'URL générée pour inviter l'Assistant sur votre serveur.

## 2. Configuration dans NanoClaw

1. Copiez le token dans le fichier `.env` à la racine :
   ```env
   DISCORD_TOKEN=votre_token_ici
   ```
2. Modifiez le fichier `nanoclaw/config/discord.config.json` pour spécifier les IDs de salons.

## 3. Lancement

```bash
docker compose up -d nanoclaw
```
Puis vérifiez les logs :
```bash
docker compose logs -f nanoclaw
```
