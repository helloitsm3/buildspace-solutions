## 🧪 Testing Solana programs

In this section, we'll learn how to test Solana programs(Unit tests and Integration tests). 

### 🔺 Unit tests
- Unit tests in Rust generally reside in the file with the code they are testing. In our case, the unit tests reside in the `src/processor.rs` file.

- Unit tests are declared inside a module named tests annotated with cfg(test)
- Run the tests using `cargo test-bpf`

### 🔺 Integration tests

- Integration tests are written in the tests directory.

```
// Example of integration test inside /tests/integration_test.rs file
use example_lib;

#[test]
fn it_adds_two() {
    assert_eq!(4, example_lib::add_two(2));
}
```
- After writing tests, Run the tests using `cargo test-bpf`

### 🔌 Integration Tests with Typescript
The alternative method to test your program is by deploying it to either Devnet or a local validator and sending transactions to it from some client that you created.

