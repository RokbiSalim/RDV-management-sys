# Livraison RDV Container Appointment Manager

Le projet est prêt et fonctionnel.

## Archive livrable
- Fichier : `C:\Users\user\rdv-project.zip`
- Contenu : copies locales du backend et du frontend sans caractères spéciaux dans le chemin.

## Démarrage rapide
### 1) Backend
Depuis le dossier extrait ou la copie locale :
```powershell
cd /d C:\rdv-backend-copy
.\mvnw.cmd -DskipTests package
.\mvnw.cmd spring-boot:run
```
Le backend démarre sur : `http://localhost:8081`

### 2) Frontend
Depuis le dossier extrait ou la copie locale :
```powershell
cd /d C:\rdv-frontend-copy
npm install
npm run dev -- --host 127.0.0.1
```
Le frontend démarre sur : `http://127.0.0.1:5173`

## Vérifications
### Disponibilité
```powershell
curl "http://localhost:8081/api/tranches/availability?date=2026-05-22"
```
### Création RDV
L’API de remplacement fonctionne :
```powershell
curl -X POST "http://localhost:8081/api/rdvs" -H "Content-Type: application/json" -d "{\"cin\":\"A123456\",\"transporterName\":\"Transporteur Test\",\"truckPlate\":\"AB-123-CD\",\"date\":\"2026-05-22\",\"trancheId\":1,\"containerId\":1,\"createdById\":1}"
```

## Validation
- Backend compilé avec succès dans `C:\rdv-backend-copy`.
- Frontend construit avec succès dans `C:\rdv-frontend-copy`.

## Points importants
- Le backend utilise PostgreSQL et se connecte à la base configurée dans `backend/Stage-Marsa-RDV-Management-backend/src/main/resources/application.properties`.
- Le frontend appelle le backend via proxy `/api/*`.
- Les routes principales sont :
  - `GET /api/tranches/availability?date=YYYY-MM-DD`
  - `GET /api/tranches`
  - `POST /api/rdvs`

## Notes
- Une création de RDV test a été effectuée avec succès.
- L’application est déjà opérationnelle dans cet environnement.
