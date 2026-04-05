#![allow(non_snake_case, unused_imports, unused_mut)]
/**
 * @zen-tui/native: Terminal Driver
 */

use crossterm::{
    cursor,
    execute,
    queue,
    style::{self, Color, PrintStyledContent},
    terminal::{self, Clear, ClearType},
};
use std::fs::File;
use std::io::{self, Write, BufWriter};

pub trait TerminalBackend {
    fn getSize(&self) -> (u16, u16);
    fn moveTo(&mut self, x: u16, y: u16) -> io::Result<()>;
    fn printStyled(&mut self, content: char, fg: Option<Color>, bg: Option<Color>, bold: bool) -> io::Result<()>;
    fn flush(&mut self) -> io::Result<()>;
    fn clear(&mut self) -> io::Result<()>;
    fn showCursor(&mut self) -> io::Result<()>;
    fn hideCursor(&mut self) -> io::Result<()>;
    fn enableRawMode(&mut self) -> io::Result<()>;
    fn disableRawMode(&mut self) -> io::Result<()>;
    fn enterAlternateScreen(&mut self) -> io::Result<()>;
    fn leaveAlternateScreen(&mut self) -> io::Result<()>;
    fn clearScrollback(&mut self) -> io::Result<()>;
    fn clearWith(&mut self, color: Color) -> io::Result<()>;
}

pub struct CrosstermBackend {
    stdout: Box<dyn Write + Send>,
}

impl CrosstermBackend {
    pub fn new() -> Self {
        // 🧱 RESILIENT SEIZURE: Attempt /dev/tty, fall back to stdout
        let writer: Box<dyn Write + Send> = match File::options().write(true).open("/dev/tty") {
            Ok(tty) => Box::new(BufWriter::with_capacity(32768, tty)),
            Err(_) => Box::new(BufWriter::with_capacity(32768, io::stdout())),
        };
        Self { stdout: writer }
    }
}

impl TerminalBackend for CrosstermBackend {
    fn getSize(&self) -> (u16, u16) { terminal::size().unwrap_or((80, 24)) }

    fn moveTo(&mut self, x: u16, y: u16) -> io::Result<()> {
        write!(self.stdout, "\x1b[{};{}H", y + 1, x + 1)
    }

    fn printStyled(&mut self, content: char, fg: Option<Color>, bg: Option<Color>, bold: bool) -> io::Result<()> {
        let mut style = style::ContentStyle::default();
        if let Some(c) = fg { style.foreground_color = Some(c); }
        if let Some(c) = bg { style.background_color = Some(c); }
        if bold { style.attributes.set(style::Attribute::Bold); }
        queue!(self.stdout, PrintStyledContent(style.apply(content)))
    }

    fn flush(&mut self) -> io::Result<()> { self.stdout.flush() }
    fn clear(&mut self) -> io::Result<()> { write!(self.stdout, "\x1b[2J\x1b[H") }

    fn clearWith(&mut self, color: Color) -> io::Result<()> {
        let (r, g, b) = match color {
            Color::Rgb { r, g, b } => (r, g, b),
            _ => (0, 0, 0),
        };
        // 🧱 Set background color and clear screen to home
        write!(self.stdout, "\x1b[48;2;{};{};{}m\x1b[2J\x1b[H", r, g, b)
    }

    fn showCursor(&mut self) -> io::Result<()> {
        write!(self.stdout, "\x1b[?25h")?;
        self.stdout.flush()
    }

    fn hideCursor(&mut self) -> io::Result<()> {
        write!(self.stdout, "\x1b[?25l")?;
        self.stdout.flush()
    }

    fn enableRawMode(&mut self) -> io::Result<()> {
        let _ = terminal::enable_raw_mode();
        self.stdout.flush()
    }

    fn disableRawMode(&mut self) -> io::Result<()> {
        let _ = terminal::disable_raw_mode();
        self.stdout.flush()
    }

    fn enterAlternateScreen(&mut self) -> io::Result<()> {
        write!(self.stdout, "\x1b[?1049h\x1b[2J\x1b[H")?;
        self.stdout.flush()
    }

    fn leaveAlternateScreen(&mut self) -> io::Result<()> {
        write!(self.stdout, "\x1b[?1049l\x1b[?25h")?;
        self.stdout.flush()
    }

    fn clearScrollback(&mut self) -> io::Result<()> {
        write!(self.stdout, "\x1b[3J")?;
        self.stdout.flush()
    }
}
