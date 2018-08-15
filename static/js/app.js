function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(response){
    console.log("metadata response: " + response);
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    let panel = d3.select("#sample-metadata")
    panel.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(([key,value])=> { 
      panel.append("h6").text(`${key}: ${value}`);
    })
  });
};

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((response) => {
    console.log("*****response*****"+response.otu_ids);
    
    console.log(response.otu_ids);
    
    const otu_ids = response.otu_ids;
    const otu_labels = response.otu_labels;
    const sample_values = response.sample_values;
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // let pieContainer = d3.select("#pie")
    // pieContainer.html("")

    let pieData = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      hoverinfo: "hovertext",
      type: 'pie'
    }];
    
    let pieLayout = {
      margin: {t:0},
    };
    
    Plotly.plot('pie', pieData, pieLayout);

    // @TODO: Build a Bubble Chart using the sample data
    // let bubbleContainer = d3.select("#bubble")
    // bubbleContainer.html("")

    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode:"markers",
      marker: {
        'size': sample_values,
        'color': otu_ids,
        'showscale': 'True'
      }
    }];

    let bubbleLayout = {
      margin: {
        t:0
      },
      hovermode: "closest",
      xaxis: {
        title: "OTU ID"
      }
    };
    Plotly.plot("bubble",bubbleData,bubbleLayout);

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

  })
}

function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    console.log("init / sampleNames: "+sampleNames);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
