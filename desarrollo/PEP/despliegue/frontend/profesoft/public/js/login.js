document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".login-form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (email && password) {
            // Aquí puedes agregar la lógica para autenticación
            alert(`Inicio de sesión con el correo: ${email}@unmsm.edu.pe`);
        } else {
            alert("Por favor, completa todos los campos");
        }
    });
});

const xhr = new XMLHttpRequest();
xhr.open("POST", "")
