var dataset; //the full dataset
var filterData  = "";
var patt = new RegExp("all");

//waterfront color encoding
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

//tool tips for data points
tip = d3.tip().attr('class', 'd3-tip').html(function(d) { 
    var waterfrontType;
    if(d.waterfront == 1) {
        waterfrontType = "yes";
     } else if(d.waterfront == 0) {
         waterfrontType = "no";
     } 
     return "Zipcode: " + d.zipcode + "<br/>" + "Price: $" + d.price + "<br/>" + "Sqft: " + d.sqft_living + "<br/>" +  "Bedrooms: " + d.bedrooms + "<br/>" + "Bathrooms: " + d.bathrooms + "<br/>" + "Waterfront: " + waterfrontType + "<br/>" + "Renovated: " + d.yr_renovated; });

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
function drawVis(ndata) {
    var circle = chart.selectAll(".dot")
        .data(ndata);

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
      .attr("id", "filterZipCode")
  
    select
      .on("change", function(d) {
        //console.log(this.value);
        filterUpdate(dataset);
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

//for creation of zipcode drop menu
d3.csv("house_waterfront.csv", function(error, data) {
    var amenitySelect = d3.select("#amenityFilter")
        .append("select")
        .attr("id", "filterWaterfront")

    amenitySelect
        .on("change", function(d) {
        //console.log(this.value);
        filterUpdate(dataset);
        });

    amenitySelect
        .append("option")
        .attr("value", "all")
        .text("All");

    amenitySelect
        .append("option")
        .attr("value", 1)
        .text("yes");
 
    amenitySelect   
        .append("option")
        .attr("value", 0)
        .text("no");
});
  
// price slider filter
$(function() {
    $("#price").slider({
    range: true,
    min: 0,
    max: 8000000,
    values: [ 0, 8000000 ], slide: function(event, ui) {
    $("#priceamount").val(ui.values[0] + " - " + ui.values[1]);
    filterUpdate(dataset); } });
    var minNum = $("#price").slider("values", 0 )
    var maxNum = $("#price").slider("values", 1 )
    $("#priceamount").val( minNum + " - " + maxNum );
  });

// square feet (living) filter
  $(function() {
    $("#sqft").slider({
    range: true,
    min: 290,
    max: 14000,
    values: [ 290, 14000 ], slide: function(event, ui) {
    $("#sqftamount").val(ui.values[0] + " - " + ui.values[1]);
    filterUpdate(dataset); } });
    var minNum = $("#sqft").slider("values", 0 )
    var maxNum = $("#sqft").slider("values", 1 )
    $("#sqftamount").val( minNum + " - " + maxNum );
  });

  // bedrooms filter
  $(function() {
    $("#bedrooms").slider({
    range: false,
    min: 0,
    max: 33,
    values: [33], slide: function(event, ui) {
    $("#bedroomamount").val(ui.values[0]);
    filterUpdate(dataset); } });
    var minNum = $("#bedrooms").slider("values", 0 )
    $("#bedroomamount").val(minNum);
  });

// bathrooms filter
$(function() {
    $("#bathrooms").slider({
    range: false,
    min: 0,
    max: 8,
    values: [8], slide: function(event, ui) {
    $("#bathroomamount").val(ui.values[0]);
    filterUpdate(dataset); } });
    var minNum = $("#bathrooms").slider("values", 0 )
    $("#bathroomamount").val(minNum);
    });

function filterUpdate(dataset) {
    var selectedZipcode = document.getElementById("filterZipCode");
    var zipcodeValue = selectedZipcode.options[selectedZipcode.selectedIndex].value;
    var selectedWaterfront = document.getElementById("filterWaterfront");
    var waterfrontValue = selectedWaterfront.options[selectedWaterfront.selectedIndex].value;

    // price
    var priceSplit = document.getElementById("priceamount").value.split("-")
    var minPrice = parseInt(priceSplit[0])
    var maxPrice = parseInt(priceSplit[1])
    var defaultPriceMin = 0;
    var defaultPriceMax = 8000000;

    // sqft
    var sqftSplit = document.getElementById("sqftamount").value.split("-")
    var minSqft = parseInt(sqftSplit[0])
    var maxSqft = parseInt(sqftSplit[1])
    var defaultSqftMin = 290;
    var defaultSqftMax = 14000;

    // bedrooms
    var currentBedrooms = parseInt(document.getElementById("bedroomamount").value);
    var defaultBedroomsMin = 0;
    var defaultBedroomsMax = 33;

    // bathrooms
    var currentBathrooms = parseInt(document.getElementById("bathroomamount").value);
    var defaultBathroomsMin = 0;
    var defaultBathroomsMax = 8;

    filterData = dataset;

    if(zipcodeValue != "all") { 
        filterData = filterData.filter(d => d.zipcode == zipcodeValue); 
    } 

    if(waterfrontValue != "all") { 
        filterData = filterData.filter(d => d.waterfront == waterfrontValue); 
    } 

    if(minPrice != defaultPriceMin || maxPrice != defaultPriceMax) {
        filterData = filterData.filter(d => d["price"] >= minPrice && d["price"] < maxPrice);
    }

    if(minSqft != defaultSqftMin || maxSqft != defaultSqftMax) {
        filterData = filterData.filter(d => d["sqft_living"] >= minSqft && d["sqft_living"] < maxSqft);
    }

    if(currentBedrooms != defaultBedroomsMax) {
        filterData = filterData.filter(d => d["bedrooms"] <= currentBedrooms);
    }

    if(currentBathrooms != defaultBathroomsMax) {
        filterData = filterData.filter(d => d["bathrooms"] <= currentBathrooms);
    }

    drawVis(filterData);
}
