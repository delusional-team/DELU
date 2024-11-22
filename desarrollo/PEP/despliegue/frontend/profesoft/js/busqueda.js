document.addEventListener("DOMContentLoaded", () => {
    const url = import.meta.env.VITE_HOST_URL;
    const API_URL = `${url}/profesoft/professors`;

    fetch(API_URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const transformedData = data.map((professor) => ({
                name: professor.name,
                evaluations: professor.grade || 0,
                courses: professor.courses || "No courses available", 
            }));

            displayResults(transformedData);
        })
        .catch((error) => {
            console.error("Error fetching professor data:", error);
        });

    function displayResults(results) {
        const resultsList = document.getElementById("results-list");
        resultsList.innerHTML = ""; 

        results.forEach((result) => {
            const resultItem = document.createElement("div");
            resultItem.classList.add("result-item");

            resultItem.innerHTML = `
                <div class="result-details">
                    <h3><a href="profesor.html?nombre=${encodeURIComponent(result.name)}" class="professor-link">${result.name}</a></h3>
                    <div class="details-inline">
                        <p><strong>Evaluaciones:</strong> ${result.evaluations}</p>
                        <p><strong>Cursos disponibles:</strong> ${result.courses}</p>
                    </div>
                </div>
            `;

            resultsList.appendChild(resultItem);
        });
    }
});
