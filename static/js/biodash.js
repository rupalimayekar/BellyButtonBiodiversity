/**
 * This Javascript file contains all the code to draw the plots and update the data on the
 * Belly Button Biodiversity Dashboard page
 */

/**
 * This function updates the metadata panel whenever the dropdown value for the sample
 * changes. It is also called initially to populate the panel with the default sample
 * @param  response 
 */
function updateMetadata(response) {
    console.log("Writing the metadata");

    $metadataPanel = Plotly.d3.select("#metadataPanel");

    // remove any existing html to clear the panel body
    $metadataPanel.html("");
    
    // Add rows of metadata information. Each row has 3 columns
    // The data is arranged for neatness and for grouping of similar data values
    $row = $metadataPanel.append("div").attr("class", "row");
    $row.append("div").attr("class", "col-md-4").html(`AGE : ${response.AGE}`);
    $row.append("div").attr("class", "col-md-4").html(`EVENT : ${response.EVENT}`);
    $row.append("div").attr("class", "col-md-4").html(`LOCATION : ${response.LOCATION}`);

    $row = $metadataPanel.append("div").attr("class", "row");
    $row.append("div").attr("class", "col-md-4").html(`BBTYPE : ${response.BBTYPE}`);
    $row.append("div").attr("class", "col-md-4").html(`ZIP012 : ${response.ZIP012}`);
    $row.append("div").attr("class", "col-md-4").html(`ZIP1319 : ${response.ZIP1319}`);

    $row = $metadataPanel.append("div").attr("class", "row");
    $row.append("div").attr("class", "col-md-4").html(`CAT : ${response.CAT}`);
    $row.append("div").attr("class", "col-md-4").html(`COUNTRY012 : ${response.COUNTRY012}`);
    $row.append("div").attr("class", "col-md-4").html(`COUNTRY1319 : ${response.COUNTRY1319}`);

    $row = $metadataPanel.append("div").attr("class", "row");
    $row.append("div").attr("class", "col-md-4").html(`DOG : ${response.DOG}`);
    $row.append("div").attr("class", "col-md-4").html(`MMAXTEMP013 : ${response.MMAXTEMP013}`);
    $row.append("div").attr("class", "col-md-4").html(`MMAXTEMP1319 : ${response.MMAXTEMP1319}`);

    $row = $metadataPanel.append("div").attr("class", "row");
    $row.append("div").attr("class", "col-md-4").html(`GENDER : ${response.GENDER}`);
    $row.append("div").attr("class", "col-md-4").html(`IMPSURFACE013 : ${response.IMPSURFACE013}`);
    $row.append("div").attr("class", "col-md-4").html(`IMPSURFACE1319 : ${response.IMPSURFACE1319}`);
    
    $row = $metadataPanel.append("div").attr("class", "row");
    $row.append("div").attr("class", "col-md-4").html(`ETHNICITY : ${response.ETHNICITY}`);
    $row.append("div").attr("class", "col-md-4").html(`PFC013 : ${response.PFC013}`);
    $row.append("div").attr("class", "col-md-4").html(`PFC1319 : ${response.PFC1319}`);

    $row = $metadataPanel.append("div").attr("class", "row");
    $row.append("div").attr("class", "col-md-4").html(`SAMPLEID : ${response.SAMPLEID}`);
    $row.append("div").attr("class", "col-md-4").html(`NPP013 : ${response.NPP013}`);
    $row.append("div").attr("class", "col-md-4").html(`NPP1319 : ${response.NPP1319}`);

    $row = $metadataPanel.append("div").attr("class", "row");
    $row.append("div").attr("class", "col-md-4").html(`WFREQ : ${response.WFREQ}`);    

}

/**
 * This function updates the scrubs chart whenever the sample value in the 
 * dropdown changes
 * @param  response 
 */
function updateScrubsChart(response) {
    console.log("Updating the scrubs chart");
    var level = +response;

    // Trig to calc meter point
    var degrees = 180 - (level*20), radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Recalculate the path to draw the meter pointer
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    // restyle the first trace
    var data_update = {
        'text': level
    };  
    
    // restyle the layout to redraw the meter pointer
    var layout_update = {
        'shapes[0].path': path
    };  
    
    // Update the plot's first trace
    Plotly.update('scrubs', data_update, layout_update, 0);
}

/**
 *  This function redraws the Pie chart and bubble chart when the dropdown value
 *  for the sample changes The newresponse contains the new data for the new sample
 * @param  newresponse 
 */
function updatePieBubble(newresponse) {
    console.log("Updating the Pie and Bubble Charts");

    var sample = Plotly.d3.select("#selDataset").node().value;
    console.log(sample);
    console.log("Updating Plotly");

    // Restyle the pie chart
    // var data_update = [{
    //     labels: [newresponse["otu_ids"].slice(0,11)],
    //     values: [newresponse[sample].slice(0,11)],
    //     text: [newresponse["otu_description"].slice(0,11)]
    // }];

    // Plotly.restyle("pie", data_update);

    Plotly.restyle("pie", "labels", [newresponse["otu_ids"].slice(0,11)]);
    Plotly.restyle("pie", "values", [newresponse[sample].slice(0,11)]);
    Plotly.restyle("pie", "text", [newresponse["otu_description"].slice(0,11)]);

    // Restyle the bubble chart
    // data_update = [{
    //     x: newresponse["otu_ids"],
    //     y: newresponse[sample],
    //     text: newresponse["otu_description"],
    //     ids: newresponse["otu_ids"],
    //     marker: { "size": newresponse[sample], 
    //                 "color": newresponse["otu_ids"]
    //                 }
    // }];

    // Plotly.restyle(bubbleElement, data_update);

    Plotly.restyle("bubble", "x", [newresponse["otu_ids"]]);
    Plotly.restyle("bubble", "y", [newresponse[sample]]);
    Plotly.restyle("bubble", "text", [newresponse["otu_description"]]);
    Plotly.restyle("bubble", "ids", [newresponse["otu_ids"]]);
    Plotly.restyle("bubble", "marker", [{ "size": newresponse[sample], 
                                                "color": newresponse["otu_ids"]
                                            }]);
}

/**
 * This function plots the pie chart for the given sample and response data
 * @param  sample 
 * @param  response 
 */
function plotPieChart(sample, response) {
    console.log("Plotting pie chart");

    // Prepare the data to plot the pie chart
    var data = [{
        labels: response["otu_ids"].slice(0,11), 
        values: response[sample].slice(0,11),
        text: response["otu_description"].slice(0,11),
        hoverinfo: "text",
        textinfo: "percent",
        name: "Distribution of microbial species",
        type: "pie"}];
    
    // prepare the layout
    var layout = {
        title: "Distribution of microbial species",
        height: 450,
        width: 450,
    };

    // Plot it
    Plotly.plot('pie', data, layout);
}

/**
 * This function plots the Bubble Chart for the given sample and response data
 * @param  sample 
 * @param  response 
 */
function plotBubbleChart(sample, response) {
    console.log("Plotting bubble chart");
    var data = [{
        x: response["otu_ids"],
        y: response[sample],
        mode: "markers",
        marker: { "size": response[sample],
                    "color": response["otu_ids"]
                },
        fill: "toitself",
        text: response["otu_description"],
        hoverinfo: "text",
        name: "Sample values vs OTU IDs",
        ids: response["otu_ids"],
        type: "scatter"
    }];

    var layout = {
        title: "Sample values vs OTU IDs",
        xaxis: { title: "OTU Ids"},
        yaxis: {title: "Sample values"},
        height: 500,
        width: 1000
    };

    Plotly.plot('bubble', data, layout);
}

/**
 * This function takes care of drawing the scrubs chart for a given sample and its response data
 * It is adapted from https://plot.ly/javascript/gauge-charts/
 * @param sample 
 * @param response 
 */
function plotScrubsChart(sample, response) {
    console.log("Plotting scrubs chart");

    // The response is a single number. We cast it to an integer to use ahead
    var level = +response;

    // Trig to calc meter point
    var degrees = 180 - (level*20),
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    // The two traces for plotting the gauge. The second trace is the guage meter
    var data = [{ type: 'scatter',
        x: [0], 
        y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'scrubs',
        text: level,
        hoverinfo: 'text+name'},

        { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
        rotation: 90,
        text: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
        textinfo: 'text',
        textposition:'inside',
        marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                                'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                                'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                                'rgba(237, 236, 212, .5)', 'rgba(242, 242, 222, .5)', 'rgba(248, 249, 232, .5)',
                                'rgba(255, 255, 255, 0)']},
        labels: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
    }];

    // The layout for the chart. 
    var layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
            }],
        title: 'Scrubs per Week',
        height: 450,
        width: 450,
        xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };

    // Plot it
    Plotly.newPlot('scrubs', data, layout);
}

/**
 * This function is the event listener call for the sample dropdown. It is called
 * whenever the dropdown value changes. It gets the data from the server for that sample
 * and updates the charts
 * @param sample 
 */
function getData(sample) {
    console.log(`Getting new data for ${sample}`);

    // Get the metadata info for the new sample and update the panel
    Plotly.d3.json(`/metadata/${sample}`, function(error, response) {
        if (error) return console.warn(error);
        console.log("NEW METADATA RESPONSE", response);
        updateMetadata(response);
    });
    
    // Get the wash frequency for the new sample and update the scrubs chart
    Plotly.d3.json(`/wfreq/${sample}`, function(error, response) {
        if (error) return console.warn(error);
        console.log("NEW WFREQ RESPONSE");
        updateScrubsChart(response);
    });
    
    // Get the new samples data and update the Pie and Bubble charts
    Plotly.d3.json(`/samples/${sample}`, function(error, response) {
        console.log("NEW SAMPLES RESPONSE ", response);
        updatePieBubble(response);
    });
}

/**
 * This part of the code below gets executed when the home page loads up. It then calls other
 * functions above to draw the individual plots/sections
 */

// Get the default dropdown selection on root page load
var sample = Plotly.d3.select("#selDataset").node().value;

// Get the default sample's metadata and show it in the panel
Plotly.d3.json(`/metadata/${sample}`, function(error, response) {
    if (error) return console.warn(error);
    console.log("INITIAL METADATA RESPONSE", response);
    updateMetadata(response);
});

// Get the Wash frequency for the default sample and plot the scrubs chart
Plotly.d3.json(`/wfreq/${sample}`, function(error, response) {
    if (error) return console.warn(error);
    console.log("INITIAL WFREQ RESPONSE", response);
    plotScrubsChart(sample, response);
});

// Get the sample data for the default sample and plot the pie and bubble charts
Plotly.d3.json(`/samples/${sample}`, function(error, response) {
    if (error) return console.warn(error);
    console.log("INITIAL SAMPLES RESPONSE", response);
    plotPieChart(sample, response);
    plotBubbleChart(sample, response);
});

