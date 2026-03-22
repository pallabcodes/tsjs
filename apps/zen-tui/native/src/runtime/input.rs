use crossterm::event::{self, Event, KeyCode, KeyEvent, KeyModifiers};
use napi_derive::napi;
use std::time::Duration;

use crossterm::terminal;

#[napi]
pub struct ZenInput {
    // Shared state if needed
}

#[napi]
impl ZenInput {
    #[napi(constructor)]
    pub fn new() -> Self {
        let _ = terminal::enable_raw_mode();
        Self {}
    }

    #[napi]
    pub fn poll_event(&self, timeout_ms: u32) -> Option<String> {
        if event::poll(Duration::from_millis(timeout_ms as u64)).unwrap() {
            if let Event::Key(key) = event::read().unwrap() {
                return Some(self.format_key(key));
            }
        }
        None
    }

    fn format_key(&self, key: KeyEvent) -> String {
        let name = match key.code {
            KeyCode::Char(c) => c.to_string(),
            KeyCode::Esc => "escape".to_string(),
            KeyCode::Enter => "return".to_string(),
            KeyCode::Backspace => "backspace".to_string(),
            KeyCode::Up => "up".to_string(),
            KeyCode::Down => "down".to_string(),
            KeyCode::Left => "left".to_string(),
            KeyCode::Right => "right".to_string(),
            _ => "unknown".to_string(),
        };

        let ctrl = key.modifiers.contains(KeyModifiers::CONTROL);
        let alt = key.modifiers.contains(KeyModifiers::ALT);
        let shift = key.modifiers.contains(KeyModifiers::SHIFT);

        format!("{{\"name\": \"{}\", \"ctrl\": {}, \"alt\": {}, \"shift\": {}}}", name, ctrl, alt, shift)
    }
}
impl Drop for ZenInput { fn drop(&mut self) { crossterm::terminal::disable_raw_mode().ok(); } }
