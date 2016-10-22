// @flow
'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ScrollView,
  View,
  ART,
  Dimensions,
} from 'react-native';
const {
  Surface,
  Group,
  Rectangle,
  ClippingRectangle,
  Shape,
} = ART;
import Pie from './Pie';
import BarChart from './BarChart';
import Theme from './Theme';
import data from './data';

import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as path from 'd3-path';
import * as d3Array from 'd3-array';
const d3 = {
  scale,
  shape,
  path,
};

import {
    scaleBand,
    scaleLinear
} from 'd3-scale'


/**
 * Create an x-scale.
 * @param {number} start Start time in seconds.
 * @param {number} end End time in seconds.
 * @param {number} width Width to create the scale with.
 * @return {Function} D3 scale instance.
 */
function createScaleX(start, end, width) {
  return d3.scale.scaleTime()
    .domain([new Date(start), new Date(end)])
    .range([0, width]);
}

/**
 * Create a y-scale.
 * @param {number} minY Minimum y value to use in our domain.
 * @param {number} maxY Maximum y value to use in our domain.
 * @param {number} height Height for our scale's range.
 * @return {Function} D3 scale instance.
 */
function createScaleY(minY, maxY, height) {
  return d3.scale.scaleLinear()
    .domain([minY, maxY]).nice()
    // We invert our range so it outputs using the axis that React uses.
    .range([height, 0]);


}

export function createLineGraph(
  data,
  width,
  height,
) {

  const path = d3.path.path();
  path.moveTo(1, 2);
  path.lineTo(3, 4);
  path.closePath();
  console.log(`p: ${path.closePath()}`);


  // Get last item in the array.
  const lastDatum = data[data.length - 1];

  // Create our x-scale.
  const scaleX = createScaleX(
    data[0].time,
    lastDatum.time,
    width
  );

  // Collect all y values.
  const allYValues = data.reduce((all, datum) => {
    all.push(datum.temperatureMax);
    return all;
  }, []);

  // Get the min and max y value.
  const extentY = d3Array.extent(allYValues);

  // Create our y-scale.
  const scaleY = createScaleY(extentY[0], extentY[1], height);

  // Use the d3-shape line generator to create the `d={}` attribute value.
  const lineShape = d3.shape.line()
    // For every x and y-point in our line shape we are given an item from our
    // array which we pass through our scale function so we map the domain value
    // to the range value.
    .x((d) => scaleX(d.time))
    .y((d) => scaleY(d.temperatureMax))
    .curve(d3.shape.curveNatural)
  //  .curve(d3.shape.curveCatmullRom.alpha(0.25));

  return {
    // Pass in our array of data to our line generator to produce the `d={}`
    // attribute value that will go into our `<Shape />` component.
    path: lineShape(data),
  };
}

const charWidth = Dimensions.get('window').width;
const charHeight = 200;

type State = {
  activeIndex: number
}

export default class chart extends Component {

  state: State;

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      spendingsPerYear: data.spendingsPerYear,
    };
    this._onPieItemSelected = this._onPieItemSelected.bind(this);
    this._shuffle = this._shuffle.bind(this);
  }

  _onPieItemSelected(newIndex){
    this.setState({...this.state, activeIndex: newIndex, spendingsPerYear: this._shuffle(data.spendingsPerYear)});
  }

  _shuffle(a) {
      for (let i = a.length; i; i--) {
          let j = Math.floor(Math.random() * i);
          [a[i - 1], a[j]] = [a[j], a[i - 1]];
      }
      return a;
  }

  render() {
    const height = charHeight;
    const width = charWidth;
    const d = createLineGraph(data.temperatures, height, width);

    console.log(`d ${JSON.stringify(d)} for ${JSON.stringify({data, height, width})}`);

    return (
      <ScrollView>
        <View style={{backgroundColor:'#dcdcdc'}}>

        <View style={{height: 21, backgroundColor:'white'}} />

          <Text style={styles.chart_title}>% of spendings this month</Text>

          <Pie pieWidth={150} pieHeight={150} onItemSelected={this._onPieItemSelected} colors={Theme.colors} width={width} height={charHeight} data={data.spendingsLastMonth} />

          <Text style={styles.chart_title}>Spending per year</Text>

          <BarChart width={width} height={height} data={this.state.spendingsPerYear} color={Theme.colors[this.state.activeIndex]} />

          <Text style={styles.chart_title}>Happines per year</Text>

          <Surface width={width} height={500}>
            <Group x={0} y={0}>
              <Shape
                d={d.path}
                stroke={Theme.colors[2]}
                strokeWidth={3}
              />
            </Group>
          </Surface>
        </View>
      </ScrollView>
    );

    //d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"
  }
}

const styles = {
  chart_title : {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 5,
    backgroundColor:'white',
    color: 'dimgrey',
    fontWeight:'bold',
  }
}
