// @flow
'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ART,
} from 'react-native';

const {
  Surface,
  Group,
  Rectangle,
  ClippingRectangle,
  LinearGradient,
  Shape,
} = ART;

import AnimShape from '../art/AnimShape';

import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as format from 'd3-format';
import * as axis from 'd3-axis';

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

const margin = 20;
const AnimationDurationMs = 250;

class AreaSpline extends React.Component {

  constructor(props: Props) {
    super(props);
    this._createArea = this._createArea.bind(this);
    this._Xvalue = this._Xvalue.bind(this);
    this._Yvalue = this._Yvalue.bind(this);
    this._label = this._label.bind(this);
  }

  //TODO: expose this methods as part of the AreaSpline interface.
  _Yvalue(item, index) { return -item.value; }

  //TODO: expose this methods as part of the AreaSpline interface.
  _Xvalue(item, index) { return index*15; }

  //TODO: expose this methods as part of the AreaSpline interface.
  _label(item, index) { return item.name; }

  // method that transforms data into a svg path (should be exposed as part of the AreaSpline interface)
  _createArea() {
    var that = this;
    var area = d3.shape.area()
        .x(function(d, index) { return that._Xvalue(d, index); })
        .y1(function(d, index) { return that._Yvalue(d, index); })
        .curve(d3.shape.curveNatural)
        (this.props.data)

    // console.debug(`area: ${JSON.stringify(area)}`);

    return { path : area };
  }

  render() {
    const x = margin;
    const y = this.props.height - margin;

    return (
      <View width={this.props.width} height={this.props.height}>
        <Surface width={this.props.width} height={this.props.height}>
           <Group x={x} y={y}>
             <AnimShape
               color={this.props.color}
               d={() => this._createArea()}
                />
           </Group>
        </Surface>
      </View>
    );
  }
}

export default AreaSpline;
