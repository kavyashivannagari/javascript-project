
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
// Get all input elements within the signup and login forms
const signupInputs = document.querySelectorAll('#signupForm input');
const loginInputs = document.querySelectorAll('#loginForm input');

// Function to handle keyboard navigation within a form
// function handleKeyboardNavigation(inputs) {
//   inputs.forEach((input, index) => {
//     input.addEventListener('keydown', (event) => {
//       if (event.key === 'Enter') {
//         event.preventDefault(); // Prevent form submission on Enter

//         // Move focus to the next input or submit the form
//         if (index < inputs.length - 1) {
//           inputs[index + 1].focus(); 
//         } else {
          
//           input.form.submit(); 
//         }
//       }
//     });
//   });
// }

// // Apply keyboard navigation to both signup and login forms
// handleKeyboardNavigation(signupInputs);
// handleKeyboardNavigation(loginInputs);






let signupbtn=document.getElementById("signupbtn")
let loginbtn=document.getElementById("loginbtn")

signupbtn.addEventListener("click",()=>{
    let signupModal=new bootstrap.Modal(document.getElementById("signupModal"))
    signupModal.show()
    let SignupSubmit=document.getElementById("SignupSubmit")
SignupSubmit.addEventListener("click", async()=>{
    let signupName =document.getElementById("signupName").value.trim()
    let signupEmail =document.getElementById("signupEmail").value.trim()
    let signupPassword =document.getElementById("signupPassword").value.trim()

   if(signupName===""||signupEmail===""||signupPassword===""){
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Please fill out all the fields!',
      confirmButtonColor: '#FF5733', // Orange color
      confirmButtonText: 'Try Again',
      confirmButtonColor: '#000', // Black color
      customClass: {
        popup: 'my-popup' // Add a custom class for styling
      }
    }).then( ()=>{
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
            confirmButtonColor: '#3085d6', // Blue color
            confirmButtonText: 'Ok',
            customClass: {
              popup: 'my-popup' // Add a custom class for styling
            }
          }).then(() => {
            // let signupModal = new bootstrap.Modal(document.getElementById("signupModal"));
            signupModal.hide(); 
          
            document.getElementById("signupName").value = "";
            document.getElementById("signupEmail").value = "";
            document.getElementById("signupPassword").value = "";
            let loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
            loginModal.show();
          
           
          });


      })
    }
      catch(err){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err,
          confirmButtonColor: '#FF5733', // Orange color
          confirmButtonText: 'Ok',
          customClass: {
            popup: 'my-popup' // Add a custom class for styling
          }
        })
    }
  
   
    
})

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
      text: 'Please fill out all the fields!',
      confirmButtonColor: '#FF5733', // Orange color
      confirmButtonText: 'Try Again',
      // confirmButtonColor: '#000', // Black color
      customClass: {
        popup: 'my-popup' // Add a custom class for styling
      }
    }).then(()=>{
    loginModal.show()
   })
   return;
  }
  try{
    await signInWithEmailAndPassword(author,loginEmail,loginPassword).then(()=>{
      Swal.fire({
        icon: 'success',
        title: 'login Successful!',
        text: 'You have successfully loggedin.',
       showConfirmButton: false, 
        timer: 1500 
      }).then(()=>{
         document.getElementById("loginEmail").textContent=""
        document.getElementById("loginPassword").textContent=""
       location.href="./dashboard/home.html"

      })
      
    })
     
  }
  catch(err){
    Swal.fire({
      icon: 'error', 
      title: 'Invalid Credentials',
      text: 'Invalid email or password',
      showConfirmButton: true, 
      confirmButtonText: 'Try Again',
      confirmButtonColor: 'orangered', 
      // confirmButtonTextColor: '#FF5733' 
    });

  }

 })