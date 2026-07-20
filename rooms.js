document.addEventListener("DOMContentLoaded", () => {
  renderRoomsGrid();
  setupCreateRoomPanel();
});

async function renderRoomsGrid() {
  const grid = document.getElementById("rooms-grid");
  const emptyState = document.getElementById("rooms-empty");
  if (!grid) return;

  grid.innerHTML = `<p class="rooms-loading">Loading rooms\u2026</p>`;

  let rooms;
  try {
    rooms = await getRooms();
  } catch (error) {
    grid.innerHTML = `<p class="rooms-loading">Couldn't load rooms right now. Check your connection and refresh.</p>`;
    return;
  }

  emptyState.hidden = rooms.length > 0;
  grid.innerHTML = "";

  // Message counts are fetched per room for the "X messages" line on each
  // card. Done in parallel so one slow room doesn't hold up the others.
  const counts = await Promise.all(rooms.map(room => getMessageCount(room.id).catch(() => 0)));

  rooms.forEach((room, index) => {
    const card = document.createElement("a");
    card.className = "room-card";
    card.href = "room.html?id=" + encodeURIComponent(room.id);

    const memberCount = (room.memberIds || []).length;
    const messageCount = counts[index];

    card.innerHTML = `
      ${room.school ? `<p class="room-card-school">${escapeHtml(room.school)}</p>` : ""}
      <p class="room-card-title">${escapeHtml(room.className)}</p>
      ${room.description ? `<p class="room-card-desc">${escapeHtml(room.description)}</p>` : ""}
      <p class="room-card-meta">${memberCount} joined \u00b7 ${messageCount} message${messageCount === 1 ? "" : "s"}</p>
    `;
    grid.appendChild(card);
  });
}

function setupCreateRoomPanel() {
  const openBtn = document.getElementById("create-room-btn");
  const panel = document.getElementById("create-room-panel");
  const cancelBtn = document.getElementById("room-create-cancel");
  const submitBtn = document.getElementById("room-create-submit");

  openBtn.addEventListener("click", () => {
    panel.hidden = false;
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  cancelBtn.addEventListener("click", () => {
    panel.hidden = true;
  });

  submitBtn.addEventListener("click", async () => {
    const school = document.getElementById("room-school").value.trim();
    const className = document.getElementById("room-class").value.trim();
    const description = document.getElementById("room-description").value.trim();

    if (!className) {
      alert("Give the room a class or topic label before creating it.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Creating\u2026";
    try {
      const room = await createRoom({ school, className, description });
      window.location.href = "room.html?id=" + encodeURIComponent(room.id);
    } catch (error) {
      alert("Couldn't create the room \u2014 check your connection and try again.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Create room";
    }
  });
}

// Minimal HTML-escaping so a room name/description containing < or & can't
// break the page's markup when it's inserted into innerHTML.
function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
