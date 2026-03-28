use crossterm::style::Color;

#[derive(Clone, Copy, PartialEq, Debug)]
pub struct Cell {
    pub content: char,
    pub fg: Option<Color>,
    pub bg: Option<Color>,
    pub bold: bool,
}

impl Default for Cell {
    fn default() -> Self {
        Self {
            content: ' ',
            fg: None,
            bg: None,
            bold: false,
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub struct Buffer {
    pub width: u16,
    pub height: u16,
    pub cells: Vec<Cell>,
}

impl Buffer {
    pub fn new(width: u16, height: u16) -> Self {
        let size = (width * height) as usize;
        Self {
            width,
            height,
            cells: vec![Cell::default(); size],
        }
    }

    pub fn set_cell(&mut self, x: u16, y: u16, cell: Cell) {
        if x >= self.width || y >= self.height { return; }
        let idx = (y * self.width + x) as usize;
        self.cells[idx] = cell;
    }

    pub fn get_cell(&self, x: u16, y: u16) -> Option<&Cell> {
        if x >= self.width || y >= self.height { return None; }
        let idx = (y * self.width + x) as usize;
        Some(&self.cells[idx])
    }

    pub fn clear(&mut self) {
        self.cells.fill(Cell::default());
    }

    pub fn resize(&mut self, width: u16, height: u16) {
        self.width = width;
        self.height = height;
        let size = (width * height) as usize;
        self.cells = vec![Cell::default(); size];
    }
}
