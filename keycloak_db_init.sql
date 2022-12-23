CREATE USER keycloak WITH PASSWORD 'password';
CREATE DATABASE keycloak with encoding 'UTF8';
GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;
