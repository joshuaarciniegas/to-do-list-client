// Se ejecuta cuando todo el contenido del DOM ha sido cargado
document.addEventListener("DOMContentLoaded", () => {

  // ===== LOGIN =====
  // Captura el formulario de login por su ID
  const loginForm = document.getElementById("login-form");

  // Si el formulario existe en la página, se agrega un listener al evento "submit"
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Previene que el formulario se envíe de forma tradicional

      // Captura los valores ingresados por el usuario
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        // Se hace una petición POST al endpoint de login del backend
        const response = await fetch("https://demo-290a.onrender.com/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }), // Enviamos los datos en formato JSON
        });

        // Se obtiene la respuesta en formato JSON
        const data = await response.json();

        if (response.ok) {
          // Si el login fue exitoso, se guarda el token en localStorage
          localStorage.setItem("token", data.token);
          alert("Inicio de sesión exitoso ✅");
          // Redirige a la página de tareas
          window.location.href = "pages/tasks.html";
        } else {
          // Muestra mensaje de error si hubo algún problema con las credenciales
          alert(data.message || "Error al iniciar sesión ❌");
        }
      } catch (error) {
        // Captura errores de la petición fetch
        console.error("Error en login:", error);
        alert("Hubo un problema al iniciar sesión");
      }
    });
  }

  // ===== SIGNUP =====
  // Captura el formulario de registro por su ID
  const signupForm = document.getElementById("sign-up");

  if (signupForm) {

    // Función para validar la contraseña: debe incluir mayúscula, minúscula, número y carácter especial
    function validatePassword(password) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
      return regex.test(password);
    }

    // Se agrega un listener al evento "submit" del formulario de registro
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Previene el envío tradicional del formulario

      // Captura los valores ingresados en los campos del formulario
      const firstName = document.getElementById("name").value.trim();
      const lastName = document.getElementById("lastname").value.trim();
      const age = document.getElementById("age").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      // Valida que la contraseña cumpla con los requisitos
      if (!validatePassword(password)) {
        alert("La contraseña debe incluir mayúscula, minúscula, número y carácter especial");
        return;
      }

      // Valida que las contraseñas coincidan
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      try {
        // Se hace una petición POST al endpoint de registro del backend
        const response = await fetch("https://demo-290a.onrender.com/api/v1/users/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, age, email, password, confirmPassword })
        });

        const data = await response.json();

        if (response.ok) {
          // Si el registro fue exitoso, muestra mensaje y redirige al login
          alert("✅ Usuario registrado con éxito");
          window.location.href = "../index.html";
        } else {
          // Muestra mensaje de error si hubo algún problema en el registro
          alert("❌ Error: " + (data.message || "Error al registrarse"));
        }
      } catch (error) {
        console.error("Error en signup:", error);
        alert("⚠️ No se pudo conectar con el servidor");
      }
    });
  }

  // ===== LOGOUT =====
  // Captura el botón de logout por su ID
  const logoutBtn = document.getElementById("logout-btn");
  // Obtiene el token guardado en localStorage
  const token = localStorage.getItem("token");
  
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        // Se hace una petición POST al endpoint de logout del backend con el token en el header
        const response = await fetch("https://demo-290a.onrender.com/api/v1/auth/logout", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          // Si se cierra la sesión correctamente, se elimina el token y se redirige al login
          localStorage.removeItem("token");
          alert(data.message || "Sesión cerrada correctamente ✅");
          window.location.href = "../index.html";
        } else {
          alert(data.message || "Error al cerrar sesión ❌");
        }
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("Hubo un problema al cerrar sesión");
      }
    });
  }

});
