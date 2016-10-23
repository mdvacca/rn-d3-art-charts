// @flow
'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ART,
  Dimensions,
  LayoutAnimation,
} from 'react-native';

const {
  Surface,
  Group,
  Rectangle,
  ClippingRectangle,
  LinearGradient,
  Shape,
} = ART;

import AnimShape from './AnimShape';
import Morph from 'art/morph/path';

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
  color: any,
  data: any
};

const MARGIN = 20;
const PaddingSize = 20;
const TickWidth = PaddingSize * 2;
const AnimationDurationMs = 250;

export default class BarChart extends React.Component {

  constructor(props: Props) {
    super(props);
    this._createBarChart = this._createBarChart.bind(this);
    this._value = this._value.bind(this);
    this._label = this._label.bind(this);
    this.state = {
      linePath: '',
    }
  }

  _value(item) { return item.number; }

  _label(item) { return item.name; }

  _createBarChart() {
    var area = d3.shape.area()
        .x(function(d, index) { return index*15; })
        .y1(function(d) { return -d.value; })
        .curve(d3.shape.curveNatural)
        (this.props.data)
        // (this._shuffle(this.props.data));

    console.debug('area: ' + JSON.stringify(area));

    return { path : area };
  }

  render() {
    const x = MARGIN;
    const y = this.props.height - MARGIN;
    //const barChart = this._createBarChart()
    // const barChart = this.state.linePath;
    // console.log(`createBarChart ${JSON.stringify(barChart)}`);
    return (
      <View width={this.props.width} height={this.props.height}>
        <Surface width={this.props.width} height={this.props.height}>
           <Group x={x} y={y}>
             <AnimShape
              key={12}
               color={this.props.color}
               createBarChart={() => this._createBarChart()}
                />
           </Group>
        </Surface>
      </View>
    );
  }
}
//
// <Shape
//   d={barChart}
//   stroke={this.props.color}
//   fill={this.props.color}
//   strokeWidth={2} />
