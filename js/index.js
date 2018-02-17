var dataset; //the full dataset
var patt = new RegExp("all");

//var color = d3.scale.category10();

var color = d3.scale.linear().domain([0,1])
        .range(['#e18d5f', '#0ac7af']);


var width = 750;
var height = 450;
var margin = {top: 90, right: 20, bottom: 20, left: 80};
    var w = 950 - margin.left - margin.right;
    var h = 550 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

tip = d3.tip().attr('class', 'd3-tip').html(function(d) { 
    if(d.waterfront == 1) {
        d.waterfront = "yes";
     } else if(d.waterfront == 0) {
         d.waterfront = "no";
     } 
     return "Price: $" + d.price + "<br/>" + "Sqft: " + d.sqft_living + "<br/>" +  "Bedrooms: " + d.bedrooms + "<br/>" + "Bathrooms: " + d.bathrooms + "<br/>" + "Waterfront: " + d.waterfront + "<br/>" + "Renovated: " + d.yr_renovated; });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = d3.select(".chart")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom+15)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

d3.csv("house_prices.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.price = +d.price;
    d.sqft_living = +d.sqft_living;
  });

  dataset = data;

  x.domain(d3.extent(data, function(d) { return d.sqft_living; })).nice();
  y.domain(d3.extent(data, function(d) { return d.price; })).nice();

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Square Feet");

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Sale Price")

  drawVis(dataset);
});


//creates the data visualization
function drawVis() {
    var circle = chart.selectAll(".dot")
        .data(dataset);

    circle
        .attr("cx", function(d) { return x(d.sqft_living); })
        .attr("cy", function(d) { return y(d.price); })
            .style("fill", function(d, i) { return color(d.waterfront) })
           
    circle.exit().remove();

    circle.enter().append("circle")
        .attr("class", "dot")
        .attr("r", 4.5)
        .attr("cx", function(d) { return x(d.sqft_living); })
        .attr("cy", function(d) { return y(d.price); })
            .style("fill", function(d, i) { return color(d.waterfront) })
            .style("opacity", 0.8)
            .style("stroke", "#363636")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

}

//creates legend for the graph
var legend = chart.selectAll(".legend")
.data(color.domain())
.enter().append("g")
.attr("class", "legend")
.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
.attr("x", width - 18)
.attr("width", 18)
.attr("height", 18)
.style("fill", color);

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { 
            if(d == 0) {
                return "no waterfront"
            } else {
                return "has waterfront"
            }
        });

//for creation of zipcode drop menu
d3.csv("house_zipcodes.csv", function(error, data) {
    var select = d3.select("#zipCodeFilter")
      .append("select")
  
    select
      .on("change", function(d) {
        var value = d3.select(this).property("value");
        alert(value);
      });
  
    select
      .append("option")
      .attr("value", "all")
      .text("All")
  
    select.selectAll("option")
      .data(data)
      .enter()
        .append("option")
        .attr("value", function (d) { return d.zipcode; })
        .text(function (d) { return d.zipcode; });
  
  });
