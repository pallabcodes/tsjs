/**
 * Zen-TUI: Sovereign Transformer (Bun Plugin)
 * 
 * Orchestrates the industrial-grade transformation of SolidJS JSX
 * directly into our sovereign ZenEngine reconciler.
 */

import { transformAsync } from "@babel/core";
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
        const file = Bun.file(args.path);
        const code = await file.text();

        // 2. Transform using Babel + Solid Universal Preset
        const result = await transformAsync(code, {
          filename: args.path,
          presets: [
            [
              solid,
              {
                moduleName: "zen-reconciler", // This points to our reconciler export
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

      // 2. Intercept SolidJS to prevent Server/Web condition leaks
      build.onLoad({ filter: /solid-js\/web\/dist\/server\.js$/ }, async (args) => {
          // Force Solid to use its core reactive logic, bypassing the 'notSup' server guards
          const path = args.path.replace("server.js", "solid.js");
          const code = await Bun.file(path).text();
          return { contents: code, loader: "js" };
      });
    },
  });
}

// Auto-register if requested
if (process.env.ZEN_REGISTER_TRANSFORMER) {
  createZenTransformer();
}
