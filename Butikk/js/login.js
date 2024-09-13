// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJr0_WO_Zy_3933wkBSa3mhUgmhepxOdw",
  authDomain: "butikk-676cd.firebaseapp.com",
  projectId: "butikk-676cd",
  storageBucket: "butikk-676cd.appspot.com",
  messagingSenderId: "716185080539",
  appId: "1:716185080539:web:322fd5083813fa38fd32fe",
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const auth = firebase.auth();

// login
let loginButton = document.querySelector("#button");
let password = document.querySelector("#password");
let email = document.querySelector("#email");

loginButton.addEventListener("click", () => {
  // log the user in
  auth
    .signInWithEmailAndPassword(email.value, password.value)
    .then(() => {
      let id = auth.currentUser.uid;
      db.collection("Users")
        .doc(id)
        .update({
          lastLogin: new Date(),
        })
        .then(() => {
          location.href = "index.html";
        });
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
      return;
    });
});

// // listen for auth status changes
// auth.onAuthStateChanged((user) => {
//   if (user) {
//     console.log("user logged in: ", user);
//     console.log("Her er det " + auth.currentUser);
//   } else {
//     console.log("user logged out");
//   }
// });

// console.log(auth.currentUser.uid);
