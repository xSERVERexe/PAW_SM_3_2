const form = document.getElementById("noaaForm");
const tokenInput = document.getElementById("apiTokenInput");
const tableBody = document.getElementById("stationsTableBody");
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
    messageContainer.textContent = "Pobieranie danych z NOAA API...";
    tableBody.innerHTML = "";

    try {
        const proxyUrl =
            "https://cors-anywhere.herokuapp.com/https://www.ncei.noaa.gov/cdo-web/api/v2/stations";

        const response = await fetch(proxyUrl, {
            method: "GET",
            headers: {
                token: token,
            },
        });

        if (!response.ok) {
            messageContainer.style.color = "red";
            messageContainer.textContent = `Błąd HTTP: ${response.status} - sprawdź poprawność tokenu.`;
            return;
        }

        const data = await response.json();
        const stations = data.results;

        if (!stations || stations.length === 0) {
            messageContainer.style.color = "red";
            messageContainer.textContent = "Brak stacji w odpowiedzi API.";
            return;
        }

        messageContainer.textContent = "";

        let rowsHTML = "";

        stations.forEach((station) => {
            const id = station.id || "Brak danych";
            const name = station.name || "Brak danych";
            const latitude =
                station.latitude !== undefined
                    ? station.latitude
                    : "Brak danych";
            const longitude =
                station.longitude !== undefined
                    ? station.longitude
                    : "Brak danych";

            rowsHTML += `
                <tr>
                    <td>${id}</td>
                    <td>${name}</td>
                    <td>${latitude}</td>
                    <td>${longitude}</td>
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
