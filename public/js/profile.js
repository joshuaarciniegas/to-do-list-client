// ================================================
// 👤 Manejo de perfil de usuario (visualización y edición)
// 👤 User profile management (viewing and editing)
// ================================================

// Se ejecuta cuando todo el contenido del DOM ha sido cargado
// Executes when the entire DOM content has been loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Obtiene el token del almacenamiento local
  // Get the token from local storage
  const token = localStorage.getItem("token");
  if (!token) {
    // Si no hay token, redirige al login
    // If no token, redirect to login
    alert("Debes iniciar sesión primero");
    window.location.href = "login.html";
    return;
  }

  try {
    // Petición al backend para traer datos del usuario
    // Request to backend to fetch user data
    const res = await fetch("http://localhost:3000/api/v1/auth/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Se envía el token en los headers
                                           // Send token in headers
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error("No se pudieron cargar los datos del usuario");
    }

    const user = await res.json();
    console.log("📌 Respuesta del backend:", user);

    // Mostrar datos en la sección de perfil
    // Display user data in the profile section
    document.querySelector(".info").innerHTML = `
      <p><strong>Nombre y Apellido:</strong> ${user.firstName} ${user.lastName}</p>
      <hr>
      <p><strong>Edad:</strong> ${user.age} años</p>
      <hr>
      <p><strong>Correo electrónico:</strong> ${user.email}</p>
      <hr>
    `;

    // Prellenar formulario de edición
    // Prefill edit form with user data
    document.getElementById("firstName").value = user.firstName;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("age").value = user.age;
    document.getElementById("email").value = user.email;

  } catch (error) {
    // Manejo de errores en la carga de datos
    // Error handling when loading data
    console.error("Error al cargar perfil:", error);
  }
});

// ======================
// Script para editar perfil
// Script to edit profile
// ======================

// Cancelar edición y volver al perfil
// Cancel editing and go back to profile
function cancelarEdicion() {
  window.location.href = "profile.html";
}

// Segundo evento DOMContentLoaded para manejar edición
// Second DOMContentLoaded event to handle editing
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión primero");
    window.location.href = "login.html";
    return;
  }

  try {
    // Traemos los datos del usuario
    // Fetch user data
    const res = await fetch("http://localhost:3000/api/v1/auth/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error("No se pudieron cargar los datos del usuario");

    const user = await res.json();

    // Prellenar los campos del formulario con datos actuales
    // Prefill form fields with current user data
    document.getElementById("firstName").value = user.firstName;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("age").value = user.age;
    document.getElementById("email").value = user.email;

  } catch (error) {
    console.error("Error al cargar perfil para edición:", error);
  }
});

// Guardar cambios en el perfil
// Save profile changes
document.getElementById("editProfileForm").addEventListener("submit", async (event) => {
  event.preventDefault(); // Evita envío tradicional del formulario
                          // Prevent traditional form submission

  // Captura de valores desde el formulario
  // Capture values from the form
  const token = localStorage.getItem("token");
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const age = document.getElementById("age").value.trim();
  const email = document.getElementById("email").value.trim();

  try {
    // Petición PUT al backend para actualizar perfil
    // PUT request to backend to update profile
    const res = await fetch("http://localhost:3000/api/v1/users/me", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ firstName, lastName, age, email })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Error al actualizar el perfil");

    // Si fue exitoso, muestra mensaje y redirige al perfil
    // If successful, show message and redirect to profile
    alert("Perfil actualizado correctamente ✅");
    window.location.href = "profile.html"; 

  } catch (error) {
    // Manejo de errores en la actualización
    // Error handling during update
    console.error("Error al actualizar perfil:", error);
    alert(error.message);
  }
});
