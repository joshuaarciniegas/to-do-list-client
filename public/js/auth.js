// ================================================
// 🌐 User Authentication (Login, Signup, Logout)
// ================================================

/**
 * Executes when the DOM content has fully loaded.
 * Handles login, signup, and logout functionality by attaching event listeners
 * to forms and buttons if they exist in the current page.
 */
document.addEventListener("DOMContentLoaded", () => {

  // ===== LOGIN =====

  /** @type {HTMLFormElement|null} */
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    /**
     * Handles the login form submission.
     * Sends user credentials (email and password) to the backend for authentication.
     *
     * @param {Event} e - The form submit event.
     * @returns {Promise<void>}
     */
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      /** @type {string} */
      const email = document.getElementById("email").value;
      /** @type {string} */
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("https://demo-290a.onrender.com/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          alert("Login successful ✅");
          window.location.href = "pages/tasks.html";
        } else {
          alert(data.message || "Login error ❌");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("There was a problem logging in");
      }
    });
  }

  // ===== SIGNUP =====

  /** @type {HTMLFormElement|null} */
  const signupForm = document.getElementById("sign-up");

  if (signupForm) {
    /**
     * Validates that a password includes at least:
     * - One lowercase letter
     * - One uppercase letter
     * - One number
     * - One special character
     *
     * @param {string} password - Password string to validate.
     * @returns {boolean} True if the password is valid, otherwise false.
     */
    function validatePassword(password) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
      return regex.test(password);
    }

    /**
     * Handles the signup form submission.
     * Sends new user data to the backend for account creation.
     *
     * @param {Event} e - The form submit event.
     * @returns {Promise<void>}
     */
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      /** @type {string} */
      const firstName = document.getElementById("name").value.trim();
      /** @type {string} */
      const lastName = document.getElementById("lastname").value.trim();
      /** @type {string} */
      const age = document.getElementById("age").value;
      /** @type {string} */
      const email = document.getElementById("email").value;
      /** @type {string} */
      const password = document.getElementById("password").value;
      /** @type {string} */
      const confirmPassword = document.getElementById("confirm-password").value;

      if (!validatePassword(password)) {
        alert("Password must include uppercase, lowercase, number, and special character");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      try {
        const response = await fetch("https://demo-290a.onrender.com/api/v1/users/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, age, email, password, confirmPassword })
        });

        const data = await response.json();

        if (response.ok) {
          alert("✅ User successfully registered");
          window.location.href = "../index.html";
        } else {
          alert("❌ Error: " + (data.message || "Signup error"));
        }
      } catch (error) {
        console.error("Signup error:", error);
        alert("⚠️ Could not connect to server");
      }
    });
  }

  // ===== LOGOUT =====

  /** @type {HTMLButtonElement|null} */
  const logoutBtn = document.getElementById("logout-btn");

  /** @type {string|null} */
  const token = localStorage.getItem("token");
  
  if (logoutBtn) {
    /**
     * Handles user logout.
     * Sends a POST request to the backend logout endpoint and removes the stored token.
     *
     * @returns {Promise<void>}
     */
    logoutBtn.addEventListener("click", async () => {
      try {
        const response = await fetch("https://demo-290a.onrender.com/api/v1/auth/logout", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.removeItem("token");
          alert(data.message || "Logout successful ✅");
          window.location.href = "../index.html";
        } else {
          alert(data.message || "Error logging out ❌");
        }
      } catch (error) {
        console.error("Logout error:", error);
        alert("There was a problem logging out");
      }
    });
  }

});
