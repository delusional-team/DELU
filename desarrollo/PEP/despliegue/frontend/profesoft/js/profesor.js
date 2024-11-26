document.addEventListener("DOMContentLoaded", function () {

    const urlParams = new URLSearchParams(window.location.search);
    const professorId = urlParams.get('id');

    const url = import.meta.env.VITE_HOST_URL; 
    const apiUrl = `${url}/profesoft/professors?id=${professorId}`;

    // Obtener datos del profesor desde el endpoint
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Mostrar la información del profesor en la página
            displayProfessorInfo(data);
        })
        .catch(error => console.error('Error:', error));

    function displayProfessorInfo(professor) {
        // Mostrar datos del profesor
        document.querySelector('.professor-name').textContent = professor.name;
        document.querySelector('.rating-value').textContent = professor.grade || 'Sin calificación';
        document.querySelector('.courses-section p').textContent = professor.courses.join(', ');
    }
});
