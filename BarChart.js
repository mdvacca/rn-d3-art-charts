// @flow
'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ART,
  Dimensions,
} from 'react-native';

const {
  Surface,
  Group,
  Rectangle,
  ClippingRectangle,
  LinearGradient,
  Shape,
} = ART;

import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as format from 'd3-format';
import * as d3Array from 'd3-array';
import * as axis from 'd3-axis';

import Theme from './Theme';

const d3 = {
  scale,
  shape,
  format,
  axis,
};

import {
    scaleBand,
    scaleLinear
} from 'd3-scale';

type Props = {
  height: number,
  width: number,
  containerWidth: number,
  containerHeight: number,
};

var data = [
  {date: new Date(2007, 3, 24), value: 3.24},
  {date: new Date(2007, 3, 25), value: 10.35},
  {date: new Date(2007, 3, 26), value: 10.84},
  {date: new Date(2007, 3, 27), value: 9.92},
  {date: new Date(2007, 3, 30), value: 65.80},
  {date: new Date(2007, 4,  1), value: 19.47},
  {date: new Date(2007, 3, 24), value: 30.24},
  {date: new Date(2007, 3, 25), value: 10.35},
  {date: new Date(2007, 3, 26), value: 10.84},
  {date: new Date(2007, 3, 27), value: 19.92},
  {date: new Date(2007, 3, 30), value: 80.80},
  {date: new Date(2007, 4,  1), value: 19.47},
  {date: new Date(2007, 3, 24), value: 34.24},
  {date: new Date(2007, 3, 25), value: 65.35},
  {date: new Date(2007, 3, 26), value: 45.84},
  {date: new Date(2007, 3, 27), value: 60.92},
  {date: new Date(2007, 3, 30), value: 21.80},
  {date: new Date(2007, 4,  1), value: 19.47},
  {date: new Date(2007, 3, 24), value: 3.24},
  {date: new Date(2007, 3, 25), value: 10.35},
  {date: new Date(2007, 3, 26), value: 20.84},
  {date: new Date(2007, 3, 27), value: 60.92},
  {date: new Date(2007, 3, 30), value: 80.80},
];

const MARGIN = 25;

export default class BarChart extends React.Component {

  constructor(props: Props) {
    super(props);
    this._createBarChart = this._createBarChart.bind(this);
    this._value = this._value.bind(this);
    this._label = this._label.bind(this);
    this._color = this._color.bind(this);
  }

  _value(item) { return item.number; }

  _label(item) { return item.name; }

  _color(index) { return Theme.colors[index]; }

  _createBarChart() {
    var area = d3.shape.area()
        .x(function(d, index) { return index*15; })
        .y1(function(d) { return -d.value; })
        (data);

    console.debug('area: ' + JSON.stringify(area));

    return area;
  }

  render() {
    const x = MARGIN;
    const y = this.props.containerHeight - MARGIN;
    const barChart = this._createBarChart()
    console.log(`createBarChart ${JSON.stringify(barChart)}`);
    return (
      <View width={this.props.containerWidth} height={this.props.containerHeight}>
        <Surface width={this.props.containerWidth} height={this.props.containerHeight}>
           <Group x={x} y={y}>
             <Shape
               d={barChart}
               stroke={this.props.color}
               fill={this.props.color}
               strokeWidth={2} />
           </Group>
        </Surface>
      </View>
    );
  }
  //stroke={Theme.colors[2]}
  //fill={Theme.colors[2]}
}
