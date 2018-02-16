var margin = {top: 20, right: 20, bottom: 20, left: 80},
    width = 950 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.price; });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

d3.csv("house_prices.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.price = +d.price;
    d.sqft_living = +d.sqft_living;
  });

  x.domain(d3.extent(data, function(d) { return d.sqft_living; })).nice();
  y.domain(d3.extent(data, function(d) { return d.price; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Square Feet");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d.sqft_living); })
      .attr("cy", function(d) { return y(d.price); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
});

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