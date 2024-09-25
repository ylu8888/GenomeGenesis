async function fetchSomeGenes() {
  try {
    const response = await fetch("https://api.gdc.cancer.gov/genes");
    if (!response.ok) throw new Error("Could not fetch resources");
    const data = await response.json();
    return {
      total: data.data.pagination.total,
      id: "genes_counter",
      name: "Genes",
    };
  } catch (error) {
    console.log(error);
  }
}

async function fetchSomeCases() {
  try {
    const response = await fetch("https://api.gdc.cancer.gov/cases");
    if (!response.ok) throw new Error("Could not fetch resources");
    const data = await response.json();
    return {
      total: data.data.pagination.total,
      id: "cases_counter",
      name: "Cases",
    };
  } catch (error) {
    console.log(error);
  }
}

async function fetchSomeFiles() {
  try {
    const response = await fetch("https://api.gdc.cancer.gov/files");
    if (!response.ok) throw new Error("Could not fetch resources");
    const data = await response.json();
    return {
      total: data.data.pagination.total,
      id: "files_counter",
      name: "Files",
    };
  } catch (error) {
    console.log(error);
  }
}

async function fetchSomeMutations() {
  try {
    const response = await fetch("https://api.gdc.cancer.gov/ssms");
    if (!response.ok) throw new Error("Could not fetch resources");
    const data = await response.json();
    return {
      total: data.data.pagination.total,
      id: "mutations_counter",
      name: "Mutations",
    };
  } catch (error) {
    console.log(error);
  }
}

// Function for animating the counter
function animateCounter(target, id, name) {
  let current = 0;
  let increment = 0;
  if (target > 2000000) {
    increment = target / 400;
  } else if (target > 1000000) increment = target / 300;
  else if (target > 40000) {
    increment = target / 200;
  } else increment = target / 100;
  const counterElement = document.getElementById(id);

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      counterElement.innerText = `${Math.floor(current)} ${name}`;
      requestAnimationFrame(updateCounter);
    } else {
      counterElement.innerText = `${target} ${name}`;
    }
  };

  updateCounter();
}

// Wait for all fetch functions to complete
async function fetchAllData() {
  try {
    // Use Promise.all to wait for all fetch functions to complete
    const [genesData, casesData, filesData, mutationsData] = await Promise.all([
      fetchSomeGenes(),
      fetchSomeCases(),
      fetchSomeFiles(),
      fetchSomeMutations(),
    ]);

    // Start counter animations after all data is fetched
    animateCounter(genesData.total, genesData.id, genesData.name);
    animateCounter(casesData.total, casesData.id, casesData.name);
    animateCounter(filesData.total, filesData.id, filesData.name);
    animateCounter(mutationsData.total, mutationsData.id, mutationsData.name);
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

// Start fetching data when the counters are visible in the viewport
const observerOptions = {
  root: null, // Use the viewport as the root
  threshold: 0.5, // Trigger when at least 50% of the element is visible
};

const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      fetchAllData(); // Fetch all data when the counters enter the viewport
      observer.unobserve(entry.target); // Stop observing after the data is fetched
    }
  });
};

// Create the observer instance
const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe each counter's parent card element
document.querySelectorAll(".card").forEach((cardElement) => {
  observer.observe(cardElement);
});
