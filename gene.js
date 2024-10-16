let allGeneData = []; // Store all gene data globally

// Fetch all gene data when the page loads
document.addEventListener("DOMContentLoaded", async () => {
  await fetchAllGenes();
  await plotBarChart();
  console.log("done");
});

async function fetchAllGenes() {
  try {
    // Show loading animation
    document.getElementById("loading").style.display = "flex";

    // Hide main content initially
    document.getElementById("mainContent").style.display = "none";

    const response = await fetch("https://api.gdc.cancer.gov/genes?size=22534");
    if (!response.ok) {
      throw new Error("Could not fetch resources");
    }
    const data = await response.json();
    allGeneData = data.data.hits; // Store the entire gene data for access

    // Simulate delay (optional)
    setTimeout(() => {
      // Hide loading animation
      document.getElementById("loading").style.display = "none";

      // Show main content
      document.getElementById("mainContent").style.display = "flex";

      // Optionally, process and display data
      console.log("Data fetched:", data.data.hits);
    }, 1000); // Optional delay for demo

    return allGeneData; // Return the array of gene objects
  } catch (error) {
    console.log(error);
  }
}

async function populateDropdown() {
  const dropdownList = document.getElementById("dropdownList");

  // Clear existing items
  dropdownList.innerHTML = "";

  // Create dropdown items for each gene ID
  allGeneData.forEach((gene) => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.textContent = gene.id; // Use gene ID as the item text
    item.onclick = () => {
      document.getElementById("searchInput").value = gene.id; // Set input to clicked item
      displayGeneInfo(gene); // Display gene information
      dropdownList.style.display = "none"; // Hide dropdown after selection
    };
    dropdownList.appendChild(item);
  });
}

// Filter function to search within dropdown items
function filterFunction() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toLowerCase();
  const dropdown = document.getElementById("dropdownList");
  const items = dropdown.getElementsByClassName("dropdown-item");

  dropdown.style.display = items.length > 0 ? "block" : "none";

  for (let i = 0; i < items.length; i++) {
    const txtValue = items[i].textContent || items[i].innerText;
    items[i].style.display = txtValue.toLowerCase().includes(filter)
      ? ""
      : "none";
  }
}

function displayGeneInfo(gene) {
  const infoContent = document.getElementById("infoContent");
  const descriptionContent = document.getElementById("descriptionContent");

  infoContent.innerHTML = `
      <strong>ID:</strong> ${gene.id}<br>
      <strong>Symbol:</strong> ${gene.symbol}<br>
      <strong>Biotype:</strong> ${gene.biotype}<br>
      <strong>Canonical Transcript Length (Genomic):</strong> ${
        gene.canonical_transcript_length_genomic
      }<br>
      <strong>Cytoband:</strong> ${gene.cytoband.join(", ")}<br>
      <strong>Canonical Transcript Length:</strong> ${
        gene.canonical_transcript_length
      }<br>
      <strong>Synonyms:</strong> ${gene.synonyms.join(", ") || "None"}<br>
      <strong>Gene Chromosome:</strong> ${gene.gene_chromosome}<br>
      <strong>Gene Start:</strong> ${gene.gene_start}<br>
      <strong>Gene End:</strong> ${gene.gene_end}<br>
      <strong>Canonical Transcript ID:</strong> ${
        gene.canonical_transcript_id
      }<br>
      <strong>Gene Strand:</strong> ${gene.gene_strand}<br>
      <strong>Name:</strong> ${gene.name}<br>
  `;

  // Populate the description in the separate div
  descriptionContent.innerHTML = gene.description || "N/A"; // Display 'N/A' if no description is available
}

// Show dropdown when the input is focused
document.getElementById("searchInput").addEventListener("focus", function () {
  populateDropdown(); // Populate dropdown on focus
  document.getElementById("dropdownList").style.display = "block";
});

// Hide dropdown when clicking outside
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("dropdownList");
  if (!dropdown.contains(event.target) && event.target.id !== "searchInput") {
    dropdown.style.display = "none";
  }
});

// Function to open the modal
function openModal() {
  const modal = document.getElementById("chartModal");
  modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById("chartModal");
  modal.style.display = "none";
}

// Attach event listeners to open/close modal for pie chart
document.querySelector(".pie").addEventListener("click", async function () {
  openModal();
  await plotPieChart();
});

document.querySelector(".close").addEventListener("click", closeModal);

// Function to plot the pie chart inside the modal
async function plotPieChart() {
  if (allGeneData.length === 0) {
    console.log("No gene data available to plot.");
    return;
  }

  // Count frequencies of each biotype
  const biotypeCounts = {};
  allGeneData.forEach((gene) => {
    const biotype = gene.biotype || "Unknown";
    biotypeCounts[biotype] = (biotypeCounts[biotype] || 0) + 1;
  });

  // Prepare data for pie chart
  const labels = Object.keys(biotypeCounts);
  const values = Object.values(biotypeCounts);

  // Calculate percentages for each biotype and append to labels
  const total = values.reduce((sum, value) => sum + value, 0);
  const labelsWithPercent = labels.map(
    (label, i) => `${label} (${((values[i] / total) * 100).toFixed(2)}%)`
  );

  // Data for the pie chart
  const bioData = {
    labels: labelsWithPercent,
    values: values,
  };

  // Plot pie chart using Plotly
  Plotly.newPlot(
    document.getElementById("popupPieChart"),
    [
      {
        values: bioData.values,
        labels: bioData.labels,
        type: "pie",
        textposition: "inside",
        textinfo: "percent",
        insidetextorientation: "auto",
      },
    ],
    {
      title: {
        text: "Gene Biotype Distribution",
        automargin: true,
      },
      margin: {
        l: 40,
        r: 40,
        t: 80,
        b: 40,
      },
    }
  );
}


// Bar Chart for Distribution of Cases by Primary Site
// Function to open / close the bar chart modal
function openBarModal() {
  const modal = document.getElementById("barChartModal");
  modal.style.display = "block";
}

function closeBarModal() {
  const modal = document.getElementById("barChartModal");
  modal.style.display = "none";
}

// Event listeners for opening/closing the bar chart modal
document.getElementById("barChartBySite").addEventListener("click", async function () {
  openBarModal();
  await plotBarChart(); // Plot the bar chart when the modal is opened
});

document.querySelector(".close-bar").addEventListener("click", closeBarModal);

// Function to plot the bar chart inside the modal
async function plotBarChart() {
  const fetchData = await fetch('https://api.gdc.cancer.gov/cases?size=5000')
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch data');
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      return null;
    });

  // Process the data
  const processedData = (() => {
    if (!fetchData || !fetchData.data) return { labels: [], values: [] };
    const primarySites = {};
    fetchData.data.hits.forEach(hit => {
      const site = hit.primary_site || 'Unknown'; // extracts primary site
      primarySites[site] = (primarySites[site] || 0) + 1;   // tallys up the amount of cases
    });
    return { labels: Object.keys(primarySites), values: Object.values(primarySites) };
  })();

  const { labels, values } = processedData;

  // Plot the bar chart using Plotly
  Plotly.newPlot(
    document.getElementById("popupBarChart"),
    [
      {
        x: labels,
        y: values,
        type: 'bar',
        text: values.map(String),  // Add values on each bar
        textposition: 'auto',      // Position the text inside the bars
      },
    ],
    {
      title: 'Distribution of Cases by Primary Site',
      xaxis: { title: 'Primary Site' },  // X-axis label
      yaxis: { title: 'Number of Cases' }  // Y-axis label
    }
  );
}

