
// Variables for the visualization instances
let scatterplot;


// Start application by loading the data
loadData();

function loadData() {
    d3.csv("data/iris.csv", row => {
            
        // prepare data
        row.sepal_length = +row.sepal_length;
        row.sepal_width = +row.sepal_width;
        row.petal_length = +row.petal_length;
        row.petal_width = +row.petal_width;
        return row;

    }).then( data => {
        console.log('data loaded ')
        scatterplot = new Scatterplot("chart-area", data);
		scatterplot.initVis();
    });

    d3.select("#ranking-type").on("change", function() {
        let option = d3.select("#ranking-type").property("value");
        scatterplot.updateVis(option);
    });
}

function brushed() {

	// Get the extent of the current brush
	let selectionRange = d3.brushSelection(d3.select(".brush").node());
	
	// Convert the extent into the corresponding domain values
	let selectionDomain = selectionRange.map((timeline.x).invert);
	
	// Update focus chart (detailed information)
	areachart.x.domain(selectionDomain);
	areachart.wrangleData();
}
