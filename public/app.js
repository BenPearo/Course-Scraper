document.addEventListener("DOMContentLoaded", e => {

    const app = firebase.app();

    const db = firebase.firestore();

    fetch('https://us-central1-course-scraper.cloudfunctions.net/api/dog')
        .then(console.log)
        .catch(e => {
            console.log("Fetch failed");
            console.error(e);
        });


    const testEndpoint = firebase.functions().httpsCallable('api/dog');
    testEndpoint("")
        .then(res => {
            console.log(res);
        })
        .catch(e => {
            console.log("https call failed");
            console.error(e);
        });

});

function updatePost(e) {
    const db = firebase.firestore();
    const myPost = db.collection('posts').doc('firstpost');
    myPost.update({
        title: e.target.value
    });
}

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            console.log(`Hello ${user.displayName}`);
        });
}

function uploadFile(files) {
    const storageRef = firebase.storage().ref();
    const file = files.item(0);
    const horseRef = storageRef.child(`images/${file.name}`);


    const task = horseRef.put(file);

    task.then(snapshot => {
        console.log(snapshot);
        snapshot.ref.getDownloadURL()
            .then(url => {
                document.querySelector('#imgUpload').setAttribute('src', url);
            });
    });
}