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

// definerer elementer
let mobilListeEl = document.querySelector(".hovedListe");
let totalSumEl = document.querySelector("#totalSum");

let purchaseButtonEl = document.querySelector("#purchase");
let emptySCButtonEl = document.querySelector("#emptySC");

let priceList = [];
let totalSum = 0;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    let uid = user.uid;

    // Lytter etter endringer i databasen
    db.collection("Users")
      .doc(uid)
      .collection("ShoppingCart")
      .onSnapshot(() => {
        // Kaller funksjonen oppdater(), som lager huskelisten på nytt
        update();
      });
  } else {
    return;
  }
});

// oppdaterer lista (kjører displaylist)
function update() {
  // Henter data. Når første bit er ferdig hentet, starter "then"-biten
  db.collection("Users")
    .doc(auth.currentUser.uid)
    .collection("ShoppingCart")
    .where("ProductCount", ">", 0)
    // .orderBy("LastUpdated", "asc")
    .orderBy("ProductCount", "desc")
    .get()
    .then((dcmnts) => {
      // Tømmer listeelementet (<div>-elementet der huskelisten lages)
      mobilListeEl.innerHTML = "";

      // Tømmer totalpriselement
      priceList = [];
      totalSum = 0;

      // Går gjennom dokumentene og lager et element for hvert av dem
      dcmnts.forEach((dcmnt) => {
        DisplayList(dcmnt);
        PriceList(dcmnt);
      });
    })
    .then(() => {
      for (let i = 0; i < priceList.length; i++) {
        totalSum += priceList[i];
      }
      totalSumEl.innerHTML = totalSum + ",-";
    });
}

function DisplayList(dcmnt) {
  let listePunkt = document.createElement("li");
  mobilListeEl.appendChild(listePunkt);

  let listItemTemplate = document.createElement("div");
  listItemTemplate.classList = "listItemTemplate";
  listePunkt.appendChild(listItemTemplate);

  // venstre del av grid
  let listGridLeft = document.createElement("div");
  listGridLeft.classList = "listGridLeft";
  listItemTemplate.appendChild(listGridLeft);

  let mobilBilde = document.createElement("div");
  mobilBilde.classList = "mobilBilde";
  listGridLeft.appendChild(mobilBilde);

  let image = document.createElement("img");
  mobilBilde.appendChild(image);

  if (dcmnt.data().Name == "Apple AirPods Pro") {
    image.classList = "logoApple";
    image.src = dcmnt.data().ImagePath;
    image.alt = "Apple Airpods Pro";
  } else if (dcmnt.data().Name == "Apple AirPods Max") {
    image.classList = "logoTest";
    image.src = dcmnt.data().ImagePath;
    image.alt = "Apple Airpods Max";
  } else if (dcmnt.data().Name == "JBL PartyBox 310") {
    image.classList = "logoApple";
    image.src = dcmnt.data().ImagePath;
    image.alt = "JBL PartyBox 310";
  } else if (dcmnt.data().Name == "Jabra Elite 75T") {
    image.classList = "logoApple";
    image.src = dcmnt.data().ImagePath;
    image.alt = "Jabra Elite 75T";
  } else if (dcmnt.data().Name == "Sony WH-1000XM3") {
    image.classList = "logoApple";
    image.src = dcmnt.data().ImagePath;
    image.alt = "Sony WH-1000XM3";
  } else if (dcmnt.data().Name == "Sony WF-1000XM3") {
    image.classList = "logoApple";
    image.src = dcmnt.data().ImagePath;
    image.alt = "Sony WF-1000XM3";
  }

  // midtre del av grid
  let listGridMiddle = document.createElement("div");
  listGridMiddle.classList = "listGridMiddle";
  listItemTemplate.appendChild(listGridMiddle);

  let mobilNavn = document.createElement("div");
  mobilNavn.classList = "mobilNavn";
  listGridMiddle.appendChild(mobilNavn);
  mobilNavn.innerHTML = dcmnt.data().Name;

  // product Count
  let listGridProductCount = document.createElement("div");
  listGridProductCount.classList = "listGridProductCount";
  listItemTemplate.appendChild(listGridProductCount);

  let changeCountGrid = document.createElement("div");
  changeCountGrid.classList = "changeCountGrid";
  listGridProductCount.appendChild(changeCountGrid);

  let minus = document.createElement("div");
  minus.classList = "minus";
  changeCountGrid.appendChild(minus);
  minus.innerHTML = "-";
  minus.addEventListener("click", () => SubtractProductCount(dcmnt.id));

  let number = document.createElement("div");
  number.classList = "number";
  changeCountGrid.appendChild(number);
  number.innerHTML = dcmnt.data().ProductCount;

  let plus = document.createElement("div");
  plus.classList = "plus";
  changeCountGrid.appendChild(plus);
  plus.innerHTML = "+";
  plus.addEventListener("click", () => AddProductCount(dcmnt.id));

  // høyre del av grid
  let listGridRight = document.createElement("div");
  listGridRight.classList = "listGridRight";
  listItemTemplate.appendChild(listGridRight);

  let mobilPris = document.createElement("div");
  mobilPris.classList = "mobilPris";
  listGridRight.appendChild(mobilPris);
  mobilPris.innerHTML = dcmnt.data().Price * dcmnt.data().ProductCount + ",-";
}

function PriceList(dcmnt) {
  priceList.push(dcmnt.data().Price * dcmnt.data().ProductCount);
}

function AddProductCount(id) {
  let docRef = db
    .collection("Users")
    .doc(auth.currentUser.uid)
    .collection("ShoppingCart")
    .doc(id);

  docRef.get().then((dcmnt) => {
    let currentCount = dcmnt.data().ProductCount;

    docRef.update({
      ProductCount: currentCount + 1,
    });
  });
}

function SubtractProductCount(id) {
  let docRef = db
    .collection("Users")
    .doc(auth.currentUser.uid)
    .collection("ShoppingCart")
    .doc(id);

  docRef.get().then((dcmnt) => {
    let currentCount = dcmnt.data().ProductCount;

    if (currentCount == 0) {
      return;
    } else {
      docRef.update({
        ProductCount: currentCount - 1,
      });
    }
  });
}

function Purchase() {
  alert("Thank you for your purchase!");
}
purchaseButtonEl.addEventListener("click", Purchase);

// Funksjon som sletter elementene fra huskelisten
function DeleteJobs(e) {
  let dbRef = db
    .collection("Users")
    .doc(auth.currentUser.uid)
    .collection("ShoppingCart");

  dbRef.get().then((dcmnts) => {
    dcmnts.forEach((dcmnt) => {
      dbRef.doc(dcmnt.id).delete();
    });
  });
}
emptySCButtonEl.addEventListener("click", DeleteJobs);
