import { DEFAULT_MOTOR_GRAPH_CONFIG } from "./-default-graph-config.js";
import Chart from 'chart.js/auto';

export class MotorGraph {
    constructor(chartElement, config = {}) {
        this.chartElement = chartElement;        
        this.config = { ...DEFAULT_MOTOR_GRAPH_CONFIG, ...config }; // merge default config and any additional config
        this.initializeChart();
    }

    initializeChart() {
        this.chart = new Chart(this.chartElement.getContext('2d'), this.config);
        this.updateChartData(this.config.data.datasets[0].data); // Initialize colors
    }

    updateChartData(values) {
        const dataset = this.chart.data.datasets[0];
        dataset.data = values;
        dataset.backgroundColor = values.map(this.getColorForValue);
        dataset.borderColor = dataset.backgroundColor;
        this.chart.update();
    }

    getColorForValue(value) {
        const red = value > 0.5 ? 255 : Math.round(510 * value);
        const green = value < 0.5 ? 255 : Math.round(510 * (1 - value));
        return `rgb(${red},${green},0)`;
    }
}

