function animateCounter(target, id, name) {
  let current = 0;
  const increment = target / 100; // Adjust speed here
  const counterElement = document.getElementById(id);

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      counterElement.innerText = `${Math.floor(current)} ${name}`;
      requestAnimationFrame(updateCounter);
      console.log(current);
    } else {
      counterElement.innerText = `${target} ${name}`;
    }
  };

  updateCounter();
}

async function fetchAllGenes() {
  try {
    const response = await fetch("https://api.gdc.cancer.gov/genes?size=22534");

    if (!response.ok) {
      throw new Error("Could not fetch resources");
    }

    const data = await response.json();
    const totalCases = data.meta.pagination.total;
    const name = "Genes";
    const id = "genes_counter";

    // Animate the counter
    animateCounter(totalCases, id, name);
  } catch (error) {
    console.log(error);
  }
}

async function fetchAllCases() {
  try {
    const response = await fetch("https://api.gdc.cancer.gov/cases?size=44736");

    if (!response.ok) {
      throw new Error("Could not fetch resources");
    }

    const data = await response.json();
    const totalCases = data.meta.pagination.total;
    const name = "Cases";
    const id = "cases_counter";

    // Animate the counter
    animateCounter(totalCases, id, name);
  } catch (error) {
    console.log(error);
  }
}
async function fetchAllFiles() {
  try {
    const response = await fetch(
      "https://api.gdc.cancer.gov/files?size=1,027,517"
    );

    if (!response.ok) {
      throw new Error("Could not fetch resources");
    }

    const data = await response.json();
    const totalCases = data.meta.pagination.total;
    const name = "Files";
    const id = "files_counter";

    // Animate the counter
    animateCounter(totalCases, id, name);
  } catch (error) {
    console.log(error);
  }
}
async function fetchAllMutations() {
  try {
    const response = await fetch(
      "https://api.gdc.cancer.gov/ssms?size=2,940,240"
    );

    if (!response.ok) {
      throw new Error("Could not fetch resources");
    }

    const data = await response.json();
    const totalCases = data.meta.pagination.total;
    const name = "Mutations";
    const id = "mutations_counter";

    // Animate the counter
    animateCounter(totalCases, id, name);
  } catch (error) {
    console.log(error);
  }
}

// Call the function to start fetching data
fetchAllGenes();
fetchAllCases();
fetchAllFiles();
fetchAllMutations();
