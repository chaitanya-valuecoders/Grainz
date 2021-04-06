import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import MepScreen from '../screens/Mep';
import StockTakeScreen from '../screens/StockTake';
import StockTake2Screen from '../screens/StockTake2';
import ManualLogScreen from '../screens/ManualLog';
import CasualPurchaseScreen from '../screens/CasualPurchase';

const AppNav = createStackNavigator();

export default function AppNavFun() {
  return (
    <AppNav.Navigator headerMode="none">
      <AppNav.Screen name="HomeScreen" component={HomeScreen} />
      <AppNav.Screen name="MepScreen" component={MepScreen}/>
      <AppNav.Screen name="StockTakeScreen" component={StockTakeScreen}/>
      <AppNav.Screen name="StockTake2Screen" component={StockTake2Screen}/>
      <AppNav.Screen name="ManualLogScreen" component={ManualLogScreen}/>
      <AppNav.Screen name="CasualPurchaseScreen" component={CasualPurchaseScreen}/>
    </AppNav.Navigator>
  );
}
