/* ===========================================================
   ROOMS DATA LAYER (REAL, FIRESTORE-BACKED)
   Replaces the earlier localStorage draft. Data now lives in
   Google's Firestore database, so any signed-in student on any
   device sees the same rooms and messages \u2014 this is the actual
   shared version, not a single-browser simulation.

   Data model:
   - "rooms" collection: one document per room
       { school, className, description, memberIds: [uid, ...], createdAt }
   - "rooms/{roomId}/messages" subcollection: one document per message
       { text, displayName, fileName, postedAt }

   Messages live in a subcollection (not an array field on the room)
   so a busy room doesn't run into Firestore's per-document size
   limits as it grows.

   rooms.js and room.js call the functions below and don't need to
   know Firestore is involved \u2014 same shape as the old localStorage
   version, just async now since these are real network calls.
=========================================================== */

let _cachedFirestore = null; // caches {db, fs} after first load so we don't re-import the SDK on every call

async function getFirestoreHandle() {
  if (_cachedFirestore) return _cachedFirestore;

  const appModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
  const fs = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");

  // Reuse the Firebase app if auth.js/auth-state.js already initialized one on this page;
  // otherwise initialize it here.
  const app = appModule.getApps().length ? appModule.getApps()[0] : appModule.initializeApp(window.firebaseConfig);
  const db = fs.getFirestore(app);

  _cachedFirestore = { db, fs };
  return _cachedFirestore;
}

async function getRooms() {
  const { db, fs } = await getFirestoreHandle();
  const snapshot = await fs.getDocs(fs.query(fs.collection(db, "rooms"), fs.orderBy("createdAt", "desc")));
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
}

async function getRoomById(id) {
  const { db, fs } = await getFirestoreHandle();
  const docSnap = await fs.getDoc(fs.doc(db, "rooms", id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

async function createRoom({ school, className, description }) {
  const { db, fs } = await getFirestoreHandle();
  const createdAt = Date.now();
  const createdBy = getCurrentUserId(); // used to check "can this person delete this room?" \u2014 never shown publicly
  const docRef = await fs.addDoc(fs.collection(db, "rooms"), {
    school: school || "",
    className,
    description: description || "",
    memberIds: [],
    createdAt,
    createdBy
  });
  return { id: docRef.id, school: school || "", className, description: description || "", memberIds: [], createdAt, createdBy };
}

function getCurrentUserId() {
  // Reuses the same user object auth.js already saves on sign-in.
  try {
    const user = JSON.parse(localStorage.getItem("elementalScienceUser"));
    return user && (user.uid || user.email) ? (user.uid || user.email) : null;
  } catch (_) {
    return null;
  }
}

async function isJoined(roomId) {
  const room = await getRoomById(roomId);
  const userId = getCurrentUserId();
  return !!(room && userId && (room.memberIds || []).includes(userId));
}

async function joinRoom(roomId) {
  const { db, fs } = await getFirestoreHandle();
  const userId = getCurrentUserId();
  if (!userId) return false;
  await fs.updateDoc(fs.doc(db, "rooms", roomId), {
    memberIds: fs.arrayUnion(userId)
  });
  return true;
}

async function getMessages(roomId) {
  const { db, fs } = await getFirestoreHandle();
  const snapshot = await fs.getDocs(
    fs.query(fs.collection(db, "rooms", roomId, "messages"), fs.orderBy("postedAt", "asc"))
  );
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
}

async function getMessageCount(roomId) {
  const { db, fs } = await getFirestoreHandle();
  const snapshot = await fs.getCountFromServer(fs.collection(db, "rooms", roomId, "messages"));
  return snapshot.data().count;
}

async function addMessage(roomId, { text, displayName, fileName }) {
  const { db, fs } = await getFirestoreHandle();
  await fs.addDoc(fs.collection(db, "rooms", roomId, "messages"), {
    text,
    displayName,
    fileName: fileName || null,
    postedAt: Date.now(),
    authorId: getCurrentUserId() // used to check "can this person delete this post?" \u2014 kept separate from displayName so it works even when posted anonymously
  });
  return true;
}

async function deleteRoom(roomId) {
  const { db, fs } = await getFirestoreHandle();

  // Firestore doesn't automatically delete a subcollection when its parent
  // document is deleted \u2014 without this step, every message in the room
  // would be silently orphaned in the database forever.
  const messagesSnapshot = await fs.getDocs(fs.collection(db, "rooms", roomId, "messages"));
  await Promise.all(messagesSnapshot.docs.map(docSnap => fs.deleteDoc(docSnap.ref)));

  await fs.deleteDoc(fs.doc(db, "rooms", roomId));
  return true;
}

async function deleteMessage(roomId, messageId) {
  const { db, fs } = await getFirestoreHandle();
  await fs.deleteDoc(fs.doc(db, "rooms", roomId, "messages", messageId));
  return true;
}
