
export const ITEM_TAGS = {
    MOTOR_SIGNALS: "motor_signal_item_tag",
    ORIENTATION: "orientation_item_tag",
    ANGULAR_RATE: "angular_rate_item_tag",
    MAGNETOMETER : "magnetometer_item_tag",
    TEMPERATURE : "temperature_item_tag",
    BATTERY: "battery_item_tag"
}

export const VISUAL_METHOD = {
    VTK: "VTK_VISUAL_METHOD",
    GRAPH: "GRAPH_VISUAL_METHOD",
    NONE: "NO_VISUAL_METHOD"
}

export const GRAPH_TYPES = {
    TIME_GRAPH: "TIME_GRAPH",
    BAR_GRAPH: "BAR_GRAPH",
    MOTOR_GRAPH: "MOTOR_GRAPH"
}


export const DEFAULT_PARSING_DATA = {
    itemIndexes: {
        0: ITEM_TAGS.ORIENTATION,
        1: ITEM_TAGS.ANGULAR_RATE,
        2: ITEM_TAGS.MAGNETOMETER,
        3: ITEM_TAGS.MOTOR_SIGNALS,
        // 4: ITEM_TAGS.TEMPERATURE,
        // 5: ITEM_TAGS.BATTERY
    },
    items: [
        {   
            displayName: "Motor Signals",
            itemTag: ITEM_TAGS.MOTOR_SIGNALS,
            visualMethods: [ VISUAL_METHOD.GRAPH ],
            graphSettings: {
                type: GRAPH_TYPES.MOTOR_GRAPH,
                title: "MOTOR SIGNALS",
                xAxis: {
                    labels: ['M1', 'M2', 'M3', 'M4']
                },
                yAxis: {
                    min: 1000,
                    max: 2000
                }
                
            }
        },
        {
            displayName: "Orientation",
            itemTag: ITEM_TAGS.ORIENTATION,
            visualMethods: [VISUAL_METHOD.GRAPH, VISUAL_METHOD.VTK],
            vtkSettings: {
                rollIndex: 0,
                pitchIndex: 1,
                yawIndex: 2,
            },
            graphSettings: {
                type: GRAPH_TYPES.TIME_GRAPH,
                title: "ORIENTATION",
                lineLabels: ['Roll', 'Pitch', 'Yaw'],
                xAxis: {
                    min: -10,
                    max: 0,
                    step: 2
                },
                yAxis: {
                    min: -30,
                    max: 30,
                    step: 10
                }
                
            }
        },
        {
            displayName: "Angular Rate",
            itemTag: ITEM_TAGS.ANGULAR_RATE,
            visualMethods: [VISUAL_METHOD.GRAPH],
            graphSettings: {
                type: GRAPH_TYPES.TIME_GRAPH,
                title: "ANGULAR RATE",
                lineLabels: ['Roll', 'Desired Roll'],
                xAxis: {
                    min: -10,
                    max: 0,
                    step: 2
                },
                yAxis: {
                    min: -80,
                    max: 80,
                    step: 20
                }
            }
        },        
        {
            displayName: "Magnetometer",
            itemTag: ITEM_TAGS.MAGNETOMETER,
            visualMethods: [VISUAL_METHOD.GRAPH],
            graphSettings: {
                type: GRAPH_TYPES.TIME_GRAPH,
                title: "MAGNETOMETER",
                lineLabels: ['X', 'Y', 'Z'],
                xAxis: {
                    min: -10,
                    max: 0,
                    step: 2
                }
            }
        },
        
    ]
}

// M1,M2,M3,M4 | Q1,Q2,Q3,Q4 | roll_rate, roll_cmd