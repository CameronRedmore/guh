if (window.__TAURI__) {
  const appWindow = window.__TAURI__.window.getCurrentWindow();

  // Handle custom title bar dragging logic.
  // We manually handle 'mousedown' because the window is undecorated and we need to trigger 
  // Tauri's native window dragging when the title bar is grabbed.
  const titleBar = document.getElementById('title-bar');
  if (titleBar) {
    titleBar.addEventListener('mousedown', (e) => {
      // Don't start dragging if the user is clicking on a button (like the close button).
      if (e.target.closest('.close-button')) return;

      // Trigger dragging on left-click only.
      if (e.buttons === 1) {
        appWindow.startDragging();
      }
    });
  }


  const closeBtn = document.getElementById('close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      appWindow.close();
    });
  }


  const contextMenu = document.getElementById('context-menu');
  const guhImage = document.querySelector('.guh-image');

  /**
   * Applies the selected mode (modern or retro) to the application.
   * This involves updating CSS classes on the body and swapping the primary 'Guh' image asset.
   * The selection is persisted in localStorage for consistency across restarts.
   */
  function applyMode(mode) {
    if (mode === 'modern') {
      document.body.classList.add('modern-mode');
      if (guhImage) guhImage.src = 'assets/guh-modern.webp';
    } else {
      document.body.classList.remove('modern-mode');
      if (guhImage) guhImage.src = 'assets/guh-retro.webp';
    }
    localStorage.setItem('guh-mode', mode);
  }


  const savedMode = localStorage.getItem('guh-mode') || 'retro';
  applyMode(savedMode);


  // Custom Context Menu implementation.
  // We prevent the default browser context menu and show our custom styled one at the cursor position.
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (contextMenu) {
      contextMenu.style.display = 'flex';
      contextMenu.style.left = `${e.clientX}px`;
      contextMenu.style.top = `${e.clientY}px`;
    }
  });

  window.addEventListener('click', () => {
    if (contextMenu) contextMenu.style.display = 'none';
  });

  document.querySelectorAll('.context-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const mode = e.target.getAttribute('data-mode');
      applyMode(mode);
    });
  });

} else {
  console.error("Tauri API not found on window.__TAURI__");
  alert("Tauri API not loaded. Ensure 'withGlobalTauri' is true in tauri.conf.json");
}
