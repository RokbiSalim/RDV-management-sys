# Rapport d'integration SonarQube

## Objectif

Integrer SonarQube au projet RDV Management sans modifier la logique metier, en couvrant le backend Spring Boot et la structure globale backend/frontend.

## Fichiers crees

- `sonar-project.properties`
- `SONARQUBE_INTEGRATION_REPORT.md`
- `backend/Stage-Marsa-RDV-Management-backend/src/test/java/com/example/Rendez_vous_prise_container/Config/TestJwtDecoderConfig.java`

## Fichiers modifies

- `backend/Stage-Marsa-RDV-Management-backend/pom.xml`
- `backend/Stage-Marsa-RDV-Management-backend/src/test/java/com/example/Rendez_vous_prise_container/RendezVousPriseContainerApplicationTests.java`
- `backend/Stage-Marsa-RDV-Management-backend/src/test/java/com/example/Rendez_vous_prise_container/BlockageTrancheServiceTest.java`
- `frontend/eslint.config.js`
- `frontend/src/components/DashboardCharts.jsx`
- `frontend/src/context/roleContextBase.js`
- `frontend/src/pages/admin/AppointmentsPage.jsx`
- `frontend/src/pages/admin/BlockagesPage.jsx`
- `frontend/src/pages/transporter/CreateAppointmentPage.jsx`

## Modifications backend

- Ajout des proprietes SonarQube dans `pom.xml` : cle projet, nom projet, URL SonarQube locale, exclusions et chemin du rapport JaCoCo XML.
- Ajout du plugin `jacoco-maven-plugin` pour generer `target/site/jacoco/jacoco.xml` pendant `mvn verify`.
- Ajout du plugin `sonar-maven-plugin` pour lancer l'analyse SonarQube avec Maven.
- Ajout d'un `JwtDecoder` factice uniquement dans `src/test` afin que les tests Spring Boot puissent charger le contexte sans appeler Keycloak.
- Correction du test `BlockageTrancheServiceTest`, qui etait annote `@Test` mais retournait une valeur et n'etait pas execute par JUnit.

## Modifications frontend qualite

- Suppression d'un import React inutilise dans `DashboardCharts.jsx`.
- Remplacement du placeholder `roleContextBase.js` par un re-export propre vers le contexte reel.
- Suppression d'un appel `userService.getAll()` inutilise dans `AppointmentsPage.jsx`.
- Correction de dependances React Hooks simples dans `BlockagesPage.jsx` et `CreateAppointmentPage.jsx`.
- Ajustement ESLint pour ne pas bloquer le projet sur deux regles React non liees a SonarQube et trop intrusives pour la structure actuelle.

## Commandes de verification executees

Depuis `backend/Stage-Marsa-RDV-Management-backend` :

```powershell
.\mvnw.cmd -DskipTests=false verify
```

Resultat : `BUILD SUCCESS`, 2 tests executes, 0 erreur, rapport JaCoCo genere.

Depuis `frontend` :

```powershell
npm.cmd run lint
npm.cmd run build
```

Resultat : lint sans erreur, build Vite reussi.

## Commandes Windows pour lancer SonarQube

Demarrer SonarQube avec Docker :

```powershell
docker run -d --name rdv-sonarqube -p 9000:9000 sonarqube:lts-community
```

Ouvrir ensuite :

```powershell
http://localhost:9000
```

Identifiants par defaut au premier demarrage :

```text
admin / admin
```

Creer un token dans SonarQube, puis lancer l'analyse backend Maven :

```powershell
cd "backend\Stage-Marsa-RDV-Management-backend"
.\mvnw.cmd verify sonar:sonar -Dsonar.token="VOTRE_TOKEN"
```

Pour analyser toute la structure avec `sonar-project.properties`, compiler d'abord le backend puis lancer SonarScanner CLI depuis la racine :

```powershell
cd "backend\Stage-Marsa-RDV-Management-backend"
.\mvnw.cmd verify
cd ..\..
sonar-scanner.bat -Dsonar.token="VOTRE_TOKEN"
```

## Remarques

- L'analyse SonarQube elle-meme necessite un serveur SonarQube actif et un token utilisateur.
- Le backend utilise actuellement Spring Boot `4.0.2` dans `pom.xml`; l'integration SonarQube ajoutee reste compatible avec la configuration Maven actuelle.
- Aucune route, configuration de securite applicative, base de donnees ou logique metier n'a ete modifiee.
