import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

/**
 * Sovereign Bridge: Clean ESM Native Loading.
 * Hides the patchwork from the core business logic.
 */
export const loadNativeModule = (name: string) => {
  const binaryPath = path.join(__dirname, '..', 'native', `${name}.node`);
  return require(binaryPath);
};
