
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
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
const author=getAuth(app)







let signupbtn=document.getElementById("signupbtn")
let loginbtn=document.getElementById("loginbtn")

signupbtn.addEventListener("click",()=>{
    let signupModal=new bootstrap.Modal(document.getElementById("signupModal"))
    signupModal.show()

})
let SignupSubmit=document.getElementById("SignupSubmit")
SignupSubmit.addEventListener("click", async()=>{
    let signupName =document.getElementById("signupName").value.trim()
    let signupEmail =document.getElementById("signupEmail").value.trim()
    let signupPassword =document.getElementById("signupPassword").value.trim()

   if(signupName===""||signupEmail===""||signupPassword===""){
    Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please fill in all the required fields.',
        
      })
      .then( ()=>{
        signupModal.show()
      })
      return;
      }
      try{
  
        await  createUserWithEmailAndPassword(author,signupEmail,signupPassword).then(()=>{
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'You have successfully registered.',
               showConfirmButton: false, 
                timer: 1500 
              }).then(()=>{
                document.getElementById("signupName").textContent=""
                document.getElementById("signupEmail").textContent=""
                document.getElementById("signupPassword").textContent=""
              })

        })


      }
      catch(err){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err,
          })
    }
  
   
    
})

loginbtn.addEventListener("click",()=>{
  let loginModal=new bootstrap.Modal(document.getElementById("loginModal"))
  loginModal.show()
})
 let LoginSubmit=document.getElementById("LoginSubmit")
 LoginSubmit.addEventListener("click", async()=>{
  let loginEmail=document.getElementById("loginEmail").value.trim()
  let loginPassword=document.getElementById("loginPassword").value.trim()

  if(loginEmail===""||loginPassword===""){
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Please fill in all the required fields.',
    }).then(()=>{
      loginModal.show()
   })
   return;
  }
  try{
    await signInWithEmailAndPassword(author,signupEmail,signupPassword).then(()=>{
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: `Welcome back, ${user.email}`,
        showConfirmButton: false,
        timer: 1500
      }).then(()=>{
       location.href="../home.html"
      })
       document.getElementById("loginEmail").textContent=""
        document.getElementById("loginPassword").textContent=""
    })
     
  }
  catch(err){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err,
    })

  }

 })