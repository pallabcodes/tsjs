// Derive debug so this runtime helper is easy to inspect in tests and runtime diagnostics.
#[derive(Debug)]
pub struct OutputBuffer {
    lines: Vec<String>,
    partial_line: String,
    max_lines: usize,
    dropped_lines: usize,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct OutputBufferSnapshot {
    pub lines: Vec<String>,
    pub partial_line: Option<String>,
    pub dropped_lines: usize,
}

impl OutputBuffer {
    pub fn with_max_lines(max_lines: usize) -> Self {
        Self {
            lines: Vec::new(),
            partial_line: String::new(),
            max_lines: max_lines.max(1),
            dropped_lines: 0,
        }
    }

    pub fn push_line(&mut self, line: impl Into<String>) {
        self.lines.push(line.into());
        self.trim_if_needed();
    }

    pub fn push_chunk(&mut self, chunk: &[u8]) {
        let chunk = String::from_utf8_lossy(chunk);

        for ch in chunk.chars() {
            if ch == '\n' {
                let line = std::mem::take(&mut self.partial_line);
                self.push_line(line);
                continue;
            }

            if ch != '\r' {
                self.partial_line.push(ch);
            }
        }
    }

    pub fn finish_partial_line(&mut self) {
        if !self.partial_line.is_empty() {
            let line = std::mem::take(&mut self.partial_line);
            self.push_line(line);
        }
    }

    pub fn clear(&mut self) {
        self.lines.clear();
        self.partial_line.clear();
        self.dropped_lines = 0;
    }

    pub fn lines(&self) -> &[String] {
        self.lines.as_slice()
    }

    pub fn snapshot(&self) -> OutputBufferSnapshot {
        OutputBufferSnapshot {
            lines: self.lines.clone(),
            partial_line: (!self.partial_line.is_empty()).then(|| self.partial_line.clone()),
            dropped_lines: self.dropped_lines,
        }
    }

    pub fn dropped_lines(&self) -> usize {
        self.dropped_lines
    }

    fn trim_if_needed(&mut self) {
        if self.lines.len() <= self.max_lines {
            return;
        }

        let overflow = self.lines.len() - self.max_lines;
        self.lines.drain(0..overflow);
        self.dropped_lines += overflow;
    }
}

impl Default for OutputBuffer {
    fn default() -> Self {
        Self::with_max_lines(2_048)
    }
}

impl OutputBuffer {
    pub fn new() -> Self {
        Self::default()
    }
}
