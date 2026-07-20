// firebase-config.js is loaded as a plain script right before this one
// (see the <script> tags in each protected page), so firebaseConfig and
// firebaseConfigured are already available as globals here.

let user = null;
try {
  user = JSON.parse(localStorage.getItem("elementalScienceUser"));
} catch (_) {}

if (!user) {
  window.location.replace("index.html#account");
} else {
  document.documentElement.classList.add("auth-ready");
}

const navTargets = document.querySelectorAll("[data-auth-nav]");
navTargets.forEach(target => {
  const initial = (user?.name || user?.email || "S").charAt(0).toUpperCase();
  target.innerHTML = `
    <div class="account-menu">
      <button class="account-trigger" type="button" aria-expanded="false">
        ${user?.photoURL ? `<img src="${user.photoURL}" alt="">` : `<span>${initial}</span>`}
        <strong>${user?.name || "Student"}</strong><b>⌄</b>
      </button>
      <div class="account-dropdown" hidden>
        <a href="dashboard.html">Dashboard</a>
        <a href="dashboard.html">My study plans</a>
        <a href="dashboard.html">Progress</a>
        <button type="button" data-signout>Sign out</button>
      </div>
    </div>`;
});

document.querySelectorAll(".account-trigger").forEach(button => {
  button.addEventListener("click", () => {
    const menu = button.nextElementSibling;
    menu.hidden = !menu.hidden;
    button.setAttribute("aria-expanded", String(!menu.hidden));
  });
});

const welcome = document.getElementById("welcome-heading");
if (welcome && user) welcome.textContent = `Welcome back, ${(user.name || "Student").split(" ")[0]}`;

async function signOutUser() {
  if (firebaseConfigured) {
    try {
      const appModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
      const authModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");
      const app = appModule.getApps().length ? appModule.getApps()[0] : appModule.initializeApp(firebaseConfig);
      await authModule.signOut(authModule.getAuth(app));
    } catch (_) {}
  }
  localStorage.removeItem("elementalScienceUser");
  localStorage.removeItem("fritterLastActivity");
  window.location.href = "index.html";
}

document.querySelectorAll("[data-signout]").forEach(button => button.addEventListener("click", signOutUser));