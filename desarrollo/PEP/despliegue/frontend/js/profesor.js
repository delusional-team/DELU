document.addEventListener("DOMContentLoaded", function () {
    // Simular datos del profesor y sus comentarios como un objeto JSON en el mismo archivo
    const data = {
        "professor": {
            "name": "Juan Carlos González Pérez",
            "rating": 4.9,
            "courses": "Desarrollo de Aplicaciones Web, Introducción a la Programación, Diseño de Software, Arquitectura de Software."
        },
        "comments": [
            {
                "name": "Lucas Fernández",
                "rating": 5,
                "text": "Me gustó mucho su enfoque práctico y la forma en la que explicaba los conceptos complejos de manera clara y sencilla. Recomiendo este curso a todos los que quieran aprender a desarrollar aplicaciones web.",
                "replies": [
                    {
                        "name": "Sofía Martínez",
                        "text": "Estoy totalmente de acuerdo contigo, Lucas. El Dr. Fernández García es un profesor excepcional. Sus clases son muy dinámicas y se nota que realmente le apasiona la enseñanza. Además, el curso me ha servido para desarrollar mis habilidades en Spring Boot y poder empezar a trabajar en proyectos reales."
                    }
                ]
            },
            {
                "name": "CodeBlue21",
                "rating": 4,
                "text": "El Dr. Fernández García es un maestro en el desarrollo de software. Su curso de 'Diseño y Arquitectura de Software' fue realmente inspirador. Me enseñó a pensar en la arquitectura de software de forma estratégica y a desarrollar aplicaciones escalables y mantenibles. Recomiendo este curso a cualquier desarrollador que quiera llevar sus habilidades al siguiente nivel."
            }
        ]
    };

    // Mostrar la información del profesor y los comentarios
    displayProfessorInfo(data.professor);
    displayComments(data.comments);

    function displayProfessorInfo(professor) {
        // Información del Profesor
        document.querySelector('.professor-name').textContent = professor.name;
        document.querySelector('.rating-value').textContent = professor.rating;
        document.querySelector('.courses-section p').textContent = professor.courses;
    }

    function displayComments(comments) {
        const commentsSection = document.querySelector('.comments-section');
        comments.forEach(comment => {
            const commentHTML = `
                <div class="comment">
                    <h3 class="commenter-name">${comment.name} <span class="rating-stars">${getStarsHTML(comment.rating)}</span></h3>
                    <p class="comment-text">${comment.text}</p>
                </div>
            `;
            commentsSection.insertAdjacentHTML('beforeend', commentHTML);

            if (comment.replies) {
                comment.replies.forEach(reply => {
                    const replyHTML = `
                        <div class="sub-comment">
                            <h4 class="sub-commenter-name">${reply.name}</h4>
                            <p class="sub-comment-text">${reply.text}</p>
                        </div>
                    `;
                    commentsSection.insertAdjacentHTML('beforeend', replyHTML);
                });
            }
        });
    }

    function getStarsHTML(rating) {
        const fullStars = '★'.repeat(Math.floor(rating));
        const emptyStars = '☆'.repeat(5 - Math.floor(rating));
        return `${fullStars}${emptyStars}`;
    }
});
