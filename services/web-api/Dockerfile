FROM rust:1.65-slim-buster

# 0 - Install linux toolchain
RUN apt-get update && apt-get install -y curl 

# 1 - Empty project
RUN cargo new --bin web-api
WORKDIR /web-api

# 2 - Copy manifests & build dependencies
COPY ./Cargo.toml ./Cargo.toml
COPY ./Cargo.lock ./Cargo.lock

RUN cargo build --release & rm src/*.rs

# 3 - Copy source code
COPY ./examples ./examples
COPY ./src ./src

EXPOSE 8080

CMD cargo run
