use std::{
    collections::HashMap,
    io,
    process::{Child, Command, ExitStatus},
    time::SystemTime,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct ProcessId(u64);

impl ProcessId {
    pub fn value(self) -> u64 {
        self.0
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ProcessSpec {
    pub program: String,
    pub args: Vec<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ProcessState {
    Registered,
    Running,
    Exited { success: bool, code: Option<i32> },
    Cancelled,
    FailedToStart,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ProcessSnapshot {
    pub id: ProcessId,
    pub spec: ProcessSpec,
    pub state: ProcessState,
    pub started_at: SystemTime,
}

#[derive(Debug)]
struct ProcessRecord {
    snapshot: ProcessSnapshot,
    child: Option<Child>,
}

// Track native child processes in one place so features can share consistent start, poll, cancel, and snapshot behavior.
#[derive(Debug, Default)]
pub struct ProcessSupervisor {
    next_id: u64,
    records: HashMap<ProcessId, ProcessRecord>,
}

impl ProcessSupervisor {
    pub fn register(&mut self, spec: ProcessSpec) -> ProcessId {
        self.next_id += 1;
        let id = ProcessId(self.next_id);

        self.records.insert(
            id,
            ProcessRecord {
                snapshot: ProcessSnapshot {
                    id,
                    spec,
                    state: ProcessState::Registered,
                    started_at: SystemTime::now(),
                },
                child: None,
            },
        );

        id
    }

    pub fn spawn(&mut self, spec: ProcessSpec) -> io::Result<ProcessId> {
        let id = self.register(spec.clone());
        let mut command = Command::new(&spec.program);
        command.args(&spec.args);

        match command.spawn() {
            Ok(child) => {
                if let Some(record) = self.records.get_mut(&id) {
                    record.snapshot.state = ProcessState::Running;
                    record.child = Some(child);
                }
                Ok(id)
            }
            Err(error) => {
                if let Some(record) = self.records.get_mut(&id) {
                    record.snapshot.state = ProcessState::FailedToStart;
                }
                Err(error)
            }
        }
    }

    pub fn poll(&mut self, id: ProcessId) -> io::Result<Option<ProcessState>> {
        let Some(record) = self.records.get_mut(&id) else {
            return Ok(None);
        };

        let Some(child) = record.child.as_mut() else {
            return Ok(Some(record.snapshot.state));
        };

        let status = child.try_wait()?;
        if let Some(status) = status {
            record.snapshot.state = exit_status_to_state(status);
            record.child = None;
        }

        Ok(Some(record.snapshot.state))
    }

    pub fn cancel(&mut self, id: ProcessId) -> io::Result<bool> {
        let Some(record) = self.records.get_mut(&id) else {
            return Ok(false);
        };

        let Some(child) = record.child.as_mut() else {
            return Ok(false);
        };

        child.kill()?;
        let _ = child.wait()?;
        record.snapshot.state = ProcessState::Cancelled;
        record.child = None;
        Ok(true)
    }

    pub fn snapshot(&self, id: ProcessId) -> Option<ProcessSnapshot> {
        self.records.get(&id).map(|record| record.snapshot.clone())
    }

    pub fn snapshots(&self) -> Vec<ProcessSnapshot> {
        self.records
            .values()
            .map(|record| record.snapshot.clone())
            .collect()
    }

    pub fn remove(&mut self, id: ProcessId) -> Option<ProcessSnapshot> {
        self.records.remove(&id).map(|record| record.snapshot)
    }

    pub fn running_count(&self) -> usize {
        self.records
            .values()
            .filter(|record| matches!(record.snapshot.state, ProcessState::Running))
            .count()
    }
}

fn exit_status_to_state(status: ExitStatus) -> ProcessState {
    ProcessState::Exited {
        success: status.success(),
        code: status.code(),
    }
}
