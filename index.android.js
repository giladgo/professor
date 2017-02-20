/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';


import App from './components/app'

export default class professor extends Component {
  render() {
    return React.createElement(App, {});
  }
}

AppRegistry.registerComponent('professor', () => professor);
