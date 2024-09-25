let allGeneData = []; // Store all gene data globally

async function fetchAllGenes() {
    try {
        const response = await fetch("https://api.gdc.cancer.gov/genes?size=22534");
        if (!response.ok) {
            throw new Error("Could not fetch resources");
        }
        const data = await response.json();
        allGeneData = data.data.hits; // Store the entire gene data for access
        return allGeneData; // Return the array of gene objects
    } catch (error) {
        console.log(error);
    }
}

async function populateDropdown() {
    await fetchAllGenes(); // Ensure gene data is fetched
    const dropdownList = document.getElementById('dropdownList');

    // Clear existing items
    dropdownList.innerHTML = '';

    // Create dropdown items for each gene ID
    allGeneData.forEach(gene => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = gene.id; // Use gene ID as the item text
        item.onclick = () => {
            document.getElementById('searchInput').value = gene.id; // Set input to clicked item
            displayGeneInfo(gene); // Display gene information
            dropdownList.style.display = 'none'; // Hide dropdown after selection
        };
        dropdownList.appendChild(item);
    });
}

// Filter function to search within dropdown items
function filterFunction() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const dropdown = document.getElementById('dropdownList');
    const items = dropdown.getElementsByClassName('dropdown-item');

    dropdown.style.display = items.length > 0 ? 'block' : 'none';

    for (let i = 0; i < items.length; i++) {
        const txtValue = items[i].textContent || items[i].innerText;
        items[i].style.display = txtValue.toLowerCase().includes(filter) ? '' : 'none';
    }
}

function displayGeneInfo(gene) {
  const infoContent = document.getElementById('infoContent');
  const descriptionContent = document.getElementById('descriptionContent');

  infoContent.innerHTML = `
      <strong>ID:</strong> ${gene.id}<br>
      <strong>Symbol:</strong> ${gene.symbol}<br>
      <strong>Biotype:</strong> ${gene.biotype}<br>
      <strong>Canonical Transcript Length (Genomic):</strong> ${gene.canonical_transcript_length_genomic}<br>
      <strong>Cytoband:</strong> ${gene.cytoband.join(', ')}<br>
      <strong>Canonical Transcript Length:</strong> ${gene.canonical_transcript_length}<br>
      <strong>Synonyms:</strong> ${gene.synonyms.join(', ') || 'None'}<br>
      <strong>Gene Chromosome:</strong> ${gene.gene_chromosome}<br>
      <strong>Gene Start:</strong> ${gene.gene_start}<br>
      <strong>Gene End:</strong> ${gene.gene_end}<br>
      <strong>Canonical Transcript ID:</strong> ${gene.canonical_transcript_id}<br>
      <strong>Gene Strand:</strong> ${gene.gene_strand}<br>
      <strong>Name:</strong> ${gene.name}<br>
  `;

  // Populate the description in the separate div
  descriptionContent.innerHTML = gene.description || 'N/A'; // Display 'N/A' if no description is available
}

// Show dropdown when the input is focused
document.getElementById('searchInput').addEventListener('focus', function() {
    populateDropdown(); // Populate dropdown on focus
    document.getElementById('dropdownList').style.display = 'block';
});

// Hide dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('dropdownList');
    if (!dropdown.contains(event.target) && event.target.id !== 'searchInput') {
        dropdown.style.display = 'none';
    }
});