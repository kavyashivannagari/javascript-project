document.addEventListener("DOMContentLoaded", () => {
    // Get all necessary DOM elements
    const audioElement = document.getElementById("songAudio");
    const playPauseButton = document.getElementById("playPauseBtn");
    const rewindButton = document.getElementById("rewindBtn");
    const fastForwardButton = document.getElementById("fastForwardBtn");
    const previousSongBtn = document.getElementById("previousSongBtn");
    const nextSongBtn = document.getElementById("nextSongBtn");
    const createPlaylistBtn = document.getElementById("createPlaylistBtn");
    const progressBar = document.getElementById("progressBar");
    const currentTimeSpan = document.getElementById("currentTime");
    const durationSpan = document.getElementById("duration");

    let isPlaying = false;
    let currentSongIndex = 0;
    let songsList = [];

    // Function to load and display song data
    function loadSong(songData) {
        if (songData) {
            // Update UI elements
            document.getElementById("songTitle").textContent = `Title: ${songData.title}`;
            document.getElementById("songAlbum").textContent = `Album: ${songData.album}`;
            document.getElementById("songArtist").textContent = `Artist: ${songData.artist}`;
            document.getElementById("songImage").src = songData.coverImage;
            audioElement.src = songData.audioUrl;

            if (songData.releaseYear) {
                document.getElementById("songReleaseYear").textContent = `Release Year: ${songData.releaseYear}`;
            }
            if (songData.language) {
                document.getElementById("songLanguage").textContent = `Language: ${songData.language}`;
            }
            if (songData.category) {
                document.getElementById("songCategory").textContent = `Genre: ${songData.category}`;
            }

            // Reset play/pause button state
            isPlaying = false;
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>';

            // Store current song in localStorage
            localStorage.setItem("selectedSong", JSON.stringify(songData));
            
            // Update current song index
            currentSongIndex = songsList.findIndex(song => song.title === songData.title);
        }
    }

    // Function to initialize songs list from database
    function initializeSongsList() {
        // Get songs list from localStorage (you can modify this to fetch from your actual database)
        songsList = JSON.parse(localStorage.getItem("songsList")) || [];
        
        // Get currently selected song
        const selectedSong = JSON.parse(localStorage.getItem("selectedSong"));
        if (selectedSong) {
            currentSongIndex = songsList.findIndex(song => song.title === selectedSong.title);
            if (currentSongIndex === -1) currentSongIndex = 0;
        }
    }

    // Function to load previous song
    function loadPreviousSong() {
        if (songsList.length === 0) return;
        
        currentSongIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songsList.length - 1;
        loadSong(songsList[currentSongIndex]);
    }

    // Function to load next song
    function loadNextSong() {
        if (songsList.length === 0) return;
        
        currentSongIndex = currentSongIndex < songsList.length - 1 ? currentSongIndex + 1 : 0;
        loadSong(songsList[currentSongIndex]);
    }

    // Event Listeners
    previousSongBtn.addEventListener("click", loadPreviousSong);
    nextSongBtn.addEventListener("click", loadNextSong);

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

    rewindButton.addEventListener("click", () => {
        audioElement.currentTime = Math.max(0, audioElement.currentTime - 5);
    });

    fastForwardButton.addEventListener("click", () => {
        audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + 5);
    });

    // Audio element event listeners
    audioElement.addEventListener("timeupdate", () => {
        const progress = (audioElement.currentTime / audioElement.duration) * 100;
        progressBar.value = progress;
        currentTimeSpan.textContent = formatTime(audioElement.currentTime);
    });

    audioElement.addEventListener("loadedmetadata", () => {
        durationSpan.textContent = formatTime(audioElement.duration);
    });

    // Auto-play next song when current song ends
    audioElement.addEventListener("ended", () => {
        loadNextSong();
    });

    progressBar.addEventListener("input", () => {
        const time = (progressBar.value / 100) * audioElement.duration;
        audioElement.currentTime = time;
    });

    // Helper function to format time
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${minutes}:${secs}`;
    }

    // Initialize the player
    initializeSongsList();
    const selectedSong = JSON.parse(localStorage.getItem("selectedSong"));
    if (selectedSong) {
        loadSong(selectedSong);
    } else if (songsList.length > 0) {
        loadSong(songsList[0]);
    }
});

