import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../constants/images';
import SubHeader from '../../components/SubHeader';
import MepScreen from '../Mep';
import Header from '../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {getMyProfileApi} from '../../connectivity/api';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {name: 'Stock take', icon: img.addIcon, screen: 'StockTakeScreen'},
        {name: 'MISE-EN-PLACE', icon: img.addIcon, screen: 'MepScreen'},
        {name: 'Recipes', icon: img.searchIcon, screen: 'MepScreen'},
        {name: 'Menu items', icon: img.searchIcon, screen: 'MepScreen'},
        {name: 'Manual log', icon: img.addIcon, screen: 'MepScreen'},
        {name: 'Deliveries', icon: img.addIcon, screen: 'MepScreen'},
        {
          name: 'Casual purchase',
          icon: img.addIcon,
          screen: 'CasualPurchaseScreen',
        },
        {name: 'Stock take', icon: img.addIcon, screen: 'MepScreen'},
        {name: 'Events', icon: img.addIcon, screen: 'MepScreen'},
      ],
      token: '',
      firstName: '',
    };
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@appToken');
      if (value !== null) {
        this.setState(
          {
            token: value,
          },
          () => this.getProfileData(),
        );
      }
    } catch (e) {
      console.warn('ErrHome', e);
    }
  };

  getProfileData = () => {
    getMyProfileApi()
      .then(res => {
        this.setState({
          firstName: res.data.firstName,
        });
      })
      .catch(err => {
        console.warn('ERr', err);
      });
  };

  componentDidMount() {
    this.getData();
  }

  removeToken = async () => {
    await AsyncStorage.removeItem('@appToken');
    this.props.UserTokenAction(null);
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={this.state.firstName}
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        <SubHeader />
        <ScrollView style={{marginTop: hp('2%'), marginBottom: hp('2%')}}>
          {this.state.buttons.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  flex: 1,
                }}>
                <View
                  style={{
                    marginTop: hp('1%'),
                    flex: 1,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate(item.screen)}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#94C036',
                      marginHorizontal: wp('10%'),
                      alignItems: 'center',
                      paddingVertical: hp('1%'),
                      marginVertical: hp('1%'),
                    }}>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                      }}>
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
                    <View style={{flex: 4}}>
                      <Text style={{color: 'white', fontSize: 18}}>
                        {' '}
                        {item.name}{' '}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    UserTokenReducer: state.UserTokenReducer,
    GetMyProfileReducer: state.GetMyProfileReducer,
  };
};

export default connect(mapStateToProps, {UserTokenAction})(index);
