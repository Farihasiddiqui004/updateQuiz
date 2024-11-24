// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgkv36lm2z84j7VkJ1f1HBhoFKTw1grJQ",
  authDomain: "fir-project-1f34e.firebaseapp.com",
  projectId: "fir-project-1f34e",
  storageBucket: "fir-project-1f34e.appspot.com",
  messagingSenderId: "80758509770",
  appId: "1:80758509770:web:dde625c66806260767e433",
  measurementId: "G-17FRFKYJZG",
};

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

setTimeout(() => {
  window.location.href = "./Quiz-App/index.html"; // Navigate to Quiz app
}, 2500);


// Profile photo upload
const profilePhotoImg = document.getElementById("profilePhotoImg");
const profilePhotoInput = document.getElementById("profilePhotoInput");

profilePhotoImg.addEventListener("click", () => {
  profilePhotoInput.click();
});

profilePhotoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const storageRef = ref(storage, `profilePhotos/${file.name}`);
  
  uploadBytes(storageRef, file).then(() => {
    getDownloadURL(storageRef).then((url) => {
      profilePhotoImg.src = url; // Set uploaded photo as profile image
    }).catch((error) => {
      console.error("Error fetching URL:", error.message);
    });
  }).catch((error) => {
    console.error("Error uploading file:", error.message);
  });
});

// Show user card
function showCard() {
  const getData = localStorage.getItem("userData");
  const parseData = JSON.parse(getData);
  console.log(parseData);
  document.getElementById("card").style.display = "block";
  const card = document.getElementById("card");
  card.innerHTML = `
    <div class="card-body">
      <h6 class="card-header text-secondary mb-3" id="name">Name: ${parseData.name}</h6> 
      <p class="card-text text-secondary" id="roll">Roll Number: ${parseData.phoneNumber}</p>
      <p class="card-text text-secondary" id="roll">Email: ${parseData.email}</p>
      <button onclick="logout()" class="btn btn-danger">Log Out</button>
    </div>
  `;
}

// Hide card after some time
function hideCard() {
  setTimeout(() => {
    document.getElementById("card").style.display = "none";
  }, 4000);
}

// User registration with Firebase Auth
function registration() {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const password = document.getElementById("password").value;
  const cpassword = document.getElementById("cpassword").value;

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;

  if (password !== cpassword) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Passwords don't match!",
    });
    return;
  }

  if (!regex.test(password)) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Password must meet all requirements.`,
    });
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      Swal.fire({
        icon: "success",
        title: "Account Created Successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      const userData = {
        uid: userCredential.user.uid,
        name,
        email,
        phoneNumber,
      };
      localStorage.setItem("userData", JSON.stringify(userData));

      setTimeout(() => {
        window.location.href = "./Quiz-App/index.html";
      }, 2500);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
    });
}

// Retrieve local data
function getLocalData() {
  const getData = localStorage.getItem("userData");
  const parseData = JSON.parse(getData);
  console.log(parseData);
  const getLocalDataDiv = document.getElementById("getLocalDataDiv");
  getLocalDataDiv.innerHTML = `
     <ul>
        <li>Name: ${parseData.name}</li>
        <li>Email: ${parseData.email}</li>
        <li>Phone Number: ${parseData.phoneNumber}</li>
     </ul>
    `;
}
getLocalData();

// Redirect to another page
function redirect() {
  window.location.href = "../index.html";
}

// User login with Firebase Auth
function login() {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500,
      });

      const user = userCredential.user;
      localStorage.setItem("userData", JSON.stringify({ uid: user.uid, email: user.email }));

      setTimeout(() => {
        window.location.href = "./Quiz-App/index.html";
      }, 2000);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
    });
}

// Logout user
function logout() {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("userData");
      Swal.fire({
        icon: "success",
        title: "Logged Out Successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        redirect();
      }, 2000);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: error.message,
      });
    });
}
