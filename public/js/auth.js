// ================================================
// 🌐 Autenticación de Usuario (Login, Signup, Logout)
// 🌐 User Authentication (Login, Signup, Logout)
// ================================================

// Se ejecuta cuando todo el contenido del DOM ha sido cargado
// Executes when the entire DOM content has been loaded
document.addEventListener("DOMContentLoaded", () => {

  // ===== LOGIN =====
  // Captura el formulario de login por su ID
  // Capture login form by its ID
  const loginForm = document.getElementById("login-form");

  // Si el formulario existe en la página, se agrega un listener al evento "submit"
  // If the form exists in the page, add an event listener for the "submit" event
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Previene envío tradicional del formulario
                          // Prevents traditional form submission

      // Captura los valores ingresados por el usuario
      // Capture values entered by the user
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        // Se hace una petición POST al endpoint de login del backend
        // Make a POST request to the backend login endpoint
        const response = await fetch("https://demo-290a.onrender.com/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }), // Enviamos los datos en formato JSON
                                                     // Send the data in JSON format
        });

        // Se obtiene la respuesta en formato JSON
        // Get the response in JSON format
        const data = await response.json();

        if (response.ok) {
          // Si el login fue exitoso, se guarda el token en localStorage
          // If login is successful, save token in localStorage
          localStorage.setItem("token", data.token);
          alert("Inicio de sesión exitoso ✅ / Login successful ✅");
          // Redirige a la página de tareas
          // Redirect to tasks page
          window.location.href = "pages/tasks.html";
        } else {
          // Muestra mensaje de error si hubo algún problema con las credenciales
          // Show error message if there was a problem with the credentials
          alert(data.message || "Error al iniciar sesión ❌ / Login error ❌");
        }
      } catch (error) {
        // Captura errores de la petición fetch
        // Catch fetch request errors
        console.error("Error en login / Login error:", error);
        alert("Hubo un problema al iniciar sesión / There was a problem logging in");
      }
    });
  }

  // ===== SIGNUP =====
  // Captura el formulario de registro por su ID
  // Capture signup form by its ID
  const signupForm = document.getElementById("sign-up");

  if (signupForm) {

    // Función para validar la contraseña:
    // debe incluir mayúscula, minúscula, número y carácter especial
    // Function to validate password:
    // must include uppercase, lowercase, number, and special character
    function validatePassword(password) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
      return regex.test(password);
    }

    // Se agrega un listener al evento "submit" del formulario de registro
    // Add event listener for "submit" event on signup form
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Previene envío tradicional del formulario
                          // Prevents traditional form submission

      // Captura los valores ingresados en los campos del formulario
      // Capture values entered in the form fields
      const firstName = document.getElementById("name").value.trim();
      const lastName = document.getElementById("lastname").value.trim();
      const age = document.getElementById("age").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      // Valida que la contraseña cumpla con los requisitos
      // Validate that the password meets the requirements
      if (!validatePassword(password)) {
        alert("La contraseña debe incluir mayúscula, minúscula, número y carácter especial / Password must include uppercase, lowercase, number, and special character");
        return;
      }

      // Valida que las contraseñas coincidan
      // Validate that passwords match
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden / Passwords do not match");
        return;
      }

      try {
        // Se hace una petición POST al endpoint de registro del backend
        // Make a POST request to the backend signup endpoint
        const response = await fetch("https://demo-290a.onrender.com/api/v1/users/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, age, email, password, confirmPassword })
        });

        const data = await response.json();

        if (response.ok) {
          // Si el registro fue exitoso, muestra mensaje y redirige al login
          // If signup was successful, show message and redirect to login
          alert("✅ Usuario registrado con éxito / User successfully registered ✅");
          window.location.href = "../index.html";
        } else {
          // Muestra mensaje de error si hubo algún problema en el registro
          // Show error message if there was a problem during signup
          alert("❌ Error: " + (data.message || "Error al registrarse / Signup error"));
        }
      } catch (error) {
        console.error("Error en signup / Signup error:", error);
        alert("⚠️ No se pudo conectar con el servidor / Could not connect to server");
      }
    });
  }

  // ===== LOGOUT =====
  // Captura el botón de logout por su ID
  // Capture logout button by its ID
  const logoutBtn = document.getElementById("logout-btn");
  // Obtiene el token guardado en localStorage
  // Get token stored in localStorage
  const token = localStorage.getItem("token");
  
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        // Se hace una petición POST al endpoint de logout del backend con el token en el header
        // Make a POST request to backend logout endpoint with token in header
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
          // If logout is successful, remove token and redirect to login
          localStorage.removeItem("token");
          alert(data.message || "Sesión cerrada correctamente ✅ / Logout successful ✅");
          window.location.href = "../index.html";
        } else {
          alert(data.message || "Error al cerrar sesión ❌ / Error logging out ❌");
        }
      } catch (error) {
        console.error("Error al cerrar sesión / Logout error:", error);
        alert("Hubo un problema al cerrar sesión / There was a problem logging out");
      }
    });
  }

});
