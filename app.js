// app.js (client-side code)

const firebaseConfig = {
    apiKey: "AIzaSyBbyQXkwsZgD3Lf0KmR5Rbg2qet1S-H9PY",
    authDomain: "orthodox-a9df0.firebaseapp.com",
    projectId: "orthodox-a9df0",
    storageBucket: "orthodox-a9df0.firebasestorage.app",
    messagingSenderId: "695206212496",
    appId: "1:695206212496:web:4710ed6487193b63cbf915",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const authBtn = document.getElementById('auth-btn');
const postContainer = document.getElementById('posts');
const newPostTextArea = document.getElementById('new-post');
const postBtn = document.getElementById('post-btn');

auth.onAuthStateChanged(user => {
    if (user) {
        authBtn.textContent = 'Logout';
        loadPosts();
    } else {
        authBtn.textContent = 'Login';
        postContainer.innerHTML = '<p>Please login to post.</p>';
    }
});

authBtn.addEventListener('click', () => {
    if (auth.currentUser) {
        auth.signOut();
    } else {
        window.location.href = 'login.html';  // Redirect to a login page
    }
});

postBtn.addEventListener('click', () => {
    if (auth.currentUser && newPostTextArea.value) {
        db.collection('posts').add({
            text: newPostTextArea.value,
            uid: auth.currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        newPostTextArea.value = '';
    }
});

function loadPosts() {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        postContainer.innerHTML = '';
        snapshot.forEach(doc => {
            const post = doc.data();
            postContainer.innerHTML += `<div class="post">
                <p>${post.text}</p>
            </div>`;
        });
    });
}
