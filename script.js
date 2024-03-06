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

document.addEventListener("DOMContentLoaded", async function () {
    if (window.location.pathname.includes('data.html')) {
        try {
            const div1 = await gvc_plot();
            const div2 = await gva_plot();

            const displayDiv = document.querySelector('#data_display');
            displayDiv.appendChild(div1);
            displayDiv.appendChild(document.createElement('br'));
            displayDiv.appendChild(div2);
        } catch (error) {
            console.error("Error:", error);
        }
    }
});
