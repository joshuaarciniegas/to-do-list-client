document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token"); // el token que guardaste al iniciar sesión
  if (!token) {
    alert("Debes iniciar sesión primero");
    window.location.href = "login.html";
    return;
  }

  try {
    // Petición al backend para traer datos del usuario
    const res = await fetch("hhttps://demo-290a.onrender.com/api/v1/auth/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error("No se pudo obtener la información del usuario");
    }

    const user = await res.json();

    // Ahora llenamos la sección de perfil con los datos
    document.querySelector(".info").innerHTML = `
      <p><strong>Nombre y Apellido:</strong> ${user.firstName} ${user.lastName}</p>
      <hr>
      <p><strong>Edad:</strong> ${user.age} años</p>
      <hr>
      <p><strong>Correo electrónico:</strong> ${user.email}</p>
      <hr>
    `;
  } catch (error) {
    console.error("Error al cargar el perfil:", error);
  }
});
