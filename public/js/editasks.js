// funcion para editar tareas 
document.addEventListener("DOMContentLoaded", async () => {
  const formEditar = document.getElementById("formEditarTarea");

  const token = localStorage.getItem("token");
  const taskId = localStorage.getItem("taskId");

  if (!taskId) {
    alert("No se encontró la tarea a editar");
    window.location.href = "tasks.html";
    return;
  }

  // --- Precargar datos con un GET ---
  try {
    const res = await fetch(`https://demo-290a.onrender.com/api/v1/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al cargar los datos de la tarea");
      window.location.href = "tasks.html";
      return;
    }

    // Rellenar los campos del formulario con los valores reales
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

  // --- Manejo del envío del formulario ---
  formEditar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const detalle = document.getElementById("detalle").value.trim();
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
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
