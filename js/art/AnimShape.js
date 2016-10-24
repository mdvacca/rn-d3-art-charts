// @flow
'use strict';

import React from 'react';
import {
  ART,
  LayoutAnimation,
} from 'react-native';

const {
  Shape,
} = ART;

import Morph from 'art/morph/path';

import * as shape from 'd3-shape';

const d3 = {
  shape,
};

type Props = {
  color: any,
  d: () => any,
};

const AnimationDurationMs = 250;

export default class AnimShape extends React.Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      path: '',
    }
  }

  componentWillMount() {
    this.computeNextState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.computeNextState(nextProps);
  }

  // Animations based on: https://github.com/hswolff/BetterWeather
  computeNextState(nextProps) {
    const {
      d,
    } = nextProps;

    const graph = this.props.d();

    this.setState({
      path: graph.path,
    });

    // The first time this function is hit we need to set the initial
    // this.previousGraph value.
    if (!this.previousGraph) {
      this.previousGraph = graph;
    }

    // Only animate if our properties change. Typically this is when our
    // yAccessor function changes.
    if (this.props !== nextProps) {
      const pathFrom = this.previousGraph.path;
      const pathTo = graph.path;

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
        path: Morph.Tween( // eslint-disable-line new-cap
          pathFrom,
          pathTo,
        ),
      }, () => {
        // Kick off our animations!
        this.animate();
      });

      this.previousGraph = graph;
    }
  }

  // This is where we animate our graph's path value.
  animate(start) {
    this.animating = requestAnimationFrame((timestamp) => {
      if (!start) {
        start = timestamp;
      }

      // Get the delta on how far long in our animation we are.
      const delta = (timestamp - start) / AnimationDurationMs;

      // If we're above 1 then our animation should be complete.
      if (delta > 1) {

        this.animating = null;
        // Just to be safe set our final value to the new graph path.
        this.setState({
          path: this.previousGraph.path,
        });

        // Stop our animation loop.
        return;
      }

      // Tween the SVG path value according to what delta we're currently at.
      this.state.path.tween(delta);

      this.setState(this.state, () => {
        this.animate(start);
      });
    });
  }

  render() {
    const path = this.state.path;
    return (
       <Shape
         d={path}
         stroke={this.props.color}
         fill={this.props.color}
         />
    );
  }
}
