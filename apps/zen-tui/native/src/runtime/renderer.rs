/**
 * Zen-Renderer: Native Core (Double-Buffered)
 * 
 * Manages the terminal grid and calculates minimal ANSI diffs for O(1) rendering.
 */

use std::io::{Write, stdout};
use crossterm::{
    cursor, execute,
    event::{self, Event, KeyCode, KeyEvent},
    style::{self, Color, ContentStyle, Stylize},
    terminal::{self, Clear, ClearType},
};

#[napi]
pub struct ZenBuffer {
    width: u16,
    height: u16,
    current: Vec<Cell>,
    previous: Vec<Cell>,
}

#[derive(Clone, PartialEq, Default)]
struct Cell {
    content: char,
    style: ContentStyle,
}

#[napi]
impl ZenBuffer {
    #[napi(constructor)]
    pub fn new(width: u16, height: u16) -> Self {
        let size = (width * height) as usize;
        Self {
            width,
            height,
            current: vec![Cell::default(); size],
            previous: vec![Cell::default(); size],
        }
    }

    /**
     * Pushes a stylized string to the logical grid.
     */
    #[napi]
    pub fn paint(&mut self, x: u16, y: u16, text: String, color: Option<String>) {
        let mut style = ContentStyle::default();
        if let Some(c) = color {
            style.foreground_color = Some(match c.as_str() {
                "cyan" => Color::Cyan,
                "green" => Color::Green,
                "amber" | "yellow" => Color::Yellow,
                "red" => Color::Red,
                _ => Color::White,
            });
        }

        let mut idx = (y * self.width + x) as usize;
        for c in text.chars() {
            if idx < self.current.len() {
                self.current[idx] = Cell { content: c, style };
                idx += 1;
            }
        }
    }

    /**
     * Real-time Flush:
     * Diffs 'current' against 'previous' and only paints deltas.
     */
    #[napi]
    pub fn flush(&mut self) -> napi::Result<()> {
        let mut out = stdout();
        
        for y in 0..self.height {
            for x in 0..self.width {
                let idx = (y * self.width + x) as usize;
                if self.current[idx] != self.previous[idx] {
                    // USP: Atomic Character Placement
                    execute!(
                        out,
                        cursor::MoveTo(x, y),
                        style::PrintStyledContent(
                            style::style(self.current[idx].content)
                                .with(self.current[idx].style.foreground_color.unwrap_or(Color::White))
                        )
                    ).map_err(|e| napi::Error::from_reason(e.to_string()))?;
                }
            }
        }

        self.previous = self.current.clone();
        out.flush().map_err(|e| napi::Error::from_reason(e.to_string()))?;
        Ok(())
    }

    #[napi]
    pub fn clear(&mut self) {
        self.current.fill(Cell::default());
    }

    /**
     * Input Orchestration:
     * Enables raw mode to capture unbuffered key events.
     */
    #[napi]
    pub fn enable_raw_mode(&self) -> napi::Result<()> {
        terminal::enable_raw_mode().map_err(|e| napi::Error::from_reason(e.to_string()))
    }

    #[napi]
    pub fn disable_raw_mode(&self) -> napi::Result<()> {
        terminal::disable_raw_mode().map_err(|e| napi::Error::from_reason(e.to_string()))
    }

    /**
     * Event Stream:
     * Non-blocking poll for the next key event.
     */
    #[napi]
    pub fn poll_event(&self) -> napi::Result<Option<String>> {
        if event::poll(std::time::Duration::from_millis(10)).unwrap_or(false) {
            if let Event::Key(KeyEvent { code, .. }) = event::read().unwrap() {
                return Ok(Some(match code {
                    KeyCode::Char(c) => c.to_string(),
                    KeyCode::Enter => "enter".to_string(),
                    KeyCode::Esc => "esc".to_string(),
                    KeyCode::Up => "up".to_string(),
                    KeyCode::Down => "down".to_string(),
                    _ => "unknown".to_string(),
                }));
            }
        }
        Ok(None)
    }
}
