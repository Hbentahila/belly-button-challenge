// Assigning UJRL to a const variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// retrieving the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
});

// Function to display initial/default page
function init() {

    // Using D3 to select the dropdown menu
    let dropDownMenu = d3.select('#selDataset');

    // Assigning the value of the dropdown menu option to a variable
    let id = dropDownMenu.property('value');

    // Retrieving all data and populating the drop down menu
    d3.json(url).then(function (data) {
        let names = data.names;
        names.map(function(name) {
            dropDownMenu.append('option').text(name);
        })

        // Displaying the default MetaData
        metaData(names[0]);

        // Displaying the default Bar Chart
        plotBarChart(names[0])

        // Displaying the default Bubble Chart
        plotBubbleChart(names[0])
    })
};

// Function to display Bar chart
function plotBarChart(id) {

    // Using d3 to retrieve all the data
    d3.json(url).then(function(data) {

        // Retrieve all sample data
        let samples = data.samples;

        // Filtering based on the id value and assigning the first index to a variable
        let results = samples.filter(row => row.id == id)[0];

        // Assigning otu_ids, otu_labels, and sample_values to corresponding variables
        let otuIds = results.otu_ids;
        console.log(otuIds);
        let otuLabels = results.otu_labels;
        console.log(otuLabels);
        let sampleValues = results.sample_values;
        console.log(sampleValues);

        // Assigining top ten OTUs (sample values, ids and labels) to corresponding variables
        // sample values already sorted in a descending order
        // Reversing the order to plot the bar chart
        let xValues = sampleValues.slice(0,10).reverse();
        let yValues = otuIds.slice(0,10).map(id => `OTU ${id}`).reverse();
        let labels = otuLabels.slice(0,10).reverse();
        
        // Setting up the Bar Chart's trace
        let trace = [{
            x: xValues,
            y: yValues,
            text: labels,
            type: "bar",
            orientation: "h"
        }];

        // Using Plotly to plot the bar chart
        Plotly.newPlot("bar", trace)
    });
};

// Function to display Bubble chart
function plotBubbleChart(id) {

    // Using d3 to retrieve all the data
    d3.json(url).then(function(data) {

        // Retrieve all sample data
        let samples = data.samples;

        // Filtering based on the id value and assigning the first index to a variable
        let results = samples.filter(row => row.id == id)[0];

        // Assigning otu_ids, otu_labels, and sample_values to corresponding variables
        let otuIds = results.otu_ids;
        console.log(otuIds);
        let otuLabels = results.otu_labels;
        console.log(otuLabels);
        let sampleValues = results.sample_values;
        console.log(sampleValues);
        
        // Setting up the bubble chart's trace
        let bTrace = [{
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
            }
        }];

        // Setting up the bubble chart's layout
        let bLayout = {
            xaxis: {title: 'OTU ID'},
            height: 600
        };

        // Using Plotly to plot the bubble chart
        Plotly.newPlot("bubble", bTrace, bLayout)
    });
};

// Function to diplay metaData i.e., an individual's demographic information
function metaData(id) {

    // Retrieving all the Data
    d3.json(url).then(function (data) {

        // Assigning the data to a variable
        let metadata = data.metadata;

        // Filtering based on the id value and assigning the first index to a variable
        let result = metadata.filter(row => row.id == id)[0];
        console.log(result);

        // Using D3 to select #sample-metadata
        let demogInfo = d3.select('#sample-metadata');

        // Clearing the metadata section
        demogInfo.html('');

        // Adding all key/value pairs to the "Demographic Info" section
        Object.entries(result).map(function([key, value]) {
            demogInfo.append('h5').text(`${key}: ${value}`);
        })
    })
};

function optionChanged(id) {

    // Displaying medadata of the selected id
    metaData(id);

    // Displaying Bar Chart of the selected id
    plotBarChart(id)

    // Displaying Bubble Chart of the selected id
    plotBubbleChart(id)

};

init();