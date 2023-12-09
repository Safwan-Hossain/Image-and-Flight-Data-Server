import vtk
import time
import threading
import socketio
import base64
from io import BytesIO
from queue import Queue, Empty

class STLViewer:
    def __init__(self, filename, server_url):
        self.filename = filename
        self.server_url = server_url
        self.reader = vtk.vtkSTLReader()
        self.mapper = vtk.vtkPolyDataMapper()
        self.actor = vtk.vtkActor()
        self.renderer = vtk.vtkRenderer()
        self.renderWindow = vtk.vtkRenderWindow()
        self.renderWindowInteractor = vtk.vtkRenderWindowInteractor()
        self.image_queue = Queue()
        self.stop_thread = threading.Event()

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

    def start(self):
        self.setup()
        self.init_socketio_client()
        self.renderWindow.Render()
        self.renderWindowInteractor.Initialize()

        self.timer_id = self.renderWindowInteractor.CreateRepeatingTimer(50)
        self.renderWindowInteractor.AddObserver('TimerEvent', self.capture_image)

        self.renderWindowInteractor.Start()

    def init_socketio_client(self):
        self.sio = socketio.Client()
        self.sio.connect(self.server_url)
        self.worker_thread = threading.Thread(target=self.background_worker)
        self.worker_thread.start()

    def capture_image(self, obj, event):
        if event == 'TimerEvent':
            window_to_image_filter = vtk.vtkWindowToImageFilter()
            window_to_image_filter.SetInput(self.renderWindow)
            window_to_image_filter.Update()

            writer = vtk.vtkPNGWriter()
            writer.SetWriteToMemory(1)
            writer.SetInputConnection(window_to_image_filter.GetOutputPort())
            writer.Write()

            img_data = BytesIO(writer.GetResult())
            self.image_queue.put(base64.b64encode(img_data.getvalue()).decode('utf-8'))

    def background_worker(self):
        while not self.stop_thread.is_set():
            try:
                while not self.image_queue.empty():  # As long as there are items in the queue
                    image_data_base64 = self.image_queue.get()  # Get an item without blocking
                    self.sio.emit('video', {'image': image_data_base64})  # Send the image data
                
                # Add a small sleep to prevent this loop from running too fast and consuming too much CPU
                time.sleep(0.01)  # Sleep for 10 milliseconds
            except Empty:
                print("Queue is empty, no image to send.")
            except Exception as e:
                print(f"Unexpected error: {e}")


    def stop(self):
        self.stop_thread.set()
        self.worker_thread.join()
        self.sio.disconnect()

def main():
    filename = 'python\stl\drone_model.stl'
    server_url = 'http://localhost:3000'
    viewer = STLViewer(filename, server_url)
    viewer.start()

if __name__ == '__main__':
    main()
