// const d3 = require("d3");
// import * as d3 from "d3";
const width = 1200;
const height = 300;
const marginRight = 10;
const marginLeft = 55;
const marginTop = 10;
const marginBottom = 200;
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + marginLeft + marginRight)
  .attr("height", height + marginBottom)
  .attr('class', 'graph-container')

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then(function(result) {
    return result.json();
  })
  .then(function(data) {
    processData(data);
  });

function processData(data) {
  const baseTemperature = data["baseTemperature"];
  const years = data["monthlyVariance"].map(function(year) {
    return year["year"];
  });
  const temps = data["monthlyVariance"].map(function(year) {
    return year["variance"] + baseTemperature;
  });
  const xScale = d3
    .scaleBand()
    .domain(d3.range(d3.min(years), d3.max(years) + 1))
    .range([marginLeft, width + marginLeft]);
  const yScale = d3
    .scaleBand()
    .domain(d3.range(1, 13))
    .range([height, 0]);
  const cScale = d3
    .scaleQuantize()
    .domain([d3.min(temps), d3.max(temps)])
    .range([...d3.schemeRdYlBu[11]].reverse());
  svg
    .selectAll("rect")
    .data(data["monthlyVariance"])
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return xScale(d.year);
    })
    .attr("y", function(d) {
      return yScale(d.month);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("fill", function(d) {
      return cScale(d.variance + baseTemperature);
    })
    .attr('class', 'cell')
    .attr('data-month', function(d) {
      return d.month
    })
    .attr('data-year', function(d) {
      return d.year
    })
    .attr('data-temp', function(d) {
      return d.variance + baseTemperature
    })
    .on('mouseover', showtooltip)
    .on('mouseout', hidetooltip)

  let xticks = years.filter(function(year) {
    return year % 20 === 0;
  });
  xticks = [... new Set(xticks)];
  
  // define x axis 
  const xAxis = d3
    .axisBottom(xScale)
    .tickValues(xticks)
    .tickSizeOuter(0)

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr('id', 'x-axis')
    .attr('class', 'xax')
    .call(xAxis);

  // define y axis
  const yticks = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const yyScale = d3
    .scaleBand()
    .domain(yticks)
    .range([height, 0]);
  const yAxis = d3.axisLeft(yyScale).tickSizeOuter(0);

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .attr('id', 'y-axis')
    .call(yAxis);

  //

  svg
    .append('g')
    .attr('transform', `translate(${(width + marginLeft) / 2}, ${height + 45})`)
    .attr('class', 'xlabel')
    .append('text')
    .text('Year')
  
  svg
  .append('g')
  .attr('transform', `translate(12, ${height / 2 + 25})`)
  .attr('class', 'ylabel')
  .append('text')
  .text('Month')
  .attr('transform', `rotate(270)`)

//Legend
  const legend = svg
    .append('g')
    .attr('transform', `translate(${marginLeft}, ${height + 50})`)
    .attr('id', 'legend')
    .selectAll('rect')
    .data([...d3.schemeRdYlBu[11]].reverse())
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
      return i * 30
    })
    .attr('width', 30)
    .attr('height', 20)
    .attr('fill', function(d) {
      return d
    })
  
  const dt = (d3.max(temps) - d3.min(temps)) / 11
  const tempThres = d3.range(d3.min(temps), d3.max(temps), dt)
  // console.log(tempThres)
  
  const legendScale = d3.scaleLinear()
    .domain([d3.min(temps), d3.max(temps)])
    .range([0, 330])

  const legendAxis = d3.axisBottom(legendScale)
    .tickSizeOuter(0)
    .tickValues(tempThres.slice(1,))
    .tickFormat(d3.format(",.1f"))

  svg.append('g')
    .attr('transform', `translate(${marginLeft}, ${height + 70})`)
    .attr('class', 'legendAxis')
    .call(legendAxis)
  
  const sv = document.getElementsByTagName('svg')[0]
  const top = sv.getBoundingClientRect()['top']
  console.log(top)
  
  function showtooltip(d) {
    const x = parseFloat(d3.select(this).attr('x')) + xScale.bandwidth() / 2 - 15;
    const y = parseFloat(d3.select(this).attr('y')) + top - 55;
    d3.select(this)
      .style('stroke', 'black')
    // console.log(y)
    d3.select('#tooltip')
      .style('left', x + 'px')
      .style('top', y + 'px')
      .classed('hidden', false)
  }
  
  function hidetooltip(d) {
    d3.select('#tooltip')
      .classed('hidden', true)
    d3.select(this)
      .style('stroke', 'none')
  }
}
