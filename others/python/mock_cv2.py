import cv2
from client import CameraClient

def tryToLockOnTarget(target):
    print("Camera System: trying to lock onto target: " + target)


client = CameraClient()
client.initialize()

cap = cv2.VideoCapture(0)

while True:
    if client.hasTarget():
        tryToLockOnTarget(client.target)

    ret, frame = cap.read()
    if not ret:
        break

    _, raw_image = cv2.imencode('.jpg', frame)
    client.update_image(raw_image, {})

cap.release()
client.disconnect()

