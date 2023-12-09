import vtk
import time
import socketio
import base64
from io import BytesIO

sio = socketio.Client()

class STLViewer:
    def __init__(self, filename):
        self.filename = filename
        self.reader = vtk.vtkSTLReader()
        self.mapper = vtk.vtkPolyDataMapper()
        self.actor = vtk.vtkActor()
        self.renderer = vtk.vtkRenderer()
        self.renderWindow = vtk.vtkRenderWindow()
        self.renderWindowInteractor = vtk.vtkRenderWindowInteractor()

    def setup(self):
        if not self.validate_file():
            raise FileNotFoundError(f"The file {self.filename} does not exist or is not readable.")
        
        self.reader.SetFileName(self.filename)
        self.mapper.SetInputConnection(self.reader.GetOutputPort())
        self.actor.SetMapper(self.mapper)

        self.renderer.AddActor(self.actor)
        self.renderer.SetBackground(0.1, 0.2, 0.3)  # Slightly blue background 

        self.renderWindow.AddRenderer(self.renderer)
        self.renderWindowInteractor.SetRenderWindow(self.renderWindow)

    def validate_file(self):
        try:
            with open(self.filename, 'rb') as file:
                return True
        except IOError:
            return False

    def save_rendering_to_image(self):
        # Capture the frame
        self.renderWindow.Render()

        windowToImageFilter = vtk.vtkWindowToImageFilter()
        windowToImageFilter.SetInput(self.renderWindow)
        windowToImageFilter.Update()

        # Write to a bytes buffer instead of a file
        writer = vtk.vtkPNGWriter()
        writer.SetWriteToMemory(1)
        writer.SetInputConnection(windowToImageFilter.GetOutputPort())
        writer.Write()

        # Retrieve the image data from the writer
        data = writer.GetResult()
        return data

    def start(self):
        self.setup()

        # Register a callback to the render window interactor to handle timer events
        self.renderWindowInteractor.AddObserver('TimerEvent', self.capture_image)
        
        # Start the interactor before setting the timer
        self.renderWindow.Render()
        self.renderWindowInteractor.Initialize()  # Ensure the interactor is initialized
        
        # Now set the timer
        self.timer_id = self.renderWindowInteractor.CreateRepeatingTimer(10)

        # Start the interactor's event loop
        self.renderWindowInteractor.Start()

    def capture_image(self, obj, event):
        # Check if the event is a TimerEvent to avoid capturing on every interaction event
        if event != 'TimerEvent':
            return

        # Capture the image data instead of saving as a file
        image_data = self.save_rendering_to_image()

        # Convert the binary data to base64
        image_data_base64 = base64.b64encode(image_data).decode('utf-8')

        # Send the image data through socketIO
        sio.emit('video', {'image': image_data_base64})

def main():
    # sio.connect('http://localhost:3000')

    filename = 'python\stl\drone_model.stl'
    viewer = STLViewer(filename)
    viewer.start()

    # Disconnect from the server after the viewer is closed
    sio.disconnect()

if __name__ == '__main__':
    main()

    