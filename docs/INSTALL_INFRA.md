# Déploiement : Cloudflare & Sentry

Ce document explique comment mettre en production l'Assistant Uprising AI avec un certificat SSL gratuit via Cloudflare et monitorer les erreurs avec Sentry.

## 1. Cloudflare (DNS & SSL)

### Prérequis
- Un nom de domaine (ex: `uprising-studio.com`)
- Un compte Cloudflare
- Un VPS (avec l'IP `YOUR_VPS_IP`)

### Étapes de configuration DNS
1. Connecte-toi à [Cloudflare](https://dash.cloudflare.com/)
2. Ajoute ton domaine s'il n'y est pas déjà
3. Va dans la section **DNS > Records**
4. Ajoute un enregistrement **A** :
   - Type : `A`
   - Name : `assistant` (ou l'URL que tu veux, ex: `assistant.uprising-studio.com`)
   - IPv4 address : `[L'IP de ton VPS]`
   - Proxy status : **Proxied (Nuage orange activé)**
5. Sauvegarde.

### Configuration SSL/TLS (Important)
1. Va dans **SSL/TLS > Overview**
2. Sélectionne le mode **Full (strict)** ou **Full**.
   *Note : Si tu n'utilises pas de certs sur ton serveur (via nginx certbot par exemple), utilise **Flexible**. Cloudflare chiffrera le trafic entre l'utilisateur et Cloudflare, mais pas entre Cloudflare et ton VPS.*

## 2. Configuration Sentry (Monitoring)

Sentry permet de capturer les bugs de l'API (`actions-service`) et de la console web en temps réel.

### Étapes Sentry
1. Crée un compte sur [sentry.io](https://sentry.io)
2. Crée un nouveau projet (Node.js/Express pour le backend, Next.js pour le web)
3. Sentry te donnera un **DSN** ressemblant à :
   `https://[KEY]@o[ORG].ingest.us.sentry.io/[PROJECT_ID]`
4. Ajoute ce DSN dans tes fichiers `.env` :

Dans le `.env` à la racine (pour `actions-service`) :
```env
SENTRY_DSN=ton_dsn_ici
```

Dans `web-console/.env.local` (ajoute-le) :
```env
NEXT_PUBLIC_SENTRY_DSN=ton_dsn_ici
```

Le code gère déjà l'initialisation de Sentry s'il détecte cette variable !
