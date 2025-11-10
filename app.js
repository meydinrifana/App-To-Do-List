// Array tugas sekarang menyimpan objek { text, date, done }
let tasks = [];

// DOM elements
const form = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

// Simpan ke localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load dari localStorage
function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
}

// Toggle status selesai dan simpan
function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks(searchInput.value.trim());
}

// Tambah tugas baru dengan tanggal otomatis
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const now = new Date();

  tasks.push({
    text: taskText,
    date: now.toISOString(), // simpan ISO untuk fleksibilitas
    done: false,
  });

  taskInput.value = "";
  saveTasks();
  renderTasks(searchInput.value.trim());
});

// Hapus tugas
function deleteTask(index) {
  if (confirm("Yakin ingin menghapus Data ini?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(searchInput.value.trim());
  }
}

// Edit tugas
function editTask(index) {
  const currentTask = tasks[index];
  const newTask = prompt("Edit tugas:", currentTask.text);

  if (newTask !== null) {
    const trimmed = newTask.trim();
    if (trimmed !== "") {
      tasks[index].text = trimmed;
      saveTasks();
      renderTasks(searchInput.value.trim());
    } else {
      alert("Data tidak boleh kosong!");
    }
  }
}

// Fungsi highlight kata pencarian pada teks
function highlightText(text, query) {
  if (!query) return text;

  // Escape special regex characters in query
  const escapedQuery = query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(escapedQuery, "gi");
  return text.replace(regex, (match) => `<mark>${match}</mark>`);
}

// Format tanggal jadi lokal yang readable
function formatDate(isoString) {
  const date = new Date(isoString);
  // Contoh: "25 Sep 2025" + tooltip jam
  const formattedDate = date.toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit'
  });
  return { formattedDate, formattedTime };
}

// Render semua tugas dengan tanggal dan filter pencarian
function renderTasks(searchTerm = "") {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const lowerText = task.text.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();

    if (!searchTerm || lowerText.includes(lowerSearch)) {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");

      // Teks tugas dengan highlight pencarian
      const span = document.createElement("span");
      span.innerHTML = highlightText(task.text, searchTerm);
      span.style.flex = "1";

      // Klik teks untuk toggle selesai
      span.addEventListener("click", () => toggleDone(index));

      // Tampilkan tanggal tugas dengan tooltip waktu
      const dateSpan = document.createElement("span");
      dateSpan.className = "task-date";
      const { formattedDate, formattedTime } = formatDate(task.date);
      dateSpan.textContent = formattedDate;
      dateSpan.title = `Dibuat pada pukul ${formattedTime}`;

      // Tombol Edit
      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.className = "btn-edit";
      editBtn.addEventListener("click", () => editTask(index));

      // Tombol Hapus
      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.className = "btn-delete";
      delBtn.addEventListener("click", () => deleteTask(index));

      li.appendChild(span);
      li.appendChild(dateSpan);
      li.appendChild(editBtn);
      li.appendChild(delBtn);

      taskList.appendChild(li);
    }
  });
}

// Filter tugas saat mengetik di searchInput
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  renderTasks(query);
});

// Load dan render tugas saat halaman dimuat
loadTasks();
renderTasks();