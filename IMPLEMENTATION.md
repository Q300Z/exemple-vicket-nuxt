# Vicket Nuxt 4 - Guide d'Architecture SOLID

Ce projet est une implémentation de référence "Enterprise-Grade" pour intégrer le support Vicket dans une application Nuxt 4.

## Principes Appliqués

### 1. SRP (Single Responsibility Principle)
Chaque brique a une fonction unique :
- `HttpClient` : Gère uniquement le transport HTTP (timeouts, erreurs).
- `VicketDataTransformer` : Gère uniquement le formatage des données entre l'UI et l'API.
- `useStepManager` : Gère uniquement la logique de navigation interne du formulaire.

### 2. OCP (Open/Closed Principle)
Le système est ouvert à l'extension mais fermé à la modification :
- **Field Factory** : Ajoutez de nouveaux types de champs sans toucher au dialogue principal.
- **Custom Validators** : Injectez des schémas Zod personnalisés via `VICKET_VALIDATORS_KEY`.

### 3. LSP (Liskov Substitution Principle)
Les services sont interchangeables :
- **Cache** : Basculez entre `MemoryCacheProvider` et `StorageCacheProvider` sans modifier la logique métier.
- **Search** : Le moteur `MiniSearch` peut être remplacé par un simple filtre ou une API externe.

### 4. ISP (Interface Segregation Principle)
Les composants UI ne reçoivent que ce dont ils ont besoin :
- `Breadcrumbs` et `Sidebar` utilisent l'interface fine `INavigable`.
- Les modèles d'articles sont segmentés en `ArticleSummary` (léger pour les listes) et `ArticleFull` (complet pour le rendu).

### 5. DIP (Dependency Inversion Principle)
L'interface dépend des abstractions, pas des implémentations :
- Les services (Toast, Confetti, Repository) sont **injectés**.
- Cela permet de tester les composants de manière isolée en fournissant des versions "Mock".

## Structure du Projet

```bash
layers/vicket/ # Le moteur pur (Agnostique, réutilisable)
app/           # La vitrine (Style spécifique, exemples d'usage)
```

## Lancer la démonstration
```bash
pnpm install
pnpm dev
```
