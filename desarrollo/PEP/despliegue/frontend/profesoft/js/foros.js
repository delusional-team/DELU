document.addEventListener("DOMContentLoaded", function () {
    const url = import.meta.env.VITE_HOST_URL; 
    const apiUrl = `${url}/foro/all`;
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
            displayForums(forums);
        })
        .catch((error) => console.error("Error:", error));

    function displayForums(forums) {
        forums.forEach((forum) => {
            const forumElement = document.createElement("div");
            forumElement.classList.add("forum");
            forumElement.innerHTML = `
                <h2 class="forum-title">${forum.title}</h2>
                <p class="forum-author">Publicado por: ${forum.author}</p>
            `;

            forumElement.addEventListener("click", () => {
                window.location.href = `forum.html?id=${forum.id}`;
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
            question: document.getElementById("forum-question").value,
        };

        fetch(`${url}/foro/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newForum),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error al crear foro: ${response.statusText}`);
                }
                return response.json();
            })
            .then(() => {
                modal.classList.add("hidden");
                window.location.reload();
            })
            .catch((error) => console.error("Error:", error));
    });
});
