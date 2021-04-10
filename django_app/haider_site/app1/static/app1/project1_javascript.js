// var from_python_data = data;

// console.log('-----> ', parsed_data);


function line_graph(data){

    // set the dimensions and margins of the graph
    var margin = {top: 0, right: 0, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });


    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#svg-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    var data = [
        {'date': 2006, 'close':40},
        {'date': 2008 , 'close': 45},
        {'date': 2010, 'close': 48},
        {'date': 2012, 'close': 51},
        {'date': 2014, 'close': 53},
        {'date': 2016, 'close': 57},
        {'date': 2017, 'close': 62}
    ]


    var formatDate= d3.timeParse("%Y");


    // format the data
    data.forEach(function(d) {
        
        d.date = formatDate(d.date);
        d.close = d.close;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d ['date']; }));
    y.domain([0, d3.max(data, function(d) { return d['close']; })]);

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
        
    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

}


//..................................................


function bar_graph (data, graph_title='default_title', x_title='x-label', 
                    y_title='y_label', trend_line=false, bar_mouseover_animation=false,
                    line_mouseover_animation=false, 
                    bar_tooltip=false,
                    line_tooltip=false,
                    mousein_tuple=[{key:'', value:''}], 
                    mouseout_tuple=[{key:'', value:''}],

                    line_mousein_tuple=[{key:'', value:''}] , 
                    line_mouseout_tuple=[{key:'', value:''}],

                    filtering=true
                    ) 
    {

    var data_fields = [];
    
    for (var field in data[0]) {
        // check if property not inherited
        if (Object.prototype.hasOwnProperty.call(data[0], field)) {
            data_fields.push(field);
        }
    }

    margins = {top: 20, right: 20, bottom: 20, left: 50}

    width = 400 - margins.left - margins.right
    height = 400 - margins.top - margins.bottom
    


    var svg = d3.select("#svg-container").append("svg")
    .attr("width", width + margins.left + margins.right + 60)
    .attr("height", height + margins.top + margins.bottom + 60)
    .append("g")
        
        .attr("transform",
              "translate(" + margins.left + "," + (margins.top) + ")");
   

    // range is output
    var xScale = d3.scaleBand().range ([0, width]).padding(0.4);
    var x2Scale =  d3.scaleLinear().range ([0, width]);

    var yScale = d3.scaleLinear().range ([height, 0]);
    

    // var g = svg.append("g")
    //            .attr("transform", "translate(" + 150 + "," + 50 + ")");
    

    // we  provide our domain values to the x and y scales    
    xScale.domain(data.map(function(d) { return d[data_fields[0]]; }));

    x2Scale.domain([d3.min(data, function(d) { return d[data_fields[0]]; }),
        d3.max(data, function(d) { return d[data_fields[0]]; }) ]);

    yScale.domain([0, d3.max(data, function(d) { return  d[data_fields[1]] ; }) + 10 ]);



    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

    svg.append("g")
    .call(d3.axisLeft(yScale).tickFormat(function(d){
        // format the ticks
        return  d;
    }).ticks(10))  // number of ticks
    
    // add title
    svg.append("text")
    .attr("transform", "translate(100,0)")
    .attr("x", 30)
    .attr("y", 0)
    .attr("font-size", "24px")
    .text(graph_title)
    
    svg.append("text")
    .attr('x', (width/2) )
    .attr('y', height + 35)
    .attr("stroke", "black")
    .text(x_title);

    svg.append("text")
    .attr("transform", 'rotate(-90)translate(-120, ' + -30 +')')
    .attr("stroke", "black")
    .text(y_title);
    

    // adding the bar
    svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")      
    
    // specify the x position
    .attr("x", function(d) { return xScale( d[data_fields[0]] ); })

    // specify the y position
    .attr("y", function(d) { return yScale( d[data_fields[1]] ); })

    // bar width; the x-scale returns a calculated bandwidth
    .attr("width", xScale.bandwidth())
    //The height of the bar. This would be the height of the SVG minus the corresponding y-value
    .attr("height", function(d) { return height - yScale( d[data_fields[1]] ); });

    
    var tooltip = d3.select("#svg-container")
                .append("div")
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .attr("class", "tooltip")
                .text("I'm a circle!")
                .html("<p>I'm a tooltip written in HTML</p>");


    
    var bisect = d3.bisector(function(d) { return d[data_fields[0]]; }).left;
    //var x0 = xScale.invert(d3.pointer(event)[0]-25);

    var i = bisect(data, 2008, 0);

    
    var focus = svg
        .append('g')
        .append('circle')
            .style("fill", "none")
            .attr("stroke", "black")
            .attr('r', 8.5)
            .style("opacity", 0)

    var focusText = svg
        .append('g')
        .append('text')
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle")


    

    if (trend_line === true) {
        var valueline = d3.line()

        .x( function(d) { return xScale(d[data_fields[0]]); })
        .y( function(d) { return yScale(d[data_fields[1]]); });
        
        var line= svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", valueline)
        ;


        var circles = svg.selectAll("myCircles")
        .data(data)
        .enter()
        .append("circle")
            .attr("fill", "#74b9ff")
            .attr("stroke", "none")
            .attr("cx", function(d) { return xScale(d[data_fields[0]]) })
            .attr("cy", function(d) { return yScale(d[data_fields[1]]) })
            .attr("r", 7)
    }

        
 
    
    if ( bar_mouseover_animation === true ) {
        svg.selectAll(".bar")
        .on("mouseover", function (d , i) {

            //-> Coloring
            //mousein_tuple
            og =  this;
            mousein_tuple.forEach(function(item) {
                d3.select(og).style(item.key , function(d) { 
                    return item.value });
            });

           
            d3.select(this)
            .transition()     // adds animation
            .duration(400)
            .attr('width', xScale.bandwidth() );
            
            //-> Tooltip
            if ( bar_tooltip===true ) {
                return  tooltip.style("visibility", "visible");
                }
            
        })
        .on("mousemove", function(event, d) {
            if ( bar_tooltip===true ) {
                        tooltip.html("value: " 
                                    + d[data_fields[1]]);
                       
                        return tooltip.style("top", (event.pageY-50)+"px")
                                      .style("left",(event.pageX-40)+"px")
                                      .style("opacity", "0.8");
                                    }
                                })

        //Add listener for the mouseout event
        .on("mouseout", function (d, i) { 
            og =  this;
            mouseout_tuple.forEach(function(item) {
                d3.select(og).style(item.key , function(d) { 
                    return item.value });
            });

            d3.select(this)
            .transition()     // adds animation
            .duration(400)
            .attr('width', xScale.bandwidth())
            
            // d3.selectAll('.highlight')
            // .remove()
            if ( bar_tooltip===true ) {
                return tooltip.style("visibility", "hidden"); 
                }
        }) 
    
    } 


   

    if ( line_mouseover_animation === true ) {
        svg.selectAll("circle")
        .on("mouseover", function (d , i) {
            og =  this;
            line_mousein_tuple.forEach(function(item) {
                d3.select(og).style(item.key , function(d) { 
                    return item.value });
            });

           

            d3.select(this)
            .transition()     // adds animation
            .duration(400)
            .attr('width', xScale.bandwidth() );

            return  tooltip.style("visibility", "visible");            
        })


        .on("mousemove", function(event, d) {

                        // use code below to bisect values of 

                        // var i = bisect(data, x0, 0);

                        // console.log('i -> ', i);
                    
                        // var selectedData = data[i]
                        // focus
                        // .attr("cx", xScale(selectedData[data_fields[0]]))
                        // .attr("cy", yScale(selectedData[data_fields[1]]))
                        // focusText
                        // .html("x:" + selectedData[data_fields[0]] + "  ,  " + "y:" 
                        //            + selectedData[data_fields[1]])

                        // .attr("x", xScale(selectedData[data_fields[0]]-1))
                        // .attr("y", yScale(selectedData[data_fields[1]])-35)

                                                
                        var x_pos = d3.pointer(event)[0];
                        var y_pos = d3.pointer(event)[1];
                        var domain = xScale.domain(); 
                        var range = xScale.range();

                        var rangePoints = d3.range(range[0], range[1], xScale.step())
                        
                        var y_value = yScale.invert(y_pos);
                        var x_value = domain[d3.bisect(rangePoints, x_pos) -1];

                        //......................

                        // var i = d3.bisect(rangePoints, x_pos)-1;
                        // var selectedData = data[i]
                        // focus
                        // .attr("cx", xScale(selectedData[data_fields[0]]))
                        // .attr("cy", yScale(selectedData[data_fields[1]]))
                        // focusText
                        // .html("x:" + selectedData[data_fields[0]] + "  ,  " + "y:" 
                        //            + selectedData[data_fields[1]])

                        // .attr("x", xScale(selectedData[data_fields[0]]-1))
                        // .attr("y", yScale(selectedData[data_fields[1]]))


                        //..........................

                        //console.log('x_value -> ', x_value, '- y_value-> ',y_value);

                        tooltip.html("" 
                                    + x_value + ' : ' + y_value);
                       
                        return tooltip.style("top", (event.pageY-50)+"px")
                                      .style("left",(event.pageX-40)+"px")
                                      .style("opacity", "0.8");
                                
                            })

        //Add listener for the mouseout event
        .on("mouseout", function (d, i) { 

            
            og =  this;

            line_mouseout_tuple.forEach(function(item) {
                d3.select(og).style(item.key , function(d) { 
                    return item.value });
            });


            d3.select(this)
            .transition()     // adds animation
            .duration(400)
            .attr('width', xScale.bandwidth());
            return tooltip.style("visibility", "hidden"); 
        }) 
    
    }
    
    // A function that update the chart
    function update(selectedGroup) {

        // Create new data with the selection?
        var dataFilter = selectedGroup.map(function(d){return {x_value: d[data_fields[0]], y_value:d[data_fields[1]]} })
  
        // Give these new data to update line
        line
            .data([dataFilter])
            .transition()
            .duration(600)
            .attr("d", d3.line()
              .x(function(d) { return xScale(d.x_value) })
              .y(function(d) { return yScale(d.y_value) })
            )
            // .attr("stroke", function(d){ return myColor(selectedGroup) })

            console.log(dataFilter);
            var e = svg.selectAll("circle")
            .data([dataFilter])
            .exit().remove();
            console.log(e);

            svg.selectAll("myCircles")
            .data(dataFilter)
            .enter().append("circle")
                 .attr("fill", "#74b9ff")
                .attr("stroke", "none")
                .attr("r", 7)
                .attr("cx", function(d) { return xScale(d.x_value) })
                .attr("cy", function(d) { return yScale(d.y_value) })
            ;

            if ( line_mouseover_animation === true ) {
                svg.selectAll("circle")
                .on("mouseover", function (d , i) {
                    og =  this;
                    line_mousein_tuple.forEach(function(item) {
                        d3.select(og).style(item.key , function(d) { 
                            return item.value });
                    });        
                    d3.select(this)
                    .transition()     // adds animation
                    .duration(400)
                    .attr('width', xScale.bandwidth() );
        
                    return  tooltip.style("visibility", "visible");            
                })
        
        
                .on("mousemove", function(event, d) {                                                        
                                var x_pos = d3.pointer(event)[0];
                                var y_pos = d3.pointer(event)[1];
                                var domain = xScale.domain(); 
                                var range = xScale.range();
        
                                var rangePoints = d3.range(range[0], range[1], xScale.step())
                                
                                var y_value = yScale.invert(y_pos);
                                var x_value = domain[d3.bisect(rangePoints, x_pos) -1];

                                tooltip.html("" 
                                            + x_value + ' : ' + y_value);
                               
                                return tooltip.style("top", (event.pageY-50)+"px")
                                              .style("left",(event.pageX-40)+"px")
                                              .style("opacity", "0.8");
                                        
                                    })
        
                //Add listener for the mouseout event
                .on("mouseout", function (d, i) {                     
                    og =  this;
                    line_mouseout_tuple.forEach(function(item) {
                        d3.select(og).style(item.key , function(d) { 
                            return item.value });
                    });
                    d3.select(this)
                    .transition()     // adds animation
                    .duration(400)
                    .attr('width', xScale.bandwidth());
                    return tooltip.style("visibility", "hidden"); 
                }) 
            
            }
           
           
    }


    if (filtering) {
        d3.select("#update-button").on("click", function(d) {
            // recover the option that has been chosen

            // var selectedGroup = d3.select(this).property("value")
            var selectedGroup = data.filter( function(d) {
                filter_boolean = (d[data_fields[0]] > 2006 && 
                                  d[data_fields[0]] < 2017)
                return filter_boolean
            });

            // run the updateChart function with this selected option
            update(selectedGroup)
        })
    }
  

}


// ...................................................................................
//....................................................................................


function bar_graph2 (data, graph_title='default_title', x_title='x-label', 
                    y_title='y_label', trend_line=false, bar_mouseover_animation=false,
                    line_mouseover_animation=false, 
                    bar_tooltip=false,
                    line_tooltip=false,
                    mousein_tuple={key:'', value:''}, mouseout_tuple={key:'', value:''},
                    line_mousein_tuple={key:'', value:''} , 
                    line_mouseout_tuple={key:'', value:''},
                    ) 
    {

        var data_fields = [];
        
        for (var field in data[0]) {
            // check if property not inherited
            if (Object.prototype.hasOwnProperty.call(data[0], field)) {
                data_fields.push(field);
                }
            }
        

        // Set the dimensions of the canvas / graph
        var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

        
        var svg = d3.select("#svg-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
        

        //var formatDate= d3.timeParse("%e-%b-%y");
        var parseTime = d3.timeParse("%e-%b-%y");
        let format = d3.timeFormat("%Y");
        let mystr = '24-Apr-12';

        console.log(parseTime(mystr));
        console.log(format(parseTime(mystr)))

        // When reading the csv, I must format variables:
        data.forEach( function(d) {
            d.date = parseTime(d.date)  // returns date object
            d.close = Number(d.close) }
        );

        console.log(data);
        
        
        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, width ]);

            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        
        // Add Y axis
        var y = d3.scaleLinear()
                .domain([53, 630])
                .range([ height, 0 ]);
            svg.append("g")
                .call(d3.axisLeft(y));

        // Add the line
        svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .curve(d3.curveBasis) // Just add that to have a curve instead of segments
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.close) })
        )


        // create a tooltip
        var Tooltip = d3.select("#svg-container")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")


        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
            Tooltip
            .style("opacity", 1)
        }
        var mousemove = function(d) {
            Tooltip
            .html("Exact value: " + d.value)
            .style("left", (d3.mouse(this)[0]+70) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
        }
        var mouseleave = function(d) {
            Tooltip
            .style("opacity", 0)
        }

        // Add the points
        svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "myCircle")
        .attr("cx", function(d) { return x(d.date) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 8)
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("fill", "white")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)



    }

// .......................................

function tootip_line(data) {

    var data_fields = [];
        
        for (var field in data[0]) {
            // check if property not inherited
            if (Object.prototype.hasOwnProperty.call(data[0], field)) {
                data_fields.push(field);
                }
            }
        

        // Set the dimensions of the canvas / graph
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 660 - margin.left - margin.right,
        height = 500 - margin.left - margin.right ;
        
        
        var svg = d3.select("#svg-container")
        .append("svg")
        .attr("width", width + margin.right + margin.right + 100)
        .attr("height", height + margin.top + margin.bottom + 100)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
         
        
         // range is possible values
        var xScale = d3.scaleLinear().range([0, width], 1);
        var yScale = d3.scaleLinear().range([height , 0]);
        
        // we  provide our domain values to the x and y scales    
        xScale.domain([d3.min(data, function(d) { return d[data_fields[0]]; })-4, 
                       d3.max(data, function(d) { return d[data_fields[0]]; })+4]);

        yScale.domain([0, d3.max(data, function(d) { return  d[data_fields[1]] + 20; }) ]);

        // var g = svg.append("g")
        // .attr("transform", "translate(" + 70 + "," + 50 + ")");

        svg.append("g")
         .attr("transform", "translate(0," + (height) + ")")
         .call(d3.axisBottom(xScale).tickFormat( function(d) {
                a = String(d)
                a=a.replace(/\,/g,'')
                a=Number(a)
                return a
         })
         .ticks(10))
         
         .append("text")
        // .attr("y", 300)
        // .attr("x", (width)/2 )
        .attr("transform", "translate(280," + (40) + ")")
        //.attr("text-anchor", "middle")
        .attr("stroke", "black")
        .text("Year");

        
        svg.append("g")
        .call(d3.axisLeft(yScale).tickFormat( function(d) {
            return "$" + d;
        }).ticks(10))
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", 16)
        .attr("dy", "-4.75em")
        .attr("transform", 'rotate(-90)translate(-200, ' + -8 +')')
        .attr("stroke", "black")
        .text("Stock Price");
        
        
        // svg.append("text")
        // .attr("transform", "translate(100,-20)")
        // .attr("x", 50)
        // .attr("y", 50)
        // .attr("font-size", "24px")
        // .text("XYZ Foods Stock Price");


         // Create the circle that travels along the curve of chart
        var focus = svg
        .append('g')
        .append('circle')
            .style("fill", "none")
            .attr("stroke", "black")
            .attr('r', 8.5)
            .style("opacity", 0)

        var focusText = svg
            .append('g')
            .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")


        // This allows to find the closest X index of the mouse:
        var bisect = d3.bisector(function(d) { return d[data_fields[0]]; }).left;

        const line = d3.line()
        .x(function(d) { return xScale(d[data_fields[0]])})
        .y(function(d) { return yScale(d[data_fields[1]])});


        // g.append("path")
        // .data([data])
        // .attr("class", "line")
        // .attr("d", line);

        svg.append("path")
        .datum(data)
        
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        
        .attr('d', line);


        // Create a rect on top of the svg area: this rectangle recovers mouse position
        svg
        .append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);


         // What happens when the mouse move -> show the annotations at the right positions.
        function mouseover() {
            focus.style("opacity", 1)
            focusText.style("opacity",1)
        }

        function mousemove() {
            // recover coordinate we need
                        
            var x0 = xScale.invert(d3.pointer(event)[0]-25);

            var i = bisect(data, x0, 0);

            console.log('i -> ', i);

            var selectedData = data[i]
            focus
            .attr("cx", xScale(selectedData[data_fields[0]]))
            .attr("cy", yScale(selectedData[data_fields[1]]))
            focusText
            .html("x:" + selectedData[data_fields[0]] + "  ,  " + "y:" + 
                                                            selectedData[data_fields[1]])
            .attr("x", xScale(selectedData[data_fields[0]]-1))
            .attr("y", yScale(selectedData[data_fields[1]])-35)
            }

        function mouseout() {
            focus.style("opacity", 0);
            focusText.style("opacity", 0)
        }

        

}
    

//------------------------------------------------


//mouseover event handler function
function onMouseOver(d, i) {
    d3.select(this).attr('class', 'highlight');
    d3.select(this)
      .transition()     // adds animation
      .duration(400)
      .attr('width', x.bandwidth() + 5);

             
}

//........................................

//mouseout event handler function
function onMouseOut(d, i) {
    // use the text label class to remove label on mouseout
    d3.select(this).attr('class', 'bar');
    d3.select(this)
      .transition()     // adds animation
      .duration(400)
      .attr('width', x.bandwidth())
      
    d3.selectAll('.val')
      .remove()
}






// ............................

var data1 = [
    {'date': 2006, 'close':40},
    {'date': 2008 , 'close': 45},
    {'date': 2010, 'close': 48},
    {'date': 2012, 'close': 51},
    {'date': 2014, 'close': 53},
    {'date': 2016, 'close': 57},
    {'date': 2017, 'close': 62}
]


const keys = Object.keys(parsed_data)

// var i = 0;
// for (var key in parsed_data) {
//     if (parsed_data.hasOwnProperty(key)) {
//         console.log(key, ' ---> ', parsed_data[key])
//         console.log(i)
//         i ++;
//     }
// }

const d1 = Object.values(parsed_data);
console.log(d1);



bar_graph (data1,   //data
          "SOME TITLE",  //graph_title
          'year', //x_title
          'value', //y_title
          true, //trend_line
          true,  // bar_mouseover_animation
          true, //line_mouseover_animation
          true, //bar_tooltip : boolean
          true, // line_tooltip : boolean
          [{key: 'fill', value: 'orange'}],  //mousein_tuple
          [{key: 'fill', value: 'rgb(70, 130, 180)'}],  //mouseout_tuple
          [{key: 'stroke', value: 'blue'}], // line_mousein_tuple
          [{key: 'stroke', value: '#74b9ff'}], // line_mouseout_tuple
          filtering=true
          )



