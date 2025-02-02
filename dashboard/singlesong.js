import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

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
import{card} from "./home.js"
