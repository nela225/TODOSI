import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDxzQnSMWGzyIcv3pPCWXvm_tb1vlTu2y0",
  authDomain: "nela-si.firebaseapp.com",
  projectId: "nela-si",
  storageBucket: "nela-si.firebasestorage.app",
  messagingSenderId: "366363984218",
  appId: "1:366363984218:web:10c7ea4d6e618cc07b7363"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ DOM
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// ✅ Ako se ovo NE pojavi u Console na GitHub Pages -> app.js se NE učitava (ime/putanja)
console.log("✅ app.js učitan, Firebase init OK");

// ✅ Dodavanje
addTaskBtn.addEventListener("click", async () => {
  const text = taskInput.value.trim();
  if (!text) return;

  try {
    const ref = await addDoc(collection(db, "tasks"), { text, completed: false });
    console.log("✅ addDoc OK:", ref.id);
    taskInput.value = "";
  } catch (e) {
    console.error("❌ addDoc error:", e.code, e.message, e);
    alert(`addDoc: ${e.code} — ${e.message}`);
  }
});

// ✅ Real-time prikaz + error handler (OVO TI JE FALILO)
onSnapshot(
  collection(db, "tasks"),
  (snapshot) => {
    taskList.innerHTML = "";

    snapshot.forEach((snap) => {
      const task = snap.data();

      const li = document.createElement("li");
      li.textContent = task.text;

      if (task.completed) li.classList.add("completed");

      li.addEventListener("click", async () => {
        try {
          await updateDoc(doc(db, "tasks", snap.id), { completed: !task.completed });
        } catch (e) {
          console.error("❌ updateDoc error:", e.code, e.message, e);
          alert(`updateDoc: ${e.code} — ${e.message}`);
        }
      });

      const del = document.createElement("button");
      del.textContent = "X";
      del.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
          await deleteDoc(doc(db, "tasks", snap.id));
        } catch (e) {
          console.error("❌ deleteDoc error:", e.code, e.message, e);
          alert(`deleteDoc: ${e.code} — ${e.message}`);
        }
      });

      li.appendChild(del);
      taskList.appendChild(li);
    });
  },
  (e) => {
    console.error("❌ onSnapshot error:", e.code, e.message, e);
    alert(`onSnapshot: ${e.code} — ${e.message}`);
  }
);
