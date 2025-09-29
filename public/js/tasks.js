/**
 * Handles task creation form submission and interaction with the backend API.
 * Executes when the DOM content is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const formTarea = document.getElementById("formTarea");
  const token = localStorage.getItem("token");

  if (formTarea) {
    /**
     * Handles the task creation process when the form is submitted.
     * @event submit
     * @param {Event} e - The submit event object.
     */
    formTarea.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Capture form values
      const titulo = document.getElementById("titulo").value.trim();
      const detalle = document.getElementById("detalle").value.trim();
      const fecha = document.getElementById("fecha").value; // yyyy-mm-dd
      const hora = document.getElementById("hora").value;   // HH:mm
      const estado = document.getElementById("estado").value;

      // Basic validation
      if (!titulo || !detalle || !fecha || !hora || !estado) {
        alert("Please complete all fields");
        return;
      }

      try {
        /**
         * Sends a POST request to create a new task in the backend.
         * @typedef {Object} Task
         * @property {string} title - The title of the task.
         * @property {string} detail - Additional details of the task.
         * @property {string} date - The date of the task in yyyy-mm-dd format.
         * @property {string} time - The time of the task in HH:mm format.
         * @property {string} status - The status of the task (e.g., "To Do", "In Progress", "Done").
         */

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
          alert("Task created ✅");
          window.location.href = "../pages/tasks.html";
          formTarea.reset();
        } else {
          alert(data.message || "Error creating the task ❌");
        }
      } catch (error) {
        console.error("Error creating the task:", error);
        alert("There was a problem connecting to the server");
      }
    });
  }
});

// http://localhost:3000
// https://demo-290a.onrender.com
