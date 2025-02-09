import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBDGJ5CaMG7XVltrSJ1VEqiaOonivmy0eg",
    authDomain: "audio-alley-authentication.firebaseapp.com",
    projectId: "audio-alley-authentication",
    storageBucket: "audio-alley-authentication.firebasestorage.app",
    messagingSenderId: "265076676307",
    appId: "1:265076676307:web:7c6e8b341fb3d3cf7c6626"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Validation Functions
function validateName(name) {
    const nameRegex = /^[A-Za-z\s]{2,30}$/;
    if (name.trim() === "") {
        return { isValid: false, error: "Name is required" };
    }
    if (!nameRegex.test(name)) {
        return { isValid: false, error: "Name should only contain letters and be 2-30 characters long" };
    }
    return { isValid: true, error: null };
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() === "") {
        return { isValid: false, error: "Email is required" };
    }
    if (!emailRegex.test(email)) {
        return { isValid: false, error: "Please enter a valid email address" };
    }
    return { isValid: true, error: null };
}

function validatePassword(password) {
    if (password.trim() === "") {
        return { isValid: false, error: "Password is required" };
    }
    if (password.length < 8) {
        return { isValid: false, error: "Password must be at least 8 characters long" };
    }
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, error: "Password must contain at least one uppercase letter" };
    }
    if (!/[a-z]/.test(password)) {
        return { isValid: false, error: "Password must contain at least one lowercase letter" };
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, error: "Password must contain at least one number" };
    }
    return { isValid: true, error: null };
}

// Real-time validation feedback
function addInputValidation(inputElement, validationFunction) {
    inputElement.addEventListener('input', () => {
        const result = validationFunction(inputElement.value);
        if (!result.isValid) {
            inputElement.classList.add('is-invalid');
            inputElement.classList.remove('is-valid');
            
            // Create or update feedback message
            let feedback = inputElement.nextElementSibling;
            if (!feedback || !feedback.classList.contains('invalid-feedback')) {
                feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                inputElement.parentNode.appendChild(feedback);
            }
            feedback.textContent = result.error;
        } else {
            inputElement.classList.remove('is-invalid');
            inputElement.classList.add('is-valid');
            
            // Remove error message if exists
            const feedback = inputElement.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.remove();
            }
        }
    });
}

// Signup Form Validation
document.getElementById('signupbtn').addEventListener('click', () => {
    const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
    signupModal.show();
});

document.getElementById('SignupSubmit').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    
    const nameValidation = validateName(nameInput.value);
    const emailValidation = validateEmail(emailInput.value);
    const passwordValidation = validatePassword(passwordInput.value);
    
    // Check all validations
    if (!nameValidation.isValid || !emailValidation.isValid || !passwordValidation.isValid) {
        let errorMessage = "Please fix the following errors:\n";
        if (!nameValidation.isValid) errorMessage += `- ${nameValidation.error}\n`;
        if (!emailValidation.isValid) errorMessage += `- ${emailValidation.error}\n`;
        if (!passwordValidation.isValid) errorMessage += `- ${passwordValidation.error}\n`;
        
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: errorMessage,
            confirmButtonColor: '#580052'
        });
        return;
    }
    
    // If validation passes, proceed with signup
    try {
        const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
        await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
        
        Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: 'You can now log in with your credentials',
            confirmButtonColor: '#580052'
        }).then(() => {
            signupModal.hide();
            // Clear the form
            nameInput.value = '';
            emailInput.value = '';
            passwordInput.value = '';
            // Show login modal
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.message,
            confirmButtonColor: '#580052'
        });
    }
});

// Login Form Validation
document.getElementById('loginbtn').addEventListener('click', () => {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
});

document.getElementById('LoginSubmit').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    const emailValidation = validateEmail(emailInput.value);
    const passwordValidation = validatePassword(passwordInput.value);
    
    if (!emailValidation.isValid || !passwordValidation.isValid) {
        let errorMessage = "Please fix the following errors:\n";
        if (!emailValidation.isValid) errorMessage += `- ${emailValidation.error}\n`;
        if (!passwordValidation.isValid) errorMessage += `- ${passwordValidation.error}\n`;
        
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: errorMessage,
            confirmButtonColor: '#580052'
        });
        return;
    }
    
    // If validation passes, proceed with login
    try {
        await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
        
        Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'Redirecting to dashboard...',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "./dashboard/home.html";
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password',
            confirmButtonColor: '#580052'
        });
    }
});

// Add real-time validation to all inputs
document.addEventListener('DOMContentLoaded', () => {
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    
    addInputValidation(signupName, validateName);
    addInputValidation(signupEmail, validateEmail);
    addInputValidation(signupPassword, validatePassword);
    addInputValidation(loginEmail, validateEmail);
    addInputValidation(loginPassword, validatePassword);
});
