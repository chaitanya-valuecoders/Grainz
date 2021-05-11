import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import MepScreen from '../screens/Mep';
import MepAdvanceScreen from '../screens/MepAdvance';
import StockTakeScreen from '../screens/StockTake';
import ManualLogScreen from '../screens/ManualLog';
import MyProfile from '../screens/MyProfile';
import CasualPurchaseScreen from '../screens/CasualPurchase';
import RecipeScreen from '../screens/Recipes';
import MenuItemsScreen from '../screens/MenuItems';
import DeliveriesScreen from '../screens/Deliveries';
import EventsScreen from '../screens/Events';
import EditPurchase from '../screens/CasualPurchase/EditPurchase';

const AppNav = createStackNavigator();

export default function AppNavFun() {
  return (
    <AppNav.Navigator headerMode="none">
      <AppNav.Screen name="HomeScreen" component={HomeScreen} />
      <AppNav.Screen name="MepScreen" component={MepScreen} />
      <AppNav.Screen name="MepAdvanceScreen" component={MepAdvanceScreen} />
      <AppNav.Screen name="ManualLogScreen" component={ManualLogScreen} />
      <AppNav.Screen name="MyProfile" component={MyProfile} />
      <AppNav.Screen name="StockTakeScreen" component={StockTakeScreen} />
      <AppNav.Screen
        name="CasualPurchaseScreen"
        component={CasualPurchaseScreen}
      />
      <AppNav.Screen name="RecipeScreen" component={RecipeScreen} />
      <AppNav.Screen name="MenuItemsScreen" component={MenuItemsScreen} />
      <AppNav.Screen name="DeliveriesScreen" component={DeliveriesScreen} />
      <AppNav.Screen name="EventsScreen" component={EventsScreen} />
      <AppNav.Screen name="EditPurchase" component={EditPurchase} />
    </AppNav.Navigator>
  );
}
