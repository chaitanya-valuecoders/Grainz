import React, {Component, useState, useEffect} from 'react';
import AppNavFun from './AppNav';
import {ActivityIndicator, View} from 'react-native';
import AuthNavFun from './AuthNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';
import {connect} from 'react-redux';
import {UserTokenAction} from '../redux/actions/UserTokenAction';

const Stack = createStackNavigator();

function HandleNavigation(props) {
  const [token, setToken] = useState('');
  const [bool, setBool] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('@appToken').then(token => {
      if (token === null) {
        setBool(false);
        props.UserTokenAction(null);
      } else {
        setBool(false);
        props.UserTokenAction(token);
      }
    });
  }, []);

  return bool ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator color="#334646" size="large" />
    </View>
  ) : props.UserTokenReducer ? (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="AfterLogin" component={AppNavFun} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="BeforeLogin" component={AuthNavFun} />
    </Stack.Navigator>
  );
}

const mapStateToProps = state => {
  return {
    UserTokenReducer: state.UserTokenReducer,
  };
};

export default connect(mapStateToProps, {UserTokenAction})(HandleNavigation);
