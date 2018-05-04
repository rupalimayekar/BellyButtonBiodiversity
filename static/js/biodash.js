

// Get new data whenever the dropdown selection changes
/*
function getData(route) {
    console.log(route);
    
    Plotly.d3.json(`/${route}`, function(error, data) {
        console.log("newdata", data);
        updatePlotly(data);
    });
};
*/

// Update the plot with new data
function updatePlotly(newresponse) {

    var sample = Plotly.d3.select("#selDataset").node().value;
    console.log(sample);
    console.log("Updating Plotly");

    // Restyle the pie chart
    var pieElement = document.getElementById('pie');
    Plotly.restyle(pieElement, "labels", [newresponse["otu_ids"].slice(0,11)]);
    Plotly.restyle(pieElement, "values", [newresponse[sample].slice(0,11)]);
    Plotly.restyle(pieElement, "text", [newresponse["otu_description"].slice(0,11)]);

    // Restyle the bubble chart
    var bubbleElement = document.getElementById("bubble");
    Plotly.restyle(bubbleElement, "x", [newresponse["otu_ids"]]);
    Plotly.restyle(bubbleElement, "y", [newresponse[sample]]);
    Plotly.restyle(bubbleElement, "text", [newresponse["otu_description"]]);
    Plotly.restyle(bubbleElement, "ids", [newresponse["otu_ids"]]);
    Plotly.restyle(bubbleElement, "marker", [{ "size": newresponse[sample], 
                                                "color": newresponse["otu_ids"]
                                            }]);



    // Restyle the scrubs chart

}

// Get new data whenever the dropdown selection changes
function getData(sample) {
    console.log(sample);
    Plotly.d3.json(`/samples/${sample}`, function(error, response) {
        console.log("newdata", response);
        updatePlotly(response);
    });
}

function plotPieChart(sample, response) {
    console.log("Plotting pie chart");

    // Prepare the data to plot the pie chart
    var data = [{
        "labels": response["otu_ids"].slice(0,11), 
        "values": response[sample].slice(0,11),
        "text": response["otu_description"].slice(0,11),
        "hoverinfo": "text",
        "textinfo": "percent",
        "name": "Howdy Pie!",
        "type": "pie"}];

    console.log("==============Pie Data========");
    console.log(data);

    var layout = {
        title: "PIE CHART FOR SAMPLE",
        showLegend: true,

    };

    var pieElement = document.getElementById('pie');
    Plotly.plot(pieElement, data);
}

function plotBubbleChart(sample, response) {
    console.log("Plotting bubble chart");
    var data = [{
        "x": response["otu_ids"],
        "y": response[sample],
        "mode": "markers",
        "marker": { "size": response[sample],
                    "color": response["otu_ids"]
                },
        "fill": "toitself",
        "text": response["otu_description"],
        "hoverinfo": "text",
        "name": "Howdy Bubble!",
        "ids": response["otu_ids"],
        "type": "scatter"
    }];

    var bubbleElement = document.getElementById("bubble");
    Plotly.plot(bubbleElement, data);
}

function plotScrubsChart(sample, response) {
    console.log("Plotting scrubs chart");

}

/**
 * This part of the code gets executed when the home page loads up. It then calls other
 * functions above
 */

// Get the default dropdown selection and plot for that sample
var default_url = "/samples/" + Plotly.d3.select("#selDataset").node().value;

Plotly.d3.json(default_url, function(error, response) {
    if (error) return console.warn(error);
    console.log(default_url);

    // Get the sample name from the page. This is the initial sample on page load
    var sample = Plotly.d3.select("#selDataset").node().value;
    
    plotPieChart(sample, response);
    plotScrubsChart(sample, response);
    plotBubbleChart(sample, response);
})
