document.addEventListener("DOMContentLoaded", () => {
    // Spotify color palette
    const spotifyColors = {
        green: '#1DB954',
        darkGreen: '#1ED760',
        black: '#191414',
        white: '#FFFFFF'
    };

    const playlistContainer = document.getElementById("playlistItems");
    
    // Get playlist from localStorage
    const playlist = JSON.parse(localStorage.getItem("myPlaylist")) || [];
    
    // Track the currently playing audio element
    let currentlyPlaying = null;
    
    // If playlist is empty
    if (playlist.length === 0) {
        playlistContainer.innerHTML = `
            <div class="empty-playlist">
                <i class="fas fa-music" style="font-size: 3em; margin-bottom: 20px; color: #1db954;"></i>
                <h2>Your playlist is empty</h2>
                <p>Go to the player and add some songs!</p>
            </div>
        `;
        return;
    }
    
    // Display each song in the playlist
    playlist.forEach((song, index) => {
        const playlistItem = document.createElement("div");
        playlistItem.className = "playlist-item";
        console.log(song);
        playlistItem.innerHTML = `
        <img src="${song.coverImage}" alt="${song.title}" class="song-image" 
             onerror="this.src='../images/default-cover.jpg'">
        
        <div class="song-info">
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>

        </div>
        
        <audio src="${song.audioUrl}" data-index="${index}"></audio>
        
        <div class="controls-container">
            <button class="play-button" data-index="${index}">
                <i class="fas fa-play-circle"></i>
            </button>
            
            <button class="remove-button" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
        
        playlistContainer.appendChild(playlistItem);
    });
    
    // Get all audio elements
    const audioElements = document.querySelectorAll("audio");
    
    // Add event listeners for play buttons
    document.querySelectorAll(".play-button").forEach((button, buttonIndex) => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            const audioToPlay = audioElements[buttonIndex];
            
            // If there's a song currently playing and it's not the one we're clicking
            if (currentlyPlaying && currentlyPlaying !== audioToPlay) {
                // Pause the currently playing song
                currentlyPlaying.pause();
                
                // Reset the icon of the previous play button
                const previousIndex = currentlyPlaying.getAttribute("data-index");
                const previousButton = document.querySelector(`.play-button[data-index="${previousIndex}"]`);
                if (previousButton) {
                    previousButton.innerHTML = '<i class="fas fa-play-circle"></i>';
                }
            }
            
            // If the audio is paused or stopped, play it
            if (audioToPlay.paused) {
                audioToPlay.play();
                currentlyPlaying = audioToPlay;
                button.innerHTML = '<i class="fas fa-pause-circle"></i>'; // Change to pause icon
            } else {
                // If the audio is playing, pause it
                audioToPlay.pause();
                currentlyPlaying = null;
                button.innerHTML = '<i class="fas fa-play-circle"></i>'; // Change to play icon
            }
        });
    });
    
    // When audio ends, reset the button icon
    audioElements.forEach((audio, index) => {
        audio.addEventListener("ended", () => {
            const button = document.querySelector(`.play-button[data-index="${index}"]`);
            if (button) {
                button.innerHTML = '<i class="fas fa-play-circle"></i>';
            }
            currentlyPlaying = null;
        });
    });
    
    // Add event listeners for remove buttons
    document.querySelectorAll(".remove-button").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            const songToRemove = playlist[index];
            
            // Show SweetAlert confirmation
            Swal.fire({
                title: 'Remove Song?',
                html: `Are you sure you want to remove "${songToRemove.title}" by ${songToRemove.artist} from your playlist?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: spotifyColors.green,
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, remove it!',
                background: spotifyColors.black,
                color: spotifyColors.white
            }).then((result) => {
                if (result.isConfirmed) {
                    // If this song is currently playing, stop it
                    const audioToRemove = audioElements[index];
                    if (currentlyPlaying === audioToRemove) {
                        audioToRemove.pause();
                        currentlyPlaying = null;
                    }
                    
                    // Remove the song from playlist
                    playlist.splice(index, 1);
                    localStorage.setItem("myPlaylist", JSON.stringify(playlist));
                    
                    // Show success message
                    Swal.fire({
                        title: 'Removed!',
                        text: `"${songToRemove.title}" has been removed from your playlist.`,
                        icon: 'success',
                        confirmButtonColor: spotifyColors.green,
                        background: spotifyColors.black,
                        color: spotifyColors.white
                    }).then(() => {
                        // Refresh the page to update the list
                        location.reload();
                    });
                }
            });
        });
    });
});