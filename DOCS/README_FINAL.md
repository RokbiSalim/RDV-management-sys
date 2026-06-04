# RDV Project Delivery

Ce projet a été préparé et validé pour une exécution locale.

## État actuel
- Backend Spring Boot démarré et testé sur `http://localhost:8081`
- Frontend React/Vite démarré et testé sur `http://127.0.0.1:5173`
- Endpoint de disponibilité fonctionnel : `GET /api/tranches/availability?date=YYYY-MM-DD`
- Création RDV test validée
- Archive livrable créée : `C:\Users\user\rdv-project.zip`

## Dossiers principaux
- Backend : `C:\rdv-backend-copy`
- Frontend : `C:\rdv-frontend-copy`

## Commandes de démarrage
### Backend
```powershell
cd /d C:\rdv-backend-copy
.\mvnw.cmd -DskipTests package
.\mvnw.cmd spring-boot:run
```

### Frontend
```powershell
cd /d C:\rdv-frontend-copy
npm install
npm run dev -- --host 127.0.0.1
```

## Validation supplémentaire
- Backend compilé avec succès via `mvnw.cmd -DskipTests package`.
- Frontend construit avec succès via `npm run build`.

## Documentation
- Guide de livraison : `DELIVERY.md`
- Guide frontend : `frontend/README_DELIVERY.md`

## Notes
- Le backend utilise PostgreSQL et se connecte à la base définie dans `backend/Stage-Marsa-RDV-Management-backend/src/main/resources/application.properties`.
- Le frontend utilise une proxy `/api/*` vers `http://localhost:8081`.
- Si un port est occupé, modifie `server.port` dans `application.properties` et l’URL du proxy dans `frontend/vite.config.js`.
