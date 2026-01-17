#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Check if we're running on Windows to apply specific window customizations.
            #[cfg(target_os = "windows")]
            {
                use tauri::Manager;
                use windows::Win32::Foundation::HWND;
                use windows::Win32::Graphics::Dwm::{
                    DwmSetWindowAttribute, DWMWA_WINDOW_CORNER_PREFERENCE, DWMWCP_DONOTROUND,
                };

                // Retrieve the main window handle to interact with the Windows API directly.
                let window = app.get_webview_window("main").unwrap();
                let hwnd = window.hwnd().unwrap().0;

                unsafe {
                    // Apply a DWM (Desktop Window Manager) attribute to ensure the window has square corners,
                    // preserving the retro aesthetics by overriding the default Windows 11 rounded corners.
                    let _ = DwmSetWindowAttribute(
                        HWND(hwnd as _),
                        DWMWA_WINDOW_CORNER_PREFERENCE,
                        &DWMWCP_DONOTROUND as *const _ as *const _,
                        std::mem::size_of::<u32>() as u32,
                    );
                }
            }
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
