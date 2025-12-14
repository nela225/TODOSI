import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

if (!taskInput || !addTaskBtn || !taskList) {
  console.error("❌ Neki element fali u HTML-u (taskInput / addTaskBtn / taskList).");
} else {
  console.log("✅ DOM OK, Firebase init OK");
}

addTaskBtn.addEventListener("click", async () => {
  const text = taskInput.value.trim();
  if (!text) return;

  try {
    const ref = await addDoc(collection(db, "tasks"), {
      text,
      completed: false,
      createdAt: serverTimestamp()
    });
    console.log("✅ Dodano u Firestore, id:", ref.id);
    taskInput.value = "";
  } catch (e) {
    console.error("❌ addDoc greška:", e.code, e.message);
    alert(`Firestore greška: ${e.message}`);
  }
});
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

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", async () => {
  const text = taskInput.value.trim();
  if (!text) return;

  try {
    await addDoc(collection(db, "tasks"), { text, completed: false });
    taskInput.value = "";
  } catch (e) {
    alert("Firestore greška: " + e.message);
    console.error(e);
  }
});

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
        await updateDoc(doc(db, "tasks", snap.id), { completed: !task.completed });
      });

      const del = document.createElement("button");
      del.textContent = "X";
      del.addEventListener("click", async (e) => {
        e.stopPropagation();
        await deleteDoc(doc(db, "tasks", snap.id));
      });

      li.appendChild(del);
      taskList.appendChild(li);
    });
  },
  (error) => {
    alert("Snapshot greška: " + error.message);
    console.error(error);
  }
);

