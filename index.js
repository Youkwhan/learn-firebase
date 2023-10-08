/* === Imports === */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

/* === Firebase Setup === */
// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyC5L6eu7x_n3obLArONJSE74PmXthZP6QI",
	authDomain: "moody-66db7.firebaseapp.com",
	projectId: "moody-66db7",
	storageBucket: "moody-66db7.appspot.com",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
/* === UI === */

/* == UI - Elements == */

const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")

const signInWithGoogleButtonEl = document.getElementById(
	"sign-in-with-google-btn"
)

const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")

const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("create-account-btn")

/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

/* === Main Code === */

showLoggedOutView()

/* === Functions === */

/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
	console.log("Sign in with Google")
}

function authSignInWithEmail() {
	console.log("Sign in with email and password")
}

function authCreateAccountWithEmail() {
	console.log("Sign up with email and password")
}

/* == Functions - UI Functions == */

function showLoggedOutView() {
	hideElement(viewLoggedIn)
	showElement(viewLoggedOut)
}

function showLoggedInView() {
	hideElement(viewLoggedOut)
	showElement(viewLoggedIn)
}

function showElement(element) {
	element.style.display = "flex"
}

function hideElement(element) {
	element.style.display = "none"
}
