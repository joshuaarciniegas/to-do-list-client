// Funciones básicas para los botones
function editTask(button) {
  const taskCard = button.closest(".task-card")
  alert("Función de editar tarea - aquí puedes integrar tu lógica de edición")
}

// Funcion para los botones perfil y nueva tarea

//Funcion para el menu hamburguesa
  const hamburger = document.getElementById("hamburger");
  const sideMenu = document.getElementById("sideMenu");
  let menuOpen = false;

  hamburger.addEventListener("click", () => {
    if (!menuOpen) {
      sideMenu.style.width = "250px"; // Abre el menú
      menuOpen = true;
    } else {
      sideMenu.style.width = "0"; // Cierra el menú
      menuOpen = false;
    }
  });

// Función para redirigir al perfil
function goToProfile() {
  window.location.href = "profile.html"; // cámbialo por la ruta real
}

// Función para redirigir a la creación de tarea
function goToCreateTask() {
  window.location.href = "newtask.html"; // cámbialo por la ruta real
}


// Función de búsqueda básica
document.getElementById("searchInput").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase()
  const taskCards = document.querySelectorAll(".task-card")

  taskCards.forEach((card) => {
    const title = card.querySelector(".task-title").textContent.toLowerCase()
    const date = card.querySelector(".task-date").textContent.toLowerCase()
    const description = card.querySelector(".task-description").textContent.toLowerCase()

    if (title.includes(searchTerm) || date.includes(searchTerm) || description.includes(searchTerm)) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
})

// funcion para mostrar las tareas
document.addEventListener("DOMContentLoaded", async () => {
  async function loadTasks() {
    try {
      const token = localStorage.getItem("token"); // ajusta el nombre si es diferente

      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetch("//https://demo-290a.onrender.com/api/v1/tasks/mytasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cargar tareas");
      }

      const tasks = data.tasks || [];
      renderTasks(tasks);
    } catch (error) {
      console.error("Error al cargar tareas:", error.message);
      document.getElementById("todo-column").innerHTML = `<p style="color:red;">❌ ${error.message}</p>`;
    }
  }

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
      <div class="task-header">
        <span>${t.title}</span>
        <span class="task-status">${t.status}</span>
      </div>
      <div class="task-detail">${t.detail || ""}</div>
      <div class="task-date">
        ${t.date ? new Date(t.date).toLocaleDateString("es-ES") : "Sin fecha"} 
        ${t.time || ""}
      </div>
      <div class="task-actions">
        <button title="Editar">Editar</button>
        <button title="Eliminar">Eliminar</button>
      </div>
    `;

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