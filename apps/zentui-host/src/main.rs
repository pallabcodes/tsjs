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

/**
 * 🧱 Triple-Buffer TrueColor Expansion
 */
struct PackProtocol;
impl PackProtocol {
    fn get_color(rgb: u32) -> Option<Color> {
        if rgb == 0xFF000000 { return None; }
        let r = ((rgb >> 16) & 0xFF) as u8;
        let g = ((rgb >> 8) & 0xFF) as u8;
        let b = (rgb & 0xFF) as u8;
        Some(Color::Rgb { r, g, b })
    }
}

struct HostState {
    width: u16, height: u16,
    back_content: Vec<u32>,
    back_fg: Vec<u32>,
    back_bg: Vec<u32>,
    backend: CrosstermBackend,
    git: NativeGit,
}

impl HostState {
    fn init() -> Self {
        log_diagnostic("Seizing Hardware TTY...");
        let mut backend = CrosstermBackend::new();
        let _ = backend.enableRawMode();
        let _ = backend.enterAlternateScreen();
        let _ = backend.clearScrollback();
        let _ = backend.hideCursor();
        
        // 🧱 IGNITION FLOOD: Eliminate the white flash by seating Slate Blue (#0F172A) immediately
        let slate = Color::Rgb { r: 15, g: 23, b: 42 };
        let _ = backend.clearWith(slate);
        let _ = backend.flush();

        let mut size = backend.getSize();
        while size.0 == 0 || size.1 == 0 { std::thread::sleep(Duration::from_millis(10)); size = backend.getSize(); }
        
        let area = (size.0 as usize) * (size.1 as usize);
        Self {
            width: size.0, height: size.1,
            back_content: vec![0; area],
            back_fg: vec![0; area],
            back_bg: vec![0; area],
            backend,
            git: NativeGit::new(".").expect("Git project not detected"),
        }
    }

    fn render_frame(&mut self, content: &[u32], fg: &[u32], bg: &[u32]) {
        let expected_len = (self.width as usize) * (self.height as usize);
        if content.len() != expected_len || fg.len() != expected_len || bg.len() != expected_len { return; }

        for i in 0..expected_len {
            let nc = content[i];
            let nfg = fg[i];
            let nbg = bg[i];
            
            if nc != self.back_content[i] || nfg != self.back_fg[i] || nbg != self.back_bg[i] {
                let x = (i % self.width as usize) as u16;
                let y = (i / self.width as usize) as u16;
                
                let c = std::char::from_u32(nc & 0x1FFFFF).unwrap_or(' ');
                let bold = (nc >> 31) & 1 == 1;
                let fg_color = PackProtocol::get_color(nfg);
                let bg_color = PackProtocol::get_color(nbg);

                let _ = self.backend.moveTo(x, y);
                let _ = self.backend.printStyled(c, fg_color, bg_color, bold);
                
                // 🧱 MANUAL CURSOR RESET: If this is the last cell, immediately move the cursor back
                // to prevent terminal auto-scrolling while ensuring full visual paint.
                if x == self.width - 1 && y == self.height - 1 {
                    let _ = self.backend.moveTo(x, y);
                }

                self.back_content[i] = nc;
                self.back_fg[i] = nfg;
                self.back_bg[i] = nbg;
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
            let total_cells = bytes.len() / 12;
            let expected_cells = (h.width as usize) * (h.height as usize);
            if total_cells != expected_cells { return; }

            let ptr = bytes.as_ptr() as *const u32;
            unsafe {
                let content = std::slice::from_raw_parts(ptr, total_cells);
                let fg = std::slice::from_raw_parts(ptr.add(total_cells), total_cells);
                let bg = std::slice::from_raw_parts(ptr.add(total_cells * 2), total_cells);
                h.render_frame(content, fg, bg);
            }
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
                    if let Some(h_state) = guard.as_mut() { 
                        h_state.width = w; h_state.height = h; 
                        let area = (w as usize) * (h as usize);
                        h_state.back_content = vec![0; area];
                        h_state.back_fg = vec![0; area];
                        h_state.back_bg = vec![0; area];
                    }
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
        return serde_json::to_string(&commits).unwrap_or_default();
    } 
    String::new() 
}

fn get_diff(hash: String) -> String { 
    let guard = lock_host(); 
    if let Some(h) = guard.as_ref() { 
        return h.git.get_diff(&hash).unwrap_or_default();
    } 
    String::new() 
}

fn get_status() -> String { 
    let guard = lock_host(); 
    if let Some(h) = guard.as_ref() { 
        let files = h.git.get_status().unwrap_or_default(); 
        return serde_json::to_string(&files).unwrap_or_default();
    } 
    String::new() 
}
fn get_branches() -> String { let guard = lock_host(); if let Some(h) = guard.as_ref() { let branches = h.git.get_branches().unwrap_or_default(); return serde_json::to_string(&branches).unwrap_or_default(); } String::new() }

fn exit_safely() { if let Ok(mut guard) = HOST.lock() { if let Some(h) = guard.as_mut() { let _ = h.backend.showCursor(); let _ = h.backend.leaveAlternateScreen(); let _ = h.backend.disableRawMode(); } } }
fn exit() { exit_safely(); std::process::exit(0); }

fn main() {
    std::panic::set_hook(Box::new(|info| { log_diagnostic(&format!("NATIVE PANIC: {:?}", info)); exit_safely(); }));

    let rt = Runtime::new().unwrap(); 
    rt.set_max_stack_size(256 * 1024);
    rt.set_memory_limit(256 * 1024 * 1024); 
    
    let ctx = Context::full(&rt).unwrap();
    let bundle_path = std::env::args().nth(1).expect("Missing bundle path.");
    let source = fs::read_to_string(&bundle_path).expect("Failed to read bundle.");

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
        
        let _res: Result<(), rquickjs::Error> = ctx.eval(source);
    });

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
                let _ = tick.call::<_, ()>(());
            }
            if let Some(json) = poll_input() { if let Ok(cb) = globals.get::<_, rquickjs::Function>("__ZENTUI_INPUT_CALLBACK") { let _ = cb.call::<_, ()>((json,)); } }
            std::thread::sleep(Duration::from_millis(16));
        });
    }
}
