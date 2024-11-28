document.addEventListener("DOMContentLoaded", function () {

    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('id');

    const questionApiUrl = `https://pandadiestro.xyz/services/pep/profesoft/forum/posts/${questionId}`;
    const commentsApiUrl = `https://pandadiestro.xyz/services/pep/profesoft/forum/posts/${questionId}/comments`;

    // Obtener datos de la pregunta
    fetch(questionApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            displayQuestionInfo(data);
        })
        .catch(error => console.error('Error:', error));

    // Obtener comentarios (respuestas)
    fetch(commentsApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener comentarios: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            displayAnswers(data);
        })
        .catch(error => console.error('Error:', error));

    function displayQuestionInfo(question) {
        document.querySelector('.question-title').textContent = question.title;
        document.querySelector('.question-author').textContent = `Publicado por: ${question.user.name}`;
        document.querySelector('.question-body').textContent = question.content;
    }

    function displayAnswers(comments) {
        const answersSection = document.querySelector('.answers-section');
        comments.forEach(comment => {
            const answerElement = document.createElement('div');
            answerElement.classList.add('answer');

            answerElement.innerHTML = `
                <p class="answer-author">${comment.user.name}</p>
                <p class="answer-text">${comment.text}</p>
            `;
            answersSection.appendChild(answerElement);
        });
    }

    // Manejar envío de nueva respuesta
    const addAnswerForm = document.getElementById('add-answer-form');
    addAnswerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const answerText = document.getElementById('answer-text').value;
        const token = localStorage.getItem('jwt');

        fetch(`https://pandadiestro.xyz/services/pep/profesoft/forum/posts/${questionId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                text: answerText
            })
        })
            .then(() => {
                location.reload();
            })
            .catch(error => console.error('Error:', error));
    });
});
