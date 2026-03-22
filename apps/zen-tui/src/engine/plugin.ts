/**
 * Zen-TUI: Sovereign Transformer (Bun Plugin)
 * 
 * Orchestrates the industrial-grade transformation of SolidJS JSX
 * directly into our sovereign ZenEngine reconciler.
 */

// @ts-ignore
import { transformAsync } from "@babel/core";
import fs from 'fs';
// @ts-ignore
import ts from "@babel/preset-typescript";
// @ts-ignore
import solid from "babel-preset-solid";
import { plugin } from "bun";

export function createZenTransformer() {
  plugin({
    name: "zen-transformer",
    setup(build) {
      // 1. Intercept all TSX/JSX files
      build.onLoad({ filter: /\.[t|j]sx$/ }, async (args) => {
        import('fs').then(fs => fs.appendFileSync('zen-verify.log', `[PLUGIN] Intercepted: ${args.path}\n`));
        const file = Bun.file(args.path);
        const code = await file.text();

        // 3. Transform using Babel + Solid Universal Preset
        const result = await transformAsync(code, {
          filename: args.path,
          presets: [
            [
              solid,
              {
                moduleName: "/Users/picon/Learning/knowledge/tsjs/apps/zen-tui/src/engine/reconciler.ts",
                generate: "universal",
              },
            ],
            [ts],
          ],
        });

        return {
          contents: result?.code ?? "",
          loader: "js",
        };
      });
    },
  });
}

// Auto-register if requested
if (process.env.ZEN_REGISTER_TRANSFORMER) {
  createZenTransformer();
}
