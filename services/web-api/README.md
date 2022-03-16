
```sh
# Only checks formatting
cargo fmt -- --check

# Updates formatting
cargo fmt

# Some extra checks
cargo clippy -- -D warnings

# Some default checks
cargo check

# To run with watch
cargo watch -x run
```

Start database:

```sh
docker run --name recipe-book-db --rm \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=password \
    -v ${HOME}/dev/personal/recipe-book/recipe-book-app/postgres:/var/lib/postgresql/data \
    postgres:14

# Get IP for pgAdmin
docker inspect recipe-book-db -f "{{json .NetworkSettings.Networks }}"

docker run --name recipe-book-db-admin --rm \
    -p 80:80 \
    -e PGADMIN_DEFAULT_EMAIL='user@domain.local' \
    -e PGADMIN_DEFAULT_PASSWORD=password \
    dpage/pgadmin4:latest
```
