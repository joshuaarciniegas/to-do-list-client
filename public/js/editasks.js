// ================================================
// ✏️ Función para editar tareas
// ✏️ Function to edit tasks
// ================================================

// Se ejecuta cuando todo el contenido del DOM ha sido cargado
// Executes when the entire DOM content has been loaded
document.addEventListener("DOMContentLoaded", async () => {

  // Obtiene el formulario de edición de tareas por su ID
  // Get the task edit form by its ID
  const formEditar = document.getElementById("formEditarTarea");

  // Obtiene el token y el ID de la tarea desde localStorage
  // Get token and task ID from localStorage
  const token = localStorage.getItem("token");
  const taskId = localStorage.getItem("taskId");

  // Si no hay taskId en localStorage, redirige al listado de tareas
  // If no taskId in localStorage, redirect to tasks list
  if (!taskId) {
    alert("No se encontró la tarea a editar");
    window.location.href = "tasks.html";
    return;
  }

  // --- Precargar datos con un GET ---
  // --- Preload task data with a GET request ---
  try {
    const res = await fetch(`https://demo-290a.onrender.com/api/v1/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Enviar token en los headers
                                         // Send token in headers
      },
    });

    const data = await res.json();

    // Validación de respuesta: si falla, redirige
    // Response validation: if it fails, redirect
    if (!res.ok) {
      alert(data.message || "Error al cargar los datos de la tarea");
      window.location.href = "tasks.html";
      return;
    }

    // Rellenar los campos del formulario con los valores de la tarea
    // Fill form fields with the task values
    document.getElementById("titulo").value = data.title;
    document.getElementById("detalle").value = data.detail;
    document.getElementById("fecha").value = data.date ? data.date.split("T")[0] : "";
    document.getElementById("hora").value = data.time || "";
    document.getElementById("estado").value = data.status || "por-hacer";

  } catch (err) {
    // Manejo de errores en la petición GET
    // Error handling for GET request
    console.error("Error cargando tarea:", err);
    alert("No se pudo conectar con el servidor");
    window.location.href = "tasks.html";
  }

  // --- Manejo del envío del formulario ---
  // --- Handling form submission ---
  formEditar.addEventListener("submit", async (e) => {
    e.preventDefault(); // Previene envío tradicional del formulario
                        // Prevents traditional form submission

    // Captura los valores actualizados desde el formulario
    // Capture updated values from form
    const titulo = document.getElementById("titulo").value.trim();
    const detalle = document.getElementById("detalle").value.trim();
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const estado = document.getElementById("estado").value;

    try {
      // Se envía una petición PUT al backend con los datos actualizados
      // Send a PUT request to backend with updated data
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

      const data = await res.json();

      // Validación de respuesta del backend
      // Backend response validation
      if (!res.ok) {
        alert(data.message || "Error al actualizar la tarea");
        return;
      }

      alert("Tarea actualizada con éxito ✅");
      window.location.href = "tasks.html";

    } catch (err) {
      // Manejo de errores en la petición PUT
      // Error handling for PUT request
      console.error("Error editando tarea:", err);
      alert("No se pudo conectar con el servidor");
    }
  });
});
