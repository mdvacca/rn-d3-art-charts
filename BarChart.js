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

  componentWillMount() {
    this.computeNextState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.computeNextState(nextProps);
  }

  computeNextState(nextProps) {
    const {
      data,
      width,
      height,
      xAccessor,
      yAccessor,
    } = nextProps;

    const lineGraph = this._createBarChart();

    this.setState({
      linePath: lineGraph.path,
    });

    // The first time this function is hit we need to set the initial
    // this.previousGraph value.
    if (!this.previousGraph) {
      this.previousGraph = lineGraph;
    }

    // Only animate if our properties change. Typically this is when our
    // yAccessor function changes.
    if (this.props !== nextProps) {
      const pathFrom = this.previousGraph.path;
      const pathTo = lineGraph.path;

      cancelAnimationFrame(this.animating);
      this.animating = null;

      // Opt-into layout animations so our y tickLabel's animate.
      // If we wanted more discrete control over their animation behavior
      // we could use the Animated component from React Native, however this
      // was a nice shortcut to get the same effect.
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          AnimationDurationMs,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity
        )
      );

      this.setState({
        // Create the ART Morph.Tween instance.
        linePath: Morph.Tween( // eslint-disable-line new-cap
          pathFrom,
          pathTo,
        ),
      }, () => {
        // Kick off our animations!
        this.animate();
      });

      this.previousGraph = lineGraph;
    }
  }

  // This is where we animate our graph's path value.
  animate(start) {
    this.animating = requestAnimationFrame((timestamp) => {
      if (!start) {
        // eslint-disable-next-line no-param-reassign
        start = timestamp;
      }

      // Get the delta on how far long in our animation we are.
      const delta = (timestamp - start) / AnimationDurationMs;

      // If we're above 1 then our animation should be complete.
      if (delta > 1) {
        this.animating = null;
        // Just to be safe set our final value to the new graph path.
        this.setState({
          linePath: this.previousGraph.path,
        });

        // Stop our animation loop.
        return;
      }

      // Tween the SVG path value according to what delta we're currently at.
      this.state.linePath.tween(delta);

      // Update our state with the new tween value and then jump back into
      // this loop.
      this.setState(this.state, () => {
        this.animate(start);
      });
    });
  }


  render() {
    const x = MARGIN;
    const y = this.props.height - MARGIN;
    //const barChart = this._createBarChart()
    const barChart = this.state.linePath;
    console.log(`createBarChart ${JSON.stringify(barChart)}`);
    return (
      <View width={this.props.width} height={this.props.height}>
        <Surface width={this.props.width} height={this.props.height}>
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
}
