/**
 * @fileoverview Handles password recovery and reset functionality.
 * - Forgot password (email form)
 * - Reset password (with token from URL)
 *
 * Provides:
 * - Form validation
 * - API requests to backend
 * - Error handling and user feedback
 */

document.addEventListener("DOMContentLoaded", () => {
  // ============================================
  // --- PASSWORD RECOVERY FORM (forgot.html) ---
  // ============================================

  /** @type {HTMLFormElement|null} */
  const forgotForm =
    document.querySelector("form#forgotForm") ||
    document.querySelector("form#forgot-email-form");

  /** @type {HTMLInputElement|null} */
  const emailInput = document.getElementById("email");

  if (forgotForm && emailInput) {
    /**
     * Handles the "forgot password" form submission
     * @async
     * @param {SubmitEvent} e
     */
    forgotForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      /** @type {string} */
      const email = emailInput.value.trim();

      if (!email) {
        alert("Por favor ingresa tu correo electrónico");
        return;
      }

      try {
        const response = await fetch(
          "https://demo-290a.onrender.com/api/v1/auth/forgot-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );

        /** @type {{message?: string}} */
        const data = await response.json();

        if (response.ok) {
          alert("✅ Se ha enviado un enlace de recuperación a tu correo");
          forgotForm.reset();
        } else {
          alert(data.message || "❌ Error al enviar el enlace de recuperación");
        }
      } catch (error) {
        console.error("Error sending recovery link:", error);
        alert("Hubo un problema al conectarse con el servidor");
      }
    });
  }

  // =============================================
  // --- PASSWORD RESET FORM WITH TOKEN (reset.html) ---
  // =============================================

  /** @type {HTMLFormElement|null} */
  const resetForm = document.getElementById("resetForm");

  /** @type {HTMLInputElement|null} */
  const newPass = document.getElementById("new-password");

  /** @type {HTMLInputElement|null} */
  const confirmPass = document.getElementById("confirm-password");

  /** @type {HTMLElement|null} */
  const errorMessage = document.getElementById("error-message");

  if (resetForm && newPass && confirmPass && errorMessage) {
    errorMessage.style.display = "none";

    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      errorMessage.style.display = "block";
      errorMessage.textContent = "Token no encontrado en la URL";
    }

    /**
     * Validate that password meets minimum requirements
     * - At least 8 characters
     * - At least one uppercase
     * - At least one lowercase
     * - At least one number
     *
     * @param {string} password
     * @returns {boolean}
     */
    const isValidPassword = (password) => {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    };

    /**
     * Handles the "reset password" form submission
     * @async
     * @param {SubmitEvent} e
     */
    resetForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (newPass.value !== confirmPass.value) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Las contraseñas no coinciden";
        return;
      }

      if (!isValidPassword(newPass.value)) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "La contraseña no cumple los requisitos";
        return;
      }

      errorMessage.style.display = "none";

      try {
        const response = await fetch(
          `https://demo-290a.onrender.com/api/v1/auth/reset-password/${token}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: newPass.value }),
          }
        );

        /** @type {{message?: string}} */
        const data = await response.json();

        if (response.ok) {
          alert("✅ Contraseña actualizada con éxito");
          window.location.href = "../index.html";
        } else {
          errorMessage.style.display = "block";
          errorMessage.textContent =
            data.message || "Error al actualizar contraseña";
        }
      } catch (err) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Error de conexión con el servidor";
        console.error(err);
      }
    });
  }
});
