import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import styles from './style';
import img from '../../constants/images';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {translate} from '../../utils/translations';

class SubHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisibleInbox: false,
      modalVisibleAdmin: false,
      modalVisibleSetup: false,
      adminArr: [
        {
          name: translate('Sales'),
          screen: 'SalesAdminScreen',
          id: 0,
        },
        {
          name: translate('Inventory Levels'),
          screen: 'InventoryAdminScreen',
          id: 1,
        },
        {
          name: translate('Ordering'),
          screen: 'OrderingAdminScreen',
          id: 2,
        },
        {
          name: translate('Events'),
          screen: 'EventsAdminScreen',
          id: 3,
        },
        {
          name: translate('Reports & Analysis'),
          screen: 'ReportsAdminScreen',
          id: 4,
        },
        {
          name: translate('Account Admin'),
          screen: 'AccountAdminScreen',
          id: 5,
        },
        {
          name: translate('Close'),
          id: 6,
        },
      ],
      setupArr: [
        {
          name: translate('Inventory List'),
          screen: 'InventorySetupScreen',
          id: 0,
        },
        {
          name: translate('Suppliers'),
          screen: 'SupplierScreen',
          id: 1,
        },
        {
          name: translate('Recipes'),
          screen: 'RecipeSetupScreen',
          id: 2,
        },
        {
          name: translate('Menu item'),
          screen: 'MenuItemScreen',
          id: 3,
        },
        {
          name: translate('Menus'),
          screen: 'MenusScreen',
          id: 4,
        },
        {
          name: translate('Close'),
          id: 5,
        },
      ],
    };
  }

  subHeaderFun = (item, index) => {
    if (index === 0) {
      this.props.navigation.navigate('AdminScreen');
    } else if (index === 1) {
      this.props.navigation.navigate('SetupScreen');
    } else {
      this.props.navigation.navigate('InboxScreen');
    }
  };

  render() {
    return (
      <View
        style={{
          height: hp('12%'),
          flexDirection: 'row',
          borderBottomWidth: 0.5,
          borderBottomColor: 'grey',
          alignItems: 'center',
          marginHorizontal: wp('5%'),
        }}>
        {this.props.buttons.map((item, index) => {
          return (
            <View
              key={index}
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => this.subHeaderFun(item, index)}
                style={{
                  height: '55%',
                  width: '85%',
                  backgroundColor: '#9AC33F',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                }}>
                <Text style={{color: 'white', fontFamily: 'Inter-Bold'}}>
                  {item.name}
                </Text>
              </TouchableOpacity>
              <View></View>
            </View>
          );
        })}
      </View>
    );
  }
}

export default SubHeader;
