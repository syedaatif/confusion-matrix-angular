import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Selection from 'd3-selection';

@Component({
  selector: 'app-confusion-matrix',
  templateUrl: './confusion-matrix.component.html',
  styleUrls: ['./confusion-matrix.component.css']
})
export class ConfusionMatrixComponent implements OnInit {
  public margin = {top: 50, right: 50, bottom: 100, left: 100};
  public svg: any;

  constructor() { }

  ngOnInit() {

    const confusionMatrix = [
      [169, 10],
      [7, 46]
    ];

    const tp = confusionMatrix[0][0];
    const fn = confusionMatrix[0][1];
    const fp = confusionMatrix[1][0];
    const tn = confusionMatrix[1][1];

    const p = tp + fn;
    const n = fp + tn;

    let accuracy = (tp + tn) / (p + n);
    let f1 = 2 * tp / (2 * tp + fp + fn);
    let precision = tp / (tp + fp);
    let recall = tp / (tp + fn);

    accuracy = Math.round(accuracy * 100) / 100;
    f1 = Math.round(f1 * 100) / 100;
    precision = Math.round(precision * 100) / 100;
    recall = Math.round(recall * 100) / 100;

    const computedData = [];
    computedData.push({ F1: f1, PRECISION: precision, RECALL: recall, ACCURACY: accuracy });

    const labels = ['Class A', 'Class B'];
    this.Matrix({
      container: '#container',
      data: confusionMatrix,
      labels,
      start_color: '#ffffff',
      end_color: '#e67e22'
    });

    // rendering the table
    const table = this.tabulate(computedData, ['F1', 'PRECISION', 'RECALL', 'ACCURACY']);
  }


  public Matrix(options) {
    const width = 250;
    const height = 250;
    const data = options.data;
    const container = options.container;
    const labelsData = options.labels;
    const startColor = options.start_color;
    const endColor = options.end_color;

    const widthLegend = 100;

    if (!data) {
      throw new Error('Please pass data');
    }

    if (!Array.isArray(data) || !data.length || !Array.isArray(data[0])) {
      throw new Error('It should be a 2-D array');
    }

    const maxValue = d3.max(data, (layer) => d3.max(layer, (d) => d));
    const minValue = d3.min(data, (layer) => d3.min(layer, (d) => d));

    const numrows = data.length;
    const numcols = data[0].length;

    this.svg = d3.select(container).append('svg')
      .attr('width', width + this.margin.left + this.margin.right)
      .attr('height', height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    const background = this.svg.append('rect')
      .style('stroke', 'black')
      .style('stroke-width', '2px')
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleBand()
      .domain(d3.range(numcols))
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(d3.range(numrows))
      .range([0, height]);

    const colorMap = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([startColor, endColor]);

    const row = this.svg.selectAll('.row')
      .data(data)
      .enter().append('g')
      .attr('class', 'row')
      .attr('transform', (d, i) => 'translate(0,' + y(i) + ')');

    const cell = row.selectAll('.cell')
      .data((d) => d)
      .enter().append('g')
      .attr('class', 'cell')
      .attr('transform', (d, i) => 'translate(' + x(i) + ', 0)');

    cell.append('rect')
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('stroke-width', 0);

    cell.append('text')
      .attr('dy', '.32em')
      .attr('x', x.bandwidth() / 2)
      .attr('y', y.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .style('fill', (d, i) => d >= maxValue / 2 ? 'white' : 'black')
      .text((d, i) => d);

    row.selectAll('.cell')
      .data((d, i) => data[i])
      .style('fill', colorMap);

    const labels = this.svg.append('g')
      .attr('class', 'labels');

    const columnLabels = labels.selectAll('.column-label')
      .data(labelsData)
      .enter().append('g')
      .attr('class', 'column-label')
      .attr('transform', (d, i) => 'translate(' + x(i) + ',' + height + ')');

    columnLabels.append('line')
      .style('stroke', 'black')
      .style('stroke-width', '1px')
      .attr('x1', x.bandwidth() / 2)
      .attr('x2', x.bandwidth() / 2)
      .attr('y1', 0)
      .attr('y2', 5);

    columnLabels.append('text')
      .attr('x', 30)
      .attr('y', y.bandwidth() / 2)
      .attr('dy', '.22em')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-60)')
      .text((d, i) => d);

    const rowLabels = labels.selectAll('.row-label')
      .data(labelsData)
      .enter().append('g')
      .attr('class', 'row-label')
      .attr('transform', (d, i) => 'translate(' + 0 + ',' + y(i) + ')');

    rowLabels.append('line')
      .style('stroke', 'black')
      .style('stroke-width', '1px')
      .attr('x1', 0)
      .attr('x2', -5)
      .attr('y1', y.bandwidth() / 2)
      .attr('y2', y.bandwidth() / 2);

    rowLabels.append('text')
      .attr('x', -8)
      .attr('y', y.bandwidth() / 2)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end')
      .text((d, i) => d);

    const key = d3.select('#legend')
      .append('svg')
      .attr('width', widthLegend)
      .attr('height', height + this.margin.top + this.margin.bottom);

    const legend = key
      .append('defs')
      .append('svg:linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '100%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%')
      .attr('spreadMethod', 'pad');

    legend
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', endColor)
      .attr('stop-opacity', 1);

    legend
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', startColor)
      .attr('stop-opacity', 1);

    key.append('rect')
      .attr('width', widthLegend / 2 - 10)
      .attr('height', height)
      .style('fill', 'url(#gradient)')
      .attr('transform', 'translate(0,' + this.margin.top + ')');

    const yscale = d3.scaleLinear()
      .range([height, 0])
      .domain([minValue, maxValue]);

    const yAxis = d3.axisRight(yscale);


    key.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(41,' + this.margin.top + ')')
      .call(yAxis);

  }

// The table generation function
public tabulate(data, columns) {
  const table = d3.select('#dataView').append('table')
    .attr('style', 'margin-left: ' + this.margin.left + 'px');
    const thead = table.append('thead');
    const tbody = table.append('tbody');

  // append the header row
  thead.append('tr')
    .selectAll('th')
    .data(columns)
    .enter()
    .append('th')
    .text((column) => column);

  // create a row for each object in the data
  const rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr');

  // create a cell in each row for each column
  const cells = rows.selectAll('td')
    .data((row) =>
      columns.map((column) => {
        const obj = { column, value: row[column] };
         return obj;}
      )
    ).enter()
    .append('td')
    .attr('style', 'font-family: Courier') // sets the font style
    .html((d) => d.value);

  return table;
}


}
