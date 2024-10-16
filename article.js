//START OF GOOGLE SCHOLAR API 
document.addEventListener('DOMContentLoaded', () => {

    const apiKey = 'd2916117f08364276db8184cad30209e1d56623f7e1445aa8df2d1fc27f0e759'

    const artList = document.querySelector('.article-display')

    document.querySelector('.search-form').onsubmit = (event) => {
    event.preventDefault(); //prevent page refresh on form submission

    const userInput = document.querySelector('.search-form input').value; //get user search input

    if(userInput === ''){ //if nothing is in search bar just return
        console.log('enter a valid input');
    }

    console.log('this is the input: ' + userInput)

    //REMOVE ALL THE previous list children from the article list
    while (artList.firstChild) {
        artList.removeChild(artList.firstChild);
    }

    fetch(`https://cors-anywhere.herokuapp.com/https://serpapi.com/search.json?engine=google_scholar&q=${userInput}&api_key=${apiKey}`)
    .then(response => {
        return response.json(); 
    })
    .then(data => { 
        console.log('DATA INCOMING:', data);
        
        //loop through each article in the organic results
        //append the newly created list item to display 
        for(let i = 0; i < data.organic_results.length; i++){
            console.log(data.organic_results[i].title)

            const artItem = document.createElement('li')
            artItem.style.display = 'flex';
            artItem.style.flexDirection = 'column';
            artItem.style.justifyContent = 'space-between';
            artItem.style.textAlign = 'center';
            artItem.style.fontSize = '20px';
            artItem.style.marginLeft = '20%';
            artItem.style.marginRight = '20%';
            
            artItem.innerHTML = 
            `<div style = "margin: 15px">
                <p style="padding: 3px; font-weight: bold;">Title: ${data.organic_results[i].title}</p>
                <p style="padding: 3px">Publisher: ${data.organic_results[i].publication_info.summary} </p>
                Link: <a style="color: #00008B; padding: 3px;" href="${data.organic_results[i].link}" target="_blank" rel="noopener noreferrer">${data.organic_results[i].link}</a>
                <p style="padding: 3px">Summary: ${data.organic_results[i].snippet} </p>
            </div>`;

            artList.appendChild(artItem)
        }

        document.querySelector('.search-form input').value = ""; //clear the previous searches 

    })
    .catch(error => { 
        console.error('WE GOT AN ERRORRRR:', error);
    });

    

    }

});

//END OF GOOGLE SCHOLAR API 
