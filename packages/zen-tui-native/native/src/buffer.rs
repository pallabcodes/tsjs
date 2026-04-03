/**
 * @zen-tui/native: Industrial Native Buffer (Hardcore Edition)
 * 
 * Performance-optimized 2D cell grid using atomic bit-packing.
 */

/**
 * 🧱 Cell: Atomic Bit-Packed Terminal State (64 bits)
 * 
 * Layout:
 * - [0-20]   Content (Unicode Codepoint, 21 bits)
 * - [21-28]  Foreground (256-color index, 8 bits)
 * - [29-36]  Background (256-color index, 8 bits)
 * - [37]     Bold Attribute (1 bit)
 * - [38-63]  Reserved
 */
#[derive(Clone, Copy, PartialEq, Debug)]
pub struct Cell(pub u64);

impl Cell {
    pub fn new(content: char, fg: u8, bg: u8, bold: bool) -> Self {
        let mut bits = (content as u32 as u64) & 0x1FFFFF;
        bits |= (fg as u64) << 21;
        bits |= (bg as u64) << 29;
        if bold { bits |= 1 << 37; }
        Self(bits)
    }

    pub fn content(&self) -> char {
        char::from_u32((self.0 & 0x1FFFFF) as u32).unwrap_or(' ')
    }

    pub fn fg(&self) -> u8 {
        ((self.0 >> 21) & 0xFF) as u8
    }

    pub fn bg(&self) -> u8 {
        ((self.0 >> 29) & 0xFF) as u8
    }

    pub fn bold(&self) -> bool {
        (self.0 >> 37) & 1 == 1
    }
}

impl Default for Cell {
    fn default() -> Self {
        Self::new(' ', 0, 0, false)
    }
}

/**
 * 🧱 Buffer: Industrial Character Grid with Dirty-Row Tracking.
 */
#[derive(Clone, Debug, PartialEq)]
pub struct Buffer {
    pub width: u16,
    pub height: u16,
    pub cells: Vec<Cell>,
    pub dirty_rows: Vec<bool>, // 🔥 DIRTY ISOLATION: Skip unchanged screen regions
}

#[allow(non_snake_case)]
impl Buffer {
    pub fn new(width: u16, height: u16) -> Self {
        let size = (width as usize) * (height as usize);
        Self {
            width,
            height,
            cells: vec![Cell::default(); size],
            dirty_rows: vec![true; height as usize], // Start fully dirty
        }
    }

    pub fn setCell(&mut self, x: u16, y: u16, cell: Cell) {
        if x >= self.width || y >= self.height { return; }
        let idx = (y as usize) * (self.width as usize) + (x as usize);
        
        // ⚡ O(1) Atomic Check: Only mark dirty if the cell actually changed
        if self.cells[idx] != cell {
            self.cells[idx] = cell;
            self.dirty_rows[y as usize] = true;
        }
    }

    pub fn getCell(&self, x: u16, y: u16) -> Option<&Cell> {
        if x >= self.width || y >= self.height { return None; }
        let idx = (y as usize) * (self.width as usize) + (x as usize);
        Some(&self.cells[idx])
    }

    pub fn clear(&mut self) {
        self.cells.fill(Cell::default());
        self.dirty_rows.fill(true);
    }

    pub fn resize(&mut self, width: u16, height: u16) {
        self.width = width;
        self.height = height;
        let size = (width as usize) * (height as usize);
        self.cells = vec![Cell::default(); size];
        self.dirty_rows = vec![true; height as usize];
    }
}
