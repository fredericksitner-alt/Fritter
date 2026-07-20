/* ===========================================================
   ONBOARDING WIZARD
   A 3-question flow: level, study goal, subject interest.
   Single-select steps (1 and 2) auto-advance once a choice is
   picked. Step 3 (subjects) allows multiple picks and only
   advances when "Finish setup" is clicked.

   The result is saved to localStorage as "elementalScienceProfile"
   — a plain object, e.g. { level: "high-school", goal: "exam",
   subjects: ["biology", "chemistry"] }. This is what future
   personalization (dashboard messaging, and eventually AI-written
   study plans) reads from. Nothing here calls any AI — it's just
   collecting and storing structured answers.
=========================================================== */

const profile = { level: null, goal: null, subjects: [] };
let currentStep = 1;
const totalSteps = 3;

const steps = document.querySelectorAll(".onboard-step");
const dots = document.querySelectorAll(".onboard-dot");
const finishButton = document.getElementById("onboard-finish");

function goToStep(stepNumber) {
  currentStep = stepNumber;
  steps.forEach(step => {
    step.classList.toggle("is-active", Number(step.dataset.step) === stepNumber);
  });
  dots.forEach(dot => {
    const dotNumber = Number(dot.dataset.dot);
    dot.classList.toggle("is-active", dotNumber === stepNumber);
    dot.classList.toggle("is-done", dotNumber < stepNumber);
  });
}

document.querySelectorAll(".onboard-grid").forEach(grid => {
  const field = grid.dataset.field;
  const isMulti = grid.dataset.multi === "true";

  grid.querySelectorAll(".onboard-choice").forEach(choice => {
    choice.addEventListener("click", () => {
      const value = choice.dataset.value;

      if (isMulti) {
        // Toggle this choice on/off, allow any number of picks
        choice.classList.toggle("is-selected");
        const index = profile.subjects.indexOf(value);
        if (choice.classList.contains("is-selected") && index === -1) {
          profile.subjects.push(value);
        } else if (!choice.classList.contains("is-selected") && index !== -1) {
          profile.subjects.splice(index, 1);
        }
        finishButton.disabled = profile.subjects.length === 0;
      } else {
        // Single-select: mark only this one, save the value, auto-advance
        grid.querySelectorAll(".onboard-choice").forEach(item => item.classList.remove("is-selected"));
        choice.classList.add("is-selected");
        profile[field] = value;

        if (currentStep < totalSteps) {
          setTimeout(() => goToStep(currentStep + 1), 200); // brief pause so the selection is visible before advancing
        }
      }
    });
  });
});

finishButton.addEventListener("click", () => {
  localStorage.setItem("elementalScienceProfile", JSON.stringify(profile));
  window.location.href = "dashboard.html";
});
