# Frontend Delivery Guide

Ce fichier explique comment lancer le frontend de l'application RDV.

## Lancement

1. Ouvre un terminal.
2. Va dans le dossier frontend local :

```powershell
cd /d C:\rdv-frontend-copy
```

3. Installe les dépendances si ce n'est pas déjà fait :

```powershell
npm install
```

4. Lance le serveur de développement :

```powershell
npm run dev -- --host 127.0.0.1
```

5. Ouvre le navigateur sur :

```text
http://127.0.0.1:5173
```

## Pré-requis

- Le backend doit être démarré sur `http://localhost:8081`.
- Le frontend utilise la proxy `/api/*` pour communiquer avec le backend.

## Remarques

- Le projet complet est livré dans l'archive `C:\Users\user\rdv-project.zip`.
- Le guide principal de livraison se trouve dans `DELIVERY.md` à la racine du workspace.
