//making the scatterplot
var width = parseInt(d3.select('#scatter')
    .style("width"));

var height = width * 2 / 3;
var margin = 10;
var labelArea = 110;
var padding = 45;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart");

// x-axis
svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");

// Transform adjust for xText
var bottomTextX = (width - labelArea) / 2 + labelArea;
var bottomTextY = height - margin - padding;
xText.attr("transform", `translate(${bottomTextX}, ${bottomTextY})`
);
//get data for "x"
xText.append("text")
    .attr("y", 19)
    .attr("data-name", "income")
    .attr("data-axis", "x")
    .attr("class", "aText active x")
    .text("Household Income (Median)");

// y-axis 
svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");

//Adjust for yText
var leftTextX = margin + padding;
var leftTextY = (height + labelArea) / 2 - labelArea;
yText.attr("transform", `translate(
    ${leftTextX}, 
    ${leftTextY}
    )rotate(-90)`
);

// get data for "y"
yText.append("text")
    .attr("y", -22)
    .attr("data-name", "obesity")
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .text("Obese (%)");

// Visualize data and make cirlces
var cRadius;
function adjustRadius() {
    if (width <= 530) {
        cRadius = 7;
    }
    else {
        cRadius = 10;
    }
}
adjustRadius();

// read data
d3.csv("assets/data/data.csv").then(function (data) {
    visualize(data);
});

function visualize(csvData) {
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    //X & Y default selections
    var currentX = "income";
    var currentY = "obesity";

    // Find the data max & min values for scaling
    function xMinMax() {
        xMin = d3.min(csvData, function (d) {
            return parseFloat(d[currentX]) * 0.85;
        });
        xMax = d3.max(csvData, function (d) {
            return parseFloat(d[currentX]) * 1.15;
        });
    }

    function yMinMax() {
        yMin = d3.min(csvData, function (d) {
            return parseFloat(d[currentY]) * 0.85;
        });
        yMax = d3.max(csvData, function (d) {
            return parseFloat(d[currentY]) * 1.15;
        });
    }

    // Scatter plot X & Y 
    xMinMax();
    yMinMax();

    var xScale = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([margin + labelArea, width - margin])

    var yScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([height - margin - labelArea, margin])

    // Create the scaled X and Y axis
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // append the axises to the svg as group elements
    svg.append("g")
        .call(xAxis)
        .attr("class", "xAxis")
        .attr("transform", `translate(
            0, 
            ${height - margin - labelArea})`
        );

    svg.append("g")
        .call(yAxis)
        .attr("class", "yAxis")
        .attr("transform", `translate(
            ${margin + labelArea}, 
            0 )`
        );

    // Make the circles for data
    var allCircles = svg.selectAll("g allCircles").data(csvData).enter();

    allCircles.append("circle")
        .attr("cx", function (d) {
            return xScale(d[currentX]);
        })
        .attr("cy", function (d) {
            return yScale(d[currentY]);
        })
        .attr("r", cRadius)
        .attr("class", function (d) {
            return "stateCircle " + d.abbr;
        })

    //Put state text on the circles dx=xAxis and dy=yAxis
    allCircles
        .append("text")
        .attr("font-size", cRadius)
        .attr("class", "stateText")
        .attr("dx", function (d) {
            return xScale(d[currentX]);
        })
        .attr("dy", function (d) {
            // Text to center
            return yScale(d[currentY]) + cRadius / 3; //by 1/3
        })
        .text(function (d) {
            return d.abbr;
        })
}