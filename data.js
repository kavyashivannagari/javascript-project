import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref,push } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyBDGJ5CaMG7XVltrSJ1VEqiaOonivmy0eg",
    authDomain: "audio-alley-authentication.firebaseapp.com",
    projectId: "audio-alley-authentication",
    storageBucket: "audio-alley-authentication.firebasestorage.app",
    messagingSenderId: "265076676307",
    appId: "1:265076676307:web:7c6e8b341fb3d3cf7c6626"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);




const songdata=document.getElementById("songdata")
const postbtn=document.getElementById("postbtn")
postbtn.addEventListener("click",(e)=>{
    e.preventDefault()
    const id=document.getElementById("id").value;
    const songname=document.getElementById("songname").value;
    const songalbum=document.getElementById("songalbum").value;
    const artist=document.getElementById("artist").value;
    const coverimage=document.getElementById("coverimage").value;
    const audiourl=document.getElementById("audiourl").value;
    const musicdirector=document.getElementById("musicdirector").value;
    const releaseyear=document.getElementById("releaseyear").value;
    const language=document.getElementById("language").value;
    const category=document.getElementById("category").value;


    // Create a data object
    const songData = {
        songid:id,
        songname: songname,
        songalbum: songalbum,
        artist:artist,
        coverimage: coverimage,
        audiourl:audiourl,
        musicdirector:musicdirector,
        releaseyear: releaseyear,
        language: language,
        category:category
    };


     // Get a reference to the location in the database
     const songsRef = ref(getDatabase(), `songs/${language}/${category}`);  
      // Push the song data to the specified location
    push(songsRef, songData)
    .then(() => {
        console.log("Data saved successfully!");
        songdata.reset(); 
    })
    .catch((error) => {
        console.error("Error writing to database:", error);
    });
  

})