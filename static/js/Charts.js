function init() {
  console.log('In Init')
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/Resources/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
    d3.json("static/Resources/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    PANEL.append("table") ;
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("tr") ;
      PANEL.append("td").text(`${key.toUpperCase()}:`) ;
      PANEL.append("td").text(`${value}`);
      });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/Resources/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var metadata = data.metadata;
    var samples = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log('result: ', result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_id = result.otu_ids;
    var otu_label = result.otu_labels;
    var sample_value = result.sample_values;
    
    console.log('otu_label: ', otu_label);
    console.log('sample_value: ', sample_value);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    //var yticks = 
    var yticks = otu_id.slice(0,10).reverse();
    for (i =0; i<10; i++) {
      yticks[i] = "OTU " + yticks[i];
    }

    console.log('yticks: ', yticks);

    // 8. Create the trace for the bar chart. 
    x_temp = [];
    y_temp = [];

    x_temp = sample_value.slice(0,10).reverse();
    y_temp = otu_label.slice(0,10).reverse();

    console.log('x_temp: ', x_temp);
    console.log('y_temp: ', y_temp);

    var trace = {
      x: x_temp,
      y: yticks,
      type: "bar",
      orientation: 'h',
      text: y_temp      
    };
    // 9. Create the layout for the bar chart. 
    var layout = {
        title: "Top 10 Bacteria Cultures Found",
        paper_bgcolor: "blue",
        font: { color: "white", family: "Arial" }
        };
        
      
    var barLayout = {
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [trace], layout); 

    // 1. Create the trace for the bubble chart.
    
     var bubbleData = {
       x: otu_id,
       y: sample_value,
       //hoverinfo: otu,
       text: otu_label,
       type: "scatter",
       mode: 'markers',
       marker: {
        size: sample_value,
        color: otu_id,
        line: {
            color: 'black',
            width: 2
        }}
     };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: {text: ' OTU IDs'}},
      hovermode: "closest",
      paper_bgcolor: "blue",
      font: { color: "white", family: "Arial" }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var metaArray = metadata.filter(metaObj => metaObj.id == sample);    
    var result = metaArray[0];

    var w_freq = result.wfreq;

    console.log ("w_freq: ", w_freq);

    var gaugeData = [{
     domain: { x: [0, 1], y: [0, 1]},
     value: w_freq,
     title: { text: "Belly Button Washing Frequency" },
     type: "indicator",
     mode: "number+gauge",
     delta: { reference: 2 },
     gauge: { axis: {range: [0,10]},
              bar: {color:"black" },
              bgcolor: "blue",
              steps: [
                { range: [0, 2], color: "red" },
                { range: [2, 4], color: "orange" },
                { range: [4, 6], color: "yellow" },
                { range: [6, 8], color: "lightgreen" },
                { range: [8, 10], color: "green" }
              ]
                        
          }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, 
      height: 500,
      paper_bgcolor: "blue",
      font: { color: "white", family: "Arial" },
      margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
