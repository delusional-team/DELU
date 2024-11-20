document.addEventListener('DOMContentLoaded', function () {
    const showPasswordCheckbox = document.getElementById('show-password');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const registrationForm = document.getElementById('registration-form');
    const messageDiv = document.getElementById('message');

    // Mostrar/ocultar contraseñas
    showPasswordCheckbox.addEventListener('change', function () {
        const type = this.checked ? 'text' : 'password';
        passwordInput.type = type;
        confirmPasswordInput.type = type;
    });

    // Manejo del envío del formulario
    registrationForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evita el envío predeterminado

        const studentCode = document.getElementById('student_code').value;
        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Verificar que las contraseñas coincidan
        if (password !== confirmPassword) {
            messageDiv.textContent = 'Las contraseñas no coinciden.';
            messageDiv.style.color = 'red';
            return;
        }

        // Crear el cuerpo de la solicitud
        const requestBody = {
            student_code: studentCode,
            email: email,
            password: password,
        };

        try {
            // Enviar la solicitud POST
            const response = await fetch('/register', {
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