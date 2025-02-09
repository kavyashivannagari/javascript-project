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


const songAudio = document.getElementById("songAudio");
const playPauseBtn = document.getElementById("playPauseBtn");
const rewindBtn = document.getElementById("rewindBtn");
const fastForwardBtn = document.getElementById("fastForwardBtn");
const playPauseIcon = playPauseBtn.querySelector("i");

// Play or Pause the song
playPauseBtn.addEventListener("click", () => {
    if (songAudio.paused) {
        songAudio.play();
        playPauseIcon.classList.replace("fa-play", "fa-pause");
    } else {
        songAudio.pause();
        playPauseIcon.classList.replace("fa-pause", "fa-play");
    }
});

// Rewind the song by 5 seconds
rewindBtn.addEventListener("click", () => {
    songAudio.currentTime = Math.max(0, songAudio.currentTime - 5);
});

// Fast-forward the song by 5 seconds
fastForwardBtn.addEventListener("click", () => {
    songAudio.currentTime = Math.min(songAudio.duration, songAudio.currentTime + 5);
});

