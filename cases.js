let allGeneData = []; // Store all gene data globally

// Fetch all gene data when the page loads
document.addEventListener("DOMContentLoaded", async () => {
    await fetchAllGenes();
    console.log("done");
});

async function fetchAllGenes() {
    try {
        // Show loading animations for both sections
        document.getElementById("loadingSectOne").style.display = "flex";
        document.getElementById("loading").style.display = "flex";

        // Hide main content for both sections initially
        document.getElementById("sectOneContent").style.display = "none";
        document.getElementById("content-table").style.display = "none";

        const response = await fetch(
            "https://api.gdc.cancer.gov/genes?size=22534"
        );
        if (!response.ok) {
            throw new Error("Could not fetch resources");
        }
        const data = await response.json();
        allGeneData = data.data.hits; // Store the entire gene data for access
        console.log("This is all of the Gene Data");
        console.log(allGeneData);

        // Simulate delay (optional)
        setTimeout(() => {
            // Hide loading animations
            document.getElementById("loadingSectOne").style.display = "none";
            document.getElementById("loading").style.display = "none";

            // Show main content for both sections
            document.getElementById("sectOneContent").style.display = "flex";
            document.getElementById("content-table").style.display = "flex";

            console.log("Data fetched:", data.data.hits);
        }, 1000); // Optional delay for demo

        return allGeneData; // Return the array of gene objects
    } catch (error) {
        console.log(error);
    }
}

// Fetch data from GDC API
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        return data.data.hits || [];
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

// Plot distribution of cases by primary site
async function plotPrimarySiteDistribution() {
    const url = "https://api.gdc.cancer.gov/cases?size=5000";
    const caseData = await fetchData(url);

    const primarySites = {};
    caseData.forEach((hit) => {
        const site = hit.primary_site || "Unknown";
        primarySites[site] = (primarySites[site] || 0) + 1;
    });

    const labels = Object.keys(primarySites);
    const values = Object.values(primarySites);

    const data = [
        {
            type: "bar",
            x: labels,
            y: values,
            text: values.map(String),
            textposition: "auto",
            marker: {
                color: "lightgreen",
            },
        },
    ];

    const layout = {
        title: "Distribution of Cases by Primary Site",
        xaxis: { title: "Primary Site", automargin: true },
        yaxis: { title: "Number of Cases" },
        margin: { b: 150 },
    };

    Plotly.newPlot("popupBarChart", data, layout);
}

// Plot distribution of cancer types (disease type)
async function plotDiseaseTypeDistribution() {
    const url =
        "https://api.gdc.cancer.gov/cases?size=5000&fields=disease_type,tumor_stage";
    const caseData = await fetchData(url);

    const diseaseCounts = {};
    caseData.forEach((caseData) => {
        const disease = caseData.disease_type || "Unknown";
        diseaseCounts[disease] = (diseaseCounts[disease] || 0) + 1;
    });

    const diseaseTypes = Object.keys(diseaseCounts);
    const counts = Object.values(diseaseCounts);

    const data = [
        {
            x: diseaseTypes,
            y: counts,
            type: "bar",
            marker: { color: "lightblue" },
        },
    ];

    const layout = {
        title: "Distribution of Cancer Types (Disease Type)",
        xaxis: {
            title: "Disease Type",
            automargin: true,
            tickangle: -45,
        },
        yaxis: { title: "Number of Cases" },
        margin: { b: 150 },
    };

    Plotly.newPlot("popupPieChart", data, layout);
}

// Update openModal function to use new charts
function openModal(chartType) {
    const modal = document.getElementById("chartModal");
    modal.style.display = "block";

    document.getElementById("popupPieChart").style.display = "none";
    document.getElementById("popupBarChart").style.display = "none";

    if (chartType === "pie") {
        document.getElementById("popupPieChart").style.display = "block";
        plotDiseaseTypeDistribution();
    } else if (chartType === "bar") {
        document.getElementById("popupBarChart").style.display = "block";
        plotPrimarySiteDistribution();
    }
}

// Close modal function
function closeModal() {
    document.getElementById("chartModal").style.display = "none";
}

// Event listener for the close button
document.querySelector(".close").addEventListener("click", closeModal);

function filterFunction() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toLowerCase();
    const dropdown = document.getElementById("dropdownList");
    const items = dropdown.getElementsByClassName("dropdown-item");

    // Show the dropdown only if there are items
    dropdown.style.display = items.length > 0 ? "block" : "none";

    for (let i = 0; i < items.length; i++) {
        const txtValue = items[i].textContent || items[i].innerText;
        // Check if the case ID, primary site, or other field matches the filter
        items[i].style.display = txtValue.toLowerCase().includes(filter)
            ? ""
            : "none";
    }
}

