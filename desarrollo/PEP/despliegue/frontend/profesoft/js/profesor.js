document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const professorId = urlParams.get('id');

    const url = import.meta.env.VITE_HOST_URL;
    const professorApiUrl = `${url}/profesoft/professors?id=${professorId}`;
    const commentsApiUrl = `${url}/profesoft/professor/${professorId}/comments`;
    const submitCommentApiUrl = `${url}/profesoft/professor/${professorId}/comments`;

    const commentsSection = document.querySelector('.comments-section');
    const addCommentForm = document.getElementById('add-comment-form');

    // Obtener datos del profesor
    fetch(professorApiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            displayProfessorInfo(data);
        })
        .catch((error) => console.error('Error:', error));

    // Mostrar datos del profesor
    function displayProfessorInfo(professor) {
        document.querySelector('.professor-name').textContent = professor.name;
        document.querySelector('.rating-value').textContent = professor.grade || 'Sin calificación';
        document.querySelector('.courses-section p').textContent = professor.courses.join(', ');
    }

    // Obtener y mostrar comentarios
    fetch(commentsApiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al obtener comentarios: ${response.statusText}`);
            }
            return response.json();
        })
        .then((comments) => {
            displayComments(comments);
        })
        .catch((error) => console.error('Error:', error));

    function displayComments(comments) {
        commentsSection.innerHTML = '';
        comments.forEach((comment) => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <p>${comment.user.name}</p>
                <p>${comment.text}</p>
            `;
            commentsSection.appendChild(commentElement);
        });
        console.log('Parece que esta vacio todo');
    }

    // Enviar un nuevo comentario
    addCommentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newComment = {
            text: document.getElementById('comment-text').value,
            grade: parseFloat(document.getElementById('comment-rating').value),
        };

        const token = localStorage.getItem('jwt');

        fetch(submitCommentApiUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(newComment),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error al enviar comentario: ${response.statusText}`);
                }
                return response.json();
            })
            .then(() => {
                // Recargar comentarios después de enviar uno nuevo
                fetch(commentsApiUrl)
                    .then((response) => response.json())
                    .then((comments) => {
                        displayComments(comments);
                    });
                addCommentForm.reset(); // Limpiar formulario
            })
            .catch((error) => console.error('Error:', error));
    });
});
