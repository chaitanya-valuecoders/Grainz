import React, {Component} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import Navigation from './src/navigations';
import {Provider} from 'react-redux';
import store from './src/redux/reducers';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar
          animated={true}
          backgroundColor="#fff"
          barStyle="dark-content"
        />
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
