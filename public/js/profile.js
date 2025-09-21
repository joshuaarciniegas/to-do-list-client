document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión primero");
    window.location.href = "login.html";
    return;
  }

  try {
    // Petición al backend para traer datos del usuario
    const res = await fetch("//https://demo-290a.onrender.com/api/v1/auth/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error("No se pudieron cargar los datos del usuario");
    }

    const user = await res.json();
    console.log("📌 Respuesta del backend:", user);

    // Mostrar datos en la sección de perfil
    document.querySelector(".info").innerHTML = `
      <p><strong>Nombre y Apellido:</strong> ${user.firstName} ${user.lastName}</p>
      <hr>
      <p><strong>Edad:</strong> ${user.age} años</p>
      <hr>
      <p><strong>Correo electrónico:</strong> ${user.email}</p>
      <hr>
    `;

    // Prellenar formulario de edición
    document.getElementById("firstName").value = user.firstName;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("age").value = user.age;
    document.getElementById("email").value = user.email;

  } catch (error) {
    console.error("Error al cargar perfil:", error);
  }
});

// ======================
// Script para editar perfil
// ======================

    // Cancelar edición
    function cancelarEdicion() {
      window.location.href = "profile.html";
    }

    document.addEventListener("DOMContentLoaded", async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión primero");
        window.location.href = "login.html";
        return;
      }

      try {
        // Traemos los datos del usuario
        const res = await fetch("//https://demo-290a.onrender.com/api/v1/auth/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) throw new Error("No se pudieron cargar los datos del usuario");

        const user = await res.json();

        // Prellenar los campos del formulario
        document.getElementById("firstName").value = user.firstName;
        document.getElementById("lastName").value = user.lastName;
        document.getElementById("age").value = user.age;
        document.getElementById("email").value = user.email;

      } catch (error) {
        console.error("Error al cargar perfil para edición:", error);
      }
    });

    // Guardar cambios
    document.getElementById("editProfileForm").addEventListener("submit", async (event) => {
      event.preventDefault();

      const token = localStorage.getItem("token");
      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const age = document.getElementById("age").value.trim();
      const email = document.getElementById("email").value.trim();

      try {
        const res = await fetch("//https://demo-290a.onrender.com/api/v1/users/me", {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ firstName, lastName, age, email })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Error al actualizar el perfil");

        alert("Perfil actualizado correctamente ✅");
        window.location.href = "profile.html"; // redirigir al perfil
      } catch (error) {
        console.error("Error al actualizar perfil:", error);
        alert(error.message);
      }
    });