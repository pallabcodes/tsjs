/**
 * @zen-tui/native: Industrial Terminal Driver (Hardened Edition)
 * 
 * Optimized for O(1) syscall flushes using a BufWriter.
 */

use crossterm::{
    cursor,
    execute,
    queue,
    style::{self, Color, PrintStyledContent},
    terminal::{self, Clear, ClearType},
};
use std::io::{self, Write, BufWriter, Stdout};

/**
 * 🎨 TerminalBackend: The Industrial Driver Interface
 */
pub trait TerminalBackend {
    fn getSize(&self) -> (u16, u16);
    fn moveTo(&mut self, x: u16, y: u16) -> io::Result<()>;
    fn printStyled(
        &mut self,
        content: char,
        fg: Option<Color>,
        bg: Option<Color>,
        bold: bool,
    ) -> io::Result<()>;
    fn flush(&mut self) -> io::Result<()>;
    fn clear(&mut self) -> io::Result<()>;
    fn showCursor(&mut self) -> io::Result<()>;
    fn hideCursor(&mut self) -> io::Result<()>;
    fn enableRawMode(&mut self) -> io::Result<()>;
    fn disableRawMode(&mut self) -> io::Result<()>;
}

/**
 * CrosstermBackend: Performance-optimized implementation using BufWriter.
 */
pub struct CrosstermBackend {
    stdout: BufWriter<Stdout>,
}

impl CrosstermBackend {
    pub fn new() -> Self {
        // 1. Initialize a large 32KB buffer for ANSI sequences
        Self {
            stdout: BufWriter::with_capacity(32768, io::stdout()),
        }
    }
}

#[allow(non_snake_case)]
impl TerminalBackend for CrosstermBackend {
    fn getSize(&self) -> (u16, u16) {
        terminal::size().unwrap_or((80, 24))
    }

    fn moveTo(&mut self, x: u16, y: u16) -> io::Result<()> {
        // ╼ Use queue! to batch cursor instructions into the buffer
        queue!(self.stdout, cursor::MoveTo(x, y))
    }

    fn printStyled(
        &mut self,
        content: char,
        fg: Option<Color>,
        bg: Option<Color>,
        bold: bool,
    ) -> io::Result<()> {
        let mut style = style::ContentStyle::default();
        if let Some(c) = fg { style.foreground_color = Some(c); }
        if let Some(c) = bg { style.background_color = Some(c); }
        if bold { style.attributes.set(style::Attribute::Bold); }

        // ╼ Queuestyled instructions into the buffer
        queue!(self.stdout, PrintStyledContent(style.apply(content)))
    }

    fn flush(&mut self) -> io::Result<()> {
        // 🔥 THE ULTIMATE PASS: Performs a single write syscall for the entire frame buffer.
        self.stdout.flush()
    }

    fn clear(&mut self) -> io::Result<()> {
        execute!(self.stdout, Clear(ClearType::All))
    }

    fn showCursor(&mut self) -> io::Result<()> {
        execute!(self.stdout, cursor::Show)
    }

    fn hideCursor(&mut self) -> io::Result<()> {
        execute!(self.stdout, cursor::Hide)
    }

    fn enableRawMode(&mut self) -> io::Result<()> {
        terminal::enable_raw_mode()
    }

    fn disableRawMode(&mut self) -> io::Result<()> {
        terminal::disable_raw_mode()
    }
}
