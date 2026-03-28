#[cfg(test)]
mod tests {
    use crate::backend::TerminalBackend;
    use crate::buffer::{Buffer, Cell};
    use crate::renderer::Renderer;
    use crossterm::style::Color;
    use std::io;

    struct MockBackend {
        width: u16,
        height: u16,
        cleared: bool,
        cursor_pos: (u16, u16),
        prints: Vec<(u16, u16, char)>,
    }

    impl MockBackend {
        fn new(w: u16, h: u16) -> Self {
            Self {
                width: w,
                height: h,
                cleared: false,
                cursor_pos: (0, 0),
                prints: Vec::new(),
            }
        }
    }

    impl TerminalBackend for MockBackend {
        fn clear(&mut self) -> io::Result<()> {
            self.cleared = true;
            Ok(())
        }
        fn move_to(&mut self, x: u16, y: u16) -> io::Result<()> {
            self.cursor_pos = (x, y);
            Ok(())
        }
        fn print_styled(&mut self, content: char, _fg: Option<Color>, _bg: Option<Color>, _bold: bool) -> io::Result<()> {
            self.prints.push((self.cursor_pos.0, self.cursor_pos.1, content));
            Ok(())
        }
        fn flush(&mut self) -> io::Result<()> { Ok(()) }
        fn show_cursor(&mut self) -> io::Result<()> { Ok(()) }
        fn hide_cursor(&mut self) -> io::Result<()> { Ok(()) }
        fn get_size(&self) -> (u16, u16) { (self.width, self.height) }
        fn enable_raw_mode(&mut self) -> io::Result<()> { Ok(()) }
        fn disable_raw_mode(&mut self) -> io::Result<()> { Ok(()) }
    }

    #[test]
    fn test_buffer_set_cell() {
        let mut buffer = Buffer::new(10, 10);
        let cell = Cell { content: 'A', ..Default::default() };
        buffer.set_cell(5, 5, cell);
        assert_eq!(buffer.get_cell(5, 5).unwrap().content, 'A');
    }

    #[test]
    fn test_renderer_diffing() {
        let backend = MockBackend::new(10, 10);
        let mut renderer = Renderer::new(backend);
        let mut buffer = Buffer::new(10, 10);

        buffer.set_cell(0, 0, Cell { content: 'X', ..Default::default() });
        renderer.render(&buffer).unwrap();

        // First render is always full buffer (100 cells)
        assert_eq!(renderer.backend().prints.len(), 100);
        assert_eq!(renderer.backend().prints[0], (0, 0, 'X'));

        // Change one cell and render again
        let current_prints = renderer.backend().prints.len();
        buffer.set_cell(1, 1, Cell { content: 'Y', ..Default::default() });
        renderer.render(&buffer).unwrap();
        
        // Should only print the changed cell
        assert_eq!(renderer.backend().prints.len(), current_prints + 1);
        assert_eq!(renderer.backend().prints.last().unwrap(), &(1, 1, 'Y'));
    }
}
