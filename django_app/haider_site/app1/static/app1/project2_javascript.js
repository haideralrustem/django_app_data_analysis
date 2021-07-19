console.log('this is project2 js')
var window_media_query_offset = 17;

// let parsed_data = null;
// parsed_data = JSON.parse('{{json_recieved_data|safe}}')
    




function wordFreq(data) {
        // set the dimensions and margins of the graph
    var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
       
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

      
        // Add X axis
        var x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.count; })])
        .range([ 0, width]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

        // Y axis
        var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(data.map(function(d) { return d.word; }))
        .padding(.1);
        svg.append("g")
        .call(d3.axisLeft(y))

        //Bars
        svg.selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0) )
        .attr("y", function(d) { return y(d.word); })
        .attr("width", function(d) { return x(d.count); })
        .attr("height", y.bandwidth() )
        .attr("fill", "#69b3a2")

 

}

let data= [{word: 'Hello', 'count': 10},
            {word: 'Verbose', 'count': 25},
            {word: 'Peli', 'count': 5},
            {word: 'Jack', 'count': 90},
            {word: 'Ink', 'count': 60}]


wordFreq(data);