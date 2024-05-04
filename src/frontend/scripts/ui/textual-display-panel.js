export class TextualDisplayPanel {

    constructor() {
        this.textComponents = {};
    }
    
    updateText(componentTag, data) {
        const listItem = this.getListItem(componentTag);
        const spanElement = listItem.querySelector('span');
        spanElement.textContent = data; 
    }

    getListItem(componentTag) {
        const textComponent = this.textComponents[componentTag];
        if (!textComponent) {
            throw Error("Text component does not exist for tag: " + componentTag)
        }
        return textComponent.listItem;
    }

    addComponent(componentTag, componentLabel) {
        const listItem = this.setupNewListItem(componentLabel);
        
        this.textComponents[componentTag] = {
            label: componentLabel,
            listItem: listItem
        }
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

    createNewListItem(itemLabel) {
        const newListItem = document.createElement('li');
        newListItem.classList.add('list-item');
        newListItem.innerHTML = `<b>${itemLabel}:</b> <span></span>`;
        return newListItem;
    }
    
    createNewList() {
        
        const newList = document.createElement('ul');
        newList.classList.add('drone-state-list');
        const droneStateDivider = document.getElementById('drone-state-divider');
        droneStateDivider.appendChild(newList);
        return newList;

    }

    setupNewListItem(componentLabel) {
        const targetList = this.findTargetList();
        const listItem = this.createNewListItem(componentLabel);

        if (targetList) {
            targetList.appendChild(listItem);
        } else {
            const newList = this.createNewList();
            newList.appendChild(listItem);
            
        }
        return listItem;
    }

    
}
