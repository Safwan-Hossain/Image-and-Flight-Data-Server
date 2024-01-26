export const DEFAULT_MOTOR_GRAPH_CONFIG = {
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


export const DEFAULT_TIMELINE_GRAPH_CONFIG = {
    type: 'line',
    data: {
        labels: Array.from({length: 100}, (_, i) => (-10 + i * 0.1).toFixed(1)), // Initialize labels from -10 to 0
        datasets: [{
            label: 'Dynamic Data',
            data: [], 
            fill: false,
            borderColor: 'rgba(0, 123, 255, 1)',
            tension: 0.5
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#fff', 
                    font: {
                        size: 14
                    }
                }
            },
            y: {
                grid: {
                    color: '#555', // Darker grid lines
                },
                ticks: {
                    color: '#fff', 
                    font: {
                        size: 14
                    }
                }
            }
        },
        elements: {
            line: {
                borderWidth: 3,
                tension: 0.1,
                backgroundColor: 'rgba(0, 175, 255, 0.6)', // Line color
                borderColor: 'rgba(0, 175, 255, 1)',
                borderCapStyle: 'round',
                shadowOffsetX: 1,
                shadowOffsetY: 1,
                shadowColor: 'rgba(0,0,0,0.25)',
                shadowBlur: 5
            },
            point: {
                hoverRadius: 6, // Slightly larger radius on hover
                hoverBackgroundColor: 'rgba(255, 255, 255, 1)', 
                radius: 0,
                backgroundColor: '#fff', // White points for contrast
                borderColor: '#fff'
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#fff', // White text for legend
                    font: {
                        size: 16,
                        style: 'italic'
                    }
                }
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0,0,0,0.8)', // Darker tooltip background
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 12
                },
                cornerRadius: 4, // Rounded corners for tooltip
                caretSize: 6, // Adjust the size of the tooltip arrow
                displayColors: false, // Disable displaying color boxes in tooltip
            }
        }
    }
};