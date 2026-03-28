use crate::backend::TerminalBackend;
use crate::buffer::Buffer;
use std::io;

pub struct Renderer<B: TerminalBackend> {
    backend: B,
    previous_buffer: Option<Buffer>,
}

impl<B: TerminalBackend> Renderer<B> {
    pub fn new(backend: B) -> Self {
        Self {
            backend,
            previous_buffer: None,
        }
    }

    pub fn render(&mut self, buffer: &Buffer) -> io::Result<()> {
        let size = self.backend.get_size();
        if size.0 != buffer.width || size.1 != buffer.height {
            // Handle resize or mismatch if needed, but for now we assume buffer matches terminal size
        }

        for y in 0..buffer.height {
            for x in 0..buffer.width {
                let current_cell = buffer.get_cell(x, y).unwrap();
                let needs_update = match &self.previous_buffer {
                    Some(prev) => prev.get_cell(x, y) != Some(current_cell),
                    None => true,
                };

                if needs_update {
                    self.backend.move_to(x, y)?;
                    self.backend.print_styled(
                        current_cell.content,
                        current_cell.fg,
                        current_cell.bg,
                        current_cell.bold,
                    )?;
                }
            }
        }

        self.backend.flush()?;
        
        // Update previous buffer
        if let Some(prev) = &mut self.previous_buffer {
            if prev.width != buffer.width || prev.height != buffer.height {
                prev.resize(buffer.width, buffer.height);
            }
            prev.cells.copy_from_slice(&buffer.cells);
        } else {
            let mut prev = Buffer::new(buffer.width, buffer.height);
            prev.cells.copy_from_slice(&buffer.cells);
            self.previous_buffer = Some(prev);
        }

        Ok(())
    }

    pub fn clear(&mut self) -> io::Result<()> {
        self.backend.clear()?;
        self.previous_buffer = None;
        Ok(())
    }

    pub fn backend_mut(&mut self) -> &mut B {
        &mut self.backend
    }
    
    pub fn backend(&self) -> &B {
        &self.backend
    }
}
