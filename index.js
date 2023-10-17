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
import {
	getFirestore,
	collection,
	addDoc,
	serverTimestamp,
	onSnapshot,
	query,
	where,
	orderBy,
} from "firebase/firestore"

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

const db = getFirestore(app)

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

const textareaEl = document.getElementById("post-input")
const postButtonEl = document.getElementById("post-btn")
const moodEmojiEls = document.getElementsByClassName("mood-emoji-btn")

const postsEl = document.getElementById("posts")

/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

signOutButtonEl.addEventListener("click", authSignOut)

for (let moodEmojiEl of moodEmojiEls) {
	moodEmojiEl.addEventListener("click", selectMood)
}

postButtonEl.addEventListener("click", postButtonPressed)

/* === Global Constants === */
let moodState = 0

const collectionName = "posts"

/* === Main Code === */

onAuthStateChanged(auth, (user) => {
	if (user) {
		// User is signed in
		showLoggedInView()
		showProfilePicture(userProfilePictureEl, user)
		showUserGreeting(userGreetingEl, user)
		fetchInRealtimeAndRenderPostsFromDB(user)
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
			console.error(errorMessage)
		})
}

function authSignInWithEmail() {
	const email = emailInputEl.value
	const password = passwordInputEl.value

	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			clearAuthFields()
		})
		.catch((error) => {
			console.error(error.message)
		})
}

function authCreateAccountWithEmail() {
	const email = emailInputEl.value
	const password = passwordInputEl.value

	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			clearAuthFields()
		})
		.catch((error) => {
			console.error(error.message)
		})
}

function authSignOut() {
	signOut(auth)
		.then(() => {})
		.catch((error) => {
			console.error(error.message)
		})
}

/* = Functions - Firebase - Cloud Firestore = */

async function addPostToDB(postBody, user) {
	try {
		const docRef = await addDoc(collection(db, collectionName), {
			body: postBody,
			uid: user.uid,
			createdAt: serverTimestamp(),
			mood: moodState,
		})
		console.log("Document written with ID: ", docRef.id)
	} catch (error) {
		console.error("Error adding document: ", error.message)
	}

	// try {
	// 	await setDoc(doc(db, "posts", "post01"), {
	// 		body: postBody,
	// 	})
	// } catch (error) {
	// 	console.error(error.message)
	// }
}

function fetchInRealtimeAndRenderPostsFromDB(user) {
	const postsRef = collection(db, collectionName)
	const q = query(
		postsRef,
		where("uid", "==", user.uid),
		orderBy("createdAt", "desc")
	)

	onSnapshot(q, (querySnapshot) => {
		clearAll(postsEl)

		querySnapshot.forEach((doc) => {
			renderPost(postsEl, doc.data())
		})
	})
}

/* == Functions - UI Functions == */

function renderPost(postsEl, postData) {
	postsEl.innerHTML += `
        <div class="post">
            <div class="header">
                <h3>${displayDate(postData.createdAt)}</h3>
                <img src="assets/emojis/${postData.mood}.png">
            </div>
            <p>
                ${replaceNewlinesWithBrTags(postData.body)}
            </p>
        </div>
    `
}

function replaceNewlinesWithBrTags(inputString) {
	return inputString.replace(/\n/g, "<br>")
}

function postButtonPressed() {
	const postBody = textareaEl.value
	const user = auth.currentUser

	if (postBody && moodState) {
		addPostToDB(postBody, user)
		clearInputField(textareaEl)
		resetAllMoodElements(moodEmojiEls)
	}
}

function clearAll(element) {
	element.innerHTML = ""
}

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
	// The user object has basic properties such as display name, email, etc.
	const photoURL = user.photoURL

	if (photoURL) {
		imgElement.src = photoURL
	} else {
		imgElement.src = "assets/images/default-profile-picture.jpeg"
	}
}

function showUserGreeting(element, user) {
	const displayName = user.displayName

	if (displayName) {
		const userFirstName = displayName.split(" ")[0]

		element.textContent = `Hey ${userFirstName}, how are you?`
	} else {
		element.textContent = `Hey friend, how are you?`
	}
}

function displayDate(firebaseDate) {
	if (!firebaseDate) {
		return "Date processing"
	}

	const date = firebaseDate.toDate()

	const day = date.getDate()
	const year = date.getFullYear()

	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	]
	const month = monthNames[date.getMonth()]

	let hours = date.getHours()
	let minutes = date.getMinutes()
	hours = hours < 10 ? "0" + hours : hours
	minutes = minutes < 10 ? "0" + minutes : minutes

	return `${day} ${month} ${year} - ${hours}:${minutes}`
}

/* = Functions - UI Functions - Mood = */

function selectMood(event) {
	const selectedMoodEmojiElementId = event.currentTarget.id

	changeMoodsStyleAfterSelection(selectedMoodEmojiElementId, moodEmojiEls)

	const chosenMoodValue = returnMoodValueFromElementId(
		selectedMoodEmojiElementId
	)

	moodState = chosenMoodValue
}

function changeMoodsStyleAfterSelection(
	selectedMoodElementId,
	allMoodElements
) {
	for (let moodEmojiEl of moodEmojiEls) {
		if (selectedMoodElementId === moodEmojiEl.id) {
			moodEmojiEl.classList.remove("unselected-emoji")
			moodEmojiEl.classList.add("selected-emoji")
		} else {
			moodEmojiEl.classList.remove("selected-emoji")
			moodEmojiEl.classList.add("unselected-emoji")
		}
	}
}

function resetAllMoodElements(allMoodElements) {
	for (let moodEmojiEl of allMoodElements) {
		moodEmojiEl.classList.remove("selected-emoji")
		moodEmojiEl.classList.remove("unselected-emoji")
	}

	moodState = 0
}

function returnMoodValueFromElementId(elementId) {
	return Number(elementId.slice(5))
}
