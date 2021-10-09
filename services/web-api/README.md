

Start database:
```sh
docker run --name recipe-book-app-db --rm \
    -p 27017:27017 \
    -v $HOME/dev/personal/recipe-book/recipe-book-app/mongodb:/data/db \
    mongo:4.4
```

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

