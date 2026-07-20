/* ===========================================================
   SUBJECT TOPIC HUB (shared by biology.html, chemistry.html, physics.html)
   Each hub page sets <body data-topics="BIOLOGY_TOPICS"> (or the
   Chemistry/Physics equivalent) so this one script can render
   whichever subject's topic tabs without duplicating the logic
   three times.
=========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderTopicHub();
});

function renderTopicHub() {
  const tabsContainer = document.getElementById("topic-tabs");
  const subjectKey = document.body.dataset.subject;
  const topics = subjectKey && typeof TOPIC_HUBS !== "undefined" ? TOPIC_HUBS[subjectKey] : undefined;
  if (!tabsContainer || !Array.isArray(topics)) return;

  tabsContainer.innerHTML = topics.map((topic, index) =>
    `<button class="content-tab ${index === 0 ? "is-active" : ""}" data-topic="${topic.id}">${topic.name}</button>`
  ).join("");

  const tabs = tabsContainer.querySelectorAll(".content-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(item => item.classList.remove("is-active"));
      tab.classList.add("is-active");
      renderTopicLessons(topics, tab.dataset.topic);
    });
  });

  if (topics.length > 0) {
    renderTopicLessons(topics, topics[0].id);
  }
}

function renderTopicLessons(topics, topicId) {
  const grid = document.getElementById("topic-lesson-grid");
  const topic = topics.find(item => item.id === topicId);
  if (!grid || !topic) return;

  const lessons = topic.subtopics
    .map(subtopic => LESSONS.find(lesson => lesson.id === subtopic.lessonId))
    .filter(Boolean); // skip silently if a lessonId typo doesn't match anything in LESSONS

  grid.innerHTML = lessons.map(lesson => {
    const icon = lesson.type === "quiz" ? "?" : lesson.type === "practice" ? "\u270E" : "\u25B6";
    const tag = lesson.comingSoon ? "div" : "a";
    const href = lesson.comingSoon ? "" : `href="lesson.html?id=${encodeURIComponent(lesson.id)}"`;
    return `
      <${tag} class="lesson-card ${lesson.comingSoon ? "coming-soon" : ""}" ${href}>
        <div class="lesson-thumb">${icon}</div>
        <div class="lesson-body">
          <p>${lesson.type}</p>
          <h3>${lesson.title}</h3>
          ${lesson.comingSoon ? "<span>Coming soon</span>" : ""}
        </div>
      </${tag}>`;
  }).join("");
}
