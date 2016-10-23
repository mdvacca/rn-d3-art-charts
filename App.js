// @flow
'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';

import AreaSpline from './charts/AreaSpline';
import Pie from './charts/Pie';
import Theme from './Theme';
import data from './data';

type State = {
  activeIndex: number,
  spendingsPerYear: any
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
    const height = 200;
    const width = 500;

    return (
      <ScrollView>
        <View style={styles.container} >
          <Text style={styles.chart_title}>% of spendings this month</Text>
          <Pie
            pieWidth={150}
            pieHeight={150}
            onItemSelected={this._onPieItemSelected}
            colors={Theme.colors}
            width={width}
            height={height}
            data={data.spendingsLastMonth} />
          <Text style={styles.chart_title}>Spending per year in {data.spendingsLastMonth[this.state.activeIndex].name}</Text>
          <AreaSpline
            width={width}
            height={height}
            data={this.state.spendingsPerYear}
            color={Theme.colors[this.state.activeIndex]} />
        </View>
      </ScrollView>
    );
  }
}

const styles = {
  container: {
    backgroundColor:'aliceblue',
    marginTop: 21,
  },
  chart_title : {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 5,
    backgroundColor:'white',
    color: 'dimgrey',
    fontWeight:'bold',
  }
}
