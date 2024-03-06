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

async function gender_v_colorectal() {
    try {
        const patientData = await fetchPatientData();

        const genderTrace = {
            x: patientData.data
                .filter(item => item.attributes.colorectal_cancer_risk_factors === "Yes")
                .map(item => item.attributes.gender),
            type: 'histogram'
        };

        return genderTrace;
    } catch (error) {
        console.log(error);
    }
}

async function gvc_plot() {
    try {
        const trace = await gender_v_colorectal();
        
        const layout = {
            title: 'Gender Vs Risk of Colon Cancer',
            xaxis: {
                title: 'Gender'
            },
            yaxis: {
                title: '# of People with High Risk'
            }
        };

        const div = document.createElement('div');
        Plotly.newPlot(div, [trace], layout);
        return div;
    } catch (error) {
        console.log(error);
    }
}

async function gender_v_alcohol() {
    try {
        const patientData = await fetchPatientData();

        const genderTrace = {
            x: patientData.data
                .filter(item => item.attributes.alcohol_exposure_intensity == "Heavy Drinker")
                .map(item => item.attributes.gender),
            type: 'histogram'
        };

        return genderTrace;
    } catch (error) {
        console.log(error);
    }
}

async function gva_plot() {
    try {
        const trace = await gender_v_alcohol();
        
        const layout = {
            title: 'Gender Vs Alcohol Comsumption',
            xaxis: {
                title: 'Gender'
            },
            yaxis: {
                title: '# of Heavy Drinkers'
            }
        };

        const div = document.createElement('div');
        Plotly.newPlot(div, [trace], layout);
        return div;
    } catch (error) {
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
        const div1 = await gvc_plot();
        const div2 = await gva_plot();

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
