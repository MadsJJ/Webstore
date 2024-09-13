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

let submit = document.querySelector("#button");
submit.addEventListener("click", register);

function register() {
  email = document.querySelector("#email").value;
  password = document.querySelector("#password").value;
  firstname = document.querySelector("#firstName").value;
  lastname = document.querySelector("#lastName").value;

  if (!validateEmail(email) || !validatePassword(password)) {
    alert("error");
    return;
  }

  auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      let user = auth.currentUser;

      db.collection("Users")
        .doc(user.uid)
        .set({
          email: email,
          password: password,
          lastLogin: new Date(),
          dateCreated: new Date(),
          firstname: firstname,
          lastname: lastname,
        })
        .then(() => {
          location.href = "index.html";
        });
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);

      alert(error.code);
      alert(error.message);
      return;
    });
}

function validateEmail(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/;
  if (expression.test(email) == true) {
    return true;
  } else {
    alert("invalid email");
    return false;
  }
}

function validatePassword(password) {
  if (password.length < 6) {
    alert("need minimum password length of 6");
    return false;
  } else {
    return true;
  }
}

// //Test if something is not blank
// function validateField(field) {
//   if (field == null) {
//     console.log("field missing");
//     return false;
//   }
//   if (field.length <= 0) {
//     console.log("field missing");
//     return false;
//   } else {
//     return true;
//   }
// }

// listen for auth status changes
