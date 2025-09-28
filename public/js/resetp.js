// Se ejecuta cuando todo el contenido del DOM ha sido cargado
// Executes when all DOM content has been fully loaded
document.addEventListener("DOMContentLoaded", () => {

  // --- FORMULARIO DE RECUPERACIÓN POR CORREO (forgot.html) ---
  // --- PASSWORD RECOVERY FORM BY EMAIL (forgot.html) ---
  
  // Se buscan los posibles formularios de recuperación de contraseña
  // Search for possible password recovery forms
  const forgotForm = document.querySelector("form#forgotForm") || document.querySelector("form#forgot-email-form");
  const emailInput = document.getElementById("email");

  // Si existe un formulario y un campo de correo
  // If a form and email input exist
  if (forgotForm && emailInput) {
    // Listener para el envío del formulario
    // Listener for form submission
    forgotForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Previene el envío tradicional del formulario | Prevents traditional form submission

      const email = emailInput.value.trim(); // Captura y limpia el correo ingresado | Captures and trims the entered email

      // Validación de campo vacío
      // Empty field validation
      if (!email) {
        alert("Por favor ingresa tu correo electrónico");
        return;
      }

      try {
        // Petición POST al endpoint de recuperación de contraseña
        // POST request to password recovery endpoint
        const response = await fetch("https://demo-290a.onrender.com/api/v1/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json(); // Convertimos la respuesta a JSON | Convert response to JSON

        if (response.ok) {
          // Si la solicitud fue exitosa, notifica al usuario y resetea el formulario
          // If request was successful, notify user and reset form
          alert("✅ Se ha enviado un enlace de recuperación a tu correo");
          forgotForm.reset();
        } else {
          // Muestra mensaje de error en caso de fallo
          // Display error message in case of failure
          alert(data.message || "❌ Error al enviar el enlace de recuperación");
        }
      } catch (error) {
        // Captura errores de conexión
        // Catch connection errors
        console.error("Error al enviar el enlace de recuperación:", error);
        alert("Hubo un problema al conectarse con el servidor");
      }
    });
  }

  // --- FORMULARIO DE RESTABLECIMIENTO CON TOKEN (reset.html) ---
  // --- PASSWORD RESET FORM WITH TOKEN (reset.html) ---

  const resetForm = document.getElementById("resetForm"); // Formulario de reset de contraseña | Password reset form
  const newPass = document.getElementById("new-password"); // Campo de nueva contraseña | New password field
  const confirmPass = document.getElementById("confirm-password"); // Campo de confirmación de contraseña | Confirm password field
  const errorMessage = document.getElementById("error-message"); // Contenedor para mostrar errores | Container to display errors

  // Si existe el formulario de reset
  // If reset form exists
  if (resetForm) {
    errorMessage.style.display = "none"; // Oculta el mensaje de error inicialmente | Hide error message initially

    // Captura el token desde la URL
    // Capture the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      // Muestra error si no se encuentra el token
      // Show error if token is not found
      errorMessage.style.display = "block";
      errorMessage.textContent = "Token no encontrado en la URL";
    }

    // Función para validar que la contraseña cumpla requisitos mínimos
    // Function to validate password meets minimum requirements
    const isValidPassword = (password) => {
      // Debe tener al menos una mayúscula, una minúscula, un número y 8 caracteres
      // Must contain at least one uppercase, one lowercase, one number, and 8 characters
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    };

    // Listener para el envío del formulario de reset
    // Listener for reset form submission
    resetForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Previene envío tradicional | Prevent traditional submission

      // Valida que las contraseñas coincidan
      // Validate passwords match
      if (newPass.value !== confirmPass.value) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Las contraseñas no coinciden";
        return;
      }

      // Valida que la nueva contraseña cumpla los requisitos
      // Validate new password meets requirements
      if (!isValidPassword(newPass.value)) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "La contraseña no cumple los requisitos";
        return;
      }

      errorMessage.style.display = "none"; // Oculta errores previos | Hide previous errors

      try {
        // Petición POST al endpoint de restablecimiento de contraseña con el token
        // POST request to password reset endpoint with token
        const response = await fetch(`https://demo-290a.onrender.com/api/v1/auth/reset-password/${token}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPass.value }),
        });

        const data = await response.json();

        if (response.ok) {
          // Si la contraseña se actualiza correctamente, notifica y redirige al login
          // If password updates successfully, notify and redirect to login
          alert("✅ Contraseña actualizada con éxito");
          window.location.href = "../index.html";
        } else {
          // Muestra error retornado por el backend
          // Show error returned by backend
          errorMessage.style.display = "block";
          errorMessage.textContent = data.message || "Error al actualizar contraseña";
        }
      } catch (err) {
        // Captura errores de conexión
        // Catch connection errors
        errorMessage.style.display = "block";
        errorMessage.textContent = "Error de conexión con el servidor";
        console.error(err);
      }
    });
  }
});
