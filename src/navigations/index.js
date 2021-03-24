import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/Login';
import AboutUsScreen from '../screens/AboutUs';
import HomeScreen from '../screens/Home';

const Stack = createStackNavigator();

const navigatorOptions = {
  headerShown: false,
};

class Navigation extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={navigatorOptions}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Navigation;
