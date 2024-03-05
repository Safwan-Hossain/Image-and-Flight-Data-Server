export class DataDisplaySettings {
    constructor(displayName, dataTag, dataParsingIndex,graphSettings, shouldBeGraphed=true, shouldBeDisplayedOnInfoBoard=true) {
        this.displayName = displayName;
        this.dataTag = dataTag;
        this.dataParsingIndex = dataParsingIndex;
        this.graphSettings = graphSettings;
        this.shouldBeGraphed = shouldBeGraphed;
        this.shouldBeDisplayedOnInfoBoard = shouldBeDisplayedOnInfoBoard;
    }
}

export class GraphSettings {
    constructor(xLabels, xAxisSettings, yLabels, yAxisSettings) {
        this.xLabels = xLabels;
        this.xAxisSettings = xAxisSettings;
        this.yLabels = yLabels;
        this.yAxisSettings = yAxisSettings;
    }

}

export class AxisSettings {
    constructor(min, max, step) {
        this.min = min;
        this.max = max;
        this.step = step;
    }
}