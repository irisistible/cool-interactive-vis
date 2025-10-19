
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

		vis.margin = {top: 40, right: 40, bottom: 60, left: 40};

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
			.range([0, vis.width]);

		vis.y = d3.scaleLinear()
			.range([vis.height, 0]);

		vis.xAxis = d3.axisBottom()
			.scale(vis.x);

		vis.yAxis = d3.axisLeft()
			.scale(vis.y);

		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxis);

		vis.svg.append("g")
			.attr("class", "y-axis axis")
            .call(vis.yAxis);

		// TO-DO: (Filter, aggregate, modify data)
		vis.wrangleData();

	}

	/*
 	* Data wrangling
 	*/
	wrangleData(){
		let vis = this;

		// Update the visualization
		vis.updateVis("sepal_width", "petal_width");
	}

	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
 	* Function parameters only needed if different kinds of updates are needed
 	*/
	updateVis(sepalOption, petalOption){
		let vis = this;

		let colour = d3.scaleOrdinal()
			.domain(["setosa", "versicolor", "virginica" ])
			.range([ "#440154ff", "#21908dff", "#fde725ff"]);

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

		let maxX = d3.max(vis.data, function(d) {
			return d[sepalOptions[sepalOptionIndex]];
		});

		let minX = d3.min(vis.data, function(d) {
			return d[sepalOptions[sepalOptionIndex]];
		});

		let maxY = d3.max(vis.data, function(d) {
			return d[petalOptions[petalOptionIndex]];
		});

		let minY = d3.min(vis.data, function(d) {
			return d[petalOptions[petalOptionIndex]];
		})

		vis.x.domain([minX, maxX]);
		vis.y.domain([minY, maxY]);

        let dot = vis.svg.selectAll("circle")
            .data(vis.data);

		// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
		// Its opacity is set to 0: we don't see it by default.
		let tooltip = d3.select("#chart-area")
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "white")
			.style("border", "solid")
			.style("border-width", "1px")
			.style("border-radius", "5px")
			.style("padding", "10px")

        dot.enter().append("circle")
			.attr("class", d => "dot " + d.species)
			.merge(dot)
            .attr("cx", d => vis.x(d[sepalOptions[sepalOptionIndex]]))
            .attr("cy", d => vis.y(d[petalOptions[petalOptionIndex]]))
            .attr("r", 5)
			.attr("fill", function (d) { return colour(d.species) })
			.on("mouseover", function (d) {
				let specie = d.srcElement.__data__.species;
				
				d3.selectAll(".dot")
					.transition()
					.duration(200)
					.style("fill", "lightgrey")
					.attr("r", 3);

				d3.selectAll("." + specie)
					.transition()
					.duration(200)
					.style("fill", colour(specie))
					.attr("r", 7);

				tooltip
					.style("opacity", 1)
					.html(specie);
			})
    		.on("mouseleave", function () {
				d3.selectAll(".dot")
					.transition()
					.duration(200)
					.style("fill", "lightgrey")
					.attr("r", 5 );

				tooltip
					.transition()
					.duration(200)
					.style("opacity", 0);
			});
		
		dot.transition().duration(1000);

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
	}
}