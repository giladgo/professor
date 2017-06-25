/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, I18nManager } from 'react-native';

import App from './components/app'

export default class professor extends Component {
  render() {
    return React.createElement(App, {});
  }
}

// עברי דבר עברית
I18nManager.forceRTL(false);
AppRegistry.registerComponent('professor', () => professor);
