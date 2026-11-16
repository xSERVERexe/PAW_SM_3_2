const form = document.getElementById("noaaForm");
const tokenInput = document.getElementById("apiTokenInput");
const datasetInput = document.getElementById("datasetInput");
const locationInput = document.getElementById("locationInput");
const startDateInput = document.getElementById("startDateInput");
const endDateInput = document.getElementById("endDateInput");
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
    messageContainer.textContent =
        "Pobieranie sparametryzowanych danych z NOAA API...";
    tableBody.innerHTML = "";

    try {
        const params = new URLSearchParams({
            datasetid: datasetInput.value.trim(),
            locationid: locationInput.value.trim(),
            startdate: startDateInput.value,
            enddate: endDateInput.value,
        });

        const apiUrl = `https://www.ncei.noaa.gov/cdo-web/api/v2/data?${params.toString()}`;

        const proxyUrl = `https://cors-anywhere.herokuapp.com/${apiUrl}`;

        const response = await fetch(proxyUrl, {
            method: "GET",
            headers: {
                token: token,
            },
        });

        if (!response.ok) {
            messageContainer.style.color = "red";
            messageContainer.textContent = `Błąd HTTP: ${response.status} - sprawdź token i poprawność parametrów.`;
            return;
        }

        const data = await response.json();

        const records = data.results;

        if (!records || records.length === 0) {
            messageContainer.style.color = "red";
            messageContainer.textContent =
                "Brak danych dla podanych parametrów.";
            return;
        }

        messageContainer.textContent = "";

        let rowsHTML = "";

        records.forEach((record) => {
            const date = record.date ? record.date.split("T")[0] : "Brak";
            const datatype = record.datatype || "Brak";
            const station = record.station || "Brak";
            const value = record.value !== undefined ? record.value : "Brak";

            rowsHTML += `
                <tr>
                    <td>${date}</td>
                    <td>${datatype}</td>
                    <td>${station}</td>
                    <td>${value}</td>
                </tr>
            `;
        });

        tableBody.innerHTML = rowsHTML;
    } catch (error) {
        messageContainer.style.color = "red";
        messageContainer.textContent = "Wystąpił błąd.";
    }
});
