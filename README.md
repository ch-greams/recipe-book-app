
# MONO-REPO


## How to get started

There're several options to run this project:

```sh
# Run full project (includes everything like docs-app and recipe-scraper)
docker compose up --build

# Run lean dev deployment with fully functional web-api
docker compose up --build rb-web-api

# Run lean dev deployment with fully functional web-api & web-app
docker compose up --build rb-web-app

# Or just run a database
docker compose up rb-database
```

Following commands will help you fill up database from scratch:

```sh
cd tools/rba-cli

# Migrate Database
cargo run migrate-database

# Seed Database with test data
cargo run seed-database
```

## Other

```sh
# Run to update project versions 
./tools/scripts/update-versions.rb $PROJECT_VERSION
```
