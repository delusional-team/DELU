document.addEventListener("DOMContentLoaded", function () {

    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('id');

    const url = import.meta.env.VITE_HOST_URL; 
    const apiUrl = `${url}/foro/questions?id=${questionId}`;

    fetch(apiUrl)
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

    function displayQuestionInfo(question) {
        document.querySelector('.question-title').textContent = question.title;
        document.querySelector('.question-author').textContent = `Publicado por: ${question.author}`;
        document.querySelector('.question-body').textContent = question.body;

        const answersSection = document.querySelector('.answers-section');
        question.answers.forEach(answer => {
            const answerElement = document.createElement('div');
            answerElement.classList.add('answer');

            answerElement.innerHTML = `
                <p class="answer-author">${answer.author}</p>
                <p class="answer-text">${answer.text}</p>
            `;
            answersSection.appendChild(answerElement);
        });
    }

    const addAnswerForm = document.getElementById('add-answer-form');
    addAnswerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const answerText = document.getElementById('answer-text').value;

        fetch(`${url}/profesoft/forum/posts/${questionId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questionId,
                text: answerText
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al enviar la respuesta');
                }
                return response.json();
            })
            .then(() => {
                location.reload();
            })
            .catch(error => console.error('Error:', error));
    });
});
