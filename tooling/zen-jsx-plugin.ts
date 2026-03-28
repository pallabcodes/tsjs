import { plugin } from "bun";
import { transformSync } from "@babel/core";

/**
 * Zen-TUI: Sovereign JSX Plugin for Bun
 * 
 * This plugin intercepts all .tsx files and transforms them using
 * SolidJS's official Universal Generator. This ensures that:
 * 1. Your code stays 100% DOM-free (no document/window usage).
 * 2. JSX tags (<Box>, <Text>) become raw functional calls to our reconciler.
 * 3. We maintain full SolidJS reactivity.
 */
plugin({
  name: "zen-solid-universal",
  setup(build) {
    build.onLoad({ filter: /\.tsx$/ }, async (args) => {
      const source = await Bun.file(args.path).text();
      
      // Auto-detect if we're transforming internal components to avoid circular resolution
      const isInternal = args.path.includes("packages\\zen-tui-solid") || args.path.includes("packages/zen-tui-solid");
      const moduleName = isInternal ? "../../src/index.js" : "@zen-tui/solid";

      const result = transformSync(source, {
        filename: args.path,
        presets: [
          ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
          ["babel-preset-solid", { 
            generate: "universal", 
            moduleName 
          }]
        ],
        sourceMaps: "inline",
      });

      return { 
        contents: result?.code || "", 
        loader: "js" 
      };
    });
  }
});
