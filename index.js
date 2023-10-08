/* === Imports === */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
} from "firebase/auth"

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
const provider = new GoogleAuthProvider()

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

const signOutButtonEl = document.getElementById("sign-out-btn")

/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

signOutButtonEl.addEventListener("click", authSignOut)

/* === Main Code === */

onAuthStateChanged(auth, (user) => {
	if (user) {
		// User is signed in
		// const uid = user.uid
		showLoggedInView()
	} else {
		// User is signed out
		showLoggedOutView()
	}
})

/* === Functions === */

/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
	signInWithPopup(auth, provider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result)
			const token = credential.accessToken
			// The signed-in user info.
			const user = result.user

			console.log("Sign in with Google")
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code
			const errorMessage = error.message
			console.log(errorMessage)
		})
}

function authSignInWithEmail() {
	const email = emailInputEl.value
	const password = passwordInputEl.value

	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			clearAuthFields()
		})
		.catch((error) => {
			console.log(error.message)
		})

	console.log("Sign in with email and password")
}

function authCreateAccountWithEmail() {
	const email = emailInputEl.value
	const password = passwordInputEl.value

	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			// const user = userCredential.user
			clearAuthFields()
		})
		.catch((error) => {
			console.error(error.message)
		})
	console.log("Sign up with email and password")
}

function authSignOut() {
	signOut(auth)
		.then(() => {
			// Signed out
		})
		.catch((error) => {
			console.log(error.message)
		})
}

/* == Functions - UI Functions == */

function showLoggedOutView() {
	hideView(viewLoggedIn)
	showView(viewLoggedOut)
}

function showLoggedInView() {
	hideView(viewLoggedOut)
	showView(viewLoggedIn)
}

function showView(view) {
	view.style.display = "flex"
}

function hideView(view) {
	view.style.display = "none"
}

function clearInputField(field) {
	field.value = ""
}

function clearAuthFields() {
	clearInputField(emailInputEl)
	clearInputField(passwordInputEl)
}
