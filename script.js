// const CORS_HEADERS = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers':
//     'Origin, X-Requested-With, Content-Type, Accept',
// };

var cors = require('cors')
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true
}

// async function handler(event, _context) {
//   if (event.httpMethod === 'OPTIONS') {
//     return {
//       statusCode: 200,
//       headers: CORS_HEADERS,
//     };
//   }

//   return {
//     statusCode: 200,
//     headers: {
//       ...CORS_HEADERS,
//       'Content-Type': 'application/json',
//     },
//   };
// }


async function fetchPatientData() {
    try {
      const response = await fetch("https://cors-anywhere.herokuapp.com/https://genomegenesis.netlify.app/pathp")
  
      if (!response.ok) {
        throw new Error("Could not fetch resources");
      }
  
      const data = await response.json();
      console.log(data);
      return data;
    } catch(error) {
      console.log(error);
    }
}

async function xSelected() {

    var pd = await fetchPatientData()

    console.log("Is this function getting hit")

    var xSelect = document.getElementById('x_drop');
    var xVal = document.getElementById('x_val_drop');
    var ySelect = document.getElementById('y_drop');

    var xx = xSelect.value;

    xVal.innerHTML = '';
    ySelect.innerHTML = ''

    if (xx) {

        val_options = [...new Set(pd.data.filter(item => item.attributes[xx] !== "NA" && item.attributes[xx] !== "Unknown" && item.attributes[xx] != null).map(item => item.attributes[xx]))];

        val_options.forEach(value => {
            var option = document.createElement("option");
            option.text = value;
            option.value = value;
            xVal.add(option);
          });

          y_options = Object.keys(pd.data[0].attributes).filter(item => item != xx)

          y_options.forEach(value => {

            var option = document.createElement("option");
            option.text = value;
            option.value = value;
            ySelect.add(option)

          })

    }

}


async function generate() {

    var pd = await fetchPatientData()

    var xSelect = document.getElementById('x_drop');
    var xv_Select = document.getElementById('x_val_drop');
    var ySelect = document.getElementById('y_drop');

    xx = xSelect.value
    xval = xv_Select.value
    yy = ySelect.value

    if (xx === "" || xval === "" || yy === "") {
        alert("Please select options in all dropdowns");
    } else {

        const trace = [{

            x: pd.data.filter(item => item.attributes[xx] == xval && item.attributes[yy] != "null").map(item => item.attributes[yy]),
            type: 'histogram',
            
          }];

        layout = [{

            title: yy.replace(/_/g, ' ') + " Vs " + xx.replace(/_/g, ' '),
            xaxis: {
              title: yy.replace(/_/g, ' ')
            },
            yaxis: {
              title: "# of " + xval.replace(/_/g, ' ')
            },
            
          }];

        const div = document.createElement('div');
        Plotly.newPlot(div, trace, layout[0]);

        const displayDiv = document.querySelector('#data_graphs');
        displayDiv.innerHTML = "";
        displayDiv.appendChild(div);

    }

}

document.addEventListener("DOMContentLoaded", async function() {
    if (window.location.pathname.includes('data.html')) {

        var pd = await fetchPatientData()

        var x_options = Object.keys(pd.data[0].attributes)

        // Get the dropdown element
        var x_dropdown = document.getElementById('x_drop');

        // Loop through the list and create options
        for (var i = 0; i < x_options.length; i++) {
            var option = document.createElement('option');
            option.value = x_options[i];
            option.text = x_options[i];
            x_dropdown.add(option);
        }

    }
});
