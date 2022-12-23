
```sh
# Only checks formatting
cargo fmt -- --check

# Updates formatting
cargo fmt

# Some extra checks
cargo clippy -- -D warnings

# Some default checks
cargo check

# To run with watch, you'll need `cargo install cargo-watch`
cargo watch -x run
```

## Integration Tests

```sh
# You need to have keycloak and database to be available
docker compose up rb-keycloak

# And then just run tests
cargo test
```
