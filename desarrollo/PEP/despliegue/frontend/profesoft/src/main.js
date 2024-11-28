document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".login-form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (email && password) {
            const xhr = new XMLHttpRequest();
            const requestBody = JSON.stringify({
                email: `${email}`, 
                password: password
            });

            xhr.open("POST", `https://pandadiestro.xyz/services/pep/profesoft/login`, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            console.log("Hola")
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        alert("Inicio de sesión exitoso");
                        console.log("Token recibido:", response.token);
                        localStorage.setItem("jwt", response.token);
                        window.location.href = "/busqueda/";
                    } else if (xhr.status === 401) {
                        alert("Credenciales inválidas. Por favor, verifica tu correo y contraseña.");
                    } else {
                        alert("Error al iniciar sesión. Intenta nuevamente más tarde.");
                        console.error("Error:", xhr.responseText);
                    }
                }
            };

            xhr.send(requestBody);
        } else {
            alert("Por favor, completa todos los campos");
        }
    });
});
