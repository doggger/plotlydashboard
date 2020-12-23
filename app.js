
// On change to the DDM, runs function to fetch and render new data
function optionChanged(id) {
    getData(id);
}

// funtion fetches data for new visualizations
function getData(id) {
    d3.json("data/samples.json").then((data) => {
        //filters data based on user selection
        var selectedperson = data.samples.filter(s => s.id.toString() === id)[0];
        // trace for bar chart
        var trace = {
            x: selectedperson.sample_values.slice(0, 10).reverse(),
            y: converttostring(selectedperson.otu_ids.slice(0, 10).reverse()),
            text: selectedperson.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

        var layout = {
            title: `Top 10 Microbial Species by OTU for Test Subject ${selectedperson.id}`,
            xaxis: { title: "OTU" },
            yaxis: { title: "Microbial ID"}
        };
        // trace for the bubble plot
        var trace2 = {
            y: selectedperson.sample_values,
            x: selectedperson.otu_ids,
            text: selectedperson.otu_labels,
            marker: {
                color: selectedperson.otu_ids,
                size: selectedperson.sample_values
                },
            mode: 'markers'
            };

        var layout2 = {
            title: `Microbial Species by OTU for Test Subject ${selectedperson.id}`,
            xaxis: { title: "OTU ID" },
            yaxis: { title: "OTU"}
            };
        // displays meta data
        var metad = data.metadata;
        var result = metad.filter(meta => meta.id.toString() === id)[0];
        var tabled = d3.select(".summary");
        tabled.html("");
        for (let k in result) {
            tabled.append("li").text(`${k}: ${result[k]}`);
        }
        var newdata = [trace, layout, trace2, layout2] 
        console.log(newdata)
        // passes updated data to function to updata visualizations
        updatePlotly(newdata);
    });
}

// function to update plots with inputed data
function updatePlotly(newdata) {
    Plotly.newPlot("bar", [newdata[0]], newdata[1]);
    Plotly.newPlot("bubble", [newdata[2]], newdata[3]);
}

// converts input array into an array of strings
function converttostring (in1) {
    out1 = [];
    for (var i = 0; i < in1.length; i++) { 
        var str1 = "OTU " + in1[i];
        out1.push(str1);
    }
    return out1;
}

// init function plots data of first subject to display on page load
function init() {
    var select = document.getElementById("selDataset"); 
    d3.json("data/samples.json").then((data) => {
        console.log(data)
        var buttonnames = data.names

        for (var i = 0; i < buttonnames.length; i++) { 
            var optn = buttonnames[i]; 
            var el = document.createElement("option"); 
            el.textContent = optn; 
            el.value = optn; 
            select.appendChild(el);
        }

        var trace = {
            x: data.samples[0].sample_values.slice(0, 10).reverse(),
            y: converttostring(data.samples[0].otu_ids.slice(0, 10).reverse()),
            text: data.samples[0].otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

        var layout = {
            title: `Top 10 Microbial Species by OTU for Test Subject ${data.samples[0].id}`,
            xaxis: { title: "OTU" },
            yaxis: { title: "Microbial ID"}
        };

        Plotly.newPlot("bar", [trace], layout);

        var trace2 = {
            y: data.samples[0].sample_values,
            x: data.samples[0].otu_ids,
            text: data.samples[0].otu_labels,
            marker: {
                color: data.samples[0].otu_ids,
                size: data.samples[0].sample_values
            },
            mode: 'markers'
        };

        var layout2 = {
            title: `Microbial Species by OTU for Test Subject ${data.samples[0].id}`,
            xaxis: { title: "OTU ID" },
            yaxis: { title: "OTU"}
        };

        Plotly.newPlot("bubble", [trace2], layout2);

        var metad = data.metadata[0];
        console.log("metad", metad);
        var metadkeys = Object.keys(metad);
        var tabled = d3.select(".summary");
        tabled.html("");
        console.log("Tabled:", tabled)

        for (let k in metad) {
            tabled.append("li").text(`${k}: ${metad[k]}`);
        }
    });  
};

init();
