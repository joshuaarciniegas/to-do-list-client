// Funciones básicas para los botones
function editTask(button) {
  const taskCard = button.closest(".task-card")
  alert("Función de editar tarea - aquí puedes integrar tu lógica de edición")
}

// =============================
// MENU HAMBURGUESA
// =============================
const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const closeBtn = document.getElementById("closeBtn");

hamburger.addEventListener("click", () => {
  sideMenu.style.width = "260px"; // abre el menú
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.width = "0"; // cierra el menú
});

  // =============================
  // RELOJ EN VIVO
  // =============================
  function updateClock() {
    const clock = document.getElementById("clock");
    const now = new Date();

    const options = { weekday: "long", day: "numeric", month: "short" };
    const time = now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    const date = now.toLocaleDateString("es-ES", options);

    clock.innerHTML = `
      <div style="font-size:20px; font-weight:700;">${time}</div>
      <div style="font-size:14px;">${date}</div>
    `;
  }

  setInterval(updateClock, 1000);
  updateClock();

// Función para redirigir al perfil
function goToProfile() {
  window.location.href = "profile.html"; // cámbialo por la ruta real
}

// Función para redirigir a la creación de tarea
function goToCreateTask() {
  window.location.href = "newtask.html"; // cámbialo por la ruta real
}
//funcion para redirigir a eliminar cuenta
function goToDeleteAccount() {
  window.location.href = "deleteaccount.html"; // cámbialo por la ruta real
}
//funcion para redirir a sobre nosotros
function goToAboutUs() {
  window.location.href = "aboutus.html"; // cámbialo por la ruta real
}

// Esperar a que el DOM cargue
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const taskCards = document.querySelectorAll(".task-card");

    taskCards.forEach((card) => {
      // Solo buscamos por el título
      const title = card.querySelector(".task-title")?.textContent.toLowerCase() || "";

      if (title.includes(searchTerm)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});




// funcion para mostrar las tareas
document.addEventListener("DOMContentLoaded", async () => {
  async function loadTasks() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetch("https://demo-290a.onrender.com/api/v1/tasks/mytasks", {
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
      <div class="task-title"><strong>Título:</strong> ${t.title}</div>
      <div class="task-detail"><strong>Detalle:</strong> ${t.detail || "Sin detalle"}</div>
      <div class="task-status"><strong>Estado:</strong> ${t.status}</div>
      <div class="task-date"><strong>Fecha:</strong> ${t.date ? new Date(t.date).toLocaleDateString("es-ES") : "Sin fecha"}</div>
      <div class="task-time"><strong>Hora:</strong> ${t.time || "Sin hora"}</div>
      <div class="task-actions">
        <button class="btn-editar" title="Editar">✏️ Editar</button>
        <button class="btn-eliminar" title="Eliminar">🗑️ Eliminar</button>
      </div>
    `;


      // 🔹 Seleccionamos el botón de editar dentro de la card
      const botonEditar = card.querySelector(".btn-editar");
      botonEditar.addEventListener("click", () => {
        localStorage.setItem("taskId", t._id); // guardamos el id de la tarea
        window.location.href = "editasks.html"; // redirigimos a la página de editar
      });

      // 🔹 Seleccionamos el botón de eliminar dentro de la card
      const botonEliminar = card.querySelector(".btn-eliminar");
      botonEliminar.addEventListener("click", async () => {
        const confirmar = confirm("¿Seguro que deseas eliminar esta tarea?");
        if (!confirmar) return;

        try {
          const token = localStorage.getItem("token"); // 🔹 Aquí lo obtienes de nuevo
          const res = await fetch(`https://demo-290a.onrender.com/api/v1/tasks/${t._id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });

          if (res.status === 204) {
            card.remove();
            alert("✅ Tarea eliminada con éxito");
          } else {
            const data = await res.json().catch(() => ({}));
            alert(data.message || "❌ Error al eliminar la tarea");
          }
        } catch (err) {
          console.error("Error eliminando tarea:", err.message || err);
          alert("⚠️ No se pudo conectar con el servidor");
        }
      });



      // Colocar la tarjeta en la columna correspondiente
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
