// VTKRendering.js

// import 'https://unpkg.com/vtk.js';

const { STLReader, PolyDataMapper, Actor, Renderer, RenderWindow, OpenGLRenderWindow, InteractorStyleTrackballCamera, RenderWindowInteractor } = vtk.Rendering.Core;

export function main(containerId) {
    // Access vtk and its components from the global scope
    
    const vtk = window.vtk;
    const RenderWindow = vtk.Rendering.Core.RenderWindow;
    const Renderer = vtk.Rendering.Core.Renderer;
    const OpenGLRenderWindow = vtk.Rendering.Core.OpenGLRenderWindow;
    const InteractorStyleTrackballCamera = vtk.Interaction.Style.InteractorStyleTrackballCamera;
    const RenderWindowInteractor = vtk.Rendering.Core.RenderWindowInteractor;
  
    // Instantiate the vtk.js objects using the vtk global object
    const renderWindow = RenderWindow.newInstance();
    const renderer = Renderer.newInstance();
    renderWindow.addRenderer(renderer);
  
    const openGLRenderWindow = OpenGLRenderWindow.newInstance();
    renderWindow.addView(openGLRenderWindow);
    const container = document.getElementById(containerId);
    openGLRenderWindow.setContainer(container);
    const size = openGLRenderWindow.getContainerSize();
    openGLRenderWindow.setSize(size[0], size[1]);
  
    const interactor = RenderWindowInteractor.newInstance();
    interactor.setView(openGLRenderWindow);
    interactor.initialize();
    interactor.bindEvents(container);
  
    const interactorStyle = InteractorStyleTrackballCamera.newInstance();
    interactor.setInteractorStyle(interactorStyle);
  
    const actor = Actor.newInstance();
    const mapper = PolyDataMapper.newInstance();
  
    const reader = STLReader.newInstance();
  
    // Use setUrl() which returns a Promise
    reader.setUrl('drone_model.stl').then(() => {
      mapper.setInputConnection(reader.getOutputPort());
      actor.setMapper(mapper);
  
      renderer.addActor(actor);
      renderer.resetCamera();
      renderWindow.render();
    });
  
    renderer.setBackground(0.0, 0.0, 0.0);
  }