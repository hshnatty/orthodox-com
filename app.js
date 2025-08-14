// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-analytics.js";

// Your Firebase config (use your actual values here)
const firebaseConfig = {
  apiKey: "AIzaSyBbyQXkwsZgD3Lf0KmR5Rbg2qet1S-H9PY",
  authDomain: "orthodox-a9df0.firebaseapp.com",
  projectId: "orthodox-a9df0",
  storageBucket: "orthodox-a9df0.firebasestorage.app",
  messagingSenderId: "695206212496",
  appId: "1:695206212496:web:4710ed6487193b63cbf915",
  measurementId: "G-7L93XVMJ0G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Get references to the HTML elements
const authBtn = document.getElementById('auth-btn');
const postContainer = document.getElementById('posts');
const newPostTextArea = document.getElementById('new-post');
const postBtn = document.getElementById('post-btn');

// Handle user authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    authBtn.textContent = 'Logout';
    loadPosts(); // Load posts if the user is authenticated
  } else {
    authBtn.textContent = 'Login';
    postContainer.innerHTML = '<p>Please login to post.</p>';
  }
});

// Log out user
authBtn.addEventListener('click', () => {
  if (auth.currentUser) {
    signOut(auth);
  } else {
    window.location.href = 'login.html';  // Redirect to login page
  }
});

// Handle new post submission
postBtn.addEventListener('click', () => {
  if (auth.currentUser && newPostTextArea.value) {
    addDoc(collection(db, "posts"), {
      text: newPostTextArea.value,
      uid: auth.currentUser.uid,
      timestamp: new Date(),
    }).then(() => {
      newPostTextArea.value = ''; // Clear textarea after posting
    });
  }
});

// Load posts from Firestore
function loadPosts() {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, orderBy("timestamp", "desc"));

  onSnapshot(q, (snapshot) => {
    postContainer.innerHTML = ''; // Clear existing posts
    snapshot.forEach(doc => {
      const post = doc.data();
      postContainer.innerHTML += `<div class="post">
        <p>${post.text}</p>
      </div>`;
    });
  });
}
