#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // This calls the 'run' function inside your huge lib.rs file
    // matches the 'name = "zerochat_lib"' in your Cargo.toml
    zerochat_lib::run();
}