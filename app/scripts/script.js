const width = 960;
const height = 480;
const margin = 20;
const animation = 1000;
const board = {
  width: width - (margin * 2),
  height: height - (margin * 2),
};

const svg = d3.select('body')
  .append('svg')
    .attr('viewBox', [0, 0, width, height].join(' '))
    .attr('width', width)
    .attr('height', height)
  .append('g');

const color = (d) => ['#eda921', '#4990e2', '#8d9697', '#edc8a3'][d];

const build = (data) => {

  let items = [];

  data.map((item) => item.items.map((value, index) => {

    if(!items[index]) {
      items[index] = [];
    }

    items[index].push({
      'date': item.date,
      'value': value
    });
  }));

  const y = d3.scaleLinear()
    .range([height - (margin * 2), 0])
    .domain([
      d3.min(data, d => Math.min.apply(null, d.items)),
      d3.max(data, d => Math.max.apply(null, d.items)),
    ]);

  const x = d3.scaleTime()
    .range([0, width])
    .domain(d3.extent(data, (d) => d.date));

  const yAxis = d3.axisLeft(y)
    .tickSizeInner(-width)
    .tickSizeOuter(0)
    .tickPadding(10);

  const xAxis = d3.axisBottom(x)
    .tickSizeInner(-height)
    .tickSizeOuter(0)
    .tickPadding(5);

  const line = d3.line()
    .curve(d3.curveLinear)
    .x((d) => x(d.date))
    .y((d) => y(d.value));

  const axes = svg.append('g');

  axes.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate( 0 , ${height} )`)
      .call(xAxis);

  axes.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

  const clip = svg.append('clipPath')
    .attr('id', 'lines-clip')
    .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', height);

  const lines = svg.append('g');

  lines.selectAll('.items')
    .data(items)
    .enter()
      .append('path')
      .attr('class', 'line')
      .attr('clip-path', 'url(#lines-clip)')
      .attr('fill', 'none')
      .attr('stroke', (d, i) => color(i))
      .attr('stroke-width', '1px')
      .attr('d', (d) => line(d));

  clip
    .transition().ease(d3.easeCubicOut).duration(animation)
    .attrTween('width', (d) => {

      const interpolate = d3.interpolate(0, width);

      return (t) => {
        return interpolate(t);
      };
    })
};

const data = [
  {"date": new Date(2016, 07, 11), "items": [ 450.21,  336.89,  365.53,  450.21 ]},
  {"date": new Date(2016, 07, 04), "items": [ 249.28,  119.80,  190.09,  216.90 ]},
  {"date": new Date(2016, 06, 27), "items": [  51.91,  234.00, -157.09,   81.15 ]},
  {"date": new Date(2016, 06, 20), "items": [-496.71, -205.10,  148.64, -136.22 ]},
  {"date": new Date(2016, 06, 13), "items": [-222.30, -322.70,   30.77, -200.50 ]},
  {"date": new Date(2016, 06, 06), "items": [ -32.12, -228.00,  414.40,   50.99 ]},
  {"date": new Date(2016, 05, 31), "items": [ -90.40, -134.20,  464.84,  113.18 ]},
  {"date": new Date(2016, 05, 23), "items": [ -24.24,  -73.00,  286.88,   83.24 ]},
  {"date": new Date(2016, 05, 16), "items": [-396.52, -187.50,  155.18, -108.21 ]},
  {"date": new Date(2016, 05, 09), "items": [-362.14, -205.30,   73.37, -146.65 ]},
  {"date": new Date(2016, 05, 03), "items": [-156.83, -218.10,  226.19,  -49.09 ]},
  {"date": new Date(2016, 04, 25), "items": [-123.82, -101.90,  328.31,   64.96 ]},
  {"date": new Date(2016, 04, 18), "items": [ 106.29,  -33.40,  293.02,  131.70 ]},
  {"date": new Date(2016, 04, 11), "items": [   0.00,    0.00,    0.00,    0.00 ]}
];

build(data);
