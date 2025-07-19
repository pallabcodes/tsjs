"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTUI = startTUI;
const blessed_1 = __importDefault(require("blessed"));
function startTUI(scheduler) {
    const screen = blessed_1.default.screen({ smartCSR: true });
    screen.title = 'super-cron TUI';
    const box = blessed_1.default.box({
        top: 'center',
        left: 'center',
        width: '90%',
        height: '90%',
        content: '',
        tags: true,
        border: { type: 'line' },
        style: { border: { fg: 'cyan' } }
    });
    screen.append(box);
    screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
    const refresh = () => {
        const now = Date.now();
        const lines = scheduler.all()
            .sort((a, b) => a.runAt - b.runAt)
            .map(task => {
            const eta = Math.max(0, task.runAt - now);
            return `🔸 ${task.id} (${task.taskType}) - ETA: ${Math.floor(eta / 1000)}s`;
        });
        box.setContent(lines.join('\n'));
        screen.render();
    };
    refresh();
    setInterval(refresh, 1000);
}
//# sourceMappingURL=tui.js.map