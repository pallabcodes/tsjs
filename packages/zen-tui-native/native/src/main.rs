use crossterm::{
    terminal::{enable_raw_mode, disable_raw_mode},
    execute,
    cursor,
};
use std::io::{stdout, Write};
use std::thread;
use std::time::Duration;

fn main() {
    println!("Testing Crossterm Raw Mode...");
    let mut out = stdout();
    
    enable_raw_mode().expect("Failed to enable raw mode");
    execute!(out, cursor::Hide).unwrap();
    
    println!("Raw mode enabled. Waiting 2 seconds...");
    thread::sleep(Duration::from_secs(2));
    
    execute!(out, cursor::Show).unwrap();
    disable_raw_mode().expect("Failed to disable raw mode");
    println!("Test complete. Raw mode disabled.");
}
