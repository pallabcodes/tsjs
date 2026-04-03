pub mod backend;
pub mod buffer;
pub mod renderer;
pub mod git;
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

fn parseColor(c: &str) -> u8 {
    match c.to_lowercase().as_str() {
        "black" => 0,
        "red" => 1,
        "green" => 2,
        "yellow" => 3,
        "blue" => 4,
        "magenta" => 5,
        "cyan" => 6,
        "white" => 7,
        "grey" | "gray" => 8,
        _ => {
            if c.starts_with('#') {
                // Return a default grey for unknown hex in this performance pass
                return 8;
            }
            0
        }
    }
}

// --- ZEN INPUT ---

#[napi]
pub struct ZenInput {}

#[napi]
#[allow(non_snake_case)]
impl ZenInput {
    #[napi(constructor)]
    pub fn new() -> Self { Self {} }

    #[napi]
    pub fn startPolling(&self, callback: ThreadsafeFunction<String>) -> napi::Result<()> {
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
    isRaw: bool,
}

#[napi]
#[allow(non_snake_case)]
impl ZenTerminal {
    #[napi(constructor)]
    pub fn new() -> Self {
        Self {
            backend: CrosstermBackend::new(),
            isRaw: false,
        }
    }

    #[napi]
    pub fn enableRawMode(&mut self) -> napi::Result<()> {
        if self.isRaw { return Ok(()); }
        self.backend.enableRawMode().map_err(|e| napi::Error::from_reason(e.to_string()))?;
        self.backend.clear().map_err(|e| napi::Error::from_reason(e.to_string()))?;
        self.backend.hideCursor().map_err(|e| napi::Error::from_reason(e.to_string()))?;
        self.isRaw = true;
        Ok(())
    }

    #[napi]
    pub fn disableRawMode(&mut self) -> napi::Result<()> {
        if !self.isRaw { return Ok(()); }
        let _ = self.backend.showCursor();
        let _ = self.backend.disableRawMode();
        self.isRaw = false;
        Ok(())
    }

    #[napi]
    pub fn getSize(&self) -> Vec<u32> {
        let (w, h) = self.backend.getSize();
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
#[allow(non_snake_case)]
impl ZenBuffer {
    #[napi(constructor)]
    pub fn new(width: u16, height: u16) -> Self {
        Self {
            buffer: Buffer::new(width, height),
            renderer: Renderer::new(CrosstermBackend::new()),
        }
    }

    #[napi]
    pub fn setCell(&mut self, x: u16, y: u16, content: String, fg: Option<String>, bg: Option<String>, bold: Option<bool>) {
        if x >= self.buffer.width || y >= self.buffer.height { return; }
        let char_content = content.chars().next().unwrap_or(' ');
        let fg_idx = fg.map(|c| parseColor(&c)).unwrap_or(0);
        let bg_idx = bg.map(|c| parseColor(&c)).unwrap_or(0);
        
        self.buffer.setCell(x, y, Cell::new(
            char_content,
            fg_idx,
            bg_idx,
            bold.unwrap_or(false),
        ));
    }

    #[napi]
    pub fn flush(&mut self) -> napi::Result<()> {
        self.renderer.render(&self.buffer).map_err(|e| napi::Error::from_reason(e.to_string()))?;
        Ok(())
    }

    #[napi]
    pub fn clear(&mut self) {
        self.buffer.clear();
    }

    #[napi]
    pub fn resize(&mut self, width: u16, height: u16) {
        self.buffer.resize(width, height);
    }

    #[napi]
    pub fn getWidth(&self) -> u16 {
        self.buffer.width
    }

    #[napi]
    pub fn getHeight(&self) -> u16 {
        self.buffer.height
    }
}

// --- NATIVE GIT BRIDGE ---

#[napi]
pub struct ZenGit {
    inner: git::NativeGit,
}

#[napi]
#[allow(non_snake_case)]
impl ZenGit {
    #[napi(constructor)]
    pub fn new() -> napi::Result<Self> {
        let inner = git::NativeGit::new(".").map_err(|e| {
            napi::Error::from_reason(format!("Failed to discover repository: {}", e))
        })?;
        Ok(Self { inner })
    }

    #[napi]
    pub fn getLog(&self, limit: u32) -> napi::Result<String> {
        let commits = self.inner.get_log(limit as usize).map_err(|e| {
            napi::Error::from_reason(format!("Failed to fetch git log: {}", e))
        })?;
        
        serde_json::to_string(&commits).map_err(|e| {
            napi::Error::from_reason(format!("Failed to serialize commits: {}", e))
        })
    }

    #[napi]
    pub fn getDiff(&self, hash: String) -> napi::Result<String> {
        self.inner.get_diff(&hash).map_err(|e| {
            napi::Error::from_reason(format!("Failed to fetch diff: {}", e))
        })
    }

    #[napi]
    pub fn stageFile(&self, path: String) -> napi::Result<()> {
        self.inner.stage_file(&path).map_err(|e| {
            napi::Error::from_reason(format!("Failed to stage file: {}", e))
        })
    }

    #[napi]
    pub fn unstageFile(&self, path: String) -> napi::Result<()> {
        self.inner.unstage_file(&path).map_err(|e| {
            napi::Error::from_reason(format!("Failed to unstage file: {}", e))
        })
    }

    #[napi]
    pub fn getStatus(&self) -> napi::Result<String> {
        let files = self.inner.get_status().map_err(|e| {
            napi::Error::from_reason(format!("Failed to fetch git status: {}", e))
        })?;
        serde_json::to_string(&files).map_err(|e| {
            napi::Error::from_reason(format!("Failed to serialize status: {}", e))
        })
    }

    #[napi]
    pub fn commit(&self, message: String) -> napi::Result<()> {
        self.inner.commit(&message).map_err(|e| {
            napi::Error::from_reason(format!("Failed to execute git commit: {}", e))
        })
    }

    #[napi]
    pub fn getBranches(&self) -> napi::Result<String> {
        let branches = self.inner.get_branches().map_err(|e| {
            napi::Error::from_reason(format!("Failed to fetch git branches: {}", e))
        })?;
        serde_json::to_string(&branches).map_err(|e| {
            napi::Error::from_reason(format!("Failed to serialize branches: {}", e))
        })
    }
}
