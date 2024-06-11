import {ITEM_TAGS} from "../../config/parsing-data.js"

export const DATA_GENERATION_INTERVAL = 100; // Time (in ms) 

export const COMPONENT_VALUES = {
    [ITEM_TAGS.MOTOR_SIGNALS]: {
        minValue: 1000,
        maxValue: 2000,
        numberOfValues: 4
    },
    [ITEM_TAGS.ORIENTATION]: {
        minValue: -30,
        maxValue: 30,
        numberOfValues: 3 
    },
    [ITEM_TAGS.ANGULAR_RATE]: {
        minValue: -70,
        maxValue: 75,
        numberOfValues: 3 
    },
    [ITEM_TAGS.MAGNETOMETER]: {
        minValue: -90, 
        maxValue: 100,
        numberOfValues: 3 
    },
    [ITEM_TAGS.TEMPERATURE]: {
        minValue: -30, 
        maxValue: 40,
        numberOfValues: 1 
    },
    [ITEM_TAGS.BATTERY]: {
        minValue: 0,
        maxValue: 100,
        numberOfValues: 1 
    }
};