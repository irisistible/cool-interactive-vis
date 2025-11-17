
// Variables for the visualization instances
let scatterplot;


// Start application by loading the data
loadData();

function loadData() {
    let setosaCheckbox = document.getElementById('setosa-check');
    let versicolorCheckbox = document.getElementById('versicolor-check');
    let virginicaCheckbox = document.getElementById('virginica-check');

    setosaCheckbox.checked = true;
    versicolorCheckbox.checked = true;
    virginicaCheckbox.checked = true;
    
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
    
    // Add event listeners
    d3.selectAll(".form-control").on("change", function() {
        scatterplot.updateVis(check(document.getElementById('setosa-check'), document.getElementById('versicolor-check'),
            document.getElementById('virginica-check')), d3.select("#sepal-dimension").property("value"), d3.select("#petal-dimension").property("value"));
    });

    setosaCheckbox.addEventListener("change", function() {
        scatterplot.updateVis(check(document.getElementById('setosa-check'), document.getElementById('versicolor-check'),
            document.getElementById('virginica-check')), d3.select("#sepal-dimension").property("value"), d3.select("#petal-dimension").property("value"));
    });
    versicolorCheckbox.addEventListener("change", function() {
        scatterplot.updateVis(check(document.getElementById('setosa-check'), document.getElementById('versicolor-check'),
            document.getElementById('virginica-check')), d3.select("#sepal-dimension").property("value"), d3.select("#petal-dimension").property("value"));
    });
    virginicaCheckbox.addEventListener("change", function() {
        scatterplot.updateVis(check(document.getElementById('setosa-check'), document.getElementById('versicolor-check'),
            document.getElementById('virginica-check')), d3.select("#sepal-dimension").property("value"), d3.select("#petal-dimension").property("value"));
    });
}

function check(setosaCheckbox, versicolorCheckbox, virginicaCheckbox) {
    let checks = {"setosa": 1, "versicolor": 1, "virginica": 1};

    if (setosaCheckbox.checked) {
            checks["setosa"] = 1;
        }
    else {
        checks["setosa"] = 0;
    }
    if (versicolorCheckbox.checked) {
        checks["versicolor"] = 1;
    }
    else {
        checks["versicolor"] = 0;
    }
    if (virginicaCheckbox.checked) {
        checks["virginica"] = 1;
    }
    else {
        checks["virginica"] = 0;
    }

    return checks;
}