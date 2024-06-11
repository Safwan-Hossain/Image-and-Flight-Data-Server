import base64
import socketio

class CameraClient:
    UPDATE_EVENT_NAME = "camera_image_data_to_server"
    
    def __init__(self):
        self.sio = None
        self.target = None

    def initialize(self):
        self.sio = socketio.Client()
        self.connect()
        self.sio.on('user_input', self.on_receive_user_input)
        self.target = None

    def connect(self):
        try:
            url = 'http://localhost:3000?role=camera'
            self.sio.connect(url)
            print('Connection established.')
        except socketio.exceptions.ConnectionError as err:
            print(f'Connection error: {err}')

    def disconnect(self):
        self.sio.disconnect()
        self.target = None
        print('Disconnected.')

    def on_receive_user_input(self, input):
        self.target = input
        print("user input: " + input)

    def update_image(self, raw_image, labels):
        encoded_image = self._encode_image(raw_image)
        data = {
            'image': encoded_image,
            'labels': labels
        }
        self._send_data(data)

    def hasTarget(self):
        return self.target is not None and self.target.strip() != ''

#   ===== Private Methods ===== 
    def _encode_image(self, raw_image):
        return base64.b64encode(raw_image).decode('utf-8')
    
    def _send_data(self, data):
        self.sio.emit(self.UPDATE_EVENT_NAME, data)

