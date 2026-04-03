use crate::backend::TerminalBackend;
use crate::buffer::Buffer;
use crossterm::style::Color;
use std::io;

pub struct Renderer<B: TerminalBackend> {
    backend: B,
    previous_buffer: Option<Buffer>,
}

#[allow(non_snake_case)]
impl<B: TerminalBackend> Renderer<B> {
    pub fn new(backend: B) -> Self {
        Self {
            backend,
            previous_buffer: None,
        }
    }

    /**
     * render: Precision Hardcore Synchronization Pass.
     * 
     * 1. Skip-Row Optimization: Bypasses 100% of rows that haven't changed.
     * 2. Atomic Bit-Diffing: O(1) cell comparison using packed u64.
     * 3. Contiguous RLE Painting: Eliminates redundant ANSI cursor moves.
     */
    pub fn render(&mut self, buffer: &Buffer) -> io::Result<()> {
        // 1. Geometry Check
        if let Some(prev) = &self.previous_buffer {
            if prev.width != buffer.width || prev.height != buffer.height {
                self.backend.clear()?;
            }
        }

        // 2. Industrial Diffing Pass
        for y in 0..buffer.height {
            // 🔥 SKIP-ROW OPTIMIZATION: Zero-overhead bypass for static regions
            if !buffer.dirty_rows[y as usize] {
                if let Some(prev) = &self.previous_buffer {
                    if prev.width == buffer.width && prev.height == buffer.height {
                        continue; 
                    }
                }
            }

            let mut current_run_start: Option<u16> = None;

            for x in 0..buffer.width {
                let cell = buffer.getCell(x, y).unwrap();
                
                // ⚡ ATOMIC BIT-DIFF: O(1) integer comparison
                let needs_update = match &self.previous_buffer {
                    Some(prev) => {
                        if prev.width == buffer.width && prev.height == buffer.height {
                            prev.getCell(x, y).map(|c| c.0 != cell.0).unwrap_or(true)
                        } else {
                            true
                        }
                    },
                    None => true,
                };

                if needs_update {
                    // ╼ RLE Management: Only move cursor if this is a new run
                    if current_run_start.is_none() {
                        self.backend.moveTo(x, y)?;
                        current_run_start = Some(x);
                    }

                    // Mapping packed bits back to crossterm types for the backend
                    self.backend.printStyled(
                        cell.content(),
                        Self::map_color(cell.fg()),
                        Self::map_color(cell.bg()),
                        cell.bold(),
                    )?;
                } else {
                    // End the contiguous run
                    current_run_start = None;
                }
            }
        }

        // 3. Frame Flush: Performs a single write syscall for the entire instruction set.
        self.backend.flush()?;
        
        // 4. Update Tombstone Tracking
        self.update_previous(buffer);

        Ok(())
    }

    fn update_previous(&mut self, buffer: &Buffer) {
        if let Some(prev) = &mut self.previous_buffer {
            if prev.width != buffer.width || prev.height != buffer.height {
                prev.resize(buffer.width, buffer.height);
            }
            prev.cells.copy_from_slice(&buffer.cells);
            prev.dirty_rows.fill(false); // Reset tracking
        } else {
            let mut prev = Buffer::new(buffer.width, buffer.height);
            prev.cells.copy_from_slice(&buffer.cells);
            prev.dirty_rows.fill(false);
            self.previous_buffer = Some(prev);
        }
    }

    fn map_color(idx: u8) -> Option<Color> {
        // Simple mapping for 256-color palette
        if idx == 0 { return None; }
        // Map common ANSI 256 indexes or use direct index
        Some(Color::AnsiValue(idx))
    }

    pub fn clear(&mut self) -> io::Result<()> {
        self.backend.clear()?;
        self.previous_buffer = None;
        Ok(())
    }
}
