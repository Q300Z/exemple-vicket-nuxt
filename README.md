# 🚀 Showcase : Implémentation Vicket Support (Nuxt 4)

[![Industrial CI/CD](https://github.com/vicket-poc/poc-vicket/actions/workflows/ci.yml/badge.svg)](https://github.com/vicket-poc/poc-vicket/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](CHANGELOG.md)

Ce projet est une **démonstration technique de haut niveau** illustrant comment intégrer la couche de support [Vicket](https://vicket.app) dans une application moderne utilisant **Nuxt 4**. 

Il sert de modèle d'implémentation industrielle, mettant l'accent sur l'architecture SOLID, la testabilité (Vitest + Playwright) et une expérience utilisateur "Ultra-Premium".

---

## ⚠️ Avertissement (Disclaimer)

**Ce projet est une initiative indépendante.**
Il n'est **pas affilié, maintenu, ni officiellement soutenu par Vicket**. Il s'agit d'une preuve de concept (PoC) réalisée pour démontrer les capacités d'intégration et de personnalisation de la solution Vicket dans un environnement Nuxt 4.

---

## 🌐 Déploiement

Le projet est hébergé et consultable en direct à l'adresse suivante :
👉 **[https://vicket.qalpuch.cc](https://vicket.qalpuch.cc)**

---

## ✨ Fonctionnalités de Vicket

[Vicket](https://vicket.app) est une plateforme de support moderne conçue pour s'intégrer nativement dans vos produits. Voici ses principaux atouts :

- **Support en Marque Blanche** : Personnalisation totale des composants pour garantir une expérience visuelle cohérente avec votre marque.
- **Système de Workflows Avancé** : Automatisation des processus de support avec des déclencheurs temporels et manuels (ex: relances automatiques, changements de statut).
- **Scoring Intelligent des Tickets** : Priorisation automatique des demandes basée sur des algorithmes intelligents pour agir sur les vrais signaux d'urgence.
- **Visibilité par Équipe** : Gestion fine des accès et des portées (scopes) pour organiser le support entre Engineering, Sales, et Support L1.
- **Intégration Rapide** : Conçu pour les développeurs, avec des composants prêts à l'emploi s'intégrant en quelques minutes.
- **Base de Connaissances Intégrée** : Système de self-service pour réduire le volume de tickets entrants.

---

## 🏗️ Structure du Projet

L'architecture suit une stratégie de **Layered Architecture** propre à Nuxt, permettant une séparation stricte entre la logique métier du support et l'application hôte.

### 📁 `layers/vicket/` (Le Cœur du Support)
C'est ici que réside toute la logique réutilisable du support.
- `app/components/` : Composants atomiques et orchestrateurs (Recherche, TicketDialog, Sidebar).
- `app/composables/` : Logique métier encapsulée (`useVicket`, `useSupportData`, `useSupportState`).
- `app/utils/` : Transformateurs de données, client HTTP typé, et schémas de validation Zod.
- `app/types/` : Définitions TypeScript et clés d'injection DIP.
- `server/` : API Proxy et utilitaires de cache/recherche côté serveur.
- `tests/` : Suite complète de tests unitaires, de composants et E2E (Playwright).

### 📁 `app/` (L'Application Showcase)
L'implémentation visuelle de la démonstration.
- `pages/` : Pages de destination et Centre d'aide orchestrant les composants du layer.
- `app.vue` : Point d'entrée principal gérant l'injection globale (DIP).
- `app.config.ts` : Configuration du branding (couleurs, labels, endpoints).

### ⚙️ Fichiers de Configuration
- `Dockerfile` & `docker-compose.yml` : Configuration de déploiement optimisée (98% d'efficacité) avec gestion des secrets.
- `.release-it.json` : Automatisation des versions et du CHANGELOG.
- `playwright.config.ts` : Configuration des tests E2E et audits d'accessibilité.
- `nuxt.config.ts` : Configuration Nuxt 4 avec support View Transitions et mode Island.

---

## 🛠️ Démarrage Local

### Prérequis
- **Node.js 22+**
- **pnpm** (recommandé)

### Installation
```bash
# Installation des dépendances
pnpm install

# Préparation de l'environnement Nuxt
pnpm run postinstall
```

### Développement
```bash
# Lancement du serveur de dev
pnpm run dev
```

### Qualité & Tests
```bash
# Linter (ESLint)
pnpm run lint

# Tests Unitaires & Composants (Vitest)
pnpm run test

# Tests E2E (Playwright)
pnpm run test:e2e
```

### Build Production
```bash
# Compilation
pnpm run build

# Preview locale du build
pnpm run preview
```

---

## 🛡️ Sécurité & Déploiement

Le projet est prêt pour Docker. Pour une mise en production sécurisée :
1. Créez vos fichiers de secrets dans `./secrets/` (cf. `docker-compose.yml`).
2. Utilisez la CI/CD intégrée qui publie automatiquement vers GHCR lors de la création d'un tag.

---

*Développé avec passion pour l'écosystème Nuxt et les solutions de support intelligentes.*
