// ================================================
// 👤 User profile management (viewing and editing)
// ================================================

/**
 * User Profile Module
 *
 * - Fetches and displays user profile information.
 * - Prefills the profile edit form with current user data.
 * - Updates user profile through a PUT request.
 * - Redirects to login if authentication token is missing.
 *
 * @module UserProfile
 */
document.addEventListener("DOMContentLoaded", async () => {
  /** @type {string|null} */
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión primero");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("https://demo-290a.onrender.com/api/v1/auth/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error("No se pudieron cargar los datos del usuario");
    }

    /** 
     * @typedef {Object} User
     * @property {string} firstName - User's first name
     * @property {string} lastName - User's last name
     * @property {number} age - User's age
     * @property {string} email - User's email
     */

    /** @type {User} */
    const user = await res.json();
    console.log("📌 Backend response:", user);

    // Display user profile info
    document.querySelector(".info").innerHTML = `
      <p><strong>Full name:</strong> ${user.firstName} ${user.lastName}</p>
      <hr>
      <p><strong>Age:</strong> ${user.age} years</p>
      <hr>
      <p><strong>Email adress:</strong> ${user.email}</p>
      <hr>
    `;

    // Prefill edit form
    document.getElementById("firstName").value = user.firstName;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("age").value = user.age;
    document.getElementById("email").value = user.email;

  } catch (error) {
    console.error("Error loading profile:", error);
  }
});

// ======================
// Script to edit profile
// ======================

/**
 * Cancel editing and redirect back to profile view
 * @function cancelarEdicion
 */
function cancelarEdicion() {
  window.location.href = "profile.html";
}

// Handle edit form prefilling
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión primero");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("https://demo-290a.onrender.com/api/v1/auth/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error("No se pudieron cargar los datos del usuario");

    /** @type {User} */
    const user = await res.json();

    // Prefill form fields
    document.getElementById("firstName").value = user.firstName;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("age").value = user.age;
    document.getElementById("email").value = user.email;

  } catch (error) {
    console.error("Error loading profile for editing:", error);
  }
});

/**
 * Handles profile edit form submission
 * Sends updated data to backend and redirects on success
 */
document.getElementById("editProfileForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  /** @type {string|null} */
  const token = localStorage.getItem("token");

  /** @type {string} */
  const firstName = document.getElementById("firstName").value.trim();
  /** @type {string} */
  const lastName = document.getElementById("lastName").value.trim();
  /** @type {string} */
  const age = document.getElementById("age").value.trim();
  /** @type {string} */
  const email = document.getElementById("email").value.trim();

  try {
    const res = await fetch("https://demo-290a.onrender.com/api/v1/users/me", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ firstName, lastName, age, email })
    });

    /** @type {{message?: string}} */
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Error al actualizar el perfil");

    alert("Perfil actualizado correctamente ✅");
    window.location.href = "profile.html";

  } catch (error) {
    console.error("Error updating profile:", error);
    alert(error.message);
  }
});
