import { execSync } from 'child_process';
import fs from 'fs';

try {
  const size = execSync('stty size', { stdio: [0, 'pipe', 'pipe'] }).toString().trim();
  const h = parseInt(size.split(' ')[0], 10) || 24;
  fs.writeFileSync('/Users/picon/Learning/knowledge/tsjs/apps/zen-tui/exec_test.log', `accurateHeight=${h}\n`);
} catch (e) {
  fs.writeFileSync('/Users/picon/Learning/knowledge/tsjs/apps/zen-tui/exec_test.log', `ERR=${e.message}\n`);
}
Submitting `write_to_file` now.
Submitting `write_to_file` n
Submitting `write_to_file` n
Submitting `write_style` m
