const url = import.meta.env.VITE_HOST_URL;

document.addEventListener('DOMContentLoaded', function () {
    const showPasswordCheckbox = document.getElementById('show-password');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const registrationForm = document.getElementById('registration-form');
    const messageDiv = document.getElementById('message');

    showPasswordCheckbox.addEventListener('change', function () {
        const type = this.checked ? 'text' : 'password';
        passwordInput.type = type;
        confirmPasswordInput.type = type;
    });

    registrationForm.addEventListener('submit', async function (event) {
        event.preventDefault(); 

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            messageDiv.textContent = 'Las contraseñas no coinciden.';
            messageDiv.style.color = 'red';
            return;
        }

        const requestBody = {
            name: username,
            email: email,
            password: password,
        };

        try {
            const response = await fetch(`${url}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.status === 201) {
                messageDiv.textContent = 'Cuenta creada exitosamente. Revisa tu correo de confirmación.';
                messageDiv.style.color = 'green';
                registrationForm.reset(); 
            } else if (response.status === 400) {
                const errorData = await response.json();
                messageDiv.textContent = `Error: ${errorData.message || 'Credenciales inválidas.'}`;
                messageDiv.style.color = 'red';
            } else {
                messageDiv.textContent = 'Ocurrió un error inesperado.';
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            messageDiv.textContent = `Error de red: ${error.message}`;
            messageDiv.style.color = 'red';
        }
    });
});