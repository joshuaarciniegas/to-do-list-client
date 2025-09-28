  async function deleteAccount() {
    const password = document.getElementById('password').value; 
    const confirmText = document.getElementById('confirmText').value; 

    if (!password || confirmText !== "ELIMINAR") {
      alert("Debes ingresar tu contraseña y escribir 'ELIMINAR' para confirmar.");
      return;
    }

    try {
      // Recuperar token JWT almacenado (ejemplo: localStorage)
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No estás autenticado. Inicia sesión de nuevo.");
        return;
      }

      // Petición al backend 
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
        // Mostrar modal de éxito
        document.getElementById('successModal').style.display = 'flex';
        // Limpiar token de almacenamiento (cerrar sesión)
        localStorage.removeItem("token");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "No se pudo eliminar la cuenta.");
      }
    } catch (err) {
      console.error("Error eliminando cuenta:", err);
      alert("Error de conexión con el servidor.");
    }
  }

  function closeModal() {
    document.getElementById('successModal').style.display = 'none';
    // Redirigir a login o página inicial
    window.location.href = "../index.html";
  }
