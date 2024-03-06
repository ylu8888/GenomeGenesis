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

async function generateGenderTrace() {
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

async function divXYX() {
    try {
        const trace = await generateGenderTrace();
        
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

document.addEventListener("DOMContentLoaded", function() {
    
    if (window.location.pathname.includes('data.html')) {
        divXYX().then(div => {
            const displayDiv = document.querySelector('.display');
            displayDiv.appendChild(div);
        });
    }
});
