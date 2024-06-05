export class TextualDisplayPanel {

    constructor() {
        this.textComponents = {};
    }
    
    updateText(componentTag, data) {
        const dataValuesElement = this.getDataValuesElement(componentTag);
        const roundedData = this.roundCommaSeparatedNumbers(data);
        dataValuesElement.textContent = roundedData; 
    }

    getDataValuesElement(componentTag) {
        const textComponent = this.textComponents[componentTag];
        if (!textComponent) {
            throw Error("Text component does not exist for tag: " + componentTag);
        }
        return textComponent.dataValuesElement;
    }
    
    addComponent(componentTag, componentLabel) {
        const dataItem = this.setupNewDataItem(componentLabel, componentTag);
        
        this.textComponents[componentTag] = {
            label: componentLabel,
            dataItem: dataItem,
            dataValuesElement: dataItem.querySelector('.data-values')
        };
    }

    findTargetContainer() {
        const droneStateDivider = document.getElementById('drone-state-divider');
        const containers = droneStateDivider.getElementsByClassName('drone-state-container');
        for (let container of containers) {
            if (container.getElementsByClassName('data-item').length < 4) {
                return container;
            }
        }
        return null;
    }

    createNewDataItem(itemLabel, componentTag) {
        const newDataItem = document.createElement('div');
        newDataItem.classList.add('data-item');
        newDataItem.innerHTML = `
            <div class="data-title">${itemLabel}:</div>
            <div id="${componentTag}" class="data-values">No Signal</div>
        `;
        return newDataItem;
    }
    
    createNewContainer() {
        const newContainer = document.createElement('div');
        newContainer.classList.add('drone-state-container');
        const droneStateDivider = document.getElementById('drone-state-divider');
        droneStateDivider.appendChild(newContainer);
        return newContainer;
    }

    setupNewDataItem(componentLabel, componentTag) {
        const targetContainer = this.findTargetContainer();
        const dataItem = this.createNewDataItem(componentLabel, componentTag);

        if (targetContainer) {
            targetContainer.appendChild(dataItem);
        } else {
            const newContainer = this.createNewContainer();
            newContainer.appendChild(dataItem);
        }
        return dataItem;
    }

    
    roundCommaSeparatedNumbers(data) {
        const values = data.split(',').map(value => {
            const number = parseFloat(value);
            return isNaN(number) ? value : Math.round(number).toString();
        });
        return values.join(', ');
    }
}
