

Start database:
```sh
docker run --name recipe-book-app-db \
    -p 27017:27017 \
    -v $HOME/dev/personal/recipe-book/recipe-book-app/mongodb:/data/db \
    mongo:4.4
```

![data-model](./data-model.svg)
