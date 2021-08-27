console.log('this is project2 js')
var window_media_query_offset = 17;

// let parsed_data = null;
// parsed_data = JSON.parse('{{json_recieved_data|safe}}')
    


function wordFreq(data, w=460, h=400, fontSize="14px") {
        // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 80, left: 100},

    width = w - margin.left - margin.right,
    
    height = h - margin.top - margin.bottom;

    let max_ticks = data[0]['count'];

    d3.select("#my_dataviz svg").remove();

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        
        .attr("height", height + margin.top + margin.bottom)
        
        .attr("class", ".my_dataviz")
       
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

      
        // Add X axis
        var x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.count; })])
        .range([ 0, width]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        // .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks((data.length)-1) )
        .call(d3.axisBottom(x).ticks(max_ticks) )
        
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        
        .style("text-anchor", "end")
        .style("font-size", fontSize);

        // Y axis
        var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(data.map(function(d) { return d.word; }))
        .padding(.1);

        svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("class", "plot-word")
        .style("font-size", fontSize)
        ;


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
        

        document.querySelectorAll('.plot-word').forEach(
            function(item) {
            item.addEventListener('click', function(event) {
                event.stopPropagation();
              //handle click
              clickPlotWord(this);
            })
          });


          function clickPlotWord(clickedItem) {
            console.log('clicked item => ', clickedItem.innerHTML);
            if ($(clickedItem).hasClass('plot-word-selected')){
                $(clickedItem).removeClass('plot-word-selected');
                // unhighlight text

            }
            else {
                $(clickedItem).addClass('plot-word-selected');
                // highlight text
                highlightWordsTextArea(clickedItem.innerHTML);

            }
           

          }

          

}

function highlightWords() {
    $(".highlight-overlay").width ($('#txa_textarea').width());
    $(".highlight-overlay").height ($('#txa_textarea').height());
    let highlight_overlay = document.querySelector('.highlight-overlay');

    let txtarea = document.querySelector('#txa_textarea');
    let coords_offset = getOffset(highlight_overlay);
    
    console.log(coords_offset);
    console.log(getOffset(txtarea));
    highlight_overlay

    initiateTextAreaOverlayProps();
  }

// set the values of overlay so that its identitcal to the textarea
function initiateTextAreaOverlayProps() {
    console.log("  initiateTextAreaOverlayProps() was called ! \n");
    // set text

    //set css
    //margin: 0% 0 0 3%;

    let selectedWord = 'vaccination';
    
    let re = new RegExp(selectedWord, "g");

    let highlightedSelectedWord = `<span class="highlighted-textarea-word">${selectedWord}</span>`
    
    // $(".highlight-overlay").width ($('#txa_textarea').width());
    // $(".highlight-overlay").height ($('#txa_textarea').height());


    let fs = $("#txa_textarea").css("font-size");
    let margin = $("#txa_textarea").css("margin");
    let padding = $("#txa_textarea").css("padding");
    let border = $("#txa_textarea").css("border");
    
    $(".highlight-overlay").css(
        {
        "font-size": fs,
        // "border": border,
        });

    let tx =  $("#txa_textarea").val().replace(/\n/g, "<br />");

    tx = tx.replace(re, highlightedSelectedWord);

    console.log(tx);

    $('.highlight-overlay').html(tx);
    
    $("#txa_textarea").scrollTop(0);

    // now match the scrolling pattern
    let target = $(".highlight-overlay")[0];
    $("#txa_textarea").scroll(function() {
        target.scrollTop = this.scrollTop;
             
    });

    

    // responisveness
    // color coding

}

function adjustTextAreaOverlay() {

}


window.addEventListener('resize', function(event) {
    // textAreaOverlayOnResize();    
    }, true);


// ........................


function textAreaOverlayOnResize() {
    let highlightOverly = document.querySelector('.highlight-overlay');
    let textArea = document.querySelector('.txa_textarea');

    highlightOverly.style.width = textArea.offsetWidth + "px";
}



function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }


function highlightWordsTextArea(highlightedWord) {
    let textArea = document.getElementById("txa_textarea");
    let text = textArea.value;
    let newText = "";
    let wrappedWord = `<span class='highlighted-textarea-word'>${highlightedWord}</span>`
    newText = text.replace(highlightedWord, wrappedWord);
    textArea.nodeValue  = newText;
}

function dehighlightWordsTextArea(highlightedWord) {
    let textArea = document.getElementById("txa_textarea");
}   


// a function when body clicks occur and we need to have a de-click
function declicker(){
    document.getElementById('text-analyzer-wapper').addEventListener('click',
        function(){
            document.querySelectorAll('.plot-word').forEach(
                function(item) {
                    if ($(item).hasClass('plot-word-selected')){
                        $(item).removeClass('plot-word-selected');
                    }
            });
        }
        
    );  

}

// execute function calls
initiateTextAreaOverlayProps();

declicker();


let data= [{word: 'Hello', 'count': 10},
            {word: 'Verbose', 'count': 25},
            {word: 'Peli', 'count': 5},
            {word: 'Jack', 'count': 90},
            {word: 'Ink', 'count': 60}]


// wordFreq(data);