import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../constants/images';
import SubHeader from '../../components/SubHeader';
import Header from '../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {getMyProfileApi} from '../../connectivity/api';
import {translate} from '../../utils/translations';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {
          name: translate('Stock Take'),
          icon: img.addIcon,
          screen: 'StockTakeScreen',
        },
        {
          name: translate('Mise-en-Place'),
          icon: img.addIcon,
          screen: 'MepScreen',
        },
        // {
        //   name: translate('Recipes'),
        //   icon: img.searchIcon,
        //   screen: 'RecipeScreen',
        // },
        // {
        //   name: translate('Menu-Items'),
        //   icon: img.searchIcon,
        //   screen: 'MenuItemsScreen',
        // },
        {
          name: translate('Manual Log'),
          icon: img.addIcon,
          screen: 'ManualLogScreen',
        },
        // {
        //   name: translate('Deliveries'),
        //   icon: img.addIcon,
        //   screen: 'DeliveriesScreen',
        // },
        {
          name: translate('Casual purchase'),
          icon: img.addIcon,
          screen: 'CasualPurchaseScreen',
        },
        // {name: translate('Events'), icon: img.addIcon, screen: 'EventsScreen'},
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
        {/* <SubHeader /> */}
        <ScrollView
          style={{marginTop: hp('2%'), marginBottom: hp('2%')}}
          showsVerticalScrollIndicator={false}>
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
