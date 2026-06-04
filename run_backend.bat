@echo off
pushd "%~dp0backend\Stage-Marsa-RDV-Management-backend"
if "%CD%"=="" (
	pushd "%~dp0..\backend\Stage-Marsa-RDV-Management-backend"
)
mvnw.cmd spring-boot:run
popd
