
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'dd693bc8-bf0d-4c64-8876-79a6ce6feae0';

    const name = document.querySelector('#article-name');
    const source = document.querySelector('#article-source');
    //const description = document.querySelector('#description');
    const img = document.querySelector('#image');
    const anchor = document.querySelector('#anchor');

    const name2 = document.querySelector('#article-name2');
    const source2 = document.querySelector('#article-source2');
    //const description2 = document.querySelector('#description2');
    const img2 = document.querySelector('#image2');
    const anchor2 = document.querySelector('#anchor2');

    const name3 = document.querySelector('#article-name3');
    const source3 = document.querySelector('#article-source3');
    //const description3 = document.querySelector('#description3');
    const img3 = document.querySelector('#image3');
    const anchor3 = document.querySelector('#anchor3');

    document.querySelector('.search-form').onsubmit = (event) => {
        event.preventDefault();

        var articleName = document.querySelector('#search-bar').value;

        if(articleName == ''){
            name.innerHTML = (`Enter a valid article title`);
            return;
        }
    
       articleName = articleName.charAt(0).toUpperCase() + articleName.slice(1);
       console.log('this the search input', articleName)

       //const apiURL =`https://api.goperigon.com/v1/all?&topic=${articleName}&apiKey=${apiKey}`
       //const apiURL =`https://api.goperigon.com/v1/all?&source=cnn.com&sortBy=date&apiKey=${apiKey}`
      
        const apiURL =`https://api.goperigon.com/v1/all?from=2015-02-26&q=${articleName}&sourceGroup=top100&language=en&apiKey=${apiKey}`
        axios.get(apiURL)
        .then((response) => {
            console.log(response.data);

            if(response.data == 'False'){
                name.innerHTML = (`Enter a valid movie title`);
                return;
            }

            console.log('this the url', response.data.articles[0].url)
            name.innerHTML = (`${response.data.articles[0].title}`);
            source.innerHTML = (`${response.data.articles[0].authorsByline}`);
            img.src = (`${response.data.articles[0].imageUrl}`);
            //description.innerHTML = (`${response.data.articles[0].description}`);
            anchor.href = (`${response.data.articles[0].url}`);
            

            name2.innerHTML = (`${response.data.articles[1].title}`);
            source2.innerHTML = (`${response.data.articles[1].authorsByline}`);
            img2.src = (`${response.data.articles[1].imageUrl}`);
           // description2.innerHTML = (`${response.data.articles[1].description}`);
            anchor2.href = (`${response.data.articles[1].url}`);

            name3.innerHTML = (`${response.data.articles[2].title}`);
            source3.innerHTML = (`${response.data.articles[2].authorsByline}`);
            img3.src = (`${response.data.articles[2].imageUrl}`);
           // description3.innerHTML = (`${response.data.articles[2].description}`);
            anchor3.href = (`${response.data.articles[2].url}`);

        })
        .catch((error) => {
            console.log(error);
        });

        
        // fetch(`api.goperigon.com/v1/all?from=2024-02-26&q=${articleName} OR "Cancer"&sourceGroup=top100&language=en&apiKey=${apiKey}`)
        // .then(response => response.json())
        // .then(data => {

        //     console.log(data);

        //     if(data.Response == 'False'){
        //         name.innerHTML = (`Enter a valid movie title`);
        //         return;
        //     }

        //     name.innerHTML = (`${data.articles[0].title}`);
        //     source.innerHTML = (`${data.articles[0].authorsByline}`);
        //     img.src = (`${data.articles[0].imageUrl}`);
        //     description.innerHTML = (`${data.articles[0].description}`);
        //     url.href = (`${data.articles[0].url}`);

        // })

        

    }


});

