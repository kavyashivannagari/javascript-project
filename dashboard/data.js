import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBDGJ5CaMG7XVltrSJ1VEqiaOonivmy0eg",
    authDomain: "audio-alley-authentication.firebaseapp.com",
    projectId: "audio-alley-authentication",
    storageBucket: "audio-alley-authentication.appspot.com",
    messagingSenderId: "265076676307",
    appId: "1:265076676307:web:7c6e8b341fb3d3cf7c6626"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 🎵 Add Song to Firebase
document.getElementById("songdata").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form refresh

    // Get values from form
    const songData = {
        id: document.getElementById("id").value.trim(),
        title: document.getElementById("songname").value.trim(),
        album: document.getElementById("songalbum").value.trim(),
        artist: document.getElementById("artist").value.trim(),
        coverImage: document.getElementById("coverimage").value.trim(),
        audioUrl: document.getElementById("audiourl").value.trim(),
        musicDirector: document.getElementById("musicdirector").value.trim(),
        actors: document.getElementById("actors").value.trim(),
        writer: document.getElementById("writer").value.trim(),
        releaseYear: document.getElementById("releaseyear").value.trim(),
        language: document.getElementById("language").value.trim(),
        category: document.getElementById("category").value.trim()
    };

    const language = songData.language;
    const category = songData.category;

    // Reference to the specific language and category in the database
    const dbref = ref(database, `songs/${language}/${category}`);

    try {
        // Push the song data to the database
        await push(dbref, songData);
        alert("Data saved successfully!");
        e.target.reset(); // Reset the form
    } catch (error) {
        alert("Error in adding data: " + (error.message || error));
        console.error(error);
    }
});