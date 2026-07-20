document.addEventListener("DOMContentLoaded", async () => {
  const roomId = new URLSearchParams(location.search).get("id");
  if (!roomId) {
    document.getElementById("room-not-found").hidden = false;
    return;
  }

  let room;
  try {
    room = await getRoomById(roomId);
  } catch (error) {
    document.getElementById("room-not-found").hidden = false;
    document.getElementById("room-not-found").querySelector("p").textContent =
      "Couldn't load this room \u2014 check your connection and refresh.";
    return;
  }

  if (!room) {
    document.getElementById("room-not-found").hidden = false;
    return;
  }

  document.getElementById("room-body").hidden = false;

  if (typeof recordActivity === "function") {
    recordActivity({
      type: "room",
      title: room.className,
      url: "room.html?id=" + encodeURIComponent(room.id)
    });
  }

  renderRoomHeader(room);
  await refreshMessages(room.id);
  await setupJoinAndComposer(room);
});

function renderRoomHeader(room) {
  document.title = `${room.className} \u2014 Fritter`;
  document.getElementById("room-meta").textContent =
    (room.school ? room.school + " \u00b7 " : "") + `${(room.memberIds || []).length} joined`;
  document.getElementById("room-title").textContent = room.className;
  document.getElementById("room-description").textContent = room.description || "";

  // Only the person who created this room sees a way to delete it.
  const deleteBtn = document.getElementById("delete-room-btn");
  const isOwner = room.createdBy && room.createdBy === getCurrentUserId();
  deleteBtn.hidden = !isOwner;

  if (isOwner && !deleteBtn.dataset.wired) {
    deleteBtn.dataset.wired = "true"; // avoid attaching a duplicate listener on re-render
    deleteBtn.addEventListener("click", async () => {
      if (!confirm("Delete this room permanently? This can't be undone, and every message in it will be deleted too.")) return;
      deleteBtn.disabled = true;
      deleteBtn.textContent = "Deleting\u2026";
      try {
        await deleteRoom(room.id);
        window.location.href = "rooms.html";
      } catch (error) {
        alert("Couldn't delete the room \u2014 check your connection and try again.");
        deleteBtn.disabled = false;
        deleteBtn.textContent = "Delete room";
      }
    });
  }
}

async function refreshMessages(roomId) {
  const feed = document.getElementById("message-feed");
  feed.innerHTML = `<p class="feed-empty">Loading messages\u2026</p>`;

  let messages;
  try {
    messages = await getMessages(roomId);
  } catch (error) {
    feed.innerHTML = `<p class="feed-empty">Couldn't load messages \u2014 check your connection and refresh.</p>`;
    return;
  }

  feed.innerHTML = "";
  if (messages.length === 0) {
    feed.innerHTML = `<p class="feed-empty">No messages yet \u2014 be the first to post.</p>`;
    return;
  }

  messages.forEach(message => {
    const item = document.createElement("div");
    item.className = "message-item";
    const time = new Date(message.postedAt).toLocaleString(undefined, {
      month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
    });
    const canDelete = message.authorId && message.authorId === getCurrentUserId();
    item.innerHTML = `
      <div class="message-meta">
        <span class="message-author">${escapeHtml(message.displayName)}</span>
        <span class="message-time">${time}</span>
      </div>
      <p class="message-text">${escapeHtml(message.text)}</p>
      ${message.fileName ? `<p class="message-file">\u{1F4CE} ${escapeHtml(message.fileName)}</p>` : ""}
      ${canDelete ? `<button class="message-delete-btn" data-message-id="${message.id}">Delete</button>` : ""}
    `;
    feed.appendChild(item);
  });

  // Wire up each message's own delete button (only present for messages you authored)
  feed.querySelectorAll(".message-delete-btn").forEach(button => {
    button.addEventListener("click", async () => {
      if (!confirm("Delete this message?")) return;
      button.disabled = true;
      button.textContent = "Deleting\u2026";
      try {
        await deleteMessage(roomId, button.dataset.messageId);
        await refreshMessages(roomId);
      } catch (error) {
        alert("Couldn't delete that message \u2014 check your connection and try again.");
        button.disabled = false;
        button.textContent = "Delete";
      }
    });
  });
}

async function setupJoinAndComposer(room) {
  const joinBar = document.getElementById("join-bar");
  const composer = document.getElementById("composer");
  const signedIn = !!getCurrentUserId();

  if (!signedIn) {
    // auth-state.js already redirects signed-out visitors away from
    // protected pages, so in practice this shouldn't be reachable \u2014
    // this is just a defensive fallback.
    joinBar.hidden = true;
    composer.hidden = true;
    return;
  }

  const joined = await isJoined(room.id);
  joinBar.hidden = joined;
  composer.hidden = !joined;

  document.getElementById("join-room-btn").addEventListener("click", async () => {
    const btn = document.getElementById("join-room-btn");
    btn.disabled = true;
    btn.textContent = "Joining\u2026";
    try {
      await joinRoom(room.id);
      joinBar.hidden = true;
      composer.hidden = false;
      const updatedRoom = await getRoomById(room.id);
      renderRoomHeader(updatedRoom);
    } catch (error) {
      alert("Couldn't join the room \u2014 check your connection and try again.");
      btn.disabled = false;
      btn.textContent = "Join room";
    }
  });

  // Identity picker: show/hide the nickname input based on selection
  const identitySelect = document.getElementById("post-identity");
  const nicknameInput = document.getElementById("post-nickname");
  identitySelect.addEventListener("change", () => {
    nicknameInput.hidden = identitySelect.value !== "nickname";
  });

  // File attach: just show the chosen filename (draft mode \u2014 real file
  // storage still needs Firebase Storage, which isn't turned on yet)
  const fileInput = document.getElementById("composer-file");
  const fileNameLabel = document.getElementById("composer-file-name");
  fileInput.addEventListener("change", () => {
    fileNameLabel.textContent = fileInput.files[0] ? fileInput.files[0].name : "";
  });

  document.getElementById("composer-submit").addEventListener("click", async () => {
    const textInput = document.getElementById("composer-text");
    const text = textInput.value.trim();
    const identityMode = identitySelect.value;

    if (!text && !fileInput.files[0]) {
      alert("Write something or attach a file before posting.");
      return;
    }

    const submitBtn = document.getElementById("composer-submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Posting\u2026";

    const displayName = resolveDisplayName(identityMode, nicknameInput.value.trim());

    try {
      await addMessage(room.id, {
        text: text || "(shared a file)",
        displayName: displayName,
        fileName: fileInput.files[0] ? fileInput.files[0].name : null
      });

      textInput.value = "";
      fileInput.value = "";
      fileNameLabel.textContent = "";
      await refreshMessages(room.id);
    } catch (error) {
      alert("Couldn't post that \u2014 check your connection and try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Post";
    }
  });
}

function resolveDisplayName(mode, nickname) {
  if (mode === "anon") return "Anonymous";
  if (mode === "nickname") return nickname || "Anonymous";

  // "real" \u2014 pull the name saved at sign-in, falling back sensibly
  try {
    const user = JSON.parse(localStorage.getItem("elementalScienceUser"));
    return (user && user.name) || "Student";
  } catch (_) {
    return "Student";
  }
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
