document.addEventListener('DOMContentLoaded', function () { 
    // Obtiene el checkbox que se usará para mostrar/ocultar la contraseña
    const showPasswordCheckbox = document.getElementById('show-password');
    
    // Obtiene los campos de contraseña y confirmación de contraseña
    const passwordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Escucha cambios en el checkbox
    showPasswordCheckbox.addEventListener('change', function () {
        if (this.checked) {
            // Si el checkbox está marcado, cambia el tipo de los inputs a 'text'
            passwordInput.type = 'text';
            confirmPasswordInput.type = 'text';
        } else {
            // Si el checkbox no está marcado, cambia el tipo de los inputs a 'password'
            passwordInput.type = 'password';
            confirmPasswordInput.type = 'password';
        }
    });
});
