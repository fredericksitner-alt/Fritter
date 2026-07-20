// firebase-config.js is loaded as a plain script right before this one
// (see the <script> tags in index.html), so firebaseConfig and
// firebaseConfigured are already available as globals here.

const tabs = document.querySelectorAll("[data-auth-mode]");
const form = document.getElementById("auth-form");
const googleButton = document.getElementById("google-signin");
const message = document.getElementById("auth-message");
const heading = document.getElementById("auth-heading");
const subtitle = document.getElementById("auth-subtitle");
const nameField = document.getElementById("name-field");
const confirmField = document.getElementById("confirm-field");
const submitButton = document.getElementById("email-submit");
const passwordInput = document.getElementById("password");
let mode = "signup";
let fb = null;

function setMode(nextMode) {
  mode = nextMode;
  const signup = mode === "signup";
  tabs.forEach(tab => {
    const active = tab.dataset.authMode === mode;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  nameField.hidden = !signup;
  confirmField.hidden = !signup;
  heading.textContent = signup ? "Create your free account" : "Welcome back";
  subtitle.textContent = signup ? "Start saving your progress in seconds." : "Continue your personalized learning plan.";
  submitButton.textContent = signup ? "Create account" : "Sign in";
  passwordInput.autocomplete = signup ? "new-password" : "current-password";
  message.textContent = "";
}

tabs.forEach(tab => tab.addEventListener("click", () => setMode(tab.dataset.authMode)));

async function loadFirebase() {
  if (!firebaseConfigured) return null;
  const appModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
  const authModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");
  const app = appModule.initializeApp(firebaseConfig);
  fb = { ...authModule, auth: authModule.getAuth(app) };
  return fb;
}

function saveUser(user) {
  localStorage.setItem("elementalScienceUser", JSON.stringify(user));
}

function hasCompletedOnboarding() {
  try {
    return !!JSON.parse(localStorage.getItem("elementalScienceProfile"));
  } catch (_) {
    return false;
  }
}

function finish(user) {
  saveUser(user);
  window.location.href = hasCompletedOnboarding() ? "dashboard.html" : "onboarding.html";
}

googleButton.addEventListener("click", async () => {
  message.textContent = "Connecting to Google…";
  try {
    const firebase = fb || await loadFirebase();
    if (!firebase) {
      finish({ name: "Demo Student", email: "demo@elementalscience.local", provider: "google-demo" });
      return;
    }
    const provider = new firebase.GoogleAuthProvider();
    const result = await firebase.signInWithPopup(firebase.auth, provider);
    finish({
      uid: result.user.uid,
      name: result.user.displayName || "Student",
      email: result.user.email,
      photoURL: result.user.photoURL || "",
      provider: "google"
    });
  } catch (error) {
    message.textContent = error.message || "Google Sign-In could not be completed.";
  }
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;
  const confirm = document.getElementById("confirm-password").value;

  if (!email || password.length < 8) {
    message.textContent = "Enter a valid email and a password with at least 8 characters.";
    return;
  }
  if (mode === "signup" && password !== confirm) {
    message.textContent = "The passwords do not match.";
    return;
  }

  message.textContent = mode === "signup" ? "Creating your account…" : "Signing you in…";

  try {
    const firebase = fb || await loadFirebase();
    if (!firebase) {
      finish({ name: name || email.split("@")[0], email, provider: "email-demo" });
      return;
    }

    let result;
    if (mode === "signup") {
      result = await firebase.createUserWithEmailAndPassword(firebase.auth, email, password);
      if (name) await firebase.updateProfile(result.user, { displayName: name });
    } else {
      result = await firebase.signInWithEmailAndPassword(firebase.auth, email, password);
    }

    finish({
      uid: result.user.uid,
      name: result.user.displayName || name || email.split("@")[0],
      email: result.user.email,
      photoURL: result.user.photoURL || "",
      provider: "email"
    });
  } catch (error) {
    message.textContent = error.message || "Authentication could not be completed.";
  }
});

loadFirebase().catch(() => {});