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
	updateProfile,
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

const userProfilePictureEl = document.getElementById("user-profile-picture")

const userGreetingEl = document.getElementById("user-greeting")

const displayNameInputEl = document.getElementById("display-name-input")
const photoURLInputEl = document.getElementById("photo-url-input")
const updateProfileButtonEl = document.getElementById("update-profile-btn")

/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

signOutButtonEl.addEventListener("click", authSignOut)

updateProfileButtonEl.addEventListener("click", authUpdateProfile)

/* === Main Code === */

onAuthStateChanged(auth, (user) => {
	if (user) {
		// User is signed in
		showLoggedInView()
		showProfilePicture(userProfilePictureEl, user)
		showUserGreeting(userGreetingEl, user)
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
		.then(() => {
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
		.then(() => {
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

function authUpdateProfile() {
	const newDisplayName = displayNameInputEl.value
	const newPhotoURL = displayNameInputEl.value

	updateProfile(auth.currentUser, {
		displayName: newDisplayName,
		photoURL: newPhotoURL,
	})
		.then(() => {
			// Profile updated
			console.log("Profile updated")
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

function showProfilePicture(imgElement, user) {
	if (user !== null) {
		// The user object has basic properties such as display name, email, etc.
		const displayName = user.displayName
		const email = user.email
		const photoURL = user.photoURL
		const emailVerified = user.emailVerified

		// The user's ID, unique to the Firebase project. Do NOT use
		// this value to authenticate with your backend server, if
		// you have one. Use User.getToken() instead.
		const uid = user.uid

		imgElement.src = photoURL
			? photoURL
			: "assets/images/default-profile-picture.jpeg"
	}
}

function showUserGreeting(element, user) {
	const displayName = user.displayName

	element.textContent = displayName
		? `Hey ${displayName.split(" ")[0]}, how are you?`
		: "Hey, friend, how are you?"
}
