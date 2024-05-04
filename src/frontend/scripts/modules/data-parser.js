import { ARRAY_DELIMITER,  DATA_DELIMITER, GRAPH_TYPES, VISUAL_METHOD, DEFAULT_PARSING_DATA } from "../../../config/parsing-data.js";
import { TimelineGraph } from "../graphs/timeline-graph.js";
import { ExternalGraph } from "../graphs/separate-graph.js";
import { TextualDisplayPanel } from "../ui/textual-display-panel.js";

const CHART_HTML_ID_SUFFIX = '-chart';

// Change name to UIManager
export class DataParser {
    constructor() {
        this.textualDisplay = new TextualDisplayPanel();
        this.parsingTags = {};
        this.graphs = {}
        this.isInitialized = false;
    }

    initialize() {
        DEFAULT_PARSING_DATA.items.forEach((item) => {
            this.setupItem(item);
        })
        this.isInitialized = true;
    }

    setupItem(item) {
        const dataIndex = item.index;
        const visualMethods = item.visualMethods;
        
        if (visualMethods.includes(VISUAL_METHOD.GRAPH)) {
            this.setupGraph(item);
        }
        
        if (visualMethods.includes(VISUAL_METHOD.VTK)) {
            // this.setupVTK(item);
        }
        this.textualDisplay.addComponent(item.itemTag, item.displayName);
    }

    setupGraph(item) {
        const graphType = item.graphSettings.type;
        if (graphType == GRAPH_TYPES.TIME_GRAPH) {
            this.setupTimeGraph(item);
        }
        else if (graphType == GRAPH_TYPES.MOTOR_GRAPH) {
            this.setupMotorGraph(item);
        }

        this.setupComponentTextDisplay(item);
    }

    findTargetList() {
        const droneStateDivider = document.getElementById('drone-state-divider');
        const lists = droneStateDivider.getElementsByClassName('drone-state-list');
        for (let list of lists) {
            if (list.getElementsByTagName('li').length < 4) {
                return list;
            }
        }
        return null;
    }

    createNewListItem(content) {
        const newItem = document.createElement('li');
        newItem.classList.add('list-item');
        newItem.innerHTML = `<b>${content}</b>`;
        return newItem;
    }

    addComponentToDroneState(content) {
        const targetList = this.findTargetList();
        const listItem = this.createNewListItem(content);

        if (targetList) {
            targetList.appendChild(listItem);
        } else {
            const newList = document.createElement('ul');
            newList.classList.add('drone-state-list');
            newList.appendChild(listItem);
            
            const droneStateDivider = document.getElementById('drone-state-divider');
            droneStateDivider.appendChild(newList);
        }
    }


    setupComponentTextDisplay() {
        
    }

    setupTimeGraph(item) {
        const itemTag = item.itemTag;
        const graphSettings = item.graphSettings;
        const lineLabels = graphSettings.lineLabels;
        
        const graphCanvas = this.createGraphCanvas(itemTag);
        
        graphCanvas.addEventListener('click', () => {this.openOnNewScreen(itemTag, graphSettings.title, lineLabels)});

        const newTimeGraph = new TimelineGraph(graphCanvas, lineLabels);
        newTimeGraph.setTitle(graphSettings.title);

        if (graphSettings.xAxis != null) {
            const xAxis = graphSettings.xAxis;
            newTimeGraph.setXAxisRange(xAxis.min, xAxis.max, xAxis.step);
        }

        if (graphSettings.yAxis != null) {
            const yAxis = graphSettings.yAxis;
            newTimeGraph.setYAxisRange(yAxis.min, yAxis.max, yAxis.step);
        }
        
        this.graphs[itemTag] = newTimeGraph;
    }

    setupMotorGraph(item) {

    }


    addParsingTag(tag, index) {
        this.parsingTags.push({
            key: tag,
            value: index
        });
    }

    getIndexForTag(tag) {
        return this.parsingTags[tag];
    }


// convert this to a data processor class
    handleData(data) {
        if (!this.isInitialized) {
            return;
        }
        const parsedData = data.split(DATA_DELIMITER);
        const itemIndexes = DEFAULT_PARSING_DATA.itemIndexes;

        Object.entries(itemIndexes).forEach(([itemIndex, itemTag]) => {
            const itemData = parsedData[itemIndex];
            this.updateItem(itemTag, itemData);
        });
    }

    updateItem(itemTag, itemData) {
        const graphLinkedToItem = this.graphs[itemTag];
        
        this.textualDisplay.updateText(itemTag, itemData);

        if (graphLinkedToItem == null) {
            return;
        }

        if (itemData.includes(ARRAY_DELIMITER)) {
            graphLinkedToItem.updateGraph(itemData.split(ARRAY_DELIMITER));

            if (this.externalGraph != null && this.externalGraph.itemTag === itemTag) {
                this.externalGraph.updateGraph(itemData.split(ARRAY_DELIMITER));
            }
        }
        else {
            graphLinkedToItem.updateGraph(itemData);
            
            if (this.externalGraph != null && this.externalGraph.itemTag === itemTag) {
                this.externalGraph.updateGraph(itemData.split(ARRAY_DELIMITER));
            }
        }
    }

    static parseVector(vector) {
        if (vector == undefined) {
            return "";
        }
        return vector.substring(1, vector.length - 1).split(ARRAY_DELIMITER);
    }

    createGraphCanvas(itemTag) {
        const chartColumn = document.getElementById('chart-column');

        // Create the new chart container div
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart';
        chartContainer.id = itemTag + '-container';

        const canvas = document.createElement('canvas');
        canvas.id = itemTag + CHART_HTML_ID_SUFFIX;
        canvas.className = 'timelineChart';

        chartContainer.appendChild(canvas);
        chartColumn.appendChild(chartContainer);

        

        return canvas;
    }

    openOnNewScreen(itemTag, title, labels) {
        this.externalGraph = new ExternalGraph(itemTag);
        this.externalGraph.initialize(title, labels);
        
    }
}

export class UIComponent {
    constructor(componentTag) {
        this.componentTag = componentTag;
    }

    addLineGraph(lineGraph) {
        this.lineGraph = lineGraph;
    }

    addMotorGraph(motorGraph) {
        this.motorGraph = motorGraph;
    }

    addVtkGraph(vtkGraph) {
        this.vtkGraph = vtkGraph;
    }

    addDisplayText(textDisplay) {
        this.textDisplay = textDisplay;
    }

    updateAll(newData) {
        if (this.lineGraph) {
            this.lineGraph.update(newData);
        }
        if (this.motorGraph) {
            this.motorGraph.update(newData);
        }
        if (this.vtkGraph) {
            this.vtkGraph.update(newData);
        }
        if (this.textDisplay) {
            this.textDisplay.update(newData);
        }
    }
}