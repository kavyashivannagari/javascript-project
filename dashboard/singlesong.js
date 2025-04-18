    document.addEventListener("DOMContentLoaded", () => {
        // Spotify color palette
        const spotifyColors = {
            green: '#1DB954',
            darkGreen: '#1ED760',
            black: '#191414',
            white: '#FFFFFF'
        };

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
        const singleSongContainer = document.getElementById("SingleSongContainer");

        let isPlaying = false;
        let currentSongIndex = parseInt(localStorage.getItem('currentSongIndex')) || 0;
        let songsList = [];

        // Function to check if current song is in playlist and update button state
        function updatePlaylistButtonState() {
            const currentSong = JSON.parse(localStorage.getItem("selectedSong"));
            if (!currentSong) return;
            
            const playlist = JSON.parse(localStorage.getItem("myPlaylist")) || [];
            const songExists = playlist.some(song => 
                song.audioUrl === currentSong.audioUrl || 
                (song.title === currentSong.title && song.artist === currentSong.artist)
            );
            
            if (songExists) {
                createPlaylistBtn.disabled = true;
                createPlaylistBtn.innerHTML = '<i class="fas fa-check"></i>';
                createPlaylistBtn.style.color = spotifyColors.green;
            } else {
                createPlaylistBtn.disabled = false;
                createPlaylistBtn.innerHTML = '<i class="fas fa-plus-circle"></i>';
                createPlaylistBtn.style.color = spotifyColors.white;
            }
        }

        // Function to load and display song data
        function loadSong(songData) {
            if (songData) {
                // Update UI elements
                document.getElementById("songTitle").textContent = `Title: ${songData.title}`;
                document.getElementById("songAlbum").textContent = `Album: ${songData.album}`;
                document.getElementById("songArtist").textContent = `Artist: ${songData.artist}`;
                
                // Add error handling for cover image
                const songImage = document.getElementById("songImage");
                songImage.src = songData.coverImage;
                songImage.onerror = () => {
                    songImage.src = '../images/default-cover.jpg'; // Provide your default image path
                };
                
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

                // Store current song and index in localStorage
                localStorage.setItem("selectedSong", JSON.stringify(songData));
                localStorage.setItem("currentSongIndex", currentSongIndex.toString());
                
                // Update playlist button state
                updatePlaylistButtonState();
                
                // Check if we should auto-play
                if (localStorage.getItem("autoPlayNextSong") === "true") {
                    setTimeout(() => {
                        audioElement.play();
                        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
                        isPlaying = true;
                        singleSongContainer.classList.add('playing');
                        // Clear the auto-play flag
                        localStorage.removeItem("autoPlayNextSong");
                    }, 300);
                }
            }
        }

        // Function to initialize songs list from localStorage
        function initializeSongsList() {
            // Get songs list from localStorage
            const storedSongs = localStorage.getItem("allSongs");
            if (storedSongs) {
                songsList = JSON.parse(storedSongs);
                console.log("Loaded songs:", songsList.length);
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

        // Function to add current song to playlist
        function addToPlaylist() {
            const currentSong = JSON.parse(localStorage.getItem("selectedSong"));
            
            if (!currentSong) {
                return;
            }
            
            // Get existing playlist or create a new one
            let playlist = JSON.parse(localStorage.getItem("myPlaylist")) || [];
            
            // Check if song already exists in playlist
            const songExists = playlist.some(song => 
                song.audioUrl === currentSong.audioUrl || 
                (song.title === currentSong.title && song.artist === currentSong.artist)
            );
            
            if (!songExists) {
                playlist.push(currentSong);
                localStorage.setItem("myPlaylist", JSON.stringify(playlist));
                // Update button state instead of showing alert
                updatePlaylistButtonState();
            }
        }

        // Event Listeners
        previousSongBtn.addEventListener("click", loadPreviousSong);
        nextSongBtn.addEventListener("click", loadNextSong);
        
        // Add event listener for create playlist button
        if (createPlaylistBtn) {
            createPlaylistBtn.addEventListener("click", addToPlaylist);
        }

        playPauseButton.addEventListener("click", () => {
            if (isPlaying) {
                audioElement.pause();
                playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
                singleSongContainer.classList.remove('playing');
            } else {
                audioElement.play();
                playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
                singleSongContainer.classList.add('playing');
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
            progressBar.style.setProperty('--progress', `${progress}%`);
            currentTimeSpan.textContent = formatTime(audioElement.currentTime);
        });

        audioElement.addEventListener("loadedmetadata", () => {
            durationSpan.textContent = formatTime(audioElement.duration);
        });

        // Auto-play next song when current song ends
        audioElement.addEventListener("ended", () => {
            loadNextSong();
            audioElement.play();
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
            singleSongContainer.classList.add('playing');
        });

        progressBar.addEventListener("input", () => {
            const time = (progressBar.value / 100) * audioElement.duration;
            audioElement.currentTime = time;
            progressBar.style.setProperty('--progress', `${progressBar.value}%`);
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