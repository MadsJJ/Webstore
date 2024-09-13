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

let logOutEl = document.querySelector("#logOut");
logOutEl.addEventListener("click", LogOut);

function LogOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("Sign-out successful.");
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
      return;
    });
  location.href = "login.html";
}

let firstnameEl = document.querySelector("#firstname");
let lastnameEl = document.querySelector("#lastname");
let emailEl = document.querySelector("#email");
let employerEl = document.querySelector("#employer");
let employeeEl = document.querySelector("#employee");

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    db.collection("Users")
      .doc(user.uid)
      .get()
      .then((dcmnt) => {
        if (dcmnt) {
          firstnameEl.innerHTML = dcmnt.data().firstname;
          lastnameEl.innerHTML = dcmnt.data().lastname;
          emailEl.innerHTML = dcmnt.data().email;
          employerEl.innerHTML = dcmnt.data().employerDescription;
          employeeEl.innerHTML = dcmnt.data().employeeDescription;
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }
});
