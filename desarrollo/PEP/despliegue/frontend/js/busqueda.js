document.addEventListener("DOMContentLoaded", () => {
    const defaultResults = [
        { name: "Juan Carlos González Pérez", evaluations: 4.9, courses: "Desarrollo de Aplicaciones Web, Introducción a la Programación, Diseño de Software, Arquitectura de Software." },
        { name: "Miguel Ángel López Fernández", evaluations: 2.9, courses: "Introducción a la Inteligencia Artificial, Aprendizaje Automático del Lenguaje Natural, Visión Artificial con OpenCV." },
        { name: "Ana Isabel Martín Sánchez", evaluations: 3.9, courses: "Introducción a la Seguridad Informática, Seguridad de Redes y Sistemas, Criptografía y Seguridad de Datos." },
        { name: "Irene Claudia Alonso Pérez", evaluations: 4.1, courses: "Diseño de Interfaz de Usuario para Dispositivos Móviles, Desarrollo de Aplicaciones Android." },
        { name: "Alicia Carles Pérez", evaluations: 5.0, courses: "Diseño de Base de Datos, Desarrollo de Aplicaciones Iphone." }
    ];

    // Mostrar resultados predeterminados al cargar la página
    displayResults(defaultResults);

    // Manejar búsqueda al escribir en el input
    const searchInput = document.getElementById("search");
    const searchButton = document.querySelector(".search-btn");
    const filterOptions = document.getElementsByName("filter");

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredResults = filterAndSortResults(searchTerm);
        displayResults(filteredResults);
    });

    // Manejar búsqueda al hacer clic en el botón de búsqueda
    searchButton.addEventListener("click", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredResults = filterAndSortResults(searchTerm);
        displayResults(filteredResults);
    });

    function filterAndSortResults(searchTerm) {
        let filteredResults = defaultResults.filter(result => result.name.toLowerCase().startsWith(searchTerm));

        // Obtener el filtro seleccionado
        let selectedFilter;
        filterOptions.forEach(option => {
            if (option.checked) {
                selectedFilter = option.value;
            }
        });

        // Aplicar ordenación según el filtro seleccionado
        if (selectedFilter === "best-rated") {
            filteredResults.sort((a, b) => b.evaluations - a.evaluations); // Mejores calificados
        } else if (selectedFilter === "worst-rated") {
            filteredResults.sort((a, b) => a.evaluations - b.evaluations); // Peores calificados
        } else if (selectedFilter === "most-courses") {
            filteredResults.sort((a, b) => b.courses.split(',').length - a.courses.split(',').length); // Más cursos disponibles
        } else {
            // Ordenar alfabéticamente si no hay filtro seleccionado
            filteredResults.sort((a, b) => a.name.localeCompare(b.name));
        }

        return filteredResults;
    }

    function displayResults(results) {
        const resultsList = document.getElementById("results-list");
        resultsList.innerHTML = ""; // Limpiar resultados anteriores
    
        results.forEach(result => {
            const resultItem = document.createElement("div");
            resultItem.classList.add("result-item");
    
            // Modificación para incluir un enlace en el nombre del profesor
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

    // Código para mostrar y ocultar las opciones del filtro
    const filterBtn = document.querySelector(".filter-btn");
    const filterContainer = document.querySelector(".filter-container");

    filterBtn.addEventListener("click", () => {
        filterContainer.classList.toggle("active");
    });

    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener("click", (e) => {
        if (!filterContainer.contains(e.target) && !filterBtn.contains(e.target)) {
            filterContainer.classList.remove("active");
        }
    });
});
