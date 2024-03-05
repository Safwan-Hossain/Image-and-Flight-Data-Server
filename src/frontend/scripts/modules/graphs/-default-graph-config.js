// ===================================================================================================== //
// ============================================ MOTOR GRAPH ============================================ //
// ===================================================================================================== //

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


// ======================================================================================================== //
// ============================================ TIMELINE GRAPH ============================================ //
// ======================================================================================================== //

export const DEFAULT_TIMELINE_COLORS = [
    'rgba(0, 123, 255, 1)', 
    'rgba(100, 123, 255, 1)', 
    'rgba(0, 3, 255, 1)', 
    'rgba(255, 165, 0, 1)'
];

export const DEFAULT_TIMELINE_GRAPH_CONFIG = {
    type: 'line',
    data: {
        datasets: [] 
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                min: -10, 
                max: 0,   
                grid: {
                    display: false,
                },
                ticks: {
                    stepSize: 2,
                    color: '#fff', 
                    maxRotation: 0, // prevent x labels from rotating. Change as needed
                    minRotation: 0, 
                    font: {
                        size: 10
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
                        size: 12
                    }
                }
            }
        },
        elements: {
            line: {
                borderWidth: 3,
                tension: 0.1,
                borderColor: 'rgba(0, 175, 255, 1)',
                borderCapStyle: 'round',
                shadowOffsetX: 1,
                shadowOffsetY: 1,
                shadowColor: 'rgba(0,0,0,0.25)',
                shadowBlur: 5
            },
            point: {
                hoverRadius: 0, 
                hoverBackgroundColor: 'rgba(255, 255, 255, 1)', 
                radius: 0,
                backgroundColor: '#fff',
                borderColor: '#fff'
            }
        },
        plugins: {
            
            title: {
                display: false,
                text: '',
                color: 'white' // TODO - change color
            },
            legend: {
                onHover: function(event, legendItem, legend) {
                    event.native.target.style.cursor = 'pointer';
                },
                onLeave: function(event, legendItem, legend) {
                    event.native.target.style.cursor = 'default';
                },
                fullSize: true,
                position: 'bottom',
                align: 'center',
                labels: {
                    usePointStyle: true,
                    pointStyle:'rect',
                    color: '#fff', 
                    font: {
                        size:10
                    }
                }
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0,0,0,0.8)', // tooltip background
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 12
                },
                cornerRadius: 4, 
                caretSize: 8, 
                displayColors: false, 
                
            }
        }
    }
};