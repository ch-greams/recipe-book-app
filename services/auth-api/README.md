
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