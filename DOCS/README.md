# Container Appointment Manager (RDV)

Application de gestion des rendez-vous pour la prise de conteneurs au port.

## Architecture

| Composant | Technologie | Port |
|-----------|-------------|------|
| Frontend | React + Vite | 5173 (ou suivant si occupé) |
| Backend | Spring Boot 4 | 8081 |
| Base de données | PostgreSQL | 8080 (config actuelle) |

Le frontend appelle `/api/*` ; en développement, Vite redirige vers `http://localhost:8081`.

## Prérequis

- Java 21
- Node.js 18+
- PostgreSQL accessible sur `localhost:8080`, base `RDV-Prise-containerdb`
- Identifiants dans `backend/Stage-Marsa-RDV-Management-backend/src/main/resources/application.properties`

## Démarrage

### 1. Backend

```powershell
cd /d C:\rdv-backend-copy
.\mvnw.cmd -DskipTests spring-boot:run
```

Au premier démarrage, des données démo sont créées : utilisateurs `admin` / `transporteur`, tranches, conteneurs, client.

> Si l’exécution depuis le dossier original (`backend\Stage-Marsa-RDV-Management-backend`) échoue à cause d’un chemin OneDrive contenant des caractères spéciaux, utilisez la copie locale `C:\rdv-backend-copy` ou l’archive `C:\Users\user\rdv-project.zip`.

### 2. Frontend

```powershell
cd /d C:\rdv-frontend-copy
npm install
npm run dev -- --host 127.0.0.1
```

Ouvrir l’URL affichée (ex. http://127.0.0.1:5173).

## Connexion

| Rôle UI | Compte démo | Rôle backend |
|---------|-------------|--------------|
| Admin | `admin` | ADMIN_PORT |
| Transporteur | `transporteur` | RESPONSABLE_TRANSPORTEURS |

Sur `/login` : choisir **Admin** ou **Transporteur**, puis **Se connecter**.

**Déconnexion** : bouton en haut à droite après connexion.

## Parcours fonctionnel

### Transporteur
1. Dashboard + **My Appointments**
2. **Create Appointment** : choisir conteneur, tranche, date, CIN, plaque
3. Soumettre → RDV en statut `CREATED` (affiché « Pending »)

### Admin
1. **Appointments** : confirmer ou annuler les demandes
2. **Containers** / **Users** : consultation et création d’utilisateurs
3. **Blockages** : bloquer une tranche sur une date

## API principale

- `GET/POST /api/users`
- `GET/POST /api/rdvs` — `PUT /api/rdvs/{id}/confirm` — `PUT /api/rdvs/{id}/cancel`
- `GET/POST /api/containers`
- `GET /api/tranches`
- `GET/POST /api/blockages` — `GET /api/blockages/check?date=&trancheId=`

## Dépannage

- **« Impossible de joindre le backend »** : vérifier que Spring Boot tourne sur le port 8081.
- **« Aucun compte »** : redémarrer le backend pour relancer l’initialisation démo (base vide).
- **Port 8081 occupé** : arrêter l’ancien processus Java ou changer `server.port` dans `application.properties` et `vite.config.js` (proxy).
