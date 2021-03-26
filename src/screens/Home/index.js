import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {connect} from 'react-redux';
import img from '../../constants/images';
import SubHeader from '../../components/SubHeader';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {name: 'Stock take', icon: img.addIcon},
        {name: 'MISE-EN-PLACE', icon: img.addIcon},
        {name: 'Recipes', icon: img.searchIcon},
        {name: 'Menu items', icon: img.searchIcon},
        {name: 'Manual log', icon: img.addIcon},
        {name: 'Deliveries', icon: img.addIcon},
        {name: 'Casual purchase', icon: img.addIcon},
        {name: 'Stock take', icon: img.addIcon},
        {name: 'Events', icon: img.addIcon},
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
                flex:1,
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  paddingVertical:'1%',
                  flexDirection: 'row',
                  width: '50%',
                  backgroundColor: '#94C036',
                  justifyContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                }}>
                <View style={{flex: 1}}>
                  <Image
                    source={item.icon}
                    style={{
                      height: 20,
                      width: 20,
                      tintColor: 'white',
                      resizeMode: 'contain',
                    }}
                  />
                </View>
                <View style={{flex: 3}}>
                  <Text style={{color: 'white'}}> {item.name} </Text>
                </View>
              </TouchableOpacity>
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
