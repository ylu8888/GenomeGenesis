//GROQ AI API 
import Groq from "groq-sdk";

document.addEventListener('DOMContentLoaded', () => {

    const apiKey = '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';

    const groq = new Groq({ apiKey: apiKey });

    const searchInput = document.querySelector('.search-form input');

    document.querySelector('.search-form').onsubmit = async (event) => {
        event.preventDefault(); //prevent page refresh on form submission

        const userInput = searchInput.value; //get user search input

        if (userInput === '') { //if nothing is in search bar just return
            console.log('enter a valid input');
            return; // Exit the function if input is invalid
        }

        console.log('this is the input: ' + userInput);

        const completion = await groq.chat.completions
        .create({
        messages: [
            {
            role: "user",
            content: userInput,
            },
        ],
        model: "llama3-8b-8192",
        })
         console.log(completion.choices[0].message.content);

       
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
