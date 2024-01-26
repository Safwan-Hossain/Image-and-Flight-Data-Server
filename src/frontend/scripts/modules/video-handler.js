const TIME_UNTIL_DISPLAY_LOADING = '5' // seconds

export class VideoHandler {
    constructor(videoContainer) {
        this.videoContainer = videoContainer;
        this.loadingScreenTimer = null;
    }

    startReceiving() {

    }    
    
    stopReceiving() {
        clearInterval(this.loadingScreenTimer);
        this.displayVideoNotConnected();
    }

    displayVideoNotConnected() {

    }

    displayLoadingVideo() {
        videoStream.style.display = 'none';
        videoPlaceholder.style.display = 'flex';
    }

    updateVideo(image) {
        this.#restartLoadingScreenTimer();
        const imageUrl = 'data:image/jpeg;base64,' + data;
        videoStream.src = imageUrl;
        videoStream.style.display = 'block';
        videoPlaceholder.style.display = 'none';
    }

    #restartLoadingScreenTimer() {
        if (this.loadingScreenTimer) {
            clearInterval(this.loadingScreenTimer);
        }
        this.loadingScreenTimer = setInterval(this.displayLoadingVideo, TIME_UNTIL_DISPLAY_LOADING);
    }
}