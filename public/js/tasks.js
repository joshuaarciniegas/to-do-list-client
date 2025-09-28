document.addEventListener("DOMContentLoaded", () => {
  const formTarea = document.getElementById("formTarea");
  const token=localStorage.getItem("token");

  if (formTarea) {
    formTarea.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Capturamos los valores del formulario
      const titulo = document.getElementById("titulo").value.trim();
      const detalle = document.getElementById("detalle").value.trim();
      const fecha = document.getElementById("fecha").value; // yyyy-mm-dd
      const hora = document.getElementById("hora").value;   // HH:mm
      const estado = document.getElementById("estado").value;
      

      // Validación básica
      if (!titulo || !detalle || !fecha || !hora || !estado) {
        alert("Por favor completa todos los campos");
        return;
      }

      try {
        const response = await fetch("https://demo-290a.onrender.com/api/v1/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            title: titulo,
            detail: detalle,
            date: fecha,
            time: hora,
            status: estado
            
          })
        });

        const data = await response.json();

        if (response.ok) {
          alert("Tarea creada ✅");
          window.location.href = "../pages/tasks.html";
          formTarea.reset();
        } else {
          alert(data.message || "Error al crear la tarea ❌");
        }
      } catch (error) {
        console.error("Error al crear la tarea:", error);
        alert("Hubo un problema al conectarse con el servidor");
      }
    });
  }
});

//http://localhost:3000
 //https://demo-290a.onrender.com