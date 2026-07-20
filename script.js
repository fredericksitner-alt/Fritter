document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  buildIonField();
  setupScrollAnimations();
  buildLipids();
  renderSubjectPage();
  renderLessonPage();
});

function setupMobileMenu() {
  const button = document.getElementById("menu-btn");
  const nav = document.getElementById("mobile-nav");
  if (!button || !nav) return;
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.classList.toggle("open", open);
    button.setAttribute("aria-expanded", String(open));
  });
}


function buildIonField() {
  const field = document.getElementById("ion-field");
  if (!field) return;

  const ionTypes = [
    { cls: "ion-na", label: "Na", charge: "+" },
    { cls: "ion-k", label: "K", charge: "+" },
    { cls: "ion-cl", label: "Cl", charge: "−" },
    { cls: "ion-ca", label: "Ca", charge: "2+" }
  ];

  // Two rows along the membrane (staggered y so neighbors never sit at
  // exactly the same height), with a clear gap in the middle for the
  // channel protein — plus an evenly spaced, brick-staggered field of
  // free-floating ions below the membrane.
  // Top-row y-values (6/10) sit safely above the membrane's actual
  // position (top:30% with a fixed 180px height) across realistic
  // viewport heights — don't move these closer to 15+ without also
  // re-checking against the membrane's current CSS position.
  // The horizontal gap (x=31 to x=69) is wider than the channel
  // protein's literal width to also clear its rounded top and glow,
  // which visually extend a bit past the plain box width.
  const positions = [
    // Top-of-membrane row, left half
    [3,6],[7,10],[11,6],[15,10],[19,6],[23,10],[27,6],[31,10],
    // Top-of-membrane row, right half (mirrors the left, same gap in between)
    [69,10],[73,6],[77,10],[81,6],[85,10],[89,6],[93,10],[97,6],
    // Free-floating ions below the membrane, staggered in two bands,
    // brought up closer to the membrane than before
    [8,55],[24,66],[40,55],[56,66],[72,55],[88,66],
    [16,66],[32,55],[48,66],[64,55],[80,66],[96,55]
  ];

  field.innerHTML = positions.map((pos, index) => {
    const type = ionTypes[index % ionTypes.length];
    const side = pos[1] < 50 ? "top" : "bottom";
    return `
      <div class="ion ${type.cls} ion-zone-${side}"
           style="--x:${pos[0]};--y:${pos[1]};--delay:${(index % 8) * -0.42}s">
        ${type.label}<sup>${type.charge}</sup>
      </div>`;
  }).join("");
}

function buildLipids() {
  document.querySelectorAll(".lipid-half").forEach(half => {
    for (let i = 0; i < 14; i++) {
      const lipid = document.createElement("span");
      lipid.className = "lipid";
      lipid.innerHTML = "<i></i><b></b>";
      half.appendChild(lipid);
    }
  });
}

function setupScrollAnimations() {
  const channel = document.querySelector(".channel-section");

  const updateChannel = () => {
    if (!channel) return;
    const rect = channel.getBoundingClientRect();
    const max = Math.max(1, channel.offsetHeight - window.innerHeight);
    const raw = Math.min(1, Math.max(0, -rect.top / max));

    // Opens with a lighter scroll: roughly 8% to 28% of the section.
    const openProgress = Math.min(1, Math.max(0, (raw - 0.08) / 0.20));
    const easedOpen = 1 - Math.pow(1 - openProgress, 3);

    // Ions begin moving shortly after the pore starts opening.
    const transitProgress = Math.min(1, Math.max(0, (raw - 0.18) / 0.20));
    const easedTransit = transitProgress < 0.5
      ? 4 * transitProgress * transitProgress * transitProgress
      : 1 - Math.pow(-2 * transitProgress + 2, 3) / 2;

    channel.style.setProperty("--channel-progress", easedOpen.toFixed(4));
    channel.style.setProperty("--transit-progress", easedTransit.toFixed(4));
    channel.style.setProperty("--raw-channel-progress", raw.toFixed(4));

    channel.classList.toggle("is-open", openProgress > 0.02);
    channel.classList.toggle("show-account", raw > 0.43);
  };

  let ticking = false;
  const update = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateChannel();
      ticking = false;
    });
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function renderSubjectPage() {
  const grid = document.getElementById("lesson-grid");
  if (!grid || typeof SUBJECTS === "undefined") return;
  const key = new URLSearchParams(location.search).get("subject") || "biology";
  const subject = SUBJECTS[key];
  if (!subject) return;

  document.getElementById("subject-title").textContent = subject.name;
  document.getElementById("subject-description").textContent = subject.description;
  document.title = `${subject.name} — Fritter`;

  const lessons = LESSONS.filter(item => item.subject === key);
  grid.innerHTML = lessons.map(item => `
    <${item.comingSoon ? "div" : "a"} class="lesson-card ${item.comingSoon ? "coming-soon" : ""}"
      data-type="${item.type}" ${item.comingSoon ? "" : `href="lesson.html?id=${encodeURIComponent(item.id)}"`}>
      <div class="lesson-thumb">${item.type === "video" ? "▶" : item.type === "quiz" ? "?" : item.type === "practice" ? "✎" : "▤"}</div>
      <div class="lesson-body">
        <p>${item.type.replace("-", " ")}</p>
        <h3>${item.title}</h3>
        ${item.comingSoon ? "<span>Coming soon</span>" : ""}
      </div>
    </${item.comingSoon ? "div" : "a"}>`).join("");

  const tabs = document.querySelectorAll(".content-tab");
  tabs.forEach(tab => tab.addEventListener("click", () => {
    tabs.forEach(item => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    const filter = tab.dataset.filter;
    let visible = 0;
    grid.querySelectorAll(".lesson-card").forEach(card => {
      const show = filter === "all" || card.dataset.type === filter;
      card.hidden = !show;
      if (show) visible++;
    });
    document.getElementById("empty-filter-state").hidden = visible > 0;
  }));
}

// Populated by renderLessonPage() right before a quiz is built, so the
// diagnosis engine (see setupQuiz / renderDiagnosis below) can look up
// concept tags and misconception notes without parsing them back out of
// the HTML.
let currentQuizMeta = [];
let currentQuizSubject = null;
let currentQuizLessonId = null;

function renderLessonPage() {
  const title = document.getElementById("lesson-title");
  if (!title || typeof LESSONS === "undefined") return;
  const id = new URLSearchParams(location.search).get("id");
  const lesson = LESSONS.find(item => item.id === id);

  // Only a genuinely unknown id (typo, stale link) shows "not found" —
  // a lesson that exists but is comingSoon still gets the full skeleton below.
  if (!lesson) {
    document.getElementById("lesson-not-found").hidden = false;
    return;
  }

  title.textContent = lesson.title;
  const topicName = (typeof BIOLOGY_TOPICS !== "undefined" && lesson.topic)
    ? (BIOLOGY_TOPICS.find(t => t.id === lesson.topic) || {}).name
    : null;
  document.getElementById("lesson-eyebrow").textContent =
    `${SUBJECTS[lesson.subject].name}${topicName ? " \u00b7 " + topicName : ""} \u00b7 ${lesson.type}`;

  document.getElementById("lesson-content").hidden = false;

  // Video section: real embed if videoId is set, otherwise an honest skeleton slot
  document.getElementById("video-section").innerHTML = lesson.videoId
    ? `<div class="video-frame"><iframe src="https://www.youtube.com/embed/${lesson.videoId}" allowfullscreen title="${lesson.title}"></iframe></div>`
    : `<div class="content-skeleton"><p class="skeleton-label">Video</p><p class="skeleton-placeholder">Coming soon — not recorded yet.</p></div>`;

  // Written content section: real text if writtenContent is set, otherwise a skeleton slot
  document.getElementById("written-section").innerHTML = lesson.writtenContent
    ? `<div class="written-content"><p class="skeleton-label">Written explanation</p><div class="written-body">${lesson.writtenContent}</div></div>`
    : `<div class="content-skeleton"><p class="skeleton-label">Written explanation</p><p class="skeleton-placeholder">Coming soon — not written yet.</p></div>`;

  if (lesson.quiz?.length) {
    currentQuizMeta = lesson.quiz;
    currentQuizSubject = lesson.subject;
    currentQuizLessonId = lesson.id;

    const container = document.getElementById("quiz-questions");
    container.innerHTML = lesson.quiz.map((question, index) => `
      <div class="quiz-q" data-answer="${question.answer}">
        <p class="quiz-question">${index + 1}. ${question.question}</p>
        <div class="quiz-options">
          ${question.options.map(option => `<button class="quiz-option" type="button" data-choice="${option.id}">${option.text}</button>`).join("")}
        </div>
      </div>`).join("");
    document.getElementById("quiz-block").hidden = false;
    setupQuiz();
  }
}

function setupQuiz() {
  document.querySelectorAll(".quiz-option").forEach(option => option.addEventListener("click", () => {
    option.parentElement.querySelectorAll(".quiz-option").forEach(item => item.classList.remove("selected"));
    option.classList.add("selected");
  }));

  document.getElementById("quiz-submit")?.addEventListener("click", () => {
    let correct = 0, answered = 0;
    const questions = document.querySelectorAll(".quiz-q");

    // Collected as questions are graded, then handed to renderDiagnosis().
    const missedConcepts = new Set();
    const missedDetails = []; // { question, misconception } for each wrong answer

    questions.forEach((question, index) => {
      const selected = question.querySelector(".selected");
      if (!selected) return;
      answered++;
      const answer = question.dataset.answer;
      const choiceId = selected.dataset.choice;
      const meta = currentQuizMeta[index]; // concepts/misconceptions for this question, from data.js

      if (choiceId === answer) {
        correct++;
        selected.classList.add("correct");
      } else {
        selected.classList.add("incorrect");
        question.querySelector(`[data-choice="${answer}"]`)?.classList.add("correct");

        if (meta) {
          (meta.concepts || []).forEach(concept => missedConcepts.add(concept));
          const chosenOption = (meta.options || []).find(option => option.id === choiceId);
          missedDetails.push({
            question: meta.question,
            misconception: chosenOption && chosenOption.misconception ? chosenOption.misconception : null
          });
        }
      }
    });

    const result = document.getElementById("quiz-result");
    result.textContent = answered < questions.length
      ? "Answer every question before checking."
      : `You got ${correct} out of ${questions.length} correct.`;

    if (answered >= questions.length) {
      renderDiagnosis(Array.from(missedConcepts), missedDetails);
    }
  });
}

/* ===========================================================
   DIAGNOSIS ENGINE
   Rule-based (no AI call): turns a set of missed concepts into
   (1) an explanation of the likely misunderstanding, tied to the
   specific wrong answer chosen, and (2) a list of existing lessons
   tagged with those concepts, so the student has a concrete next
   step instead of just a score.

   This reads entirely from data.js (LESSONS' "concepts" tags and
   each quiz question's "concepts"/"misconception" fields) — add
   more tagged content there and it automatically becomes
   recommendable here, no code changes needed.
=========================================================== */
function renderDiagnosis(missedConcepts, missedDetails) {
  const panel = document.getElementById("quiz-diagnosis");
  if (!panel) return;

  if (missedConcepts.length === 0) {
    panel.hidden = false;
    panel.innerHTML = `<div class="diagnosis-panel diagnosis-clear"><p>Solid work — no weak spots flagged on this quiz.</p></div>`;
    return;
  }

  const misconceptionItems = missedDetails
    .filter(detail => detail.misconception)
    .map(detail => `<li><strong>${detail.question}</strong><p>${detail.misconception}</p></li>`)
    .join("");

  const recommendations = (typeof LESSONS !== "undefined" ? LESSONS : []).filter(item =>
    item.subject === currentQuizSubject &&
    item.id !== currentQuizLessonId &&
    (item.concepts || []).some(concept => missedConcepts.includes(concept))
  );

  const recommendationsHTML = recommendations.length
    ? recommendations.map(item => `
        <div class="rec-card ${item.comingSoon ? "coming-soon" : ""}">
          <p class="rec-type">${item.type}</p>
          <p class="rec-title">${item.title}</p>
          ${item.comingSoon
            ? '<span class="coming-soon-badge">Coming soon</span>'
            : `<a href="lesson.html?id=${encodeURIComponent(item.id)}" class="rec-link">Review this \u2192</a>`}
        </div>`).join("")
    : `<p class="diagnosis-empty">No tagged content covers "${missedConcepts.join(", ")}" yet — add a lesson with a matching concept tag in data.js and it'll show up here automatically.</p>`;

  panel.hidden = false;
  panel.innerHTML = `
    <div class="diagnosis-panel">
      <p class="section-label">Where to focus next</p>
      ${misconceptionItems ? `<ul class="misconception-list">${misconceptionItems}</ul>` : ""}
      <div class="rec-grid">${recommendationsHTML}</div>
    </div>`;
}