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

let containerEl = document.querySelector("#container");

let selectedJobContainerEl = document.querySelector("#selectedJobContainer");

// definere elementer
let jobCardsContainerEl = document.querySelector("#jobCardsContainer");
let listContainerEl = document.querySelector("#listContainer");
let jobDescriptionContainerEl = document.querySelector(
  "#jobDescriptionContainer"
);
let listSortEl = document.querySelector("#listSort");
let sortEl = document.querySelector("#sort");
let listFilterEl = document.querySelector("#listFilter");
let filterEl = document.querySelector("#filter");
let userIconEl = document.querySelector("#uIcon");
let listEl = document.querySelector("#listContainer");
let mobilListeEl = document.querySelector(".hovedListe");

auth.onAuthStateChanged((user) => {
  if (user) {
    return;
  } else {
    location.href = "login.html";
  }
});

// sjekker om man er logget inn (viser logg inn knapp eller user icon og welcome "navn").
auth.onAuthStateChanged((user) => {
  if (user) {
    db.collection("Users")
      .doc(user.uid)
      .get()
      .then((dcmnt) => {
        if (dcmnt.exists) {
          let topLayerEl = document.querySelector("#topLayer");

          let welcomeDiv = document.createElement("div");
          topLayerEl.appendChild(welcomeDiv);
          welcomeDiv.setAttribute("id", "welcomeDiv");

          welcomeDiv.innerHTML = "Welcome " + dcmnt.data().firstname + "!";
        } else {
          // dcmnt.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  } else {
    let uIconUserEl = document.querySelector("#uIconUser");
    uIconUserEl.innerHTML = "";
    uIconUserEl.setAttribute("id", "uIconLogin");
    uIconUserEl.addEventListener("click", UserProfileLink);

    let logInDivEl = document.createElement("div");
    logInDivEl.setAttribute("id", "logInDiv");
    logInDivEl.innerHTML += "Log in or register";
    uIconUserEl.appendChild(logInDivEl);
  }
});

function UserProfileLink() {
  if (auth.currentUser) {
    location.href = "userProfile.html";
  } else {
    location.href = "login.html";
  }
}
let userProfileEl = document.querySelector(".fa-user-circle");
userProfileEl.addEventListener("click", UserProfileLink);

function ShoppingCartLink() {
  location.href = "shoppingCart.html";
}
let shoppingCartEl = document.querySelector("#shoppingCart");
shoppingCartEl.addEventListener("click", ShoppingCartLink);

// viser og skjuler sorteringsmeny
function showSort() {
  if (listSortEl.style.display != "block") {
    listSortEl.style.display = "block";
    listFilterEl.style.display = "none";
  } else {
    listSortEl.style.display = "none";
  }
}
sortEl.addEventListener("click", showSort);

// viser og skjuler filtermeny
function showFilter(e) {
  if (listFilterEl.style.display != "block") {
    listFilterEl.style.display = "block";
    listSortEl.style.display = "none";
  } else {
    listFilterEl.style.display = "none";
  }
}
filterEl.addEventListener("click", showFilter);

window.addEventListener("click", CloseFilter)
function CloseFilter(e) {
  if (!filterEl.contains(e.target) && !sortEl.contains(e.target)) {
    listFilterEl.style.display = "none"
    listSortEl.style.display = "none"
  }
  // else if (!sortEl.contains(e.target)) {
  //   listSortEl.style.display = "none"
  //   console.log("2");

  // }
}

// Lytter etter endringer i databasen
db.collection("Products").onSnapshot(() => {
  // Kaller funksjonen oppdater(), som lager huskelisten på nytt
  update();
});

// oppdaterer lista (kjører displaylist)
function update() {
  // Henter data. Når første bit er ferdig hentet, starter "then"-biten
  db.collection("Products")
    .orderBy("LastUpdated", "asc")
    .get()
    .then((dcmnts) => {
      // Tømmer listeelementet (<div>-elementet der huskelisten lages)
      mobilListeEl.innerHTML = "";

      // Går gjennom dokumentene og lager et element for hvert av dem
      dcmnts.forEach((dcmnt) => {
        DisplayList(dcmnt);
      });
    });
}

function DisplayList(dcmnt) {
  let listePunkt = document.createElement("li");
  mobilListeEl.appendChild(listePunkt);

  let listItemTemplate = document.createElement("div");
  listItemTemplate.classList = "listItemTemplate";
  listePunkt.appendChild(listItemTemplate);
  // listItemTemplate.addEventListener("mouseenter", (e) => MouseEnter(e.currentTarget))
  // listItemTemplate.addEventListener("mouseleave", (e) => MouseLeave(e.currentTarget))
  // listItemTemplate.addEventListener("mouseenter", () => MouseEnter(dcmnt.id))
  // listItemTemplate.addEventListener("mouseleave", () => MouseLeave(dcmnt.id))
  listItemTemplate.setAttribute("data-id", dcmnt.id);


  // venstre del av grid
  let listGridLeft = document.createElement("div");
  listGridLeft.classList = "listGridLeft";
  listItemTemplate.appendChild(listGridLeft);

  let mobilNavn = document.createElement("div");
  mobilNavn.classList = "mobilNavn";
  listGridLeft.appendChild(mobilNavn);
  mobilNavn.innerHTML = dcmnt.data().Name;

  let mobilPris = document.createElement("div");
  mobilPris.classList = "mobilPris";
  listGridLeft.appendChild(mobilPris);
  mobilPris.innerHTML = dcmnt.data().Price + ",-";

  // midtre del av grid
  let listGridMiddle = document.createElement("div");
  listGridMiddle.classList = "listGridMiddle";
  listItemTemplate.appendChild(listGridMiddle);
  listGridMiddle.setAttribute("data-id", dcmnt.id);


  let mobilInfo = document.createElement("div");
  mobilInfo.classList = "mobilInfo";
  listGridMiddle.appendChild(mobilInfo);
  mobilInfo.setAttribute("data-id", dcmnt.id);


  let mobilInfo2 = document.createElement("div");
  mobilInfo2.classList = "mobilInfo2";
  listGridMiddle.appendChild(mobilInfo2);
  mobilInfo2.innerHTML += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac mattis nisl. Integer purus leo, dignissim ac tincidunt eget, efficitur at velit. Proin convallis ullamcorper mattis. Maecenas ex velit, imperdiet et urna quis, suscipit rhoncus felis. Nulla quis sollicitudin est, sit amet cursus nisl. Donec ac accumsan nisi. Ut faucibus vulputate lorem ut consequat. Vivamus ullamcorper finibus erat, nec gravida nibh euismod id. Quisque sit amet pretium tellus."


  for (let i = 1; i < Object.keys(dcmnt.data().info).length + 1; i++) {
    if (i > 1) {
      mobilInfo.innerHTML += ", ";
    }
    mobilInfo.innerHTML += dcmnt.data().info[i];
  }


  let mobilDato = document.createElement("div");
  mobilDato.classList = "mobilDato";
  listGridMiddle.appendChild(mobilDato);
  mobilDato.innerHTML = "sist oppdatert: " + dcmnt.data().LastUpdated;

  // høyre del av grid
  let listGridRight = document.createElement("div");
  listGridRight.classList = "listGridRight";
  listItemTemplate.appendChild(listGridRight);

  let mobilBilde = document.createElement("div");
  mobilBilde.classList = "mobilBilde";
  listGridRight.appendChild(mobilBilde);

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

  // kjøp del
  let listGridBuy = document.createElement("div");
  listGridBuy.classList = "listGridBuy";
  listItemTemplate.appendChild(listGridBuy);

  let buyButton = document.createElement("button");
  listGridBuy.appendChild(buyButton);
  buyButton.classList = "buyButton";
  buyButton.innerHTML += "Add to cart";
  buyButton.addEventListener("click", () => AddToCart(dcmnt.id));
}

// lik som update, men uten å hente dokumentene. det gjøres av sort eller filter
function printForSort(dcmnts) {
  // Tømmer listeelementet (<div>-elementet der huskelisten lages)
  mobilListeEl.innerHTML = "";

  // Går gjennom dokumentene og lager et element for hvert av dem
  dcmnts.forEach((dcmnt) => {
    DisplayList(dcmnt);
  });
}

function FilterHeadphones() {
  db.collection("Products")
    .where("Category", "==", "Headphones")
    .orderBy("Name")
    .get()
    .then((snapshot) => {
      printForSort(snapshot);
    });
}
let headphonesEl = document.querySelector("#headphones");
headphonesEl.addEventListener("click", FilterHeadphones);

function FilterEarbuds() {
  db.collection("Products")
    .where("Category", "==", "Earbuds")
    .orderBy("Name")
    .get()
    .then((snapshot) => {
      printForSort(snapshot);
    });
}
let earbudsEl = document.querySelector("#earbuds");
earbudsEl.addEventListener("click", FilterEarbuds);

function FilterBluetoothSpeakers() {
  db.collection("Products")
    .where("Category", "==", "Speaker")
    .orderBy("Name")
    .get()
    .then((snapshot) => {
      printForSort(snapshot);
    });
}
let bluetoothSpeakersEl = document.querySelector("#bluetoothSpeakers");
bluetoothSpeakersEl.addEventListener("click", FilterBluetoothSpeakers);

function FilterAll() {
  update();
}
let showAllEl = document.querySelector("#showAll");
showAllEl.addEventListener("click", FilterAll);

function PriceHLSort() {
  db.collection("Products")
    .orderBy("Price", "desc")
    .orderBy("Name")
    .get()
    .then((snapshot) => {
      printForSort(snapshot);
    });
}
let PriceHLEl = document.querySelector("#priceHL");
PriceHLEl.addEventListener("click", PriceHLSort);

function PriceLHSort() {
  db.collection("Products")
    .orderBy("Price", "asc")
    .orderBy("Name")
    .get()
    .then((snapshot) => {
      printForSort(snapshot);
    });
}
let PriceLHEl = document.querySelector("#priceLH");
PriceLHEl.addEventListener("click", PriceLHSort);

function NameSort() {
  db.collection("Products")
    .orderBy("SortName", "asc")
    .get()
    .then((snapshot) => {
      printForSort(snapshot);
    });
}
let titleSortEl = document.querySelector("#title");
titleSortEl.addEventListener("click", NameSort);

function AddToCart(id) {
  db.collection("Products")
    .doc(id)
    .get()
    .then((dcmnt) => {
      let Category = dcmnt.data().Category;
      let ImagePath = dcmnt.data().ImagePath;
      let LastUpdated = dcmnt.data().LastUpdated;
      let Merke = dcmnt.data().Merke;
      let Name = dcmnt.data().Name;
      let Price = dcmnt.data().Price;
      let info1 = dcmnt.data().info[1];
      let info2 = dcmnt.data().info[2];
      let info3 = dcmnt.data().info[3];
      let info4 = dcmnt.data().info[4];

      let docRef = db
        .collection("Users")
        .doc(auth.currentUser.uid)
        .collection("ShoppingCart")
        .doc(Name);

      docRef.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());

          newCount = doc.data().ProductCount + 1;
          docRef.update({
            ProductCount: newCount,
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document yet!");

          docRef
            .set({
              ProductCount: 1,
              Category: Category,
              ImagePath: ImagePath,
              LastUpdated: LastUpdated,
              Merke: Merke,
              Name: Name,
              Price: Price,
              info: {
                one: info1,
                two: info2,
                three: info3,
                four: info4,
              },
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });

      alert("Successfully added to cart!");
    });
}



// function MouseEnter(listItem) {
//   console.log(listItem);
//   listItem.style.height = "20vh"
// }

// function MouseLeave(listItem) {
//   console.log(listItem);
//   listItem.style.height = "13vh"
//   // listItemTemplate.style.height = 
// }


// function MouseEnter(id) {
//   let allListItems = document.querySelectorAll(".listItemTemplate")

// allListItems.forEach((item) => {
//   if (item.getAttribute("data-id") == id) {
//     item.style.height = "20vh";
//     item.style.fontSize = "1.6rem"
//     item.style.transition = " .4s";
//   }
// })

// let allGridMiddle = document.querySelectorAll(".listGridMiddle")

// allGridMiddle.forEach((item) => {
//   if (item.getAttribute("data-id") == id) {
//     item.style.gridTemplateRows = "3fr 6fr 1fr";
//   }
// })

// }

// function MouseLeave(id) {
//   let allListItems = document.querySelectorAll(".listItemTemplate")

//   allListItems.forEach((item) => {
//     if (item.getAttribute("data-id") == id) {
//       item.style.height = "13vh";
//       item.style.fontSize = "1.5rem"
//     }
//   })

//   let allGridMiddle = document.querySelectorAll(".listGridMiddle")

// allGridMiddle.forEach((item) => {
//   if (item.getAttribute("data-id") == id) {
//     item.style.gridTemplateRows = "3fr 0 1fr";
//   }
// })

// }