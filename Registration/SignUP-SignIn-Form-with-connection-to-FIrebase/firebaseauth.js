
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
//code from firebaseConfig website 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Function to show messages
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Signup with email and password
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName
            };
            showMessage('Account Created Successfully', 'signUpMessage');
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error("Error writing document", error);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode == 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists !!!', 'signUpMessage');
            } else {
                showMessage('Unable to create User', 'signUpMessage');
            }
        });
});

// Signin with email and password
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Login is successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = 'homepage.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Account does not Exist', 'signInMessage');
            }
        });
});



// Google Sign-In
const googleSignInButtons = [
    document.getElementById('googleSignUp'),
    document.getElementById('googleSignIn')
];

googleSignInButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                const db = getFirestore();
                const userData = {
                    email: user.email,
                    firstName: user.displayName.split(" ")[0] || "",
                    lastName: user.displayName.split(" ")[1] || "",
                    photoURL: user.photoURL || ""
                };

                // Save user data to Firestore
                const docRef = doc(db, "users", user.uid);
                setDoc(docRef, userData, { merge: true })
                    .then(() => {
                        showMessage("Login successful! Redirecting...", "signInMessage");
                        localStorage.setItem('loggedInUserId', user.uid);
                        window.location.href = 'homepage.html';
                    })
                    .catch((error) => {
                        console.error("Error saving user data:", error);
                        showMessage("Error saving user data.", "signInMessage");
                    });
            })
            .catch((error) => {
                console.error("Google login error:", error);
                showMessage("Login failed. Please try again.", "signInMessage");
            });
    });
});
