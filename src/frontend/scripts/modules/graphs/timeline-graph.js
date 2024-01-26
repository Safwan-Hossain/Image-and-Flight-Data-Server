import { DEFAULT_TIMELINE_GRAPH_CONFIG } from "./-default-graph-config.js";

export class TimelineGraph {
    constructor(canvasId, customConfig = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas with id "${canvasId}" not found.`);
        }

        this.DATA_POINT_LIFETIME = 10; // in seconds
        this.DATA_POINT_INTERVAL = 0.1;
        this.INITIAL_DATA_POINTS = this.DATA_POINT_LIFETIME / this.DATA_POINT_INTERVAL;

        const ctx = this.canvas.getContext('2d');
        this.chart = new Chart(ctx, { ...DEFAULT_TIMELINE_GRAPH_CONFIG, ...customConfig });
        this.startTime = Date.now();
        this.shouldDisplayUpdate = true;
        this.populateInitialData();
    }

    populateInitialData() {
        const initialData = Array.from({ length: this.INITIAL_DATA_POINTS }, (_, i) => ({
            x: (-1) * i * this.DATA_POINT_INTERVAL,
            y: 0,
        }));
        
        this.chart.data.datasets[0].data = initialData;
        this.chart.update();
    }

    resumeUpdates() {
        this.shouldDisplayUpdate = true;
    }

    pauseUpdates() {
        this.shouldDisplayUpdate = false;
    }

    updateGraph(updateValue, timestamp = Date.now()) {
        const elapsedTime = (timestamp - this.startTime) / 1000;
        this.addNewDataPoint(elapsedTime, updateValue);
        this.removeOldDataPoints(elapsedTime);
        this.displayUpdate();
    }

    displayUpdate() {
        if (this.shouldDisplayUpdate) {
            this.chart.update();
        }
    }

    addNewDataPoint(x, y) {
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data.push({ x, y });
        });
    }

    removeOldDataPoints(elapsedTime) {
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data = dataset.data.filter(point => point.x > elapsedTime - this.DATA_POINT_LIFETIME);
        });
    }
}
