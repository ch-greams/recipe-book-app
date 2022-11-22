
# MONO-REPO


## How to get started

```sh
docker compose up --build

# Migrate Database
rba-cli migrate-database

# Seed Database with test data
rba-cli seed-database
```

## Other

```sh
# Run to update project versions 
./tools/scripts/update-versions.rb $PROJECT_VERSION
```
