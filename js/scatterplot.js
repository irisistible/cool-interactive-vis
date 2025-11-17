
/*
 * Scatterplot
 * @param  parentElement 	-- the HTML element in which to draw the visualization
 * @param  data             -- the data the that's provided initially
 * @param  displayData      -- the data that will be used finally (which might vary based on the selection)
 *
 * @param  focus            -- a switch that indicates the current mode (focus or stacked overview)
 * @param  selectedIndex    -- a global 'variable' inside the class that keeps track of the index of the selected area
 */

class Scatterplot {

// constructor method to initialize Scatterplot object
constructor(parentElement, data) {
    this.parentElement = parentElement;
    this.data = data;
    this.displayData = [];
}


	/*
	 * Method that initializes the visualization (static content, e.g. SVG area or axes)
 	*/
	initVis(){
		let vis = this;

		vis.margin = {top: 60, right: 40, bottom: 60, left: 40};

		vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		// Overlay with path clipping
		vis.svg.append("defs").append("clipPath")
			.attr("id", "clip")

			.append("rect")
			.attr("width", vis.width)
			.attr("height", vis.height);

		// Scales and axes
		vis.x = d3.scaleLinear()
			.range([0, vis.width - 50]);

		vis.y = d3.scaleLinear()
			.range([vis.height, 0]);

		vis.xAxis = d3.axisBottom()
			.scale(vis.x);

		vis.yAxis = d3.axisLeft()
			.scale(vis.y);

		let xAxisGroup = vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(50," + vis.height + ")")
            .call(vis.xAxis);

		let yAxisGroup = vis.svg.append("g")
			.attr("class", "y-axis axis")
			.attr("transform", "translate(50, 0)")
            .call(vis.yAxis);

		// Add axis labels
		xAxisGroup.append("text")
			.attr("class", "axis-label x-axis-label")
			.attr("x", vis.width - 75)
			.attr("y", 40)
			.attr("text-anchor", "middle")
			.attr("fill", "black");

		yAxisGroup.append("text")
			.attr("class", "axis-label y-axis-label")
			.attr("x", 75)
			.attr("y", 50)
			.attr("text-anchor", "midle")
			.attr("fill", "black")
			.attr("transform", "rotate(90, 0, 0)");

		// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
		// Its opacity is set to 0: we don't see it by default.
		vis.tooltip = d3.select("#chart-area")
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "rgb(240, 230, 250)")
			.style("border", "1px solid rgb(187, 168, 206)")
			.style("border-width", "1px")
			.style("border-radius", "5px")
			.style("padding", "10px")
			.style("position", "absolute");

		// TO-DO: (Filter, aggregate, modify data)
		vis.wrangleData();

	}

	/*
 	* Data wrangling
 	*/
	wrangleData(){
		let vis = this;

		// Update the visualization
		vis.updateVis({"setosa": 1, "versicolor": 1, "virginica": 1}, "sepal_width", "petal_width");
	}

	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
 	* Function parameters only needed if different kinds of updates are needed
 	*/
	updateVis(checks, sepalOption, petalOption){
		let vis = this;

		let colour = {"setosa": "#440154ff", "versicolor": "#21908dff", "virginica": "#fde725ff"};

		let dimension = ['width', 'length'];

		let sepalOptions = ["sepal_width", "sepal_length"];
		let sepalOptionIndex = 0;
		if (sepalOption == "sepal_width") {
			sepalOptionIndex = 0;
		}
		else if (sepalOption == "sepal_length") {
			sepalOptionIndex = 1;
		}

		let petalOptions = ["petal_width", "petal_length"];
		let petalOptionIndex = 0;
		if (petalOption == "petal_width") {
			petalOptionIndex = 0;
		}
		else if (petalOption == "petal_length") {
			petalOptionIndex = 1;
		}

		let filteredData = vis.data.filter(function(d) {
			return checks[d.species]
		});

		let maxX = d3.max(filteredData, function(d) {
			return d[sepalOptions[sepalOptionIndex]];
		});

		let minX = d3.min(filteredData, function(d) {
			return d[sepalOptions[sepalOptionIndex]];
		});

		let maxY = d3.max(filteredData, function(d) {
			return d[petalOptions[petalOptionIndex]];
		});

		let minY = d3.min(filteredData, function(d) {
			return d[petalOptions[petalOptionIndex]];
		})

		vis.x.domain([minX, maxX]);
		vis.y.domain([minY, maxY]);

        let dot = vis.svg.selectAll("circle")
            .data(filteredData);

        dot.enter().append("circle")
			.attr("class", d => "dot " + d.species)
			.merge(dot)
            .attr("cx", d => vis.x(d[sepalOptions[sepalOptionIndex]]) + 50)
            .attr("cy", d => vis.y(d[petalOptions[petalOptionIndex]]))
            .attr("r", 5)
			.attr("fill", function (d) { return colour[d.species] })
			.on("mousemove", function (event, d) {			
				d3.selectAll("." + d.species)
					.transition()
					.duration(200)
					.style("fill", colour[d.species])
					.style("opacity", 1)
					.attr("r", 10);

				vis.tooltip
					.style("opacity", 1)
					.style("left", event.pageX + 20 + "px")
                	.style("top", event.pageY + "px")
					.text("Specie: " + d.species);
				})
    		.on("mouseleave", function () {
				d3.selectAll(".dot")
					.transition()
					.duration(200)
					.style("opacity", 0.5)
					.attr("r", 5);
				
				vis.tooltip
					.transition()
					.duration(200)
					.style("opacity", 0);
			})
			.style("opacity", 0)
			.transition()
			.duration(1000)
			.style("opacity", 0.5);

        dot.exit().remove();

		// Update axis by calling the axis function
		vis.svg.select(".x-axis")
			.transition()
			.duration(1000)
			.call(vis.xAxis);
		
		vis.svg.select(".y-axis")
			.transition()
			.duration(1000)
			.call(vis.yAxis);

		vis.svg.select(".x-axis-label")
			.text("Sepal " + dimension[sepalOptionIndex]);

		vis.svg.select(".y-axis-label")
			.text("Petal " + dimension[petalOptionIndex]);
	}
}