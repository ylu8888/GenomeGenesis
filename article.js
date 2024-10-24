//START OF GOOGLE SCHOLAR API 
document.addEventListener('DOMContentLoaded', () => {

    const apiKey = 'd2916117f08364276db8184cad30209e1d56623f7e1445aa8df2d1fc27f0e759';
    const artList = document.querySelector('.article-display');
    const searchInput = document.querySelector('.search-form input');

    // Check if there is a gene name stored in localStorage
    const geneName = localStorage.getItem('geneName');

    // If a gene name is found, populate the search input and perform a search
    if (geneName) {
        searchInput.value = geneName; // Set the input value to the gene name
        performSearch(geneName); // Call the search function
    }

    document.querySelector('.search-form').onsubmit = (event) => {
        event.preventDefault(); //prevent page refresh on form submission

        const userInput = searchInput.value; //get user search input

        if (userInput === '') { //if nothing is in search bar just return
            console.log('enter a valid input');
            return; // Exit the function if input is invalid
        }

        console.log('this is the input: ' + userInput);

        //REMOVE ALL THE previous list children from the article list
        while (artList.firstChild) {
            artList.removeChild(artList.firstChild);
        }

        performSearch(userInput); // Perform the search with the user input

        searchInput.value = ""; //clear the previous searches 
    };

    // Function to perform the search and fetch data
    function performSearch(query) {
        fetch(`https://cors-anywhere.herokuapp.com/https://serpapi.com/search.json?engine=google_scholar&q=${query}&api_key=${apiKey}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log('DATA INCOMING:', data);

                // Loop through each article in the organic results
                // Append the newly created list item to display 
                for (let i = 0; i < data.organic_results.length; i++) {
                    console.log(data.organic_results[i].title);

                    const artItem = document.createElement('li');
                    artItem.style.display = 'flex';
                    artItem.style.justifyContent = 'space-between';
                    artItem.style.textAlign = 'center';
                    artItem.style.fontSize = '20px';
                    artItem.style.marginLeft = '20%';
                    artItem.style.marginRight = '20%';
                    artItem.style.border = '20%';

                    artItem.innerHTML =
                        `<div style="margin: 15px">
                            <p style="padding: 3px; font-weight: bold;">Title: ${data.organic_results[i].title}</p>
                            <p style="padding: 3px">Publisher: ${data.organic_results[i].publication_info.summary} </p>
                            Link: <a style="padding: 3px; color: #04d9ff;" href="${data.organic_results[i].link}" target="_blank" rel="noopener noreferrer">${data.organic_results[i].link}</a>
                            <p style="padding: 3px">Summary: ${data.organic_results[i].snippet} </p>
                        </div>`;

                    artList.appendChild(artItem);
                }
            })
            .catch(error => {
                console.error('WE GOT AN ERRORRRR:', error);
            });
    }
});

//END OF GOOGLE SCHOLAR API 