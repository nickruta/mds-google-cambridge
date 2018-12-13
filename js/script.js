d3.csv('data/data.csv',function (data) {
// CSV section
  var body = d3.select("#vis-container")
  var selectData = [ { "text" : "Physical Distance" },
                     { "text" : "Estimated Time" },
                   ]

  var span = body.append('span')
  .attr("class", "select-container")
      .text('Select MDS Distance Metric: ')
  var yInput = body.append('select')
      .attr('id','ySelect')
      .on('change',yChange)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
  body.append('br')

  // Variables
  var body = d3.select('body')
  var margin = { top: 0, right: 200, bottom: 100, left: 0 }
  var h = 650 - margin.top - margin.bottom
  var w = 750 - margin.left - margin.right

  var formatPercent = d3.format('.2%')
  // Scales
  var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
  var xScale = d3.scaleLinear()
    .domain([
      d3.min([-1.5,d3.min(data,function (d) { return d['x_miles'] })]),
      d3.max([2.0,d3.max(data,function (d) { return d['x_miles'] })])
      ])
    .range([0,w])
  var yScale = d3.scaleLinear()
    .domain([
      d3.min([-1,d3.min(data,function (d) { return d['y_miles'] })]),
      d3.max([1.5,d3.max(data,function (d) { return d['y_miles'] })])
      ])
    .range([h,0])
  // SVG
  var svg = d3.select("#vis-container").append('svg')
      .attr('height',h + margin.top + margin.bottom)
      .attr('width',w + margin.left + margin.right)
    .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')')

  // Circles
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale(d['x_miles']) })
      .attr('cy',function (d) { return yScale(d['y_miles']) })
      .attr('r','13')
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d,i) { 

        if (d.location == "Harvard University") {
          return "#990000"

        } else {
          return colorScale(i) 
        }

        })
      .attr('class', function(d) {
        if (d.location == "Harvard University") {
          return "cirlce harvard"
        } else {return "circle"}
      })
      .on('mouseover', function (d) {
      })
      .on('mouseout', function () {
      })
    .append('title') // Tooltip
      .text(function (d) { return d['location']
      })

    var harvard_text = svg.append("text")
      .text(function(d) {
        return "Harvard University"
      })
      .attr('x',312)
      .attr('y',380)
      .style("fill", "#990000")

    var closest_text = svg.append("text")
      .text(function(d) {
        return "Nubar"
      })
      .attr('x',225)
      .attr('y',340)
      .attr("fill", "#17becf")

    var asterisk_text = svg.append("text")
      .text(function(d) {
        return "* hover over a circle for"
      })
      .attr('x',480)
      .attr('y',510)
      .style("font-size", "12px")
      .attr("fill", "black")

    var asterisk_text = svg.append("text")
      .text(function(d) {
        return " 2 seconds to see the restaurant name"
      })
      .attr('x',480)
      .attr('y',525)
      .style("font-size", "12px")
      .attr("fill", "black")

  function yChange() {
    var value = this.value // get the new y value

    var x_type = ''
    var y_type = ''

    var harvard_text_x;
    var harvard_text_y;
    var closest_text_x;
    var closest_text_y;
    var closest_text_label;

    if (value == "Estimated Time") {
      $('#info-panel').fadeTo(800, 0.0, function() { $(this).html("When Distance is based on the <strong>estimated time to arrival</strong>, the closest restaurant to Harvard is <span id='kirkland'>The Kirkland Tap & Trotter.</span>").fadeTo(500, 1.0); });

      x_type = 'x_minutes';
      y_type = 'y_minutes';

      harvard_text_x = 264;
      harvard_text_y = 207;

      closest_text_x =270;
      closest_text_y = 143;
      closest_text_label = 'The Kirkland Tap & Trotter';
       closest_text_color = '#d62728';

    } else {
      $('#info-panel').fadeTo(800, 0.0, function() { $(this).html("When Distance is based on <strong>physical straight-line distance</strong>, the closest restaurant to Harvard is <span id='nubar'>Nubar.</span>").fadeTo(500, 1.0); });

      x_type = 'x_miles'
      y_type = 'y_miles'
      harvard_text_x = 312
      harvard_text_y = 353
      closest_text_x =225;
      closest_text_y = 315;
      closest_text_label = 'Nubar'
      closest_text_color = '#17becf'
    }

    yScale // change the yScale
      .domain([
        d3.min([-1.2,d3.min(data,function (d) { return d[y_type] })]),
        d3.max([1.5,d3.max(data,function (d) { return d[y_type] })])
        ])
    // yAxis.scale(yScale) // change the yScale
    d3.select('#yAxis') // redraw the yAxis
      .transition().duration(1000)
      // .call(yAxis)
    d3.select('#yAxisLabel') // change the yAxisLabel
      .text(value)    
    d3.selectAll('circle') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i*100})
        .attr('cy',function (d) { return yScale(d[y_type]) })
        .attr('cx',function (d) { return xScale(d[x_type]) })

    harvard_text
      .transition()
      .duration(1000)
      .attr('x',harvard_text_x)
      .attr('y',harvard_text_y)

    closest_text
    .style("opacity", 0.0)
      .transition()
      .duration(3000)
      .attr('x',closest_text_x)
      .attr('y',closest_text_y)
      .text(closest_text_label)
      .style("fill", closest_text_color)
      .style("opacity", 1.0)
  }
})