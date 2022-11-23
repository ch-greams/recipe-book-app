
# MONO-REPO


## How to get started

There're several options to run this project:

```sh
# Run full project
docker compose up --build

# Run lean dev deployment with fully functional web-api
docker compose up --build recipe-book-api

# Run lean dev deployment with fully functional web-api & web-app
docker compose up --build recipe-book-app
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
