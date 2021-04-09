import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import MepScreen from '../screens/Mep';
import MepAdvanceScreen from '../screens/MepAdvance';
import StockTakeScreen from '../screens/StockTake';
import StockTake2Screen from '../screens/StockTake2';
import ManualLogScreen from '../screens/ManualLog';
import MyProfile from '../screens/MyProfile';
import CasualPurchaseScreen from '../screens/CasualPurchase';

const AppNav = createStackNavigator();

export default function AppNavFun() {
  return (
    <AppNav.Navigator headerMode="none">
      <AppNav.Screen name="HomeScreen" component={HomeScreen} />
      <AppNav.Screen name="MepScreen" component={MepScreen} />
      <AppNav.Screen name="MepAdvanceScreen" component={MepAdvanceScreen} />
      <AppNav.Screen name="StockTake2Screen" component={StockTake2Screen} />
      <AppNav.Screen name="ManualLogScreen" component={ManualLogScreen} />
      <AppNav.Screen name="MyProfile" component={MyProfile} />
      <AppNav.Screen name="StockTakeScreen" component={StockTakeScreen} />
      <AppNav.Screen
        name="CasualPurchaseScreen"
        component={CasualPurchaseScreen}
      />
    </AppNav.Navigator>
  );
}
