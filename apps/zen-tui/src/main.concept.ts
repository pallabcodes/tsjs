/**
 * Ensure there is no unused code
 * If we must have dynamic import , the fine
 * My feedback: This file/code is fine as is.
 */

import "./engine/plugin.js";
import "./engine/plugin";

// --- BOOTSTRAP ---
async function bootstrap() {
    console.log("ZEN-TUI: Sovereign Reactivity Bootstrapping...");

    // 1. Re-import reconciler and App ONLY AFTER the plugin is registered
    const { render } = await import('./engine/reconciler.ts');
    const { ZenApp } = await import('./engine/app.ts');
    const { default: App } = await import('./app/App.tsx');

    // 2. Initialize the High-Performance Zen Engine
    const zen = new ZenApp();

    // 3. Render the App Shell
    import('fs').then(fs => fs.appendFileSync('zen-verify.log', '[MAIN] App instantiating...\n'));
    render(() => {
        import('fs').then(fs => fs.appendFileSync('zen-verify.log', '[MAIN] Reactive Root Executed.\n'));
        try {
            return <App onInput={ (l: any) => zen.onInput = l } />;
        } catch (err: any) {
            import('fs').then(fs => fs.appendFileSync('zen-verify.log', `[FATAL ERROR IN RENDER] ${err.stack || err}\n`));
            return null;
        }
    }, zen.root);
}

bootstrap().catch(console.error);
