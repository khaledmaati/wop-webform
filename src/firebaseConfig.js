// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";




import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBvBr-RJ303kaKN9SGcL9fqJNvaOQPPbxQ",
    authDomain: "wop-webform.firebaseapp.com",
    projectId: "wop-webform",
    storageBucket: "wop-webform.appspot.com",
    messagingSenderId: "695474711482",
    appId: "1:695474711482:web:58b7482fe47ea331e18b83"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };


async function signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in user:", userCredential.user);
      // Handle signed in user
    } catch (error) {
      console.error("Error signing in:", error);
      // Handle errors here
    }
  }


  async function signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", userCredential.user);
      // Handle new user
    } catch (error) {
      console.error("Error creating user:", error);
      // Handle errors here
    }
  }


  async function signOutUser() {
    try {
      await signOut(auth);
      console.log("User signed out");
      // Handle sign out
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle errors here
    }
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user);
      // User is signed in, handle it here
    } else {
      console.log("No user is signed in.");
      // No user is signed in, handle it here
    }
  });