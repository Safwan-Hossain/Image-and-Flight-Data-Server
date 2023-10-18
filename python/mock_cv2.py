import cv2
import base64
import socketio

sio = socketio.Client()
sio.connect('http://localhost:3000')

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    print("Sending")
    _, buffer = cv2.imencode('.jpg', frame)
    encoded_image = base64.b64encode(buffer).decode('utf-8')
    sio.emit('video', {'image': encoded_image})

cap.release()
sio.disconnect()