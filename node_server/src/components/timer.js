export class Timer {
    constructor(task, interval) {
        this.task = task;
        this.interval = interval;
        this.timerHandle = null;
    }

    start(timerHandle = this.interval) {
        if (this.timerHandle) {
            clearInterval(this.timerHandle);
        }
        this.timerHandle = setInterval(this.task, timerHandle);
    }

    // Stop the timer
    stop() {
        if (this.timerHandle) {
            clearInterval(this.timerHandle);
            this.timerHandle = null;
        }
    }

    updateInterval(newInterval) {
        this.interval = newInterval;
        this.start();
    }
}
