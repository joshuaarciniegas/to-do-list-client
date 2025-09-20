// Se ejecuta cuando todo el contenido del DOM ha sido cargado
document.addEventListener("DOMContentLoaded", () => {

  // --- FORMULARIO DE RECUPERACIÓN POR CORREO (forgot.html) ---
  // Se buscan los posibles formularios de recuperación de contraseña
  const forgotForm = document.querySelector("form#forgotForm") || document.querySelector("form#forgot-email-form");
  const emailInput = document.getElementById("email");

  if (forgotForm && emailInput) {
    // Listener para el envío del formulario
    forgotForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Previene el envío tradicional del formulario

      const email = emailInput.value.trim(); // Captura y limpia el correo ingresado
      if (!email) {
        alert("Por favor ingresa tu correo electrónico");
        return;
      }

      try {
        // Petición POST al endpoint de recuperación de contraseña
        const response = await fetch("https://demo-290a.onrender.com/api/v1/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json(); // Convertimos la respuesta a JSON

        if (response.ok) {
          // Si la solicitud fue exitosa, notifica al usuario y resetea el formulario
          alert("✅ Se ha enviado un enlace de recuperación a tu correo");
          forgotForm.reset();
        } else {
          // Muestra mensaje de error en caso de fallo
          alert(data.message || "❌ Error al enviar el enlace de recuperación");
        }
      } catch (error) {
        // Captura errores de conexión
        console.error("Error al enviar el enlace de recuperación:", error);
        alert("Hubo un problema al conectarse con el servidor");
      }
    });
  }

  // --- FORMULARIO DE RESTABLECIMIENTO CON TOKEN (reset.html) ---
  const resetForm = document.getElementById("resetForm"); // Formulario de reset de contraseña
  const newPass = document.getElementById("new-password"); // Campo de nueva contraseña
  const confirmPass = document.getElementById("confirm-password"); // Campo de confirmación de contraseña
  const errorMessage = document.getElementById("error-message"); // Contenedor para mostrar errores

  if (resetForm) {
    errorMessage.style.display = "none"; // Oculta el mensaje de error inicialmente

    // Captura el token desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      // Muestra error si no se encuentra el token
      errorMessage.style.display = "block";
      errorMessage.textContent = "Token no encontrado en la URL";
    }

    // Función para validar que la contraseña cumpla requisitos mínimos
    const isValidPassword = (password) => {
      // Debe tener al menos una mayúscula, una minúscula, un número y 8 caracteres
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    };

    // Listener para el envío del formulario de reset
    resetForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Previene envío tradicional

      // Valida que las contraseñas coincidan
      if (newPass.value !== confirmPass.value) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Las contraseñas no coinciden";
        return;
      }

      // Valida que la nueva contraseña cumpla los requisitos
      if (!isValidPassword(newPass.value)) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "La contraseña no cumple los requisitos";
        return;
      }

      errorMessage.style.display = "none"; // Oculta errores previos

      try {
        // Petición POST al endpoint de restablecimiento de contraseña con el token
        const response = await fetch(`https://demo-290a.onrender.com/api/v1/auth/reset-password/${token}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPass.value }),
        });

        const data = await response.json();

        if (response.ok) {
          // Si la contraseña se actualiza correctamente, notifica y redirige al login
          alert("✅ Contraseña actualizada con éxito");
          window.location.href = "index.html";
        } else {
          // Muestra error retornado por el backend
          errorMessage.style.display = "block";
          errorMessage.textContent = data.message || "Error al actualizar contraseña";
        }
      } catch (err) {
        // Captura errores de conexión
        errorMessage.style.display = "block";
        errorMessage.textContent = "Error de conexión con el servidor";
        console.error(err);
      }
    });
  }
});
