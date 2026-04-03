use rquickjs::{Context, Runtime, class::Trace};
use std::fs;
use std::sync::{Arc, Mutex};
use crossterm::event::{self, Event, KeyCode, KeyModifiers};
use std::time::Duration;

#[path = "../../../packages/zen-tui-native/native/src/buffer.rs"]
pub mod buffer;
#[path = "../../../packages/zen-tui-native/native/src/backend.rs"]
pub mod backend;
#[path = "../../../packages/zen-tui-native/native/src/renderer.rs"]
pub mod renderer;
#[path = "../../../packages/zen-tui-native/native/src/git.rs"]
pub mod git;

use buffer::{Buffer, Cell};
use backend::{CrosstermBackend, TerminalBackend};
use renderer::Renderer;
use git::NativeGit;

fn parse_color(c: &str) -> u8 {
    match c.to_lowercase().as_str() {
        "black" => 0,
        "red" => 1,
        "green" => 2,
        "yellow" => 3,
        "blue" => 4,
        "magenta" => 5,
        "cyan" => 6,
        "white" => 7,
        "grey" | "gray" => 8,
        _ => 0,
    }
}

// Global Host State
struct HostState {
    buffer: Buffer,
    renderer: Renderer<CrosstermBackend>,
    backend: CrosstermBackend,
    git: NativeGit,
}

impl HostState {
    fn new() -> Self {
        let mut backend = CrosstermBackend::new();
        backend.enableRawMode().unwrap();
        backend.hideCursor().unwrap();
        backend.clear().unwrap();
        let (w, h) = backend.getSize();

        Self {
            buffer: Buffer::new(w, h),
            renderer: Renderer::new(CrosstermBackend::new()),
            backend,
            git: NativeGit::new(".").unwrap(),
        }
    }
}

// We use a global mutex for QuickJS to easily call it, 
// since rquickjs classes require some boilerplate we want to avoid for this prototype.
lazy_static::lazy_static! {
    static ref HOST: Arc<Mutex<HostState>> = Arc::new(Mutex::new(HostState::new()));
}

fn set_cell(x: u16, y: u16, content: String, fg: Option<String>, bg: Option<String>, bold: Option<bool>) {
    let mut host = HOST.lock().unwrap();
    if x >= host.buffer.width || y >= host.buffer.height { return; }
    let char_content = content.chars().next().unwrap_or(' ');
    let fg_idx = fg.map(|c| parse_color(&c)).unwrap_or(0);
    let bg_idx = bg.map(|c| parse_color(&c)).unwrap_or(0);
    
    host.buffer.setCell(x, y, Cell::new(
        char_content,
        fg_idx,
        bg_idx,
        bold.unwrap_or(false),
    ));
}

fn flush() {
    let mut host = HOST.lock().unwrap();
    let buf = host.buffer.clone();
    host.renderer.render(&buf).unwrap();
}

fn get_size() -> Vec<u16> {
    let host = HOST.lock().unwrap();
    vec![host.buffer.width, host.buffer.height]
}

fn poll_input() -> Option<String> {
    if event::poll(Duration::from_millis(50)).unwrap_or(false) {
        if let Ok(ev) = event::read() {
            match ev {
                Event::Key(key) => {
                    let name = match key.code {
                        KeyCode::Char(c) => c.to_string(),
                        KeyCode::Esc => "escape".to_string(),
                        KeyCode::Enter => "return".to_string(),
                        KeyCode::Backspace => "backspace".to_string(),
                        KeyCode::Up => "up".to_string(),
                        KeyCode::Down => "down".to_string(),
                        KeyCode::Left => "left".to_string(),
                        KeyCode::Right => "right".to_string(),
                        _ => "unknown".to_string(),
                    };
                    let ctrl = key.modifiers.contains(KeyModifiers::CONTROL);
                    let alt = key.modifiers.contains(KeyModifiers::ALT);
                    let shift = key.modifiers.contains(KeyModifiers::SHIFT);
                    return Some(format!("{{\"name\": \"{}\", \"ctrl\": {}, \"alt\": {}, \"shift\": {}}}", name, ctrl, alt, shift));
                }
                Event::Resize(w, h) => {
                    let mut host = HOST.lock().unwrap();
                    host.buffer.resize(w, h);
                    return Some(format!("{{\"name\": \"resize\", \"width\": {}, \"height\": {}}}", w, h));
                }
                _ => return None,
            }
        }
    }
    None
}

fn get_log(limit: u32) -> String {
    let host = HOST.lock().unwrap();
    let commits = host.git.get_log(limit as usize).unwrap_or_default();
    serde_json::to_string(&commits).unwrap_or_default()
}

fn get_diff(hash: String) -> String {
    let host = HOST.lock().unwrap();
    host.git.get_diff(&hash).unwrap_or_default()
}

fn get_status() -> String {
    let host = HOST.lock().unwrap();
    let files = host.git.get_status().unwrap_or_default();
    serde_json::to_string(&files).unwrap_or_default()
}

fn get_branches() -> String {
    let host = HOST.lock().unwrap();
    let branches = host.git.get_branches().unwrap_or_default();
    serde_json::to_string(&branches).unwrap_or_default()
}

fn exit() {
    let mut host = HOST.lock().unwrap();
    host.backend.showCursor().unwrap();
    host.backend.disableRawMode().unwrap();
    std::process::exit(0);
}

fn main() {
    let rt = Runtime::new().unwrap();
    let ctx = Context::full(&rt).unwrap();

    let bundle_path = std::env::args().nth(1).expect("[ZentuiHost] Missing JS bundle path argument.");
    let source = fs::read_to_string(&bundle_path).expect("[ZentuiHost] Failed to read JS bundle.");

    ctx.with(|ctx| {
        let globals = ctx.globals();
        
        // Expose Native ZenHost API
        let host_obj = rquickjs::Object::new(ctx.clone()).unwrap();
        
        host_obj.set("setCell", rquickjs::Function::new(ctx.clone(), set_cell)).unwrap();
        host_obj.set("flush", rquickjs::Function::new(ctx.clone(), flush)).unwrap();
        host_obj.set("getSize", rquickjs::Function::new(ctx.clone(), get_size)).unwrap();
        host_obj.set("pollInput", rquickjs::Function::new(ctx.clone(), poll_input)).unwrap();
        host_obj.set("getLog", rquickjs::Function::new(ctx.clone(), get_log)).unwrap();
        host_obj.set("getDiff", rquickjs::Function::new(ctx.clone(), get_diff)).unwrap();
        host_obj.set("getStatus", rquickjs::Function::new(ctx.clone(), get_status)).unwrap();
        host_obj.set("getBranches", rquickjs::Function::new(ctx.clone(), get_branches)).unwrap();
        host_obj.set("exit", rquickjs::Function::new(ctx.clone(), exit)).unwrap();

        globals.set("__ZEN_HOST__", host_obj).unwrap();

        // Evaluate the JS Bundle
        let _res: Result<(), rquickjs::Error> = ctx.eval(source);
        if let Err(e) = _res {
            let exc_msg = if let rquickjs::Error::Exception = e {
                let exc = ctx.catch();
                if let Some(exc_obj) = exc.into_exception() {
                    format!("Exception: {}\nStack: {}", exc_obj.message().unwrap_or_default(), exc_obj.stack().unwrap_or_default())
                } else {
                    "Unknown Exception".to_string()
                }
            } else {
                e.to_string()
            };

            let mut host = HOST.lock().unwrap();
            host.backend.showCursor().unwrap();
            host.backend.disableRawMode().unwrap();
            drop(host);
            eprintln!("JS Execution Error: {}", exc_msg);
            std::process::exit(1);
        }
    });

    // Sovereign Event Loop
    loop {
        ctx.with(|ctx| {
            let globals = ctx.globals();
            // Pulse the JavaScript engine timers
            if let Ok(tick) = globals.get::<_, rquickjs::Function>("__ZENTUI_TICK") {
                let _ = tick.call::<_, ()>(());
            }

            // Check for native input
            if let Some(json) = poll_input() {
                if let Ok(callback) = globals.get::<_, rquickjs::Function>("__ZENTUI_INPUT_CALLBACK") {
                    let _ = callback.call::<_, ()>((json,));
                }
            } else {
                std::thread::sleep(Duration::from_millis(10));
            }
        });
    }
}
