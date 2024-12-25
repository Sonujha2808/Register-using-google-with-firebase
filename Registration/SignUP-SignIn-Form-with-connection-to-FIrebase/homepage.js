import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
    //add firebaseConfig from website 
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        console.log("Logged in user ID:", loggedInUserId);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    console.log("User data:", userData);
                    document.getElementById('loggedUserFName').innerText = userData.firstName;
                    document.getElementById('loggedUserEmail').innerText = userData.email;
                    document.getElementById('loggedUserLName').innerText = userData.lastName;
                } else {
                    console.error("No document found matching ID");
                }
            })
            .catch((error) => {
                console.error("Error getting document:", error);
            });
    } else {
        console.error("User ID not found in local storage");
        window.location.href = '/index.html'; // Redirect to login page
    }
});

const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
        .then(() => {
            console.log("User signed out successfully.");
            window.location.href = './index.html';
        })
        .catch((error) => {
            console.error("Error signing out:", error);
        });
});
