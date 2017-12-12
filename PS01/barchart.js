// bar chart part
var width = $('#barchart #svg1').width();
var height = $('#barchart #svg2').height();

var marginLeft = 100;
var marginTop = 100;

var nestedData = [];

var svg1 = d3.select('#barchart #svg1')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var svg2 = d3.select('#barchart #svg2')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var scaleX = d3.scaleBand().rangeRound([0, width-2*marginLeft]).padding(0.1);
var scaleY = d3.scaleLinear().range([height-2*marginTop, 0]);
var scaleY2 = d3.scaleLinear().range([height-2*marginTop, 0]);

// load the data.
d3.queue(3)
    .defer(d3.csv, 'xunData.csv')
    .defer(d3.csv, 'xundata2.csv')
    .defer(d3.csv, 'XUN8.csv')
    .defer(d3.json, 'cb_2016_us_state_20m.json')
    .await(grandprix);
// get the data from the csv.
function grandprix(error, xundata, xundata2, xundata8, geojson){
    nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(xundata2);

    var loadData = nestedData.filter(function(d){return d.key ==='1'})[0].values;
    svg1.append("g")
        .attr('class','xaxis')
        .attr('transform','translate(0,' + (height-2*marginTop) + ')')  //move the x axis from the top of the y axis to the bottom
        .call(d3.axisBottom(scaleX));

    svg1.append("g")
        .attr('class', 'yaxis')
        .call(d3.axisLeft(scaleY));
    svg1.append("text")
        .attr("transform", "translate(200,350)")
        .text("Stock Price  ")
        .style("font-size",'18px')
        .attr('fill', "" +
            "black");

    svg2.append("g")
        .attr('class','xaxis')
        .attr('transform','translate(0,' + (height-2*marginTop) + ')')  //move the x axis from the top of the y axis to the bottom
        .call(d3.axisBottom(scaleX));

    svg2.append("g")
        .attr('class', 'yaxis2')
        .call(d3.axisLeft(scaleY2));
    svg2.append("text")
        .attr("transform", "translate(200,350)")
        .text("Stock Volumn")
        .style("font-size",'18px')
        .attr('fill', "" +
            "black");

    drawPoints(loadData);
};

function drawPoints(pointData){

    scaleX.domain(pointData.map(function(d){return d.Stock;}));
    scaleY.domain([0, d3.max(pointData.map(function(d){return +d.Close}))]);
    scaleY2.domain([0, d3.max(pointData.map(function(d){return +d.Volume}))]);

    d3.selectAll('.xaxis')
        .call(d3.axisBottom(scaleX));

    d3.selectAll('.yaxis')
        .call(d3.axisLeft(scaleY));

    d3.selectAll('.yaxis2')
        .call(d3.axisLeft(scaleY2));

    var rects = svg1.selectAll('.bars')
        .data(pointData, function(d){return d.Stock;});

    var geodiv = d3.select("#mapchart svg").append("g");

    rects.exit()
        .remove();

    rects
        .transition()
        .duration(10)
        .attr('x',function(d){
            return scaleX(d.Stock);
        })
        .attr('y',function(d){
            return scaleY(d.Close);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY(d.Close);
        });

    rects
        .enter()
        .append('rect')
        .attr('class','bars')
        .attr('id', function(d){return d.Stock;})
        .attr('fill', "lightblue")
        .attr('x',function(d){
            return scaleX(d.Stock);
        })
        .attr('y',function(d){
            return scaleY(d.Close);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY(d.Close);
        })
        .on('mouseover', function(d){

            d3.select(this).attr('fill','#00264d');
            currentID = d3.select(this).attr('id');
            svg2.selectAll('#' + currentID).attr('fill','#00264d');
            var cxx = svg.selectAll("#" + currentID).attr("cx");
            var cyy = svg.selectAll("#" + currentID).attr("cy");
            svg.selectAll("#" + currentID)
                .attr("fill", "red")
                .attr("opacity",1);

            var stock = d.Stock;
            var volumn = d.Volume;
            var average = d.average;
            geodiv.attr("transform", "translate(" + cxx + "," + cyy + ")")
                .append("text")
                .attr("class", "companyinfo")
                .html("Company: " + stock + " - " + "Volumn: " + volumn )
                .attr("fill", "#f44242")
                .style("font-size",'18px');
        })
        .on('mouseout', function(d){
            d3.select(this).attr('fill','lightblue');

            currentID = d3.select(this).attr('id');
            svg2.selectAll('#' + currentID).attr('fill','lightblue')
            svg.selectAll("#" + currentID).attr("fill", "blue").attr("opacity", 0.3);
            geodiv.select(".companyinfo").remove();
        });

    var rects2 = svg2.selectAll('.bars')
        .data(pointData, function(d){return d.Stock;});

    rects2
        .transition()
        .duration(10)
        .attr('x',function(d){
            return scaleX(d.Stock);
        })
        .attr('y',function(d){
            return scaleY2(d.Volume);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY2(d.Volume);
        });

    rects2
        .enter()
        .append('rect')
        .attr('class','bars')
        .attr('id', function(d){return d.Stock;})
        .attr('fill', "lightblue")
        .attr('x',function(d){
            return scaleX(d.Stock);
        })
        .attr('y',function(d){
            return scaleY2(d.Volume);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY2(d.Volume);
        })
        .on('mouseover', function(d){
            d3.select(this).attr('fill','#00264d');

            currentID = d3.select(this).attr('id');
            svg1.selectAll('#' + currentID).attr('fill','#00264d')
            linechart(d.Stock);
        })
        .on('mouseout', function(d){
            d3.select(this).attr('fill','lightblue');

            currentID = d3.select(this).attr('id');
            svg1.selectAll('#' + currentID).attr('fill','lightblue')
            d3.select("#linechart svg").remove();
        })
}

function updateData(selectedYear){
    return nestedData.filter(function(d){return d.key == selectedYear})[0].values;
}

function sliderMoved(value){

    newData = updateData(value);
    drawPoints(newData);

}

var w1 = document.getElementById('mapchart').clientWidth;
var h1 = document.getElementById('mapchart').clientHeight;
var margin = {top:20, left:30, right:30, bottom:20};

var svg = d3.select('#mapchart').append("svg")
    .attr("width", w1 + margin.left + margin.right)
    .attr("height", h1 + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + (- margin.top) + ')');

//set up the projection for the map
var albersProjection = d3.geoAlbersUsa()  //tell it which projection to use
    .scale(700)                           //tell it how big the map should be
    .translate([(w1/2), (h1/2)]);  //set the center of the map to show up in the center of the screen

//set up the path generator function to draw the map outlines
path = d3.geoPath()
    .projection(albersProjection);        //tell it to use the projection that we just made to convert lat/long to pixels

// load the data.
d3.queue(1)
    .defer(d3.csv, 'xundata8.csv')
    .defer(d3.json, 'cb_2016_us_state_20m.json')
    .await(geograph);
// get the data from the csv.
function geograph(error, xundata8, geojson){
    svg.selectAll("path")               //make empty selection
        .data(geojson.features)          //bind to the features array in the map data
        .enter()
        .append("path")                 //add the paths to the DOM
        .attr("d", path)                //actually draw them
        .attr("class", "feature")
        .attr('fill','gainsboro')
        .attr('stroke','white')
        .attr('stroke-width',1);

    svg.selectAll('circle1')
        .data(xundata8).enter()
        .append('circle')
        .attr('id', function(d){return d.company;})
        .attr('cx', function (d){
            return albersProjection([d.longtitude, d.latitude])[0]
        })
        .attr('cy', function (d){
            return albersProjection([d.longtitude, d.latitude])[1]
        })
        .attr('r', 3)
        .attr('fill','blue')
        .attr("opacity", 0.3);
};

function linechart(linedata){
    var margin = {top:40, left:30, right:40,bottom:40};
    var w2 = document.getElementById('linechart').clientWidth - margin.left - margin.right;
    var h2 = document.getElementById('linechart').clientHeight -margin.top - margin.bottom;
    var svg3 = d3.select('#linechart').append("svg")
        .attr("width", w2 + margin.left + margin.right)
        .attr("height", h2 + margin.top + margin.bottom);

    svg3.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //set up scales to position circles using the data
    var scaleX3 = d3.scalePoint().domain(["","Jan", "Feb", "March", "Apr", "May", "June","July"]).range([0, 400]);
    var scaleY3 = d3.scaleLinear().domain([0,400]).range([300, 0]);  //remember that 0,0 is at the top of the screen! 300 is the lowest value on the y axis

    var nestedData = [];

    // Add the x Axis
    svg3.append("g")
        .attr('transform','translate(100,340)')
        .attr("class", "axisRed")
        .attr('stroke-width', 2)//move the x axis from the top of the y axis to the bottom
        .call(d3.axisBottom(scaleX3));

    svg3.append("g")
        .attr("transform", "translate(100, 40)")
        .call(d3.axisLeft(scaleY3))
        .attr("class", "axisRed")
        .attr('stroke-width', 2);

    var makeLine = d3.line()
        .x(function(d){
            return scaleX3(d.age);
        })
        .y(function(d){
            return scaleY3(d.val);
        });

    //import the data from the .csv file
    d3.csv('xunData.csv', function(dataIn){
        var headers = d3.keys(dataIn[0]);

        nestedData = d3.nest()
            .key(function(d){return d.year})
            .entries(dataIn);

        var loadData = dataIn;

        var lvalue = [];
        for(var i = 0; i<loadData.length; i++){
            var ld = loadData[i];
            var oob = Object.keys(ld);
            var oobv = Object.values(ld);
            var oval = 0;
            for(var j = 0; j<oob.length; j++){
                if(oob[j] == linedata){
                    oval = oobv[j];
                }
            }
            let obj = {age: ld.age, val: oval};
            lvalue.push(obj);
        }
        svg3.append('text')
            .text('Monthly performance in portfolio')
            .attr('transform','translate(300, 30)')
            .style('text-anchor','middle')
            .attr('fill', 'White');

        svg3.append('text')
            .text('Time')
            .attr('transform','translate(300, 380)')
            .attr('fill', 'white');

        svg3.append('text')
            .text('Price')
            .attr('transform', 'translate(50,200)rotate(270)')
            .attr('fill', 'white');

        svg3.append('path')
            .datum(lvalue)
            .attr('class', 'line')
            .attr("transform", "translate(100, 40)")
            .attr('d', makeLine)
            .attr('fill', 'none')
            .attr('stroke', '#f44242');

        svg3.selectAll('circles')
            .data(lvalue)
            .enter()
            .append("circle")
            .attr("transform", "translate(100, 40)")
            .attr('cx',function(d){return scaleX3(d.age)})
            .attr('cy',function(d){return scaleY3(d.val)})
            .attr('data-toggle', "tooltip")
            .attr('title', function(d){
                return d.val;
            })
            .attr('r',3)
            .attr('fill','#f44242');
    });
}

