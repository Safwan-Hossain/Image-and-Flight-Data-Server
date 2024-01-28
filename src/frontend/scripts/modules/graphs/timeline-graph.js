import { DEFAULT_TIMELINE_GRAPH_CONFIG, DEFAULT_TIMELINE_COLORS } from "./-default-graph-config.js";


export class TimelineGraph {
    constructor(canvasId, datasetLabels, customConfig = {}) {
        this.validateCanvas(canvasId);
        this.initializeProperties(datasetLabels, customConfig);
    }

    validateCanvas(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas with id "${canvasId}" not found.`);
        }
    }

    initializeProperties(datasetLabels, customConfig) {
        this.lineColors = DEFAULT_TIMELINE_COLORS;
        this.DATA_POINT_LIFETIME = 10;
        this.DATA_POINT_INTERVAL = 0.1

        const ctx = this.canvas.getContext('2d');
        this.chart = new Chart(ctx, { ...DEFAULT_TIMELINE_GRAPH_CONFIG, ...customConfig });
        this.datasetLabels = datasetLabels;
        this.setupDatasets();
        this.populateInitialData();

        this.startTime = Date.now();
        this.lastUpdateTime = this.startTime;
        this.shouldDisplayUpdate = true;
        this.isGraphInitialized = true;
    }

    setupDatasets() {
        this.datasetLabels.forEach((label, index) => {
            this.chart.data.datasets.push(this.createDataset(label, index));
        });
    }

    createDataset(label, index) {
        const color = this.getColorForDataset(index);
        return {
            label: label,
            data: [],
            fill: false,
            borderColor: color,
            backgroundColor: color,
            tension: 0.5
        };
    }

    getColorForDataset(index) {
        return this.lineColors[index % this.lineColors.length]; // Cycle through colors
    }

    setTitle(newTitle) {
        if (this.chart && this.chart.options.plugins.title) {
            this.chart.options.plugins.title.display = true;
            this.chart.options.plugins.title.text = newTitle;
            this.chart.update();
        }
    }

    setLineColors(lineColors) {
        this.lineColors = lineColors;
    }

    setYAxisRange(min, max, stepSize) {
        this.chart.options.scales.y = {
            min: min,
            max: max,
            ticks: {
                color: '#fff', 
                stepSize: stepSize
            }
        };
        this.chart.update();
    }

    setXAxisRange(min, max, stepSize) {
            this.chart.options.scales.x.min = min;
            this.chart.options.scales.x.max = max;
            this.chart.options.scales.x.ticks.stepSize = stepSize;
    }

    populateInitialData() {
        const NUM_OF_INIT_POINTS = Math.ceil(this.DATA_POINT_LIFETIME / this.DATA_POINT_INTERVAL);
        const NUM_OF_DATASETS = this.datasetLabels.length;

        for (let i = 0; i < NUM_OF_INIT_POINTS; i++) {
            const x = -1 * this.DATA_POINT_LIFETIME + i * this.DATA_POINT_INTERVAL;
            const arrayOfZeroes = new Array(NUM_OF_DATASETS).fill(0);
            this.addMultipleDataPoints(x, arrayOfZeroes)
        }

        this.chart.update();
    }
    
    
    

    resumeUpdates() {
        this.shouldDisplayUpdate = true;
    }

    pauseUpdates() {
        this.shouldDisplayUpdate = false;
    }

    updateGraph(updateValues, timestamp = Date.now()) {
        if (!this.isGraphInitialized) return;

        updateValues = Array.isArray(updateValues) ? updateValues : [updateValues];
        const deltaTime = (timestamp - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = timestamp;

        this.shiftDataPoints(deltaTime);
        this.addMultipleDataPointsNow(updateValues);
        this.removeOldDataPoints();
        this.displayUpdate();
    }
    

    displayUpdate() {
        if (this.shouldDisplayUpdate) {
            this.chart.update();
        }
    }

    addMultipleDataPointsNow(values) {
        this.addMultipleDataPoints(0, values);
    }

    addMultipleDataPoints(time, values) {
        values.forEach((value, index) => {
            this.addSingleDataPoint(time, value, index);
        })
    }

    addSingleDataPoint(x, y, datasetIndex) {
        const dataset = this.chart.data.datasets[datasetIndex];
        if (dataset) {
            dataset.data.push({ x, y });
        }
    }

    shiftDataPoints(deltaTime) {
        this.chart.data.datasets.forEach(dataset => {
            dataset.data.forEach(point => {
                point.x = point.x - deltaTime;
            });
        });
    }

    removeOldDataPoints() {
        this.chart.data.datasets.forEach(dataset => {
            dataset.data = dataset.data.filter(point => this.isPointWithinLifetime(point)); // removes any datapoints that have been alive for more than the max lifetime
        });
    }

    isPointWithinLifetime(point) {
        // In this function we check if the x value of the point (time it has been alive) is still within the
        // max lifetime. Since all x values are negative, we check if the x value is greater than the MAX_NEGATIVE_AGE
        const MAX_NEGATIVE_AGE = (-1) * this.DATA_POINT_LIFETIME; // Note - MAX_NEGATIVE_AGE is the lowest value allowed in the graph.
        return point.x >= MAX_NEGATIVE_AGE;
    }
    
    
}
