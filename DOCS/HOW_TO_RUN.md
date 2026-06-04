# How to Run the RDV Management System

This guide is based on the project files currently present in this repository.

## 1. Project Structure

```text
RDV-management-sys/
+-- frontend/                 # React + Vite frontend
+-- RDV-Prise-container/      # Spring Boot backend project currently present
+-- backend/
|   +-- Stage-Marsa-RDV-Management-backend/  # Expected full backend path, but empty in this checkout
+-- DOCS/                     # Documentation
+-- run_local.bat             # Windows helper script, targets the empty backend folder
+-- start-backend.ps1         # Windows helper script, targets the empty backend folder
+-- start-frontend.ps1        # Windows helper script for the frontend
```

Important: the existing scripts and some older docs expect the backend at:

```text
backend/Stage-Marsa-RDV-Management-backend
```

In the current checkout, that folder is empty. The only backend source code currently available is in:

```text
RDV-Prise-container
```

## 2. Prerequisites

Install these before running the project:

1. Java 21 JDK
2. Node.js and npm
3. Git Bash, PowerShell, Terminal, or another command-line shell

Check your versions:

```bash
java -version
node -v
npm -v
```

The backend Gradle configuration requires Java 21. If Java 21 is missing, Gradle fails with a toolchain error.

## 3. Run the Backend Currently Present

From the project root:

```bash
cd RDV-Prise-container
```

On macOS or Linux, make the Gradle wrapper executable if needed:

```bash
chmod +x ./gradlew
```

Run the backend:

```bash
./gradlew bootRun
```

On Windows PowerShell:

```powershell
cd RDV-Prise-container
.\gradlew.bat bootRun
```

By default, this Spring Boot app runs on:

```text
http://localhost:8080
```

Current limitation: this backend is very small. It contains the Spring Boot application class and one `Client` JPA entity, but no API controllers. The frontend expects API endpoints under `/api`, so the full app will not work correctly unless the complete backend is restored or implemented.

## 4. Run Backend Tests

From `RDV-Prise-container`:

```bash
./gradlew test
```

On Windows:

```powershell
.\gradlew.bat test
```

The test configuration uses an in-memory H2 database from:

```text
RDV-Prise-container/src/test/resources/application.properties
```

## 5. Run the Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Then open the URL printed by Vite, usually:

```text
http://localhost:5173
```

The frontend development server is configured in:

```text
frontend/vite.config.js
```

It proxies frontend calls from `/api` to:

```text
http://localhost:8081
```

## 6. Fix the Backend Port Mismatch

The frontend expects the backend on port `8081`, but the backend currently present will default to `8080`.

You have two options.

Option A: run the backend on port `8081`.

Add this line to:

```text
RDV-Prise-container/src/main/resources/application.properties
```

```properties
server.port=8081
```

Then restart the backend.

Option B: change the frontend proxy to port `8080`.

Edit `frontend/vite.config.js`:

```js
target: 'http://localhost:8080',
```

Then restart the frontend.

For this repository, option A is better because the frontend `.env` files and existing docs already expect port `8081`.

## 7. Windows Helper Scripts

The repository includes these helper scripts:

```text
run_local.bat
start-backend.ps1
start-frontend.ps1
run_backend.bat
start-backend-windows.bat
```

Use `start-frontend.ps1` for the frontend:

```powershell
.\start-frontend.ps1
```

Do not rely on the backend scripts until the full backend exists at:

```text
backend\Stage-Marsa-RDV-Management-backend
```

Those backend scripts currently target that empty folder, not `RDV-Prise-container`.

## 8. If You Restore the Full Backend

If you have the missing full backend project, place it here:

```text
backend/Stage-Marsa-RDV-Management-backend
```

The folder should contain files such as:

```text
pom.xml
mvnw
mvnw.cmd
src/main/resources/application.properties
src/main/java/...
```

Then run it on Windows with:

```powershell
cd backend\Stage-Marsa-RDV-Management-backend
.\mvnw.cmd spring-boot:run
```

Or on macOS/Linux:

```bash
cd backend/Stage-Marsa-RDV-Management-backend
chmod +x ./mvnw
./mvnw spring-boot:run
```

The frontend should work without changing `vite.config.js` if the full backend runs on:

```text
http://localhost:8081
```

## 9. Recommended Local Run Order

1. Install Java 21.
2. Install Node.js and npm.
3. Start the backend.
4. Start the frontend in a separate terminal.
5. Open `http://localhost:5173`.
6. If API calls fail, check that the backend is running on the same port used by `frontend/vite.config.js`.

## 10. Troubleshooting

### Gradle says Java 21 is missing

Install a Java 21 JDK and make sure `java -version` shows version 21.

### `./gradlew` says permission denied

Run:

```bash
chmod +x ./gradlew
```

Then try again.

### Frontend starts but API calls fail

Check the backend port. The frontend currently sends `/api` requests to `http://localhost:8081`.

### Backend scripts fail

The backend scripts point to `backend/Stage-Marsa-RDV-Management-backend`, which is empty in this checkout. Restore the full backend there or run `RDV-Prise-container` manually.

### `npm install` fails

Delete `frontend/node_modules` if it exists, then retry:

```bash
cd frontend
npm install
```

If the problem continues, check your Node.js version and internet connection.
