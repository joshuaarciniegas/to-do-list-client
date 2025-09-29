/**
 * @fileoverview Task management UI logic.
 * Provides:
 * - Task editing, deletion, and rendering
 * - Hamburger menu toggle
 * - Live clock
 * - Navigation shortcuts
 * - Task search filter
 * - API integration to load user tasks
 */

/**
 * Edit a task (placeholder for future logic).
 * @param {HTMLButtonElement} button - The edit button clicked.
 */
function editTask(button) {
  const taskCard = button.closest(".task-card");
  alert("Task edit function - integrate your edit logic here");
}

// =============================
// HAMBURGER MENU
// =============================

/** @type {HTMLElement} */
const hamburger = document.getElementById("hamburger");
/** @type {HTMLElement} */
const sideMenu = document.getElementById("sideMenu");
/** @type {HTMLElement} */
const closeBtn = document.getElementById("closeBtn");

hamburger.addEventListener("click", () => {
  sideMenu.style.width = "260px";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.width = "0";
});

// =============================
// LIVE CLOCK
// =============================

/**
 * Updates the clock element with the current time and date.
 */
function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();

  const options = { weekday: "long", day: "numeric", month: "short" };
  const time = now.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = now.toLocaleDateString("en-EN", options);

  clock.innerHTML = `
      <div style="font-size:20px; font-weight:700;">${time}</div>
      <div style="font-size:14px;">${date}</div>
    `;
}

setInterval(updateClock, 1000);
updateClock();

// =============================
// NAVIGATION FUNCTIONS
// =============================

/** Redirect to profile page */
function goToProfile() {
  window.location.href = "profile.html";
}

/** Redirect to task creation page */
function goToCreateTask() {
  window.location.href = "newtask.html";
}

/** Redirect to delete account page */
function goToDeleteAccount() {
  window.location.href = "deleteaccount.html";
}

/** Redirect to about us page */
function goToAboutUs() {
  window.location.href = "aboutus.html";
}

// =============================
// SEARCH FILTER
// =============================

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const taskCards = document.querySelectorAll(".task-card");

      taskCards.forEach((card) => {
        const title =
          card.querySelector(".task-title")?.textContent.toLowerCase() || "";

        card.style.display = title.includes(searchTerm) ? "block" : "none";
      });
    });
  }
});

// =============================
// LOAD AND RENDER TASKS
// =============================

document.addEventListener("DOMContentLoaded", async () => {
  /**
   * Fetch tasks from the backend API.
   * @async
   */
  async function loadTasks() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        "https://demo-290a.onrender.com/api/v1/tasks/mytasks",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error loading tasks");
      }

      const tasks = data.tasks || [];
      renderTasks(tasks);
    } catch (error) {
      console.error("Error loading tasks:", error.message);
      document.getElementById(
        "todo-column"
      ).innerHTML = `<p style="color:red;">❌ ${error.message}</p>`;
    }
  }

  /**
   * Render tasks into the Kanban columns.
   * @param {Array<Object>} tasks - Array of task objects.
   * @param {string} tasks[].title - Task title.
   * @param {string} tasks[].detail - Task details.
   * @param {string} tasks[].status - Task status ("Por hacer", "Haciendo", "Hecho").
   * @param {string} [tasks[].date] - Task due date.
   * @param {string} [tasks[].time] - Task due time.
   * @param {string} tasks[]._id - Task unique ID.
   */
  function renderTasks(tasks) {
    const todo = document.getElementById("todo-column");
    const doing = document.getElementById("doing-column");
    const done = document.getElementById("done-column");

    todo.innerHTML = "";
    doing.innerHTML = "";
    done.innerHTML = "";

    tasks.forEach((t) => {
      const card = document.createElement("div");
      card.className = "task-card";
      card.innerHTML = `
      <div class="task-title"><strong>Title:</strong> ${t.title}</div>
      <div class="task-detail"><strong>Detail</strong> ${t.detail || "Sin detalle"}</div>
      <div class="task-status"><strong>Status:</strong> ${t.status}</div>
      <div class="task-date"><strong>Date:</strong> ${
        t.date ? new Date(t.date).toLocaleDateString("es-ES") : "Sin fecha"
      }</div>
      <div class="task-time"><strong>Hour:</strong> ${t.time || "Sin hora"}</div>
      <div class="task-actions">
        <button class="btn-editar" title="Editar">✏️ Edit</button>
        <button class="btn-eliminar" title="Eliminar">🗑️ Delete</button>
      </div>
    `;

      // Edit button
      const botonEditar = card.querySelector(".btn-editar");
      botonEditar.addEventListener("click", () => {
        localStorage.setItem("taskId", t._id);
        window.location.href = "editasks.html";
      });

      // Delete button
      const botonEliminar = card.querySelector(".btn-eliminar");
      botonEliminar.addEventListener("click", async () => {
        const confirmar = confirm("¿Seguro que deseas eliminar esta tarea?");
        if (!confirmar) return;

        try {
          const token = localStorage.getItem("token");
          const res = await fetch(
            `https://demo-290a.onrender.com/api/v1/tasks/${t._id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.status === 204) {
            card.remove();
            alert("✅ Task deleted successfully");
          } else {
            const data = await res.json().catch(() => ({}));
            alert(data.message || "❌ Error deleting task");
          }
        } catch (err) {
          console.error("Error deleting task:", err.message || err);
          alert("⚠️ Could not connect to the server");
        }
      });

      // Append card to column
      const status = t.status;
      if (status === "Por hacer") {
        todo.appendChild(card);
      } else if (status === "Haciendo") {
        doing.appendChild(card);
      } else if (status === "Hecho") {
        done.appendChild(card);
      }
    });
  }

  await loadTasks();
});
