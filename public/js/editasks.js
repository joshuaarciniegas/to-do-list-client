// ================================================
// ✏️ Function to edit tasks
// ================================================

/**
 * Task Editing Module
 * 
 * - Preloads task data from the backend using a GET request.
 * - Populates the edit form with the task's existing values.
 * - Handles task update submission with a PUT request.
 * - Redirects to task list if `taskId` is missing or errors occur.
 * 
 * @module EditTask
 */
document.addEventListener("DOMContentLoaded", async () => {

  /** @type {HTMLFormElement|null} */
  const formEditar = document.getElementById("formEditarTarea");

  /** @type {string|null} */
  const token = localStorage.getItem("token");

  /** @type {string|null} */
  const taskId = localStorage.getItem("taskId");

  if (!taskId) {
    alert("No se encontró la tarea a editar");
    window.location.href = "tasks.html";
    return;
  }

  // --- Preload task data with GET request ---
  try {
    const res = await fetch(`https://demo-290a.onrender.com/api/v1/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    /** @type {{title: string, detail: string, date?: string, time?: string, status?: string, message?: string}} */
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al cargar los datos de la tarea");
      window.location.href = "tasks.html";
      return;
    }

    document.getElementById("titulo").value = data.title;
    document.getElementById("detalle").value = data.detail;
    document.getElementById("fecha").value = data.date ? data.date.split("T")[0] : "";
    document.getElementById("hora").value = data.time || "";
    document.getElementById("estado").value = data.status || "por-hacer";

  } catch (err) {
    console.error("Error cargando tarea:", err);
    alert("No se pudo conectar con el servidor");
    window.location.href = "tasks.html";
  }

  // --- Handle form submission for editing task ---
  formEditar.addEventListener("submit", async (e) => {
    e.preventDefault();

    /** @type {string} */
    const titulo = document.getElementById("titulo").value.trim();
    /** @type {string} */
    const detalle = document.getElementById("detalle").value.trim();
    /** @type {string} */
    const fecha = document.getElementById("fecha").value;
    /** @type {string} */
    const hora = document.getElementById("hora").value;
    /** @type {string} */
    const estado = document.getElementById("estado").value;

    try {
      const res = await fetch(`https://demo-290a.onrender.com/api/v1/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: titulo,
          detail: detalle,
          date: fecha,
          time: hora,
          status: estado,
        }),
      });

      /** @type {{message?: string}} */
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al actualizar la tarea");
        return;
      }

      alert("Tarea actualizada con éxito ✅");
      window.location.href = "tasks.html";

    } catch (err) {
      console.error("Error editando tarea:", err);
      alert("No se pudo conectar con el servidor");
    }
  });
});
