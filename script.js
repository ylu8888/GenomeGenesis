async function fetchPatientData() {
    try {
      const response = await fetch("https://api.cellmodelpassports.sanger.ac.uk/patients?page[size]=10000")
  
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

async function fetchSampleData() {

  try {

    const response = await fetch("https://api.cellmodelpassports.sanger.ac.uk/samples?page[size]=10000")

    if (!response.ok) {
      throw new Error("Could not fetch sample resources");
    }

    const data = await response.json()
    return data

  } catch(error) {
    console.log(error)
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

async function sxSelected() {

  var sd = await fetchSampleData()

  console.log("sample function is getting hit")

  var xSelect = document.getElementById('sx_drop');
  var xVal = document.getElementById('sx_val_drop');

  var xx = xSelect.value;

  xVal.innerHTML = '';

  if (xx) {

      val_options = [...new Set(sd.data.filter(item => item.attributes[xx] !== "NA" && item.attributes[xx] !== "Unknown" && item.attributes[xx] != null).map(item => item.attributes[xx]))];

      val_options.forEach(value => {
          var option = document.createElement("option");
          option.text = value;
          option.value = value;
          xVal.add(option);
        });

  }

}

async function sample_patients() {

  var pd = await fetchPatientData()
  var sd = await fetchSampleData()

  var xSelect = document.getElementById('x_drop');
  var xv_Select = document.getElementById('x_val_drop');
  var ySelect = document.getElementById('y_drop');

  var div = document.getElementById('sample_info_container')
  div.style.display = "block";

  xx = xSelect.value
  xval = xv_Select.value
  yy = ySelect.value

  id_list = pd.data.filter(item => item.attributes[xx] == xval && item.attributes[yy] != "null").map(item => item.id)

  console.log("This is the id_list:")
  console.log(id_list)

  var x_options = Object.keys(sd.data[0].attributes)

  // Get the dropdown element
  var x_dropdown = document.getElementById('sx_drop');

  // Loop through the list and create options
  for (var i = 0; i < x_options.length; i++) {
      var option = document.createElement('option');
      option.value = x_options[i];
      option.text = x_options[i];
      x_dropdown.add(option);
  }

}

async function sample_generate() {

  var pd = await fetchPatientData()
  var sd = await fetchSampleData()

  var xSelect = document.getElementById('x_drop');
  var xv_Select = document.getElementById('x_val_drop');
  var ySelect = document.getElementById('y_drop');

  //clean this up, messy just for now
  var sxSelect = document.getElementById('sx_drop');
  var sxv_Select = document.getElementById('sx_val_drop');

  xx = xSelect.value
  xval = xv_Select.value
  yy = ySelect.value

  sxx = sxSelect.value
  sxval = sxv_Select.value

  if (sxx === "" || sxval === "") {
    alert("Please select options in all dropdowns");
  } else {


    // this is getting all of the ids of the people that match the first query
    id_list = pd.data.filter(item => item.attributes[xx] == xval && item.attributes[yy] != "null").map(item => item.id)
  
    console.log("This is the id_list:")
    console.log(id_list)

    const sxData = sd.data.filter(item => id_list.includes(item.relationships.patient.data.id)).filter(item => item.attributes[sxx] == sxval).map(item => item.attributes[sxx])
    console.log("This is sxData")
    console.log(sxData)

    // once we get the ids of the people that match the first query, we then filter those people to see the ones who match the second query
    const trace = [];

    if (sxData.length > 0) {
      trace.push({
        x: sxData,
        type: 'histogram'
      });
    } else {
      trace.push({
        x: [],
        type: 'histogram'
      });
    }


    layout = [{

        title: "Previous Object Vs " + sxx.replace(/_/g, ' '),
        xaxis: {
          title: "Prevoius Object"
        },
        yaxis: {
          title: "# of " + sxval.replace(/_/g, ' ')
        },
        annotations: []
        
      }];

    if (sxData.length === 0) {
      layout[0].annotations.push({
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        y: 0.5,
        text: 'No data available',
        showarrow: false,
        font: {
          size: 16,
          color: 'black'
        }
      });
    }

    const div = document.createElement('div');
    Plotly.newPlot(div, trace, layout[0]);

    const displayDiv = document.querySelector('#sample_graphs');
    displayDiv.innerHTML = "";
    displayDiv.appendChild(div);

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

        var sample = document.getElementById("more_info");
        sample.style.display = "block";

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
