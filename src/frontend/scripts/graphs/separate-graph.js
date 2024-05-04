import { TimelineGraph } from "./timeline-graph.js";

export class ExternalGraph {
    constructor(itemTag) {
        this.itemTag = itemTag;
        const newWindow = window.open('', 'GraphWindow', 'width=800,height=600');
        this.newWindow = newWindow;
        
        if (this.newWindow) {
            
            this.newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Chart in New Window</title>
                    <style>
                        body {
                            background-color: #f0f0f0; /* Light gray background */
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                        }
                        canvas {
                            margin-right: 20px;
                            width: 90%;
                            height: 200px;
                            max-width: 800px;
                            background: #383838; 
                            padding: 10px;
                            box-shadow: 0 6px 10px rgba(0,0,0,0.1);
                            border-radius: 8px;
                        }
                    </style>
                </head>
                <body>
                    <canvas id="myChart" width="800" height="800"></canvas>
                </body>
                </html>
            `);
            // Create a script element
            
            this.canvas = this.newWindow.document.getElementById('myChart');
            const scriptElement = newWindow.document.createElement('script');
            const scriptElement2 = newWindow.document.createElement('script');
            const scriptElement3 = newWindow.document.createElement('script');
            scriptElement.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            scriptElement.onload = function() {
                // Script has loaded, now you can initialize your chart
                console.log('Chart.js has been loaded successfully');
                // You can now proceed to use Chart.js to create charts in the new window
            };
            
            scriptElement2.src = 'https://cdn.jsdelivr.net/npm/moment@^2';
            scriptElement2.onload = function() {
                // Script has loaded, now you can initialize your chart
                console.log('Chart.js has been loaded successfully');
                // You can now proceed to use Chart.js to create charts in the new window
            };
            
            
            scriptElement3.src = 'https://cdn.jsdelivr.net/npm/chartjs-adapter-moment@^1';
            scriptElement3.onload = function() {
                // Script has loaded, now you can initialize your chart
                console.log('Chart.js has been loaded successfully');
                // You can now proceed to use Chart.js to create charts in the new window
            };

            scriptElement.onerror = function() {
                console.error('Failed to load Chart.js');
            };

            // Append the script element to the head of the document in the new window
            newWindow.document.head.appendChild(scriptElement);
            newWindow.document.head.appendChild(scriptElement2);
            newWindow.document.head.appendChild(scriptElement3);
        }
        
    }

    initialize(title, datasetLabels) {
        
        console.log(this.canvas)
        this.graph = new TimelineGraph(this.canvas, datasetLabels);
        this.graph.setTitle(title)
        this.graph.setXAxisRange(-10, 0, 2);
        this.graph.setYAxisRange(-80, 80, 20);
    }

    updateGraph(updateValues) {
        if (!this.graph) {
            return;
        }
        this.graph.updateGraph(updateValues);
    }

    
}