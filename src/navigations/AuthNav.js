import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/Login';
import AboutUsScreen from '../screens/AboutUs';

const AuthNav = createStackNavigator();

export default function AuthNavFun() {
  return (
    <AuthNav.Navigator headerMode="none">
      <AuthNav.Screen name="LoginScreen" component={LoginScreen} />
      <AuthNav.Screen name="AboutUsScreen" component={AboutUsScreen} />
    </AuthNav.Navigator>
  );
}
