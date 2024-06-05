// Events that are sent to the server (e.g. from user to the server)
export const SERVER_EVENT_TAGS = {
    CAMERA_IMAGE_DATA: 'camera_image_data_to_server',
    CAMERA_SYSTEM_DATA: 'camera_system_data_to_server',
    USER_INPUT: 'user_input_to_server',
    USER_SYSTEM_DATA: 'user_system_data_to_server',
    SERIAL_DATA: 'serial_data_to_server',
    CONSOLE_DATA: 'console_data_to_server'
}

// Events that are broadcasted from the server to a client (client/camera/serial) (e.g. from server to the user)
export const CLIENT_EVENT_TAGS = {
    CAMERA_IMAGE_DATA: 'camera_image_data_to_client',
    CAMERA_SYSTEM_DATA: 'camera_system_data_to_client',
    USER_INPUT: 'user_input_to_client', //e.g. user to camera
    USER_SYSTEM_DATA: 'user_system_data_to_client',
    SERIAL_DATA: 'serial_data_to_client',
    CONSOLE_DATA: 'console_data_to_client'
    
}