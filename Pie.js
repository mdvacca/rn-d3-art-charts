// @flow
'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ART,
  LayoutAnimation,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

const {
  Surface,
  Group,
  Rectangle,
  Shape,
} = ART;

import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as d3Array from 'd3-array';

import Theme from './Theme';

const d3 = {
  scale,
  shape,
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
  colors: any,
  onItemSelected: any
};

const MARGIN = 25;

type State = {
  highlightedIndex: number,
};
export default class Pie extends React.Component {

  state: State;

  constructor(props: Props) {
    super(props);
    this.state = { highlightedIndex: 0 };
    this._createPieChart = this._createPieChart.bind(this);
    this._value = this._value.bind(this);
    this._label = this._label.bind(this);
    this._color = this._color.bind(this);
    this._onPieItemSelected = this._onPieItemSelected.bind(this);
  }

  componentWilUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  componentWillReceiveProps(newProps){
    console.log(JSON.stringify(newProps));
  }

  _value(item) { return item.number; }

  _label(item) { return item.name; }

  _color(index) { return Theme.colors[index]; }

  _createPieChart() {

    var arcs = d3.shape.pie()
        .value(this._value)
        (this.props.data);

    // console.debug('arcs: ' + JSON.stringify(arcs));

    var that = this;
    var hightlightedArc = d3.shape.arc()
      .outerRadius(this.props.width/2 + 10)
      .padAngle(.05)
      .innerRadius(30);

    var arc = d3.shape.arc()
      .outerRadius(this.props.width/2)
      .padAngle(.05)
      .innerRadius(30);

    return {
      //paths: arcs.map( function(a, index) { var path = arc(a); return { path , color: that._color(index) }; } )
      paths: arcs.map( (a, index) => {
        var path; // = arc(a);
        if (this.state.highlightedIndex == index) {
          path = hightlightedArc(a);
        } else {
          path = arc(a);
        }

        return {
          path,
          color: that._color(index),
          };
      })
    };
  }

  _onPieItemSelected(index) {
    this.setState({...this.state, highlightedIndex: index});
    this.props.onItemSelected(index);
  }

  render() {
    const x = this.props.width / 2 + MARGIN;
    const y = this.props.height / 2 + MARGIN;
    const pieChart = this._createPieChart()

    return (
      <View width={this.props.containerWidth} height={this.props.containerHeight}>
        <Surface width={this.props.containerWidth} height={this.props.containerHeight}>
           <Group x={x} y={y}>
           {
              pieChart.paths.map( (item, index) =>
                (<Shape
                   key={'pie_shape_' + index}
                   fill={item.color}
                   stroke={item.color}
                   d={item.path}
                />)
              )
            }
           </Group>
        </Surface>
        <View style={{position: 'absolute', top:MARGIN, left:2*MARGIN + this.props.width}}>
          {
            this.props.data.map( (item, index) =>
            {
              var fontWeight = this.state.highlightedIndex == index ? 'bold' : 'normal';
              return (
                <TouchableWithoutFeedback key={index} onPress={() => this._onPieItemSelected(index)}>
                  <View>
                    <Text style={{color: this._color(index), fontSize: 15, marginTop: 5, fontWeight: fontWeight}}>{this._label(item)}: {this._value(item)}%</Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })
          }
        </View>
      </View>
    );
  }
}
