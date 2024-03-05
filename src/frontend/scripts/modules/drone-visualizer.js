import 'https://unpkg.com/vtk.js';

export class DroneVisualizer {

    constructor(vtkContainer, stlModelPath) {
        this.vtkContainer = vtkContainer;
        this.stlModelPath = stlModelPath;
        this.lastOrientation = { roll: 0, pitch: 0, yaw: 0 };

        this.initializeRenderer();
        this.loadStlModel();
    }

    initializeRenderer() {
        const vtkGenericRenderWindow = vtk.Rendering.Misc.vtkGenericRenderWindow;
        const vtkActor = vtk.Rendering.Core.vtkActor;
        const vtkMapper = vtk.Rendering.Core.vtkMapper;

        const genericRenderWindow = vtkGenericRenderWindow.newInstance();
        genericRenderWindow.setContainer(this.vtkContainer);

        this.renderer = genericRenderWindow.getRenderer();
        this.renderWindow = genericRenderWindow.getRenderWindow();
        this.interactor = genericRenderWindow.getInteractor();

        this.actor = vtkActor.newInstance();
        this.mapper = vtkMapper.newInstance();

        this.mapper.setScalarVisibility(false);
        this.actor.setMapper(this.mapper);

        this.renderer.addActor(this.actor);
    }
    
    loadStlModel() {
        const vtkSTLReader = vtk.IO.Geometry.vtkSTLReader;

        this.reader = vtkSTLReader.newInstance();
        this.reader.setUrl(this.stlModelPath).then(() => {
            this.setUpStlModel();
        });
    }

    setUpStlModel() {
        this.mapper.setInputConnection(this.reader.getOutputPort());
        this.configureActorProperties();

        this.renderer.resetCamera();
        this.actor.rotateX(-90);
        this.renderWindow.render();
    }

    configureActorProperties() {
        const property = this.actor.getProperty();
        property.setColor(1, 0.5, 0.5);
        property.setSpecularPower(1);
        property.setAmbient(0.05);
        property.setDiffuse(0.9);
    }

    // TODO - use vector?
    updateOrientation({ roll, pitch, yaw }) {  
        const deltaRoll = roll - this.lastOrientation.roll;
        const deltaPitch = pitch - this.lastOrientation.pitch;
        const deltaYaw = yaw - this.lastOrientation.yaw;

        this.actor.rotateX(deltaRoll);
        this.actor.rotateY(deltaPitch);
        this.actor.rotateZ(deltaYaw);

        this.updateCameraClippingRange();
        this.renderWindow.render();

        this.lastOrientation = { roll, pitch, yaw };
    }

    updateCameraClippingRange() {
        const camera = this.renderer.getActiveCamera();
        const bounds = this.actor.getBounds();
        const distance = camera.getDistance();
        camera.setClippingRange(0.1 * (distance - (bounds[1] - bounds[0])), (2 * distance + (bounds[1] - bounds[0])));
    }

}