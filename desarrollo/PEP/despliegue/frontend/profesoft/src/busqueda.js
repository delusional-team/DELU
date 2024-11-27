document.addEventListener("DOMContentLoaded", () => {
    const url = import.meta.env.VITE_HOST_URL;
    const API_URL = `${url}/profesoft/professors`;
    let professors = [];

    fetch(API_URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            professors = data.map((professor) => ({
                id: professor.id,
                name: professor.name,
                evaluations: professor.grade || 0,
                courses: professor.courses || "No courses available", 
            }));

            displayResults(professors);
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
                    <h3><a href="profesor.html?id=${encodeURIComponent(result.id)}" class="professor-link">${result.name}</a></h3>
                    <div class="details-inline">
                        <p><strong>Calificación:</strong> ${result.evaluations}</p>
                        <p><strong>Cursos disponibles:</strong> ${result.courses}</p>
                    </div>
                </div>
            `;

            resultsList.appendChild(resultItem);
        });
    }

    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filteredResults = professors.filter((prof) =>
            prof.name.toLowerCase().includes(query)
        );
        displayResults(filteredResults);
    });

    const filterOptions = document.querySelectorAll(".filter-options input[name='filter']");
    filterOptions.forEach((filter) => {
        filter.addEventListener("change", () => {
            let filteredResults = [...professors];

            if (filter.value === "best-rated") {
                filteredResults.sort((a, b) => b.evaluations - a.evaluations);
                // console.log(filteredResults)
            } else if (filter.value === "worst-rated") {
                filteredResults.sort((a, b) => a.evaluations - b.evaluations);
                // console.log(filteredResults)
            } else if (filter.value === "most-courses") {
                filteredResults.sort((a, b) => b.courses - a.courses);
                // console.log(filteredResults)
            }

            displayResults(filteredResults);
        });
    });
});

const filterBtn = document.querySelector(".filter-btn");
const filterContainer = document.querySelector(".filter-container");

filterBtn.addEventListener("click", () => {
    filterContainer.classList.toggle("active");
});