document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = `https://pandadiestro.xyz/services/pep/profesoft/forum/posts`;
    const forumsList = document.getElementById("forums-list");
    const createForumBtn = document.getElementById("create-forum-btn");
    const modal = document.getElementById("create-forum-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const createForumForm = document.getElementById("create-forum-form");

    // Obtener la lista de foros
    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al obtener los foros: ${response.statusText}`);
            }
            return response.json();
        })
        .then((forums) => {
            console.log('Estos son todos los foros')
            displayForums(forums);
        })
        .catch((error) => console.error("Error:", error));

    function displayForums(forums) {
        forums.forEach((forum) => {
            const forumElement = document.createElement("div");
            forumElement.classList.add("forum");
            forumElement.innerHTML = `
                <h2 class="forum-title">${forum.title}</h2>
                <p class="forum-author">Publicado por: ${forum.user.name}</p>
            `;

            forumElement.addEventListener("click", () => {
                window.location.href = `/foro/index.html?id=${forum.id}`;
            });

            forumsList.appendChild(forumElement);
        });
    }

    // Abrir modal
    createForumBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    // Cerrar modal
    closeModalBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Crear nuevo foro
    createForumForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newForum = {
            title: document.getElementById("forum-title").value,
            content: document.getElementById("forum-question").value,
        };

        const token = localStorage.getItem('jwt');

        fetch(`https://pandadiestro.xyz/services/pep/profesoft/forum/posts`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
             },
            body: JSON.stringify(newForum),
        })
            .then(() => {
                modal.classList.add("hidden");
                window.location.reload();
            })
            .catch((error) => console.error("Error:", error));
    });
});
