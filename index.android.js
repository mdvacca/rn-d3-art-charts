// @flow
'use strict';

import { AppRegistry } from 'react-native';
import App from './App'

console.log(`App ${typeof(App)}`);

AppRegistry.registerComponent('rn_d3_art_charts', () => App);
