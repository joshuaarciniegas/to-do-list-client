/**
 * Deletes the currently authenticated user account.
 * 
 * - Requires the user to enter their password.
 * - Requires the user to type "ELIMINAR" for confirmation.
 * - Sends a DELETE request to the backend with authentication token.
 * - On success: shows confirmation modal and removes token from storage.
 * - On failure: shows an error message.
 * 
 * @async
 * @function deleteAccount
 * @returns {Promise<void>} Resolves when the account deletion process completes.
 */
async function deleteAccount() {
  /** @type {string} */
  const password = document.getElementById('password').value; 
  /** @type {string} */
  const confirmText = document.getElementById('confirmText').value; 

  if (!password || confirmText !== "ELIMINAR") {
    alert("You must enter your password and type 'ELIMINAR' to confirm.");
    return;
  }

  try {
    /** @type {string|null} */
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authenticated. Please log in again..");
      return;
    }

    const response = await fetch("https://demo-290a.onrender.com/api/v1/users/me", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        password: password,
        confirm: confirmText
      })
    });

    if (response.status === 204) {
      document.getElementById('successModal').style.display = 'flex';
      localStorage.removeItem("token");
    } else {
      const errorData = await response.json();
      alert(errorData.message || "The account could not be deleted.");
    }
  } catch (err) {
    console.error("Error deleting account:", err);
    alert("Server connection error.");
  }
}

/**
 * Closes the success modal and redirects the user.
 * 
 * - Hides the account deletion success modal.
 * - Redirects the user to the login or home page.
 * 
 * @function closeModal
 * @returns {void}
 */
function closeModal() {
  document.getElementById('successModal').style.display = 'none';
  window.location.href = "../index.html";
}
