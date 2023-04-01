// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwH_aEHH3svpKPRkGe5uPSH6Wjh0ola_w",
    authDomain: "fixmyfit-abb80.firebaseapp.com",
    projectId: "fixmyfit-abb80",
    storageBucket: "fixmyfit-abb80.appspot.com",
    messagingSenderId: "834596917251",
    appId: "1:834596917251:web:aca8de9faf3765856fbe36"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;


