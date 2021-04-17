

Start database:
```sh
docker run \
    -p 27017:27017 \
    -v recipe-book-app_rba-mongodb-data:/data/db \
    mongo:4.4
```

