use rquickjs::{Context, Runtime, ArrayBuffer, Ctx};
use std::fs;
use std::sync::{Arc, Mutex};
use crossterm::event::{self, Event, KeyCode, KeyModifiers};
use crossterm::style::Color;
use std::time::Duration;
use std::io::Write;

#[path = "../../../packages/zen-tui-native/native/src/buffer.rs"]
pub mod buffer;
#[path = "../../../packages/zen-tui-native/native/src/backend.rs"]
pub mod backend;
#[path = "../../../packages/zen-tui-native/native/src/renderer.rs"]
pub mod renderer;
#[path = "../../../packages/zen-tui-native/native/src/git.rs"]
pub mod git;

use backend::{CrosstermBackend, TerminalBackend};
use git::NativeGit;

fn log_diagnostic(msg: &str) {
    if let Ok(mut f) = fs::OpenOptions::new().append(true).create(true).open("zentui.log") {
        let _ = writeln!(f, "[DIAG] {}", msg);
    }
}

struct PackProtocol;
impl PackProtocol {
    fn unpack(packed: u32) -> (char, Option<Color>, Option<Color>, bool, bool, bool) {
        let unicode = packed & 0x1FFFFF;
        let fg_idx = ((packed >> 21) & 0xF) as u8;
        let bg_idx = ((packed >> 25) & 0xF) as u8;
        let attr = (packed >> 29) & 0x7;
        let c = std::char::from_u32(unicode).unwrap_or(' ');
        let fg = Self::get_color(fg_idx);
        let bg = Self::get_color(bg_idx);
        let bold = (attr & 1) != 0;
        let dim = (attr & 2) != 0;
        let underline = (attr & 4) != 0;
        (c, fg, bg, bold, dim, underline)
    }

    fn get_color(idx: u8) -> Option<Color> {
        match idx {
            0 => Some(Color::Black), 1 => Some(Color::Red), 2 => Some(Color::Green), 3 => Some(Color::Yellow),
            4 => Some(Color::Blue), 5 => Some(Color::Magenta), 6 => Some(Color::Cyan), 7 => Some(Color::White),
            8 => Some(Color::Grey), 9 => Some(Color::DarkGrey), 10 => Some(Color::DarkRed), 11 => Some(Color::DarkGreen),
            12 => Some(Color::DarkYellow), 13 => Some(Color::DarkBlue), 14 => Some(Color::DarkMagenta), 15 => Some(Color::DarkCyan),
            _ => None,
        }
    }
}

struct HostState {
    width: u16, height: u16,
    back_buffer: Vec<u32>,
    backend: CrosstermBackend,
    git: NativeGit,
}

impl HostState {
    fn init() -> Self {
        log_diagnostic("Seizing Hardware TTY...");
        let mut backend = CrosstermBackend::new();
        if let Err(e) = backend.enableRawMode() { log_diagnostic(&format!("ERR: EnableRawMode: {}", e)); }
        if let Err(e) = backend.enterAlternateScreen() { log_diagnostic(&format!("ERR: EnterAlternateScreen: {}", e)); }
        if let Err(e) = backend.clearScrollback() { log_diagnostic(&format!("ERR: ClearScrollback: {}", e)); }
        if let Err(e) = backend.hideCursor() { log_diagnostic(&format!("ERR: HideCursor: {}", e)); }
        if let Err(e) = backend.flush() { log_diagnostic(&format!("ERR: Flush: {}", e)); }
        let mut size = backend.getSize();
        while size.0 == 0 || size.1 == 0 { std::thread::sleep(Duration::from_millis(10)); size = backend.getSize(); }
        
        log_diagnostic(&format!("TTY Geometry: {}x{}", size.0, size.1));
        Self {
            width: size.0, height: size.1,
            back_buffer: vec![0; (size.0 as usize) * (size.1 as usize)],
            backend,
            git: NativeGit::new(".").expect("Git project not detected"),
        }
    }

    fn render_frame(&mut self, new_buffer: &[u32]) {
        let expected_len = (self.width as usize) * (self.height as usize);
        if new_buffer.len() != expected_len { return; }
        if new_buffer.len() != self.back_buffer.len() {
            let _ = self.backend.clear();
            self.back_buffer = vec![0; expected_len];
        }

        for (i, &cell) in new_buffer.iter().enumerate() {
            if cell != self.back_buffer[i] {
                let x = (i % self.width as usize) as u16;
                let y = (i / self.width as usize) as u16;
                if x == self.width - 1 && y == self.height - 1 { continue; }
                let (c, fg, bg, bold, _, _) = PackProtocol::unpack(cell);
                let _ = self.backend.moveTo(x, y);
                let _ = self.backend.printStyled(c, fg, bg, bold);
                self.back_buffer[i] = cell;
            }
        }
        let _ = self.backend.flush();
    }
}

lazy_static::lazy_static! { static ref HOST: Arc<Mutex<Option<HostState>>> = Arc::new(Mutex::new(None)); }

fn lock_host() -> std::sync::MutexGuard<'static, Option<HostState>> {
    HOST.lock().expect("Host Mutex Poisoned")
}

fn commit_frame(_ctx: Ctx<'_>, buf: ArrayBuffer<'_>) {
    let mut guard = lock_host();
    if let Some(h) = guard.as_mut() {
        if let Some(bytes) = buf.as_bytes() {
            if bytes.as_ptr() as usize % 4 != 0 { return; }
            let u32_ptr = bytes.as_ptr() as *const u32;
            let u32_len = bytes.len() / 4;
            let new_frame = unsafe { std::slice::from_raw_parts(u32_ptr, u32_len) };
            h.render_frame(new_frame);
        }
    }
}

fn get_size() -> Vec<u16> { let guard = lock_host(); match guard.as_ref() { Some(h) => vec![h.width, h.height], None => vec![0, 0] } }

fn poll_input() -> Option<String> {
    if event::poll(Duration::from_millis(5)).unwrap_or(false) {
        if let Ok(ev) = event::read() {
            match ev {
                Event::Resize(w, h) => {
                    let mut guard = lock_host();
                    if let Some(h_state) = guard.as_mut() { h_state.width = w; h_state.height = h; }
                    return Some(format!("{{\"name\": \"resize\", \"width\": {}, \"height\": {}}}", w, h));
                },
                Event::Key(key) => {
                    let name = match key.code {
                        KeyCode::Char(c) => c.to_string(), KeyCode::Esc => "escape".to_string(), KeyCode::Enter => "return".to_string(),
                        KeyCode::Backspace => "backspace".to_string(), KeyCode::Up => "up".to_string(), KeyCode::Down => "down".to_string(),
                        KeyCode::Left => "left".to_string(), KeyCode::Right => "right".to_string(), _ => "unknown".to_string(),
                    };
                    return Some(format!("{{\"name\": \"{}\", \"ctrl\": {}, \"alt\": {}, \"shift\": {}}}", name, key.modifiers.contains(KeyModifiers::CONTROL), key.modifiers.contains(KeyModifiers::ALT), key.modifiers.contains(KeyModifiers::SHIFT)));
                }
                _ => return None,
            }
        }
    }
    None
}

fn get_log(limit: u32) -> String { 
    let guard = lock_host(); 
    if let Some(h) = guard.as_ref() { 
        let commits = h.git.get_log(limit as usize).unwrap_or_default(); 
        let json = serde_json::to_string(&commits).unwrap_or_default();
        log_diagnostic(&format!("JSON LOG: {}", json));
        return json;
    } 
    String::new() 
}

fn get_diff(hash: String) -> String { 
    let guard = lock_host(); 
    if let Some(h) = guard.as_ref() { 
        let diff = h.git.get_diff(&hash).unwrap_or_default();
        log_diagnostic(&format!("DIFF TRACE [{}]: {} chars", hash, diff.len()));
        return diff;
    } 
    String::new() 
}

fn get_status() -> String { 
    let guard = lock_host(); 
    if let Some(h) = guard.as_ref() { 
        let files = h.git.get_status().unwrap_or_default(); 
        let json = serde_json::to_string(&files).unwrap_or_default();
        log_diagnostic(&format!("JSON STATUS: {}", json));
        return json;
    } 
    String::new() 
}
fn get_branches() -> String { let guard = lock_host(); if let Some(h) = guard.as_ref() { let branches = h.git.get_branches().unwrap_or_default(); return serde_json::to_string(&branches).unwrap_or_default(); } String::new() }

fn exit_safely() { if let Ok(mut guard) = HOST.lock() { if let Some(h) = guard.as_mut() { let _ = h.backend.showCursor(); let _ = h.backend.leaveAlternateScreen(); let _ = h.backend.disableRawMode(); } } }
fn exit() { exit_safely(); std::process::exit(0); }

fn main() {
    // 🧱 IGNITION PULSE: Definitively prove existence before hardware seizure
    log_diagnostic("ZenTUI Engine Pulse: Ignition Start.");
    
    std::panic::set_hook(Box::new(|info| {
        log_diagnostic(&format!("NATIVE PANIC: {:?}", info));
        exit_safely();
    }));

    let rt = Runtime::new().unwrap(); 
    rt.set_max_stack_size(256 * 1024); // 🧱 macOS SIGKILL Guard: Reduced stack footprint
    rt.set_memory_limit(256 * 1024 * 1024); 
    
    let ctx = Context::full(&rt).unwrap();
    let bundle_path = std::env::args().nth(1).expect("Missing bundle path.");
    let source = fs::read_to_string(&bundle_path).expect("Failed to read bundle.");

    log_diagnostic("Runtime Stabilized. Initializing Host State...");
    let host_state = HostState::init();
    {
        let mut guard = HOST.lock().unwrap();
        *guard = Some(host_state);
    }

    ctx.with(|ctx| {
        let globals = ctx.globals();
        let host_obj = rquickjs::Object::new(ctx.clone()).unwrap();
        host_obj.set("commitFrame", rquickjs::Function::new(ctx.clone(), commit_frame)).unwrap();
        host_obj.set("getSize", rquickjs::Function::new(ctx.clone(), get_size)).unwrap();
        host_obj.set("pollInput", rquickjs::Function::new(ctx.clone(), poll_input)).unwrap();
        host_obj.set("getLog", rquickjs::Function::new(ctx.clone(), get_log)).unwrap();
        host_obj.set("getDiff", rquickjs::Function::new(ctx.clone(), get_diff)).unwrap();
        host_obj.set("getStatus", rquickjs::Function::new(ctx.clone(), get_status)).unwrap();
        host_obj.set("getBranches", rquickjs::Function::new(ctx.clone(), get_branches)).unwrap();
        host_obj.set("exit", rquickjs::Function::new(ctx.clone(), exit)).unwrap();
        globals.set("__ZEN_HOST__", host_obj).unwrap();
        
        log_diagnostic("Evaluating Bundle...");
        let _res: Result<(), rquickjs::Error> = ctx.eval(source);
        if let Err(e) = _res {
            let mut msg = e.to_string();
            if let rquickjs::Error::Exception = e {
                let exc = ctx.catch();
                if let Some(obj) = exc.into_exception() {
                    msg = format!("JS Exception: {}\nStack: {}", obj.message().unwrap_or_default(), obj.stack().unwrap_or_default());
                }
            }
            log_diagnostic(&format!("CRITICAL JS ERROR: {}", msg));
            exit_safely();
            std::process::exit(1);
        }
    });

    log_diagnostic("Ignition Success. Entering Render Loop.");
    let mut first_tick = true;
    loop {
        ctx.with(|ctx| {
            let globals = ctx.globals();
            if first_tick {
                let (w, h) = { let guard = lock_host(); match guard.as_ref() { Some(h_state) => (h_state.width, h_state.height), None => (0, 0) } };
                if let Ok(cb) = globals.get::<_, rquickjs::Function>("__ZENTUI_INPUT_CALLBACK") {
                    let json = serde_json::json!({ "name": "resize", "width": w, "height": h }).to_string();
                    let _ = cb.call::<_, ()>((json,));
                }
                first_tick = false;
            }
            if let Ok(tick) = globals.get::<_, rquickjs::Function>("__ZENTUI_TICK") {
                if let Err(e) = tick.call::<_, ()>(()) {
                    log_diagnostic(&format!("RUNTIME TICK ERROR: {:?}", e));
                }
            }
            if let Some(json) = poll_input() { if let Ok(cb) = globals.get::<_, rquickjs::Function>("__ZENTUI_INPUT_CALLBACK") { let _ = cb.call::<_, ()>((json,)); } }
            std::thread::sleep(Duration::from_millis(16));
        });
    }
}
