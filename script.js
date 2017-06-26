// started from D3 Block 
// http://bl.ocks.org/zanarmstrong/76d263bd36f312cb0f9f

var margin = {top: 60, right: 0, bottom: 20, left: 0},
    // width = 960,
    width = 860,
    // height = 500 - margin.top - margin.bottom,
    height = 555 - margin.top - margin.bottom,
    formatRate = d3.format(".2%"),
    formatDollars = d3.format("$,"),  
    transitioning;

var areaLimit = .030;

function niceBigNumber(val) {
  // format billions to one decimal like "$1.3 billion"
  if (Math.abs(Number(val)) >= 1.0e+9) {
    var float = Math.abs(Number(val)) / 1.0e+9;
    val = '$' + float.toFixed(1) + ' billion';
  } 
  // format millions to nearest million like "$346 million"
  else if (Math.abs(Number(val)) >= 1.0e+6) {
    var float = Math.abs(Number(val)) / 1.0e+6;   
    val = '$' + float.toFixed() + ' million';
  } 
  // format thousands to nearest thousand like "$144,000"
  else if (Math.abs(Number(val)) >= 1.0e+3) {
    val = '$' + (Math.round(1000*val)/1000).toLocaleString();
  }
  return val;
}

// function formatStuff(labelValue) 
//   {
//   // Nine Zeroes for Billions
//   return Math.abs(Number(labelValue)) >= 1.0e+9

//        ? Math.abs(Number(labelValue)) / 1.0e+9 + " Billion"
//        // Six Zeroes for Millions 
//        : Math.abs(Number(labelValue)) >= 1.0e+6

//        ? Math.abs(Number(labelValue)) / 1.0e+6 + " Million"
//        // Three Zeroes for Thousands
//        : Math.abs(Number(labelValue)) >= 1.0e+3

//        ? Math.abs(Number(labelValue)) / 1.0e+3 + " K"

//        : Math.abs(Number(labelValue));

//    }


// sets x and y scale to determine size of visible boxes
var x = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, height])
    .range([0, height]);

var treemap = d3.layout.treemap()
    .children(function(d, depth) { return depth ? null : d._children; })
    .sort(function(a, b) { return a.value - b.value; })
    .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
    .round(false);

var svg = d3.select("#chart").append("svg")
    .attr("id", "treemap")
    // responsive svg
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 860 555")
    .attr("class", "responsive-svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.bottom + margin.top)
    .style("margin-left", -margin.left + "px")
    .style("margin.right", -margin.right + "px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("shape-rendering", "crispEdges");


// defs for gradient
var defs = svg.append("defs");

var gradientGreen = defs.append("linearGradient")
   .attr("id", "greenGradient")
   .attr("x1", "0%")
   .attr("x2", "100%")
   .attr("y1", "0%")
   .attr("y2", "100%");

gradientGreen.append("stop")
   .attr('class', 'start')
   .attr("offset", "0%")
   .attr("stop-color", "#68a32b")
   .attr("stop-opacity", 1);

gradientGreen.append("stop")
   .attr('class', 'end')
   .attr("offset", "100%")
   // .attr("stop-color", "#3c7209")
   .attr("stop-color", "#548223")
   .attr("stop-opacity", 1);

var gradientDarkGreen = defs.append("linearGradient")
   .attr("id", "darkGreenGradient")
   .attr("x1", "0%")
   .attr("x2", "100%")
   .attr("y1", "0%")
   .attr("y2", "100%");

gradientDarkGreen.append("stop")
   .attr('class', 'start')
   .attr("offset", "0%")
   .attr("stop-color", "#548223")
   .attr("stop-opacity", 1);

gradientDarkGreen.append("stop")
   .attr('class', 'end')
   .attr("offset", "100%")
   // .attr("stop-color", "#3c7209")
   .attr("stop-color", "#3B6A0E")
   .attr("stop-opacity", 1);

var gradientPurple = defs.append("linearGradient")
   .attr("id", "purpleGradient")
   .attr("x1", "0%")
   .attr("x2", "100%")
   .attr("y1", "0%")
   .attr("y2", "100%");

gradientPurple.append("stop")
   .attr('class', 'start')
   .attr("offset", "0%")
   .attr("stop-color", "#8d75e3")
   .attr("stop-opacity", 1);

gradientPurple.append("stop")
   .attr('class', 'end')
   .attr("offset", "100%")
   .attr("stop-color", "#7b58ea")
   .attr("stop-opacity", 1);

var gradientPurple = defs.append("linearGradient")
   .attr("id", "darkPurpleGradient")
   .attr("x1", "0%")
   .attr("x2", "100%")
   .attr("y1", "0%")
   .attr("y2", "100%");

gradientPurple.append("stop")
   .attr('class', 'start')
   .attr("offset", "0%")
   .attr("stop-color", "#7b58ea")
   .attr("stop-opacity", 1);

gradientPurple.append("stop")
   .attr('class', 'end')
   .attr("offset", "100%")
   .attr("stop-color", "#6544ce")
   .attr("stop-opacity", 1);

var gradientYellow = defs.append("linearGradient")
   .attr("id", "yellowGradient")
   .attr("x1", "0%")
   .attr("x2", "100%")
   .attr("y1", "0%")
   .attr("y2", "100%");

gradientYellow.append("stop")
   .attr('class', 'start')
   .attr("offset", "0%")
   .attr("stop-color", "#e5e52b")
   .attr("stop-opacity", 1);

gradientYellow.append("stop")
   .attr('class', 'end')
   .attr("offset", "100%")
   .attr("stop-color", "#c9cb00")
   .attr("stop-opacity", 1);

var gradientYellow = defs.append("linearGradient")
   .attr("id", "darkYellowGradient")
   .attr("x1", "0%")
   .attr("x2", "100%")
   .attr("y1", "0%")
   .attr("y2", "100%");

gradientYellow.append("stop")
   .attr('class', 'start')
   .attr("offset", "0%")
   .attr("stop-color", "#c9cb00")
   .attr("stop-opacity", 1);

gradientYellow.append("stop")
   .attr('class', 'end')
   .attr("offset", "100%")
   .attr("stop-color", "#b0b201")
   .attr("stop-opacity", 1);

var gradientAqua = defs.append("linearGradient")
   .attr("id", "aquaGradient")
   .attr("x1", "0%")
   .attr("x2", "100%")
   .attr("y1", "0%")
   .attr("y2", "100%");

gradientAqua.append("stop")
   .attr('class', 'start')
   .attr("offset", "0%")
   .attr("stop-color", "#02cdc9")
   .attr("stop-opacity", 1);

gradientAqua.append("stop")
   .attr('class', 'end')
   .attr("offset", "100%")
   .attr("stop-color", "#00b7ac")
   .attr("stop-opacity", 1);

var gradientAqua = defs.append("linearGradient")
   .attr("id", "darkAquaGradient")
   .attr("x1", "0%")
   .attr("x2", "100%")
   .attr("y1", "0%")
   .attr("y2", "100%");

gradientAqua.append("stop")
   .attr('class', 'start')
   .attr("offset", "0%")
   .attr("stop-color", "#00b7ac")
   .attr("stop-opacity", 1);

gradientAqua.append("stop")
   .attr('class', 'end')
   .attr("offset", "100%")
   .attr("stop-color", "#01a398")
   .attr("stop-opacity", 1);


var grandparent = svg.append("g")
    .attr("class", "grandparent");

grandparent.append("rect")
    .attr("y", -margin.top)
    .attr("width", width)
    .attr("height", margin.top);

grandparent.append("text")
    .attr("x", 8)
    .attr("y", 8 - margin.top)
    .attr("dy", ".75em");

// functions

function initialize(root) {
    root.x = root.y = 0;
    root.dx = width;
    root.dy = height;
    root.depth = 0;
  }

  // Aggregate the values for internal nodes. This is normally done by the
  // treemap layout, but not here because of our custom implementation.
  // We also take a snapshot of the original children (_children) to avoid
  // the children being overwritten when when layout is computed.
  function accumulate(d) {
    return (d._children = d.children)
      // recursion step, note that p and v are defined by reduce
        ? d.value = d.children.reduce(function(p, v) {return p + accumulate(v); }, 0)
        : d.value;
  }



  // Compute the treemap layout recursively such that each group of siblings
  // uses the same size (1×1) rather than the dimensions of the parent cell.
  // This optimizes the layout for the current zoom state. Note that a wrapper
  // object is created for the parent node for each group of siblings so that
  // the parent’s dimensions are not discarded as we recurse. Since each group
  // of sibling was laid out in 1×1, we must rescale to fit using absolute
  // coordinates. This lets us use a viewport to zoom.
  function layout(d) {
    if (d._children) {
      // treemap nodes comes from the treemap set of functions as part of d3
      treemap.nodes({_children: d._children});
      d._children.forEach(function(c) {
        c.x = d.x + c.x * d.dx;
        c.y = d.y + c.y * d.dy;
        c.dx *= d.dx;
        c.dy *= d.dy;
        c.parent = d;
        // recursion
        layout(c);
      });
    }
  }


d3.json("budgetdata.json", function(root) {
  initialize(root);
  accumulate(root);
  layout(root);
  display(root);

  function display(d) {
    grandparent
        .datum(d.parent)
        .on("click", transition)
      .select("text")
        .text(name(d))

    grandparent
      .datum(d.parent)
      .select("rect")
      .attr("fill", function(){
        // console.log(color(d.rate)); 
        // return color(d['rate'])
        return '#223d08';
      });

    var g1 = svg.insert("g", ".grandparent")
        .datum(d)
        .attr("class", "depth");

    var g = g1.selectAll("g")
        .data(d._children)
        .enter()
        .append("g")
        .attr('class', function(d){
          // add color classes from data
          var classes = '';
          if (d.color) {
            classes += d.color;
          } else if (d.parent.color) {
            classes += d.parent.color;
          } else {
            classes += d.parent.parent.color;            
          }
          return classes;
        })
        // tootip shit
        .on("mouseover", function(d){
          // if (d.parent.name != '2017-18 Prop. 98 increase') {
          //   var tooltipText = d.name + ': <br> ' + formatDollars(d.value) + '<br>' + formatRate(d.rate) + ' of 2017 budget increase <br>' + formatRate(d.parentRate) + ' of ' + d.parent.name + ' increase';            
          // } else {
          //    var tooltipText = d.name + ': <br> ' + formatDollars(d.value) + '<br>' + formatRate(d.rate) + ' of 2017 budget increase';            
          // }
          if (d.area < areaLimit) {
            var tooltipText = d.name + ': <br> ' + niceBigNumber(d.value);
            tooltip.html(tooltipText);
            return tooltip.style("visibility", "visible");          
          }          
        })
        .on("mousemove", function(d){
          if (d.area < areaLimit) { 
            return tooltip.style("top", (d3.event.pageY)+"px").style("left",(d3.event.pageX-88)+"px");
          }
        })
        .on("mouseout", function(d){
          if (d.area < areaLimit) {          
            return tooltip.style("visibility", "hidden");
          }
        });

    g.filter(function(d) { return d._children; })
        .classed("children", true)
        .on("click", transition);

    g.selectAll(".child")
        .data(function(d) { return d._children || [d]; })
      .enter().append("rect")
        .attr("class", "child")
        .call(rect);

    g.append("rect")
        .attr("class", "parent")
        .call(rect)
      // .append("title")
      //   .text(function(d) {
      //     console.log(typeof(d.value), d.value); 
      //     return d.name + ': ' + formatDollars(d.value) + '\n' + formatRate(d.rate) + ' of 2017 budget increase\n' + formatRate(d.parentRate) + ' of ' + d.parent.name + ' total'; 
      //   });

    var tooltip = d3.select("#chart")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");

    // g.append("text")
    //     .attr("dy", ".75em")
    //     .text(function(d) { 
    //       return d.name; 
    //     })
    //     .call(text);

    g.append("foreignObject")
        .attr("dy", ".75em")
        .attr("class", "textObject")
        .html(function(d) { 
          if (d.area > areaLimit) {
            return d.name + ' <br><span class="smaller">' + niceBigNumber(d.value) + '</span>';             
          } else {
            // return '<span>' + d.name + '</span>';            
            return '<span class="icon"></span>';
          }
        }) 
        .call(text);

    function transition(d) {
      if (transitioning || !d) return;
      transitioning = true;

      var g2 = display(d),
          t1 = g1.transition().duration(750),
          t2 = g2.transition().duration(750);

      // Update the domain only after entering new elements.
      x.domain([d.x, d.x + d.dx]);
      y.domain([d.y, d.y + d.dy]);

      // Enable anti-aliasing during the transition.
      svg.style("shape-rendering", null);

      // Draw child nodes on top of parent nodes.
      svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

      // hide active tooltips
      tooltip.style("visibility", "hidden");

      // Fade-in entering text.
      g2.selectAll("foreignObject").style("fill-opacity", 0);

      // Transition to the new view.
      t1.selectAll("foreignObject").call(text).style("fill-opacity", 0);
      t2.selectAll("foreignObject").call(text).style("fill-opacity", 1);
      t1.selectAll("rect").call(rect);
      t2.selectAll("rect").call(rect);

      // Remove the old node when the transition is finished.
      t1.remove().each("end", function() {
        svg.style("shape-rendering", "crispEdges");
        transitioning = false;
      });
    }

    return g;
  }

  function text(text) {
    text.attr("x", function(d) { return x(d.x) + 8; })
        .attr("y", function(d) { return y(d.y) + 8; })
        .attr("width", function(d) { 
          return x(d.x + d.dx) - x(d.x) - 12; 
        })
        .attr("style", function(d){
          if (d.area > .030) {
            return 'font-size: ' + ((d.area + .5) * 2.2) + 'em';            
          } else {
            return 'font-size: ' + (d.area * .5) + 'em';             
          }
        })
        .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
        .attr("fill", function (d) {
          return 'white';          
        });
  }

  function rect(rect) {
    rect.attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y); })
        .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
        .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });
        // .attr("fill", function(d){
          // return '#68a32b'; // edsource green
          // return color(parseFloat(d.rate));
          // return "url(#greenGradient)";
        // });
  }

  function name(d) {
    return d.parent
        ? name(d.parent) + ": " + d.name
        : d.name;
  }

// IE Test stuff

function ieTest() {
  console.log('trying to apply error msg');
    var chart = document.getElementById('chart');
    var errorMsg = document.createElement('div');
    errorMsg.setAttribute('id', 'ieError');
    var text = document.createTextNode("This interactive graphic is not supported by Internet Explorer. Please use a standards-compatible browser such as Firefox, Chrome, or Safari for a better experience.");
    errorMsg.appendChild(text);
    chart.appendChild(errorMsg);  
}
// ieTest();



/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
  var ua = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
  
  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
  
  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
  
  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}

// Get IE or Edge browser version
var ieVersion = detectIE();

console.log('browser testing...')

if (ieVersion === false) {
  // document.getElementById('result').innerHTML = '<s>IE/Edge</s>';
  console.log('NOT ie/edge');
} else if (ieVersion >= 12) {
  // document.getElementById('result').innerHTML = 'Edge ' + version;
  console.log('edge ' + ieVersion);
} else {
  // document.getElementById('result').innerHTML = 'IE ' + version;
  console.log('ie ' + ieVersion);
  ieTest();
}


// setTimeout(function(){
//     console.log('browser testing again...')
//     if (ieVersion) {
//         console.log('some IE thing')
//         // do IE-specific things
//     } 
// }, 3000);


});



