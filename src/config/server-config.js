export const Config = {
    server: {
        arduinoPort: "COM4",
        serverPort: 3000
    },
    parser: {
        numOfDecimalsToDisplay: 1,
        useMessageMarkingFlags: true,
        messageBeginFlag: '!',
        messageEndFlag: '@'
    },
    stl: {
        relativeFileLocation: './assets/stl/drone_model_centered.stl' // this is relative to the public folder since it will be referenced from index.html
    }
};