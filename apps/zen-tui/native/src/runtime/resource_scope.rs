use std::fmt;

type CleanupAction = Box<dyn FnMut() -> Result<(), String> + Send + 'static>;

struct CleanupEntry {
    label: String,
    action: CleanupAction,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CleanupResult {
    pub label: String,
    pub succeeded: bool,
    pub error: Option<String>,
}

// Keep cleanup scopes cheap to create while still allowing explicit, ordered teardown of native resources.
pub struct ResourceScope {
    label: String,
    released: bool,
    cleanups: Vec<CleanupEntry>,
}

impl ResourceScope {
    pub fn new(label: impl Into<String>) -> Self {
        Self {
            label: label.into(),
            released: false,
            cleanups: Vec::new(),
        }
    }

    pub fn defer(
        &mut self,
        label: impl Into<String>,
        action: impl FnMut() -> Result<(), String> + Send + 'static,
    ) {
        self.cleanups.push(CleanupEntry {
            label: label.into(),
            action: Box::new(action),
        });
    }

    pub fn cleanup_count(&self) -> usize {
        self.cleanups.len()
    }

    pub fn is_released(&self) -> bool {
        self.released
    }

    pub fn release(&mut self) {
        self.released = true;
        self.cleanups.clear();
    }

    pub fn run_cleanup(&mut self) -> Vec<CleanupResult> {
        if self.released {
            return Vec::new();
        }

        let mut results = Vec::new();

        while let Some(mut entry) = self.cleanups.pop() {
            match (entry.action)() {
                Ok(()) => results.push(CleanupResult {
                    label: entry.label,
                    succeeded: true,
                    error: None,
                }),
                Err(error) => results.push(CleanupResult {
                    label: entry.label,
                    succeeded: false,
                    error: Some(error),
                }),
            }
        }

        self.released = true;
        results
    }
}

impl fmt::Debug for ResourceScope {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("ResourceScope")
            .field("label", &self.label)
            .field("released", &self.released)
            .field("cleanup_count", &self.cleanups.len())
            .finish()
    }
}

impl Default for ResourceScope {
    fn default() -> Self {
        Self::new("unnamed-scope")
    }
}

impl Drop for ResourceScope {
    fn drop(&mut self) {
        let _ = self.run_cleanup();
    }
}
