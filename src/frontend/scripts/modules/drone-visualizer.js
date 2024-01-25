import 'https://unpkg.com/vtk.js';

export class DroneVisualizer {

    constructor(vtkContainer, stlModelPath) {
        this.vtkContainer = vtkContainer;
        this.stlModelPath = stlModelPath;
        this.setUpStlModel = this.setUpStlModel.bind(this);

        this.lastRoll = 0;
        this.lastPitch = 0;
        this.lastYaw = 0;
    }

    initializeRenderer() {
        // vtk.js modules
        const vtkGenericRenderWindow = vtk.Rendering.Misc.vtkGenericRenderWindow;
        const vtkSTLReader = vtk.IO.Geometry.vtkSTLReader;
        const vtkActor = vtk.Rendering.Core.vtkActor;
        const vtkMapper = vtk.Rendering.Core.vtkMapper;
        const vtkVolumeMapper  = vtk.Rendering.Core.vtkVolumeMapper;
        const vtkVolume   = vtk.Rendering.Core.vtkVolume;

        const genericRenderWindow = vtkGenericRenderWindow.newInstance();
        genericRenderWindow.setContainer(this.vtkContainer);

        this.renderer = genericRenderWindow.getRenderer();
        this.renderWindow = genericRenderWindow.getRenderWindow();
        this.interactor = genericRenderWindow.getInteractor();

        this.reader = vtkSTLReader.newInstance();
        this.actor = vtkActor.newInstance();
        this.mapper = vtkMapper.newInstance();
        const volumeMapper = vtkVolumeMapper.newInstance();
        const volume = vtkVolume.newInstance();

        volume.setMapper(volumeMapper);
        this.renderer.addVolume(volume);
        

        // this.interactor.setInteractorStyle(null); 

        this.mapper.setScalarVisibility(false);
        this.actor.setMapper(this.mapper);

        this.reader.setUrl(this.stlModelPath).then(() => this.setUpStlModel());

        // window.onresize = function () {
        //     this.interactor.handleResize();
        // };
    }

    setUpStlModel() {
        this.mapper.setInputConnection(this.reader.getOutputPort());
        const property = this.actor.getProperty();
        property.setColor(1, .5, 0.5);
        // property.setDiffuseColor(1, 0.5, 0.5);
        // property.setSpecular(0.1); 
        property.setSpecularPower(1); 

        property.setAmbient(0.05); // Lower ambient light
        property.setDiffuse(0.9); // Higher diffuse reflection

        this.renderer.addActor(this.actor);
        this.renderer.resetCamera();
        this.renderWindow.render();
        this.actor.rotateX(-90);
    }

    updateOrientation(orientation) {  
        const roll = orientation[0];
        const pitch = orientation[1];
        const yaw = orientation[2];
        
        const deltaRoll = roll - this.lastRoll;
        const deltaPitch = pitch - this.lastPitch;
        const deltaYaw = yaw - this.lastYaw;
        
        this.actor.rotateX(deltaRoll);
        this.actor.rotateY(deltaPitch);
        this.actor.rotateZ(deltaYaw);

        this.lastRoll = roll;
        this.lastPitch = pitch;
        this.lastYaw = yaw;

        const camera = this.renderer.getActiveCamera();
        const bounds = this.actor.getBounds();
        const distance = camera.getDistance();

        camera.setClippingRange(0.1 * (distance - (bounds[1] - bounds[0])), (2 * distance + (bounds[1] - bounds[0])));

        this.renderWindow.render();
    }


}