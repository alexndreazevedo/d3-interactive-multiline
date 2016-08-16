const width = 960;
const height = 480;
const margin = {
  top: 100,
  left: 40,
  right: 20,
  bottom: 20,
};
const animation = 1000;
const board = {
  width: width - (margin.left + margin.right),
  height: height - (margin.top + margin.bottom),
};

const svg = d3.select('body')
  .append('svg')
    .attr('viewBox', [0, 0, width, height].join(' '))
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

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
    .range([board.height, 0])
    .domain([
      d3.min(data, d => Math.min.apply(null, d.items) * 1.2),
      d3.max(data, d => Math.max.apply(null, d.items) * 1.2),
    ]);

  const x = d3.scaleTime()
    .range([0, board.width])
    .domain(d3.extent(data, (d) => d.date));

  const yAxis = d3.axisLeft(y)
    .tickSizeInner(-board.width)
    .tickSizeOuter(0)
    .tickPadding(10)
    .tickArguments([8, "s"])
    .tickFormat((d) => (d / 100) + '%');

  const xAxis = d3.axisBottom(x)
    .tickSizeInner(-board.height)
    .tickSizeOuter(0)
    .tickPadding(5);

  const line = d3.line()
    .curve(d3.curveLinear)
    .x((d) => x(d.date))
    .y((d) => y(d.value));

  const axes = svg.append('g');

  axes.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate( 0 , ${board.height} )`)
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
      .attr('height', board.height);

  const lines = svg.append('g');

  lines.selectAll('.items')
    .data(items)
    .enter()
      .append('path')
      .attr('class', 'line')
      .attr('clip-path', 'url(#lines-clip)')
      .attr('fill', 'none')
      .attr('stroke', (d, i) => color(i))
      .attr('stroke-width', '1.5px')
      .attr('d', (d) => line(d))
      .on('mouseover', function() {
        d3.selectAll('.line')
          .attr('stroke-width', '1.5px')
          .attr('opacity', '.3');

        d3.select(this)
          .attr('stroke-width', '4.5px')
          .attr('opacity', '1');
      })
      .on('mouseout', function() {
        d3.selectAll('.line')
          .attr('stroke-width', '1.5px')
          .attr('opacity', '1');
      });

  clip
    .transition().ease(d3.easeCubicOut).duration(animation)
    .attrTween('width', (d) => {

      const interpolate = d3.interpolate(0, board.width);

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
