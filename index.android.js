import React, { Component } from 'react';
import { AppRegistry, I18nManager } from 'react-native';


import App from './components/app'

export default class professor extends Component {
  render() {
    return React.createElement(App, {});
  }
}
I18nManager.forceRTL(false);
AppRegistry.registerComponent('professor', () => professor);
