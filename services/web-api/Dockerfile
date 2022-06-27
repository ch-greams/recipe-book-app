FROM rust:1.61-slim-buster

# 1 - Empty project
RUN cargo new --bin web-api
WORKDIR /web-api

# 2 - Copy manifests & build dependencies
COPY ./Cargo.toml ./Cargo.toml
COPY ./Cargo.lock ./Cargo.lock

RUN cargo build --release & rm src/*.rs

# 3 - Copy source code
COPY ./examples ./examples
COPY ./database ./database
COPY ./src ./src

EXPOSE 8080

CMD cargo run
