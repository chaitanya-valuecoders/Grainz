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
import StockScreen from '../screens/StockTake/StockScreen';
<<<<<<< HEAD
import SalesAdminScreen from '../screens/Home/Admin/Sales';
import AccountAdminScreen from '../screens/Home/Admin/Account';
import EventsAdminScreen from '../screens/Home/Admin/Events';
import EventsSecAdminScreen from '../screens/Home/Admin/EventsSec';
import InventoryAdminScreen from '../screens/Home/Admin/Inventory';
import OrderingAdminScreen from '../screens/Home/Admin/Ordering';
import OrderingSecAdminScreen from '../screens/Home/Admin/OrderingSec';
import ReportsAdminScreen from '../screens/Home/Admin/Reports';
import StaffAdminScreen from '../screens/Home/Admin/Staff';
import InventorySetupScreen from '../screens/Home/Setup/InventoryList';
import MenuItemSetupScreen from '../screens/Home/Setup/MenuItems';
import MenuSetupScreen from '../screens/Home/Setup/Menus';
import RecipeSetupScreen from '../screens/Home/Setup/Recipes';
import SupplierSetupScreen from '../screens/Home/Setup/Supplier';
=======
import SalesAdminScreen from '../screens/Home/Admin/Sales/Sales';
import AccountAdminScreen from '../screens/Home/Admin/Account/Account';
import EventsAdminScreen from '../screens/Home/Admin/Events/Events';
import EventsSecAdminScreen from '../screens/Home/Admin/Events/EventsSec';
import InventoryAdminScreen from '../screens/Home/Admin/Inventory/Inventory';
import OrderingAdminScreen from '../screens/Home/Admin/Ordering/Ordering';
import OrderingSecAdminScreen from '../screens/Home/Admin/Ordering/OrderingSec';
import OrderingThreeAdminScreen from '../screens/Home/Admin/Ordering/OrderingThree';
import ReportsAdminScreen from '../screens/Home/Admin/Reports/Reports';
import InventorySetupScreen from '../screens/Home/Setup/Inventory/InventorySetup';
import MenuItemScreen from '../screens/Home/Setup/MenuItem/MenuItem';
import MenusScreen from '../screens/Home/Setup/Menus/Menus';
import RecipeSetupScreen from '../screens/Home/Setup/Recipe/Recipe';
import SupplierScreen from '../screens/Home/Setup/Supplier/Supplier';
>>>>>>> 6bf3dd4eeea276944521f74dac0cfcf82a537022

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
      <AppNav.Screen name="StockScreen" component={StockScreen} />
      <AppNav.Screen name="SalesAdminScreen" component={SalesAdminScreen} />
      <AppNav.Screen name="AccountAdminScreen" component={AccountAdminScreen} />
      <AppNav.Screen name="EventsAdminScreen" component={EventsAdminScreen} />
      <AppNav.Screen
        name="EventsSecAdminScreen"
        component={EventsSecAdminScreen}
      />
      <AppNav.Screen
        name="InventoryAdminScreen"
        component={InventoryAdminScreen}
      />
      <AppNav.Screen
        name="OrderingAdminScreen"
        component={OrderingAdminScreen}
      />
      <AppNav.Screen name="ReportsAdminScreen" component={ReportsAdminScreen} />
      <AppNav.Screen
        name="OrderingSecAdminScreen"
        component={OrderingSecAdminScreen}
      />
<<<<<<< HEAD

      <AppNav.Screen
        name="InventorySetupScreen"
        component={InventorySetupScreen}
      />
      <AppNav.Screen
        name="MenuItemSetupScreen"
        component={MenuItemSetupScreen}
      />
      <AppNav.Screen name="MenuSetupScreen" component={MenuSetupScreen} />
      <AppNav.Screen name="RecipeSetupScreen" component={RecipeSetupScreen} />
      <AppNav.Screen
        name="SupplierSetupScreen"
        component={SupplierSetupScreen}
      />
=======
      <AppNav.Screen
        name="OrderingThreeAdminScreen"
        component={OrderingThreeAdminScreen}
      />
      <AppNav.Screen
        name="InventorySetupScreen"
        component={InventorySetupScreen}
      />
      <AppNav.Screen name="MenuItemScreen" component={MenuItemScreen} />
      <AppNav.Screen name="MenusScreen" component={MenusScreen} />
      <AppNav.Screen name="RecipeSetupScreen" component={RecipeSetupScreen} />
      <AppNav.Screen name="SupplierScreen" component={SupplierScreen} />
>>>>>>> 6bf3dd4eeea276944521f74dac0cfcf82a537022
    </AppNav.Navigator>
  );
}
