const form = document.getElementById("noaaForm");
const tokenInput = document.getElementById("apiTokenInput");
const tableBody = document.getElementById("dataTableBody");
const messageContainer = document.getElementById("messageContainer");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = tokenInput.value.trim();

    if (!token) {
        messageContainer.style.color = "red";
        messageContainer.textContent = "Proszę podać token API.";
        return;
    }

    messageContainer.style.color = "black";
    messageContainer.textContent = "Pobieranie zbiorów danych z NOAA API...";
    tableBody.innerHTML = "";

    try {
        const proxyUrl =
            "https://cors-anywhere.herokuapp.com/https://www.ncei.noaa.gov/cdo-web/api/v2/datasets";

        const response = await fetch(proxyUrl, {
            method: "GET",
            headers: {
                token: token,
            },
        });

        if (!response.ok) {
            messageContainer.style.color = "red";
            messageContainer.textContent = `Błąd HTTP: ${response.status} - sprawdź token.`;
            return;
        }

        const data = await response.json();
        const datasets = data.results;

        if (!datasets || datasets.length === 0) {
            messageContainer.style.color = "red";
            messageContainer.textContent = "Brak danych w odpowiedzi API.";
            return;
        }

        messageContainer.textContent = "";

        let rowsHTML = "";

        datasets.forEach((dataset) => {
            const id = dataset.id || "Brak danych";
            const name = dataset.name || "Brak danych";
            const minDate = dataset.mindate || "Brak danych";
            const maxDate = dataset.maxdate || "Brak danych";

            rowsHTML += `
                <tr>
                    <td>${id}</td>
                    <td>${name}</td>
                    <td>${minDate}</td>
                    <td>${maxDate}</td>
                </tr>
            `;
        });

        tableBody.innerHTML = rowsHTML;
    } catch (error) {
        messageContainer.style.color = "red";
        messageContainer.textContent =
            "Wystąpił błąd podczas łączenia z serwerem.";
    }
});
