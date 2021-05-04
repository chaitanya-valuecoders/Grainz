import React, {Component} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import Navigation from './src/navigations';
import {Provider} from 'react-redux';
import store from './src/redux/reducers';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {setI18nConfig, translate} from './src/utils/translations';
import AsyncStorage from '@react-native-async-storage/async-storage';

class App extends Component {
  constructor(props) {
    super(props);
    this.setLanguage();
    this.state = {
      language: '',
    };
  }

  async componentDidMount() {
    SplashScreen.hide();
    await this.setLanguage();
  }

  setLanguage = async () => {
    const lang = await AsyncStorage.getItem('Language');
    if (lang !== null && lang !== undefined) {
      this.setState({
        language: lang,
      });
      setI18nConfig();
    } else {
      await AsyncStorage.setItem('Language', 'en');
      this.setState({
        language: 'en',
      });
      setI18nConfig();
    }
  };

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
