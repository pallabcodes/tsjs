mod backend;
mod buffer;
mod renderer;
#[cfg(test)]
mod tests;

use backend::{CrosstermBackend, TerminalBackend};
use buffer::{Buffer, Cell};
use renderer::Renderer;

use crossterm::{
    event::{self, Event, KeyCode, KeyModifiers},
    style::{Color},
};
use napi_derive::napi;
use napi::threadsafe_function::{ThreadsafeFunction, ThreadsafeFunctionCallMode};
use std::time::Duration;

// --- SHARED UTILS ---

fn parse_color(c: &str) -> Option<Color> {
    if c.starts_with('#') && c.len() == 7 {
        let r = u8::from_str_radix(&c[1..3], 16).unwrap_or(0);
        let g = u8::from_str_radix(&c[3..5], 16).unwrap_or(0);
        let b = u8::from_str_radix(&c[5..7], 16).unwrap_or(0);
        return Some(Color::Rgb { r, g, b });
    }
    match c.to_lowercase().as_str() {
        "black" => Some(Color::Black),
        "red" => Some(Color::Red),
        "green" => Some(Color::Green),
        "yellow" => Some(Color::Yellow),
        "blue" => Some(Color::Blue),
        "magenta" => Some(Color::Magenta),
        "cyan" => Some(Color::Cyan),
        "white" => Some(Color::White),
        "grey" | "gray" => Some(Color::Grey),
        _ => None,
    }
}

// --- ZEN INPUT ---

#[napi]
pub struct ZenInput {}

#[napi]
impl ZenInput {
    #[napi(constructor)]
    pub fn new() -> Self { Self {} }

    #[napi(js_name = "start_polling")]
    pub fn start_polling(&self, callback: ThreadsafeFunction<String>) -> napi::Result<()> {
        std::thread::spawn(move || {
            loop {
                if event::poll(Duration::from_millis(100)).unwrap_or(false) {
                    if let Ok(ev) = event::read() {
                        let msg = match ev {
                            Event::Key(key) => {
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
                                Some(format!("{{\"name\": \"{}\", \"ctrl\": {}, \"alt\": {}, \"shift\": {}}}", name, ctrl, alt, shift))
                            }
                            Event::Resize(w, h) => {
                                Some(format!(
                                    "{{\"name\": \"resize\", \"width\": {}, \"height\": {}}}",
                                    w, h
                                ))
                            }
                            _ => None
                        };

                        if let Some(json) = msg {
                            callback.call(Ok(json), ThreadsafeFunctionCallMode::Blocking);
                        }
                    }
                }
            }
        });
        Ok(())
    }
}

// --- ZEN TERMINAL ---

#[napi]
pub struct ZenTerminal {
    backend: CrosstermBackend,
    is_raw: bool,
}

#[napi]
impl ZenTerminal {
    #[napi(constructor)]
    pub fn new() -> Self {
        Self {
            backend: CrosstermBackend::new(),
            is_raw: false,
        }
    }

    #[napi(js_name = "enable_raw_mode")]
    pub fn enable_raw_mode(&mut self) -> napi::Result<()> {
        if self.is_raw { return Ok(()); }
        self.backend.enable_raw_mode().map_err(|e| napi::Error::from_reason(e.to_string()))?;
        self.backend.clear().map_err(|e| napi::Error::from_reason(e.to_string()))?;
        self.backend.hide_cursor().map_err(|e| napi::Error::from_reason(e.to_string()))?;
        self.is_raw = true;
        Ok(())
    }

    #[napi(js_name = "disable_raw_mode")]
    pub fn disable_raw_mode(&mut self) -> napi::Result<()> {
        if !self.is_raw { return Ok(()); }
        let _ = self.backend.show_cursor();
        let _ = self.backend.disable_raw_mode();
        self.is_raw = false;
        Ok(())
    }

    #[napi(js_name = "get_size")]
    pub fn get_size(&self) -> Vec<u32> {
        let (w, h) = self.backend.get_size();
        vec![w as u32, h as u32]
    }
}

// --- ZEN BUFFER ---

#[napi]
pub struct ZenBuffer {
    buffer: Buffer,
    renderer: Renderer<CrosstermBackend>,
}

#[napi]
impl ZenBuffer {
    #[napi(constructor)]
    pub fn new(width: u16, height: u16) -> Self {
        Self {
            buffer: Buffer::new(width, height),
            renderer: Renderer::new(CrosstermBackend::new()),
        }
    }

    #[napi(js_name = "set_cell")]
    pub fn set_cell(&mut self, x: u16, y: u16, content: String, fg: Option<String>, bg: Option<String>, bold: Option<bool>) {
        if x >= self.buffer.width || y >= self.buffer.height { return; }
        let char_content = content.chars().next().unwrap_or(' ');
        self.buffer.set_cell(x, y, Cell {
            content: char_content,
            fg: fg.and_then(|c| parse_color(&c)),
            bg: bg.and_then(|c| parse_color(&c)),
            bold: bold.unwrap_or(false),
        });
    }

    #[napi(js_name = "flush")]
    pub fn flush(&mut self) -> napi::Result<()> {
        self.renderer.render(&self.buffer).map_err(|e| napi::Error::from_reason(e.to_string()))?;
        Ok(())
    }

    #[napi(js_name = "clear")]
    pub fn clear(&mut self) {
        self.buffer.clear();
    }

    #[napi(js_name = "resize")]
    pub fn resize(&mut self, width: u16, height: u16) {
        self.buffer.resize(width, height);
    }
}
