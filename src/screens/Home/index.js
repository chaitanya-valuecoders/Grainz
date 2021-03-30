import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {connect} from 'react-redux';
import img from '../../constants/images';
import SubHeader from '../../components/SubHeader';
import MepScreen from '../Mep';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {name: 'Stock take', icon: img.addIcon, screen: 'StockTakeScreen'},
        {name: 'MISE-EN-PLACE', icon: img.addIcon, screen: 'MepScreen'},
        {name: 'Recipes', icon: img.searchIcon, screen: 'MepScreen'},
        {name: 'Menu items', icon: img.searchIcon, screen: 'MepScreen'},
        {name: 'Manual log', icon: img.addIcon, screen: 'ManualLogScreen'},
        {name: 'Deliveries', icon: img.addIcon, screen: 'MepScreen'},
        {name: 'Casual purchase', icon: img.addIcon, screen: 'MepScreen'},
        {name: 'Stock take', icon: img.addIcon, screen: 'MepScreen'},
        {name: 'Events', icon: img.addIcon, screen: 'MepScreen'},
      ],
    };
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@appToken');
      if (value !== null) {
        console.log('VAL', value);
      }
    } catch (e) {
      console.warn('ErrHome', e);
    }
  };

  componentDidMount() {
    this.getData();
  }

  removeToken = async () => {
    await AsyncStorage.removeItem('@appToken');
    this.props.UserTokenAction(null);
  };

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <SubHeader />

        {this.state.buttons.map(item => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                borderBottomColor: 'red',
              }}>
              <View style={{marginTop : 6, backgroundColor: '', flex:1, width : '150%'}}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate(item.screen)}
                  style={{
                    paddingVertical: '1%',
                    flexDirection: 'row',
                    width: '50%',
                    backgroundColor: '#94C036',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 6,
                  }}>
                  <View style={{flex: 1}}>
                    <Image
                      source={item.icon}
                      style={{
                        height: 35,
                        width: 35,
                        tintColor: 'white',
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                  <View style={{flex: 3}}>
                    <Text style={{color: 'white', fontSize:18}}> {item.name} </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    UserTokenReducer: state.UserTokenReducer,
  };
};

export default connect(mapStateToProps, {UserTokenAction})(index);
