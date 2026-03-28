use crossterm::{
    cursor, queue,
    terminal::{self, ClearType},
    style::{self, Color, Stylize},
};
use std::io::{self, Write, stdout, Stdout};

pub trait TerminalBackend {
    fn clear(&mut self) -> io::Result<()>;
    fn move_to(&mut self, x: u16, y: u16) -> io::Result<()>;
    fn print_styled(&mut self, content: char, fg: Option<Color>, bg: Option<Color>, bold: bool) -> io::Result<()>;
    fn flush(&mut self) -> io::Result<()>;
    fn show_cursor(&mut self) -> io::Result<()>;
    fn hide_cursor(&mut self) -> io::Result<()>;
    fn get_size(&self) -> (u16, u16);
    fn enable_raw_mode(&mut self) -> io::Result<()>;
    fn disable_raw_mode(&mut self) -> io::Result<()>;
}

pub struct CrosstermBackend {
    stdout: Stdout,
}

impl CrosstermBackend {
    pub fn new() -> Self {
        Self { stdout: stdout() }
    }
}

impl TerminalBackend for CrosstermBackend {
    fn clear(&mut self) -> io::Result<()> {
        queue!(self.stdout, terminal::Clear(ClearType::All))
    }
    fn move_to(&mut self, x: u16, y: u16) -> io::Result<()> {
        queue!(self.stdout, cursor::MoveTo(x, y))
    }
    fn print_styled(&mut self, content: char, fg: Option<Color>, bg: Option<Color>, bold: bool) -> io::Result<()> {
        let mut styled = style::style(content);
        if let Some(c) = fg { styled = styled.with(c); }
        if let Some(c) = bg { styled = styled.on(c); }
        if bold { styled = styled.bold(); }
        queue!(self.stdout, style::PrintStyledContent(styled))
    }
    fn flush(&mut self) -> io::Result<()> {
        self.stdout.flush()
    }
    fn show_cursor(&mut self) -> io::Result<()> {
        queue!(self.stdout, cursor::Show)
    }
    fn hide_cursor(&mut self) -> io::Result<()> {
        queue!(self.stdout, cursor::Hide)
    }
    fn get_size(&self) -> (u16, u16) {
        terminal::size().unwrap_or((80, 24))
    }
    fn enable_raw_mode(&mut self) -> io::Result<()> {
        terminal::enable_raw_mode()
    }
    fn disable_raw_mode(&mut self) -> io::Result<()> {
        terminal::disable_raw_mode()
    }
}
