const { execSync } = require('child_process');
try {
  const tput = execSync('tput lines', { stdio: [0, 'pipe', 'pipe'] }).toString().trim();
  const stty = execSync('stty size', { stdio: [0, 'pipe', 'pipe'] }).toString().trim();
  require('fs').writeFileSync('/Users/picon/Learning/knowledge/tsjs/apps/zen-tui/exec_test.log', `tput=${tput}\nstty=${stty}\n`);
} catch (e) {
  require('fs').writeFileSync('/Users/picon/Learning/knowledge/tsjs/apps/zen-tui/exec_test.log', `ERR=${e.message}\n`);
}
