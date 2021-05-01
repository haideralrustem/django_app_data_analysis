// var from_python_data = data;

// console.log('-----> ', parsed_data);


function line_graph_test(data){

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


function line_graph(data=[], x_title='x_title', y_title='y_title',
                    graph_title='graph_title', y_ticks=10, data_circles=false,
                    line_mouseover_animation=true, line_mousein_tuple,
                    line_mouseout_tuple,
                    num_of_lines=1,
                    x_name='',
                    y_names=[],
                    x_axis_min=null,
                    x_axis_max=null,
                    y_axis_min=null,
                    y_axis_max=null,
                    ) {
    var data_fields = [];
    
    for (var field in data[0]) {
        // check if property not inherited
        if (Object.prototype.hasOwnProperty.call(data[0], field)) {

            data_fields.push(field);
            
        }
    }

    

    var animation_state = {
        highlighter_engaged: false,
        
    }


    // a method placed here must determine what type of data we are dealing with
    // so that we load the right filters

    margins = {top: 20, right: 20, bottom: 20, left: 50}

    width = 400 - margins.left - margins.right
    height = 400 - margins.top - margins.bottom
    
    
    var svg = d3.select("#svg-container").append("svg")
    .attr("width", width + margins.left + margins.right + 60)
    .attr("height", height + margins.top + margins.bottom + 60)
    .append("g")
        
        .attr("transform",
              "translate(" + margins.left + "," + (margins.top) + ")");

    
    // check if linear or should be other things
    var xScale =  d3.scaleLinear().range ([0, width]);


    var yScale = d3.scaleLinear().range ([height, 0]);



    var max_y = 0;
    var min_y = 0;
   
    var max_list = [];
    var min_list = [];

    for(let i=0; i < y_names.length; i++) {
        let y_name = y_names[i];
        // infer the domain??
        let current_min = d3.min(data, function(d) { return d[y_name]; });
        let current_max = d3.max(data, function(d) { return d[y_name]; });

        min_list.push(current_min);
        max_list.push(current_max);
        if (current_max >= max_y) {
            max_y = current_max;
        }
        if (current_min <= min_y) {
            min_y = current_min;
        }
    }
    max_list.sort(function(a, b){return b-a}); // sort descending
    if (max_list[0] - max_list[1] > 200) {
        alert(
            'consider a different graph for the other line because' +
            ' the y values difference is more than 200!'
            )
    }
    min_list.sort(function(a, b){return a-b}); // sort ascending
    if (min_list[1] - min_list[0] > 200) {
        alert(
            'consider a different graph for the other line because' +
            ' the x values difference is more than 200! and the graph can' +
            'appear distorted for some data points'
            )
    }

    // ............

    if (x_axis_max == null) {
        x_axis_max = d3.max(data, function(d) { return d[x_name]; });
    }
    if (x_axis_min == null ) {
        x_axis_min = d3.min(data, function(d) { return d[x_name]; });
    }
    if (y_axis_max == null) {
        y_axis_max = max_y;
    }
    if (y_axis_min == null) {
        y_axis_min = 0;
    }

    xScale.domain([x_axis_min, x_axis_max ]);
    yScale.domain([y_axis_min, y_axis_max + 5 ]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

    svg.append("g")
    .call(d3.axisLeft(yScale).tickFormat(function(d){
        // format the ticks
        return  d;
    }).ticks(y_ticks))  // number of ticks
    
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



    for(let i=0; i < y_names.length; i++) {
        let y_name = y_names[i];
        //line
        var valueline = d3.line()

            .x( function(d) { return xScale(d[x_name]); })
            .y( function(d) { return yScale(d[y_name]); });
            
            var line= svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", valueline)
            ;
        

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

        var bisect = d3.bisector(function(d) { return d[x_name]; }).left;
    
        
        if( data_circles === true) {
            var circles = svg.selectAll("myCircles")
            .data(data)
            .enter()
            .append("circle")
                .attr("class", "line-circles")
                .attr("stroke", "none")
                .attr("cx", function(d) { return xScale(d[x_name]) })
                .attr("cy", function(d) { return yScale(d[y_name]) })
                .attr("r", 5)
                .style("opacity", 0)
                .transition()     // adds animation
                .duration(500)
                .style("opacity", 1);;
        }

    

        if ( line_mouseover_animation === true ) {
            svg.selectAll(".line")
            .on("mouseover", function (d , i) { 
                line_mousein_animation(d, i, element=this, y_name=y_name)        
            })

            .on("mousemove", function(event, d) {
                line_mousemove_animation(event, d, element=this, y_name=y_name)
                                    
            })

            //Add listener for the mouseout event
            .on("mouseout", function (d, i) { 
                line_mouseout_animation(d, i, y_name=y_name)
            }) 

            svg.selectAll("circle")
            .on("mouseover", function (d , i) { 
                line_mousein_animation(d, i, element=this, y_name=y_name)        
            })

            .on("mousemove", function(event, d) {
                line_mousemove_animation(event, d, element=this, y_name=y_name)
                                    
            })

            //Add listener for the mouseout event
            .on("mouseout", function (d, i) { 
                line_mouseout_animation(d, i, y_name=y_name)
            }) 
        }

    
    }  // end for


    function line_mousein_animation (d , i, element , y_name) {

        line_mousein_tuple.forEach(function(item) {
            d3.select(element).style(item.key , function(d) { 
                return item.value });
        });


        let style_attr_name = ''
        console.log(element.tagName)
        if (element.tagName === "path") {
            style_attr_name = 'stroke'
        }
        else if (element.tagName === "circle") {
            style_attr_name = 'fill'
        }

        d3.select(element)
        .style(style_attr_name, "rgb(107, 199, 253)")
        .transition()     // adds animation
        .duration(100)
        .style(style_attr_name, "#D6A2E8")
        ;

        return  tooltip.style("visibility", "visible");            
    }

    function  line_mousemove_animation (event, d, element, y_name) {         
        var x0 = xScale.invert(d3.pointer(event)[0]-25);

        var i = bisect(data, x0, 0);

        console.log('i -> ', i);

        var selectedData = data[i]
        
        var y_value = selectedData[x_name];
        var x_value = selectedData[y_name]

        tooltip.html("" 
                    + x_value + ' : ' + y_value);
       
        return tooltip.style("top", (event.pageY-50)+"px")
                      .style("left",(event.pageX-40)+"px")
                      .style("opacity", "0.8");
                
            }

    function line_mouseout_animation(d, i, y_name) {                      
        
        line_mouseout_tuple.forEach(function(item) {
            d3.select(element).style(item.key , function(d) { 
                return item.value });
        });

        let style_attr_name = ''
        console.log(element.tagName)
        if (element.tagName === "path") {
            style_attr_name = 'stroke'
        }
        else if (element.tagName === "circle") {
            style_attr_name = 'fill'
        }
       
        d3.select(element)
        .style(style_attr_name, "#D6A2E8") 
        
        // before
        .transition()     // adds animation
        .duration(150)
        .style(style_attr_name, "rgb(107, 199, 253)")
        
        ; // after

        return tooltip.style("visibility", "hidden"); 
    }


}




//...................................................

function bar_graph (data, graph_title='default_title', x_title='x-label', 
                    y_title='y_label', 
                    bar_color='rgb(70, 130, 180)',
                    trend_line=false, bar_mouseover_animation=false,
                    line_mouseover_animation=false, 
                    bar_tooltip=false,
                    line_tooltip=false,
                    mousein_tuple=[{key:'', value:''}], 
                    mouseout_tuple=[{key:'', value:''}],

                    line_mousein_tuple=[{key:'', value:''}] , 
                    line_mouseout_tuple=[{key:'', value:''}],

                    filtering=true,
                    bar_filter=true,
                    line_filter=true,
                    highlighting=true,
                    highligh_style=[{key:'', value:''}]
                    ) 
    {
    
    var data_fields = [];
    
    for (var field in data[0]) {
        // check if property not inherited
        if (Object.prototype.hasOwnProperty.call(data[0], field)) {
            data_fields.push(field);
        }
    }

    var animation_state = {
        highlighter_engaged: false,
        
    }


    // a method placed here must determine what type of data we are dealing with
    // so that we load the right filters

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


    // .............

    // adding the bar
    svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")    
    .style("fill", bar_color)  
    
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
            .attr("class", "line-circles")
            .attr("stroke", "none")
            .attr("cx", function(d) { return xScale(d[data_fields[0]]) })
            .attr("cy", function(d) { return yScale(d[data_fields[1]]) })
            .attr("r", 7)
            .style("opacity", 0)
            .transition()     // adds animation
            .duration(500)
            .style("opacity", 1);;
    }

        
    // bar mouse animation functions.......
    function bar_mousein_animation(d, i, element) {
        //-> Coloring
            //mousein_tuple
            console.log(animation_state.highlighter_engaged);   
            

            mousein_tuple.forEach(function(item) {
                d3.select(element).style(item.key , function(d) { 
                    return item.value });
            });
            
                      
            d3.select(element)
            .transition()     // adds animation
            .duration(400)
            .attr('width', xScale.bandwidth() );
            
            //-> Tooltip
            if ( bar_tooltip===true ) {
                return  tooltip.style("visibility", "visible");
            }
    }

    function bar_mousemove_animation(event, d, element, values) {

       
        if ( bar_tooltip===true ) {
            let tooltip_value = ""
            
            values.forEach( function(i) {
                tooltip_value += 'value: ' + i + '\n';
            });

            tooltip.html(tooltip_value);
           
            return tooltip.style("top", (event.pageY-50)+"px")
                          .style("left",(event.pageX-40)+"px")
                          .style("opacity", "0.8");
                        }
    }

    function bar_mouseout_animation(d, i, element=this) {
       
        
            mouseout_tuple.forEach(function(item) {
                d3.select(element).style(item.key , function(d) { 
                    return item.value });
            });
        

        

        d3.select(element)
        .transition()     // adds animation
        .duration(400)
        .attr('width', xScale.bandwidth())
        
        // d3.selectAll('.highlight')
        // .remove()
        if ( bar_tooltip===true ) {
            return tooltip.style("visibility", "hidden"); 
            }
    }

    // ..........
    
    if ( bar_mouseover_animation === true ) {
        svg.selectAll(".bar")
        .on("mouseover", function (d , i) {

            bar_mousein_animation(d, i, element=this)
            
        })

        .on("mousemove", function(event, d) {
            bar_mousemove_animation(event, d, element=this, 
                values=[d[data_fields[1]]])
        })

        //Add listener for the mouseout event
        .on("mouseout", function (d, i) { 
           bar_mouseout_animation(d, i, element=this)
        }) 
    
    } 

   
    function line_mousein_animation (d , i, element) {

        line_mousein_tuple.forEach(function(item) {
            d3.select(element).style(item.key , function(d) { 
                return item.value });
        });

        d3.select(element)
        .style("fill", "rgb(107, 199, 253)")
        .transition()     // adds animation
        .duration(100)
        .style("fill", "#D6A2E8")
        ;

        return  tooltip.style("visibility", "visible");            
    }

    function  line_mousemove_animation (event, d, element) {                                                        
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
                
            }

    function line_mouseout_animation(d, i) {                      
        
        line_mouseout_tuple.forEach(function(item) {
            d3.select(element).style(item.key , function(d) { 
                return item.value });
        });
        d3.select(element)
        .style("fill", "#D6A2E8") 
        
        // before
        .transition()     // adds animation
        .duration(150)
        .style("fill", "rgb(107, 199, 253)")
        
        ; // after

        return tooltip.style("visibility", "hidden"); 
    }


    if ( line_mouseover_animation === true ) {
        svg.selectAll("circle")
        .on("mouseover", function (d , i) { 
            line_mousein_animation(d, i, element=this)        
        })

        .on("mousemove", function(event, d) {
            line_mousemove_animation(event, d, element=this)
                                
        })

        //Add listener for the mouseout event
        .on("mouseout", function (d, i) { 
            line_mouseout_animation(d, i)
        }) 
    
    }



    //............

    
    
    // A function that update the chart
    function updateData(selectedGroup) {

        // Create new data with the selection?
        var dataFilter = selectedGroup.map(function(d){return {x_value: d[data_fields[0]], y_value:d[data_fields[1]]} })
        
        if (bar_filter === true) {

            d3.selectAll(".bar").remove();


             // adding the bar
            svg.selectAll(".bar")
            .data(dataFilter)
            .enter().append("rect")
            .attr("class", "bar")    
            .style("fill", bar_color)
            
            // specify the x position
            .attr("x", function(d) { return xScale( d.x_value ); })

            // specify the y position
            .attr("y", function(d) { return yScale( d.y_value ); })

            // bar width; the x-scale returns a calculated bandwidth
            .attr("width", xScale.bandwidth())
            //The height of the bar. This would be the height of the SVG minus the corresponding y-value
            .attr("height", function(d) { return height - yScale(d.y_value ); })
            .style("opacity", 0.4)
            .transition()
            .duration(100)
            .style("opacity", 1)
            ;
            if ( bar_mouseover_animation === true ) {
                svg.selectAll(".bar")
                .on("mouseover", function (d , i) {
        
                    bar_mousein_animation(d, i, element=this)
                    
                })
        
                .on("mousemove", function(event, d) {
                    bar_mousemove_animation(event, d, element=this,
                        values=[d.y_value])
                })
        
                //Add listener for the mouseout event
                .on("mouseout", function (d, i) { 
                   bar_mouseout_animation(d, i, element=this)
                }) 
            
            } 

        }

        if(highlighting=== true) {
            let dataFilter_fields = []
            for (var field in dataFilter[0]) {
                // check if property not inherited
                if (Object.prototype.hasOwnProperty.call(dataFilter[0], field)) {
                    dataFilter_fields.push(field);
                }
            }
            

            highlight_onclick(svg=svg, selector=".bar", data=data, 
                              highligh_style=highligh_style,
                              d_fields=dataFilter_fields
                              );
            let svg_container = document.querySelector('#svg-container');

            
            
            // have to update ALL listeners
            
            svg_container.addEventListener("click", function() {
                // remove highlighting
                animation_state.highlighter_engaged = false;
    
                svg.selectAll(".bar").style('fill', bar_color);
                
                if ( bar_mouseover_animation === true ) {
                    svg.selectAll(".bar")
                    .on("mouseover", function (d , i) {
            
                        bar_mousein_animation(d, i, element=this)
                        
                    })
            
                    .on("mousemove", function(event, d) {
                        bar_mousemove_animation(event, d, element=this, 
                            values=[d.y_value])
                    })
            
                    //Add listener for the mouseout event
                    .on("mouseout", function (d, i) { 
                        bar_mouseout_animation(d, i, element=this)
                    }) 
                
                } 
                            
            });
            }
        



        // Give these new data to update line
        line
            .data([dataFilter])
            
            .attr("d", d3.line()
              .x(function(d) { return xScale(d.x_value) })
              .y(function(d) { return yScale(d.y_value) })
            )
            .style("opacity", 0.4)
            .transition()     // adds animation
            .duration(500)
            .style("opacity", 1)

            // .attr("stroke", function(d){ return myColor(selectedGroup) })
                        
            var e = svg.selectAll("circle")
            .data([dataFilter])
            .exit().remove();
            

            svg.selectAll("myCircles")
            .data(dataFilter)
            .enter().append("circle")
                 .attr("fill", "#74b9ff")
                .attr("stroke", "none")
                .attr("r", 7)
                .attr("cx", function(d) { return xScale(d.x_value) })
                .attr("cy", function(d) { return yScale(d.y_value) })
                .style("opacity", 0.4)
                .transition()     // adds animation
                .duration(500)
                .style("opacity", 1)
            ;

            if ( line_mouseover_animation === true ) {
                svg.selectAll("circle")
                .on("mouseover", function (d , i) {
                    line_mousein_animation(d, i, element=this); 
                })
        
        
                .on("mousemove", function(event, d) {                                                        
                    line_mousemove_animation(event, d, element=this)                                       
                })
        
                //Add listener for the mouseout event
                .on("mouseout", function (d, i) {                     
                    line_mouseout_animation(d, i, element=this);
                }) 
            
            }
            
    }
    let svg_container = document.querySelector('#svg-container');
    console.log(svg_container);

    // FILTERING //  
    
    // $("#slider").slider("destroy");
    
    // Your Code Here
    
    if (filtering) {
        d3.select("#update-button").on("click", function(d) {
            // recover the option that has been chosen

            // var selectedGroup = d3.select(this).property("value")


            // this filter should be based on the view
            var selectedGroup = data.filter( function(d) {
                filter_boolean = (d[data_fields[0]] > 2006 && 
                                  d[data_fields[0]] < 2017)
                return filter_boolean
            });

            // run the updateChart function with this selected option
            updateData(selectedGroup)
        })
            
            
        $(function () {
            $("#slider1").slider({
                range: true,
                min: xScale.domain()[0],
                max: xScale.domain()[xScale.domain().length-1],
                values: [xScale.domain()[0], xScale.domain()[xScale.domain().length-1]],
                step: 0.1,
                slide: function( event, ui ) { 
                    
                    let min_val = Math.round(ui.values[ 0 ]);
                    let max_val = Math.round(ui.values[ 1 ]);
                    $("#label-slider1").html(min_val);
                    $("#label-slider2").html(max_val);

                    var selectedGroup=data.filter( function(d) {
                        filter_boolean = (d[data_fields[0]] >= min_val && 
                                          d[data_fields[0]] <= max_val)
                        return filter_boolean
                    });

                    updateData(selectedGroup);
                   
                }

            });
        });
       

        
    }


    //      HIGHLIGHTING    ///

    
    if(highlighting=== true) {

        var data_mod = [];  // a variable to keep track of the clicked/de-clicked
        // data objects. Used for text labels


        highlight_onclick(svg=svg, selector=".bar", data=data, 
                          highligh_style=highligh_style,
                          d_fields=data_fields
                          );

        // animation_state.highlighter_engaged = true;

        let svg_container = document.querySelector('#svg-container');

        svg_container.addEventListener("click", function() {
            // remove highlighting
            animation_state.highlighter_engaged = false;
            
            // reset data_mod, which is an array containing highlighted items
            data_mod = [];
            // toggle
           d3.selectAll(".bar").classed("highlighted", false );
           

            show_data_labels(select_all=true, datum_clicked=null, 
                index_clicked=null, should_highlight_element=false,
                data_point_class_name=null);

            svg.selectAll(".bar").style('fill', bar_color);

            if ( bar_mouseover_animation === true ) {
                svg.selectAll(".bar")
                .on("mouseover", function (d , i) {
        
                    bar_mousein_animation(d, i, element=this)
                    
                })
        
                .on("mousemove", function(event, d) {
                    bar_mousemove_animation(event, d, element=null, 
                        values=[d[data_fields[1]]])
                })
        
                //Add listener for the mouseout event
                .on("mouseout", function (d, i) { 
                   bar_mouseout_animation(d, i, element=this)
                }) 
            
            } 
                        
        });
        

    }


    
    function highlight_onclick(svg, selector, data, highligh_style, d_fields=null,
                                )
        {
                

        d3.selectAll(selector)
        .attr("data-index", function(d, i) { return i; })
        .on("click", function(event,  d) {
           event.stopPropagation();
           
           console.log(d);
           let index_clicked = this.getAttribute("data-index");
           

           let obj = this
           let selection = d3.select(obj);
                    
           // toggle
           selection.classed("highlighted", selection.classed("highlighted") ? false : true);
           
           let bound_show_data_labels = show_data_labels.bind(this);

           
            
           // highlight case
           if (selection.attr("class").includes("highlighted")) {

            console.log('selection classes -> ', selection.attr("class"));
                
                highligh_style.forEach(function (item) {
                    d3.select(obj).style(item.key , function(d) { 
                        return item.value });
                });

                bound_show_data_labels(select_all=false, datum_clicked=d, 
                    index_clicked=index_clicked, should_highlight_element=true,
                    data_point_class_name='data_point_'+ index_clicked);
                
                animation_state.highlighter_engaged = true;



                d3.select(obj).on('mouseover', function(d, i) {
                
                    //-> Tooltip
                    if ( bar_tooltip===true ) {
                        return  tooltip.style("visibility", "visible");
                }
                });
                
                d3.select(obj).on("mousemove", function(event, d) {
                    bar_mousemove_animation(event, d, element=null, 
                        values=[d[d_fields[1]]])
                });
                
                d3.select(obj).on('mouseout', function(d, i) {
                    //-> Tooltip
                    if ( bar_tooltip===true ) {
                        return  tooltip.style("visibility", "hidden");
                }
                });

           }
           // de-highlight case
           else {

            console.log('selection classes -> ', selection.attr("class"));
                
                d3.select(obj).style('fill', bar_color);

                if ( bar_mouseover_animation === true ) {

                    svg.selectAll(".bar")
                    .on("mouseover", function (d , i) {
            
                        bar_mousein_animation(d, i, element=this)
                        
                    })
            
                    .on("mousemove", function(event, d) {
                        bar_mousemove_animation(event, d, element=null, 
                            values=[d[data_fields[1]]])
                    })
            
                    //Add listener for the mouseout event
                    .on("mouseout", function (d, i) { 
                       bar_mouseout_animation(d, i, element=this)
                    }) 
                
                } 

                
                bound_show_data_labels(select_all=false, datum_clicked=d, 
                    index_clicked=index_clicked, should_highlight_element=false,
                    data_point_class_name='data_point_'+ index_clicked);
                   

           }
        
            console.log('from onclick highlight ', animation_state.highlighter_engaged);
        
            }
        );          
    }

    let f = true;
    
    
    var i = 0; 

    svg.selectAll('text.sec')
            .data(data)
            .enter()
            .append('text')
            
            .attr("class", function(d, i) {
               
                return 'sec data_point_'+ i
            })
            
            .attr("x", function(d) {return xScale(d[data_fields[0]]) } )
            .attr("y", function(d) { return yScale(d[data_fields[1]])  } )
            
            .text(function(d) {   
                    return ""
             } )
            ;

    
    

    // clicked_dataum, clicked_index
    function show_data_labels(select_all, datum_clicked, index_clicked,
        should_highlight_element, data_point_class_name) {
    
        if (select_all === true) {


            if (should_highlight_element === false) {
                d3.selectAll("text.sec")            
                
                .text("");
            }
           

        }

// use selctall with a specified class to remove those who dont have that class
        else {
            if (f === true) {
            
            
            console.log("index_clicked  --> ",  index_clicked);

            let clicked_obj = data[index_clicked];

            console.log('clicked_obj = ', clicked_obj);
                       
            if (is_in_array(clicked_obj, data_mod)) {  // de-highlight
                const index = data_mod.indexOf(clicked_obj);
                if (index > -1) {
                    console.log('splicing: ', data_mod.splice(index, 1));
                    console.log('already exists! REMOVE!');
                  }
            }
            else {  // highlight
                data_mod.push(clicked_obj);
            }

            console.log('data_mod -> ', data_mod);
            
            let selector = "text.sec." + data_point_class_name; 
            if (should_highlight_element=== true) {   
                //  class highlighted should be ON
                               
                let enter_selection  = d3.selectAll(selector)            
                
                .text("" + Number(clicked_obj[data_fields[1]]).toFixed(2)   
                 );
                           

            }

            else if (should_highlight_element === false) {   
                //  class highlighted should be OFF
               
                let enter_selection  = d3.selectAll(selector)            
                
                .text("");
                
                

            }
            

            
            
            }
         

        }

    console.log('\n\n');  
    
    i ++;
       
    }
     

}


// ..............................

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

//................................

function is_in_array(obj, arr) {
    
    for(let i=0; i < arr.length; i++) {
        
        if (obj === arr[i]) {
            return true
        }        
    }
    return false

}

// ...................................................................................
//....................................................................................

function testing(data) {

    var data_fields = [];
    
    for (var field in data[0]) {
        // check if property not inherited
        if (Object.prototype.hasOwnProperty.call(data[0], field)) {
            data_fields.push(field);
        }
    }

    var animation_state = {
        highlighter_engaged: false,
        
    }


    // a method placed here must determine what type of data we are dealing with
    // so that we load the right filters

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
    .text("graph_title")
    
    svg.append("text")
    .attr('x', (width/2) )
    .attr('y', height + 35)
    .attr("stroke", "black")
    .text("x_title");

    svg.append("text")
    .attr("transform", 'rotate(-90)translate(-120, ' + -30 +')')
    .attr("stroke", "black")
    .text("y_title");

    
    // svg.selectAll("circle").data(data)
    // .enter()
    // .append("circle")
    // .style("stroke", "gray")
    // .style("fill", "red")
    // .attr("r", 4)
    // .attr("cx", function(d) {return xScale(d[data_fields[0]]) } )
    // .attr("cy", function(d) { return yScale(d[data_fields[1]]) } );

    // var node = svg.selectAll("circle")
    //             .data(data)
    //             .enter()
    //             .append("circle")
    // .attr("class", "dot")
    // .style("fill", "red")
    // .attr("cx",  function(d) {return xScale(d[data_fields[0]]) })
    // .attr("cy", function(d) { return yScale(d[data_fields[1]]) })
    // .attr("r", 3);
    
    console.log(svg);

    // svg.selectAll("text.sec")
    // .data(data)
    // .enter()
    // .append('text')
    // .attr("class", "sec")
    // .style("fill", "blue")
    // .attr("x", function(d) {return xScale(d[data_fields[0]]) } )
    // .attr("y", function(d) { return yScale(d[data_fields[1]]) - 25 } )
    
    // .text(function(d) { return yScale(d[data_fields[1]]) } );
    
        

    document.querySelector('#update-button').addEventListener("click", button_click);

    var r = 0;

    var data_labels_tracker

    function button_click() {
        // let r = Math.floor(Math.random() * data.length);
        if (r === data.length){
            r = 0;
        }



        data_mod = data.slice(r, r+1);
        
        console.log(data_mod);
        
        var ex = svg.selectAll("text.sec")
        .datum({})
        .exit();
        console.log(ex);


        // svg.selectAll("text.sec")
        // .data(data_mod)
        // .exit()
        // .remove();

        // svg.selectAll("circle").data(data_mod)
        // .exit().remove();
        svg.selectAll("text.sec")
        .data(data_mod)
        .enter()
        .append('text')
        .attr("class", "sec")
        .style("fill", "blue")
        .attr("x", function(d) {return xScale(d[data_fields[0]]) } )
        .attr("y", function(d) { return yScale(d[data_fields[1]]) - 25 } )
        
        .text(function(d) { return Number(yScale(d[data_fields[1]])).toFixed(2) } );
        
        r ++;

    }

}

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


    
// -----------------------------------



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
    {'date': 2006, 'close':40, 'loss': 70},
    {'date': 2008 , 'close': 45, 'loss': 33},
    {'date': 2010, 'close': 48, 'loss': 22},
    {'date': 2012, 'close': 51, 'loss': 29},
    {'date': 2014, 'close': 53, 'loss': 39},
    {'date': 2016, 'close': 57, 'loss': 49},
    {'date': 2017, 'close': 62, 'loss': 51}
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

//testing(data=data1);
line_graph(data=data1, x_title='xaxis', y_title='ytitle', graph_title='TITLEST',
            y_ticks=10, data_circles=true, line_mouseover_animation=true,
            line_mousein_tuple=[{key: "stroke", value: 'orange'}], 
            line_mouseout_tuple=[{key: "stroke", value: 'rgb(70, 130, 180)'}],
            num_of_lines=1,
            x_name='date',
            y_names=['close', 'loss'],
            x_axis_min=2005,
            x_axis_max=2018,
            y_axis_min=null,
            y_axis_max=100,
            )

// bar_graph (data1,   //data
//           "SOME TITLE",  //graph_title
//           'year', //x_title
//           'value', //y_title
//           bar_color='rgb(70, 130, 180)',
//           true, //trend_line
//           true,  // bar_mouseover_animation
//           true, //line_mouseover_animation
//           true, //bar_tooltip : boolean
//           true, // line_tooltip : boolean
//           [{key: 'fill', value: 'orange'}],  //mousein_tuple
//           [{key: 'fill', value: 'rgb(70, 130, 180)'}],  //mouseout_tuple
//           [{key: 'stroke', value: 'blue'}], // line_mousein_tuple
//           [{key: 'stroke', value: '#74b9ff'}], // line_mouseout_tuple
//           filtering=true,
//           bar_filter=true,
//           line_filter=true,
//           highlighting=true,
//           highligh_style=[{key: "fill", value: "red"}]
//           )



