
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
        let maxSepalWidth = d3.max(vis.data, function(d) {
            return d.sepal_width;
        });
        let maxPetalWidth = d3.max(vis.data, function(d) {
            return d.petal_width;
        });
        let maxWidth = Math.max(maxSepalWidth, maxPetalWidth);

		vis.x = d3.scaleLinear()
			.range([0, vis.width])
			.domain([0, maxWidth]);

        let maxSepalLength = d3.max(vis.data, function(d) {
            return d.sepal_length;
        });
        let maxPetalLength = d3.max(vis.data, function(d) {
            return d.petal_length;
        });
        let maxLength = Math.max(maxSepalLength, maxPetalLength);

		vis.y = d3.scaleLinear()
			.range([vis.height, 0])
            .domain([0, maxLength]);

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
		vis.updateVis("setosa");
	}

	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
 	* Function parameters only needed if different kinds of updates are needed
 	*/
	updateVis(option){
		let vis = this;

		let filteredData = vis.data.filter((d) => d.species == option);

        let group = vis.svg.selectAll("g")
            .data(filteredData);

        group.enter().append("g");

		group.append("circle")
            .attr("class", "dot")
			.transition()
			.duration(1000)
            .attr("cx", function(d){ return vis.x(d.sepal_width); })
            .attr("cy", function(d){ return vis.y(d.sepal_length); })
            .attr("r", 5)
			.attr("fill", "#2ea34d")

		group.append("circle")
            .attr("class", "dot")
			.transition()
			.duration(1000)
			.attr("cx", function(d){ return vis.x(d.petal_width); })
            .attr("cy", function(d){ return vis.y(d.petal_length); })
            .attr("r", 5)
			.attr("fill", "#4a39a8")

        group.exit().remove();
	}
}