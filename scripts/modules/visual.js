import 'https://unpkg.com/vtk.js';

const { STLReader, PolyDataMapper, Actor, Renderer, RenderWindow, OpenGLRenderWindow, InteractorStyleTrackballCamera, RenderWindowInteractor } = vtk.Rendering.Core;

const SERVER_PORT = 3000;
// const socket = io('http://localhost:' + SERVER_PORT);
const vtkContainer = document.getElementById('vtkContainer');
const stlURL = '../../python/stl/drone_model_centered.stl';

// socket.on('arduinoData', (data) => {
//     const ARRAY_DELIM  = '|';
//     const DATA_DELIM  = ',';

//     const ROLL_INDEX = 0;
//     const PITCH_INDEX = 1;
//     const YAW_INDEX = 2;

//     const parsedData = data.split(DATA_DELIM);
//     const MOTOR_SIGNAL_INDEX = 0;
//     const ORIENTATION_INDEX = 1;
    
//     let motors = parsedData[MOTOR_SIGNAL_INDEX].split(ARRAY_DELIM);
//     let orientation = parsedData[ORIENTATION_INDEX].split(ARRAY_DELIM);

//     motors = motors.map(motorSignal => formatMotorSignal(motorSignal));

//     document.getElementById('input-roll').value = orientation[ROLL_INDEX];
//     document.getElementById('input-pitch').value = orientation[PITCH_INDEX];
//     document.getElementById('input-yaw').value = orientation[YAW_INDEX];

//     updateOrientation();
//     updateChartData(motors);
// });

function formatMotorSignal(number) {
    return (number - 1000) / 1000;
}

// vtk.js modules we will use
const vtkGenericRenderWindow = vtk.Rendering.Misc.vtkGenericRenderWindow;
const vtkSTLReader = vtk.IO.Geometry.vtkSTLReader;
const vtkActor = vtk.Rendering.Core.vtkActor;
const vtkMapper = vtk.Rendering.Core.vtkMapper;
const vtkVolumeMapper  = vtk.Rendering.Core.vtkVolumeMapper;
const vtkVolume   = vtk.Rendering.Core.vtkVolume;

// Create and initialize a generic render window
const genericRenderWindow = vtkGenericRenderWindow.newInstance();
genericRenderWindow.setContainer(vtkContainer);
genericRenderWindow.resize();

// Get the renderer, render window, and interactor from the generic render window
const renderer = genericRenderWindow.getRenderer();
const renderWindow = genericRenderWindow.getRenderWindow();
const interactor = genericRenderWindow.getInteractor();

// interactor.setInteractorStyle(null);

// Instantiate an STL reader, actor, and mapper
const reader = vtkSTLReader.newInstance();
const actor = vtkActor.newInstance();
const mapper = vtkMapper.newInstance();
const volumeMapper = vtkVolumeMapper.newInstance();
const volume = vtkVolume.newInstance();

volume.setMapper(volumeMapper);
renderer.addVolume(volume);

mapper.setScalarVisibility(false);
actor.setMapper(mapper);;


reader.setUrl(stlURL).then(() => {

    mapper.setInputConnection(reader.getOutputPort());
    const property = actor.getProperty();
    property.setColor(1, .5, 0.5);
    // property.setDiffuseColor(1, 0.5, 0.5);
    // property.setSpecular(0.1); // Shiny surface
    property.setSpecularPower(1); // Sharp specular effect

    // Adjust the ambient and diffuse lighting to control how "flat" the color appears
    property.setAmbient(0.05); // Lower ambient light
    property.setDiffuse(0.9); // Higher diffuse reflection
    renderer.addActor(actor);

    renderer.addActor(actor);
    renderer.resetCamera();
    renderWindow.render();
});

window.onresize = function () {
    interactor.handleResize();
};

    

let lastRoll = 0, lastPitch = 0, lastYaw = 0;
actor.rotateX(-90);

function updateOrientation() {
    let roll = parseFloat(document.getElementById('input-roll').value) || 0;
    let pitch = parseFloat(document.getElementById('input-pitch').value) || 0;
    let yaw = parseFloat(document.getElementById('input-yaw').value) || 0;

    document.getElementById('roll-value').innerText = roll;
    document.getElementById('pitch-value').innerText = pitch;
    document.getElementById('yaw-value').innerText = yaw;
    
    let deltaRoll = roll - lastRoll;
    let deltaPitch = pitch - lastPitch;
    let deltaYaw = yaw - lastYaw;
    
    actor.rotateX(deltaRoll);
    actor.rotateY(deltaPitch);
    actor.rotateZ(deltaYaw);

    lastRoll = roll;
    lastPitch = pitch;
    lastYaw = yaw;

    const camera = renderer.getActiveCamera();
    const bounds = actor.getBounds();
    const range = camera.getClippingRange();
    const distance = camera.getDistance();

    camera.setClippingRange(0.1 * (distance - (bounds[1] - bounds[0])), (2 * distance + (bounds[1] - bounds[0])));

    renderWindow.render();
}



var ctx = document.getElementById('myBarChart').getContext('2d');
var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['M1', 'M2', 'M3', 'M4'], 
        datasets: [{
            label: 'Motor Signals',
            data: [0, 0, 0, 0], 
            backgroundColor: ['green', 'green', 'green', 'green'], 
            borderColor: ['green', 'green', 'green', 'green'],
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
});

function getColorForValue(value) {
    var red = value > 0.5 ? 255 : Math.round(510 * value);
    var green = value < 0.5 ? 255 : Math.round(510 * (1 - value));
    return 'rgb(' + red + ',' + green + ',0)';
}

function updateChartData(values) {
    myBarChart.data.datasets.forEach((dataset) => {
        dataset.data = values; 
        dataset.backgroundColor = values.map(value => getColorForValue(value)); 
        dataset.borderColor = dataset.backgroundColor;
    });
    myBarChart.update();
}

updateChartData([1,.5,.75,.25])