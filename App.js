import React, {Component} from 'react';
import {SafeAreaView, Text} from 'react-native';
import Navigation from './src/navigations';
import {Provider} from 'react-redux';
import store from './src/redux/reducers';
import {NavigationContainer} from '@react-navigation/native';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer>
          <Provider store={store}>
            <Navigation />
          </Provider>
        </NavigationContainer>
      </SafeAreaView>
    );
  }
}

export default App;
