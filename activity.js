/* ===========================================================
   ACTIVITY TRACKER
   Records the single most recent thing a student viewed (a
   lesson/video/quiz, or a room) so the dashboard can offer a
   "Pick up where you left off" link back to it.

   This is stored in localStorage, so it's per-browser, not
   synced across devices \u2014 same simplification used elsewhere
   on the site (like the onboarding profile). It's cleared on
   sign-out (see auth-state.js) so a shared computer doesn't leak
   one student's activity to the next person who signs in.
=========================================================== */

function recordActivity({ type, title, url }) {
  try {
    localStorage.setItem("fritterLastActivity", JSON.stringify({
      type,   // "lesson" | "room"
      title,
      url,
      at: Date.now()
    }));
  } catch (_) {
    // Storage can fail (private browsing, full quota, etc.) \u2014 this
    // feature is a nice-to-have, so just skip silently rather than
    // breaking the page over it.
  }
}

function getLastActivity() {
  try {
    return JSON.parse(localStorage.getItem("fritterLastActivity"));
  } catch (_) {
    return null;
  }
}
