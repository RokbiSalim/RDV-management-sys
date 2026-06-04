# Frontend RDV Container Appointment Manager

Ce dossier contient le frontend React de l’application de gestion des rendez-vous de prise de conteneurs.

## Utilisation

Ouvre un terminal et exécute :

```powershell
cd /d C:\rdv-frontend-copy
npm install
npm run dev -- --host 127.0.0.1
```

Ensuite, ouvre :

```text
http://127.0.0.1:5173
```

## Notes

- Le frontend communique avec le backend Spring Boot via la proxy /api/*.
- Assure-toi que le backend est démarré sur http://localhost:8081 avant d’utiliser l’application.
- Pour le guide complet de livraison et les commandes backend, consulte le fichier racine DELIVERY.md.
