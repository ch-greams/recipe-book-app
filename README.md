
# MONO-REPO


## How to get started

#### 1. There're several options to run this project

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

#### 2. After project is started it should be possible to access following pages and endpoints

- Login as admin into Keycloak http://localhost:3002/admin/ (with these [credentials](./docker-compose.yaml#L84-L85))

- Check health endpoints for all running services (like http://localhost:3003/api/v1/health for `auth-api`)

- `docs-app` should be available here http://localhost:3001/ (I suggest checking out [documentation](http://localhost:3001/docs/intro) and [web-api](http://localhost:3001/web-api) pages)

- At this moment you should be able to see `web-app` ( http://localhost:3000/ ), but functionality will be broken because database has not been migrated

#### 3. Following commands will help you fill up database from scratch

```sh
cd tools/rba-cli

# Migrate Database
cargo run migrate-database

# Seed Database with test data
cargo run seed-database
```

NOTE: After migration 99% of the functionality should be there (1% might be affected by metadata seeding), except maybe for small issue here and there, and empty pages.

#### 4. After project is fully bootstrapped all functionality should be in the working state

- Try logging into `web-app` http://localhost:3000/login by using following [credentials](./services/auth-api/config/keycloak_users.json#19)

  - Should be possible to find "Cheddar Cheese" using search on home page http://localhost:3000/

  - Should be possible to access one of the recipes like this http://localhost:3000/recipe/1

  - Should be possible to access user-page http://localhost:3000/user

  - Should be possible to access food journal http://localhost:3000/journal

- Try using couple of endpoint from `web-api`:
  
  - Nutrients ( http://localhost:8080/api/v1/meta/nutrients ) should always have dozens of items after seeding, otherwise application wouldn't be fully functional

  - Food ( http://localhost:8080/api/v1/food ) will show you all food items that currently exists in the database

  - And you can see any recipe in detail by calling an address like this http://localhost:8080/api/v1/recipe/5 (where 5 is an `id` which you can get from previous endpoint)

NOTE: For more information check out `docs-app` mentioned above

## Other

```sh
# Run to update project versions 
./tools/scripts/update-versions.rb $PROJECT_VERSION
```
