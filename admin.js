// admin.js (admin-side code)

const logoutBtn = document.getElementById('logout-btn');
const postList = document.getElementById('post-list');

logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        window.location.href = 'index.html'; // Redirect to home page after logout
    });
});

firebase.auth().onAuthStateChanged(user => {
    if (user && user.uid === 'YOUR_ADMIN_UID') {  // Check if user is admin
        loadPostsForAdmin();
    } else {
        window.location.href = 'index.html';  // If not admin, redirect
    }
});

function loadPostsForAdmin() {
    firebase.firestore().collection('posts').get().then(snapshot => {
        snapshot.forEach(doc => {
            const post = doc.data();
            const listItem = document.createElement('li');
            listItem.textContent = post.text;
            postList.appendChild(listItem);
        });
    });
}
