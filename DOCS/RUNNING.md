**Prérequis**
- Java 17+ installé et sur le `PATH` (`java -version`)
- Node.js + npm installés
- PostgreSQL local (ou adapter `JDBC_DATABASE_URL`)

**Étapes rapides**

1. Ouvrir un `cmd.exe` en administrateur.
2. Lancer le script local pour copier le projet hors de OneDrive et démarrer backend + frontend:

```cmd
cd C:\Users\user\OneDrive - Ecole Marocaine des Sciences de l'Ing\'enieur\Bureau\rdv
run_local.bat
```

3. Si tu préfères lancer manuellement:

Backend:
```cmd
cd C:\Users\user\OneDrive - Ecole Marocaine des Sciences de l'Ing\'enieur\Bureau\rdv\backend\Stage-Marsa-RDV-Management-backend
mvnw.cmd spring-boot:run
```
ou si Maven est installé globalement:
```cmd
mvn spring-boot:run
```

Frontend:
```cmd
cd C:\Users\user\OneDrive - Ecole Marocaine des Sciences de l'Ing\'enieur\Bureau\rdv\frontend
npm install
npm run dev
```

**Notes**
- Si le backend ne démarre pas, copie/colle ici le contenu d'erreur du terminal (ou le fichier `mvn-out.txt` si généré) et je t'aide à diagnostiquer.
- La méthode la plus fiable est de déplacer le projet vers un chemin sans espaces ni OneDrive (ex: `C:\rdv_local`) — le script `run_local.bat` le fait automatiquement.

***Fin***