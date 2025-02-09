document.addEventListener("DOMContentLoaded",()=>{
    const selectedSong=JSON.parse(localStorage.getItem("selectedSong"));
    if(selectedSong){
        document.getElementById("songTitle").textContent=`Title: ${selectedSong.title}`;
        document.getElementById("songAlbum").textContent=`Album: ${selectedSong.album}`;
        document.getElementById("songArtist").textContent=`Artist: ${selectedSong.artist}`;
        document.getElementById("songImage").src=selectedSong.coverImage
}
if(selectedSong.audioUrl){
    document.getElementById("songAudio").src=selectedSong.audioUrl;
}
if(selectedSong.releaseYear){
    document.getElementById('SongReleaseYear').textContent=`Release Year: ${selectedSong.releaseYear}`;
}
if(selectedSong.language){
    document.getElementById("songLanguage").textContent=`language: ${selectedSong.language}`;
}
if(selectedSong.category){
document.getElementById("songCategory").textContent=`Genre: ${selectedSong.category}`
}
else{
    console.error("no song selected")
}
})






const audioElement = document.getElementById("songAudio");
        const playPauseButton = document.getElementById("playPauseBtn");
        const rewindButton = document.getElementById("rewindBtn");
        const fastForwardButton = document.getElementById("fastForwardBtn");

        // Create a progress bar and time display
        const progressBar = document.createElement("input");
        progressBar.type = "range";
        progressBar.id = "progressBar";
        progressBar.value = 0;
        progressBar.min = 0;
        progressBar.max = 100;

        const currentTimeDisplay = document.createElement("span");
        currentTimeDisplay.id = "currentTime";
        currentTimeDisplay.textContent = "0:00";

        const durationDisplay = document.createElement("span");
        durationDisplay.id = "duration";
        durationDisplay.textContent = "0:00";

        const progressContainer = document.createElement("div");
        progressContainer.id = "progressContainer";
        progressContainer.appendChild(currentTimeDisplay);
        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(durationDisplay);
        const controlsDiv = document.getElementById("audioControls");
        controlsDiv.after(progressContainer);

        // Play/Pause toggle
        let isPlaying = false;
        playPauseButton.addEventListener("click", () => {
            if (isPlaying) {
                audioElement.pause();
                playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                audioElement.play();
                playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isPlaying = !isPlaying;
        });

        // Rewind
        rewindButton.addEventListener("click", () => {
        
            audioElement.currentTime = Math.max(0, audioElement.currentTime - 5);
        });

        // Fast forward
        fastForwardButton.addEventListener("click", () => {
            audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + 5);
        });

        // Update progress bar
        audioElement.addEventListener("timeupdate", () => {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            progressBar.value = progress;
            currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
        });

        // Set duration
        audioElement.addEventListener("loadedmetadata", () => {
            durationDisplay.textContent = formatTime(audioElement.duration);
        });

        // Seek audio
        progressBar.addEventListener("input", () => {
            const seekTime = (progressBar.value / 100) * audioElement.duration;
            audioElement.currentTime = seekTime;
        });

        // Format time helper
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
            return `${minutes}:${secs}`;
        }
