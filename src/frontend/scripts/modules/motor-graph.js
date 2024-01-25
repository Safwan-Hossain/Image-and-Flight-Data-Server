// import { Chart } from 'chart.js/auto';

const defaultConfig = {
    type: 'bar',
    data: {
        labels: ['M1', 'M2', 'M3', 'M4'],
        datasets: [{
            label: 'Motor Signals',
            data: [0, 0, 0, 0],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 1
            }
        },
        animation: {
            duration: 100
        },
        plugins: {
            legend: {
                display: false
            }
        },
        onHover: (event, chartElement) => {
            event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }
    }
};

export class MotorGraph {
    constructor(chartElement, config = {}) {
        this.chartElement = chartElement;        
        this.config = { ...defaultConfig, ...config }; // merge default config and any additional config
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

