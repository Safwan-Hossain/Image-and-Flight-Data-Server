export const LogLevel = Object.freeze({
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
});

export class ConsoleLogger {
    constructor(consoleElementId, maxLines = 100) {
        this.consoleElement = document.getElementById(consoleElementId);
        this.maxLines = maxLines;
    }

    logMessage(level, message) {
        if (!Object.values(LogLevel).includes(level)) {
            throw new Error(`Invalid log level: ${level}`);
        }

        const atBottom = this.consoleElement.scrollHeight - this.consoleElement.scrollTop === this.consoleElement.clientHeight;

        const time = new Date().toLocaleTimeString();
        const logElement = document.createElement('div');
        logElement.className = 'log';
        logElement.innerHTML = `<span class="level ${level}">[${level.toUpperCase()}]</span><span class="time">[${time}]</span> ${message}`;
        this.consoleElement.appendChild(logElement);

        if (this.consoleElement.childElementCount > this.maxLines) {
            this.consoleElement.removeChild(this.consoleElement.firstElementChild);
        }

        if (atBottom) {
            this.consoleElement.scrollTop = this.consoleElement.scrollHeight;
        }
    }
}