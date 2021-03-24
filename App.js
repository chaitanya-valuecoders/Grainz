import React, {Component} from 'react';
import {SafeAreaView, Text} from 'react-native';
import Navigation from './src/navigations';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Navigation />
      </SafeAreaView>
    );
  }
}

export default App;
