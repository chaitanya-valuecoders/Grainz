import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
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
import Modal from 'react-native-modal';
import moment from 'moment';

import {translate, setI18nConfig} from '../../utils/translations';

var minTime = new Date();
minTime.setHours(0);
minTime.setMinutes(0);
minTime.setMilliseconds(0);

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [],
      token: '',
      modalVisibleAdmin: false,
      modalVisibleSetup: false,
      modalVisibleInbox: false,
      firstName: '',
      buttonsSubHeader: [],
      loader: true,
      adminArr: [],
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
          loader: false,
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
              name: translate('Manual Log small'),
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
          buttonsSubHeader: [
            {name: translate('ADMIN')},
            {name: translate('Setup')},
            {name: translate('INBOX')},
          ],
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
              name: translate('Staff Costs'),
              screen: 'StaffAdminScreen',
              id: 4,
            },
            {
              name: translate('Reports & Analysis'),
              screen: 'ReportsAdminScreen',
              id: 5,
            },
            {
              name: translate('Account Admin'),
              screen: 'AccountAdminScreen',
              id: 6,
            },
            {
              name: translate('Back'),
              id: 7,
            },
          ],
        });
      })
      .catch(err => {
        console.warn('ERr', err.response);
        this.setState({
          loader: false,
          buttons: [
            {
              name: translate('Sales'),
              icon: img.addIcon,
              screen: 'StockTakeScreen',
            },
            {
              name: translate('Mise-en-Place'),
              icon: img.addIcon,
              screen: 'MepScreen',
            },
            {
              name: translate('Recipes'),
              icon: img.searchIcon,
              screen: 'RecipeScreen',
            },
            {
              name: translate('Menu-Items'),
              icon: img.searchIcon,
              screen: 'MenuItemsScreen',
            },
            {
              name: translate('Manual Log small'),
              icon: img.addIcon,
              screen: 'ManualLogScreen',
            },
            {
              name: translate('Deliveries'),
              icon: img.addIcon,
              screen: 'DeliveriesScreen',
            },
            {
              name: translate('Casual purchase'),
              icon: img.addIcon,
              screen: 'CasualPurchaseScreen',
            },
          ],
          buttonsSubHeader: [
            {name: translate('ADMIN')},
            {name: translate('Setup')},
            {name: translate('INBOX')},
          ],
        });
        Alert.alert('Grainz', 'Session Timeout', [
          {text: 'OK', onPress: () => this.removeToken()},
        ]);
      });
  };

  removeToken = async () => {
    await AsyncStorage.removeItem('@appToken');
    this.props.UserTokenAction(null);
  };

  componentDidMount() {
    this.getData();
    this.setLanguage();
  }

  setLanguage = async () => {
    setI18nConfig();
    const lang = await AsyncStorage.getItem('Language');
    if (lang !== null && lang !== undefined) {
      setI18nConfig();
    } else {
      await AsyncStorage.setItem('Language', 'en');
      setI18nConfig();
    }
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    this.props.navigation.navigate(item.screen);
  };

  setAdminModalVisible = visible => {
    this.setState({
      modalVisibleAdmin: visible,
      modalVisibleInbox: visible,
      modalVisibleSetup: visible,
    });
  };

  subHeaderFun = (item, index) => {
    if (index === 0) {
      this.setState({modalVisibleAdmin: true});
    } else if (index === 1) {
      this.setState({modalVisibleSetup: true});
    } else {
      this.setState({modalVisibleInbox: true});
    }
  };

  adminModalFun = (item, index) => {
    if (item.id === 7) {
      this.setAdminModalVisible(false);
    } else if (item.id === 0) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('SalesAdminScreen');
      }, 300);
    } else if (item.id === 1) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('InventoryAdminScreen');
      }, 300);
    } else if (item.id === 2) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('OrderingAdminScreen');
      }, 300);
    } else if (item.id === 3) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('EventsAdminScreen');
      }, 300);
    } else if (item.id === 4) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('StaffAdminScreen');
      }, 300);
    } else if (item.id === 5) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('ReportsAdminScreen');
      }, 300);
    } else if (item.id === 6) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('AccountAdminScreen');
      }, 300);
    }
  };

  render() {
    const {
      modalVisibleAdmin,
      firstName,
      buttons,
      buttonsSubHeader,
      loader,
      modalVisibleInbox,
      modalVisibleSetup,
      adminArr,
    } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {loader ? (
          <ActivityIndicator size="large" color="grey" />
        ) : (
          <SubHeader
            buttons={buttonsSubHeader}
            onPressSubHeader={(item, index) => this.subHeaderFun(item, index)}
          />
        )}
        <ScrollView
          style={{marginBottom: hp('5%')}}
          showsVerticalScrollIndicator={false}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {buttons.map((item, index) => {
              return (
                <View style={{}} key={index}>
                  <TouchableOpacity
                    onPress={() => this.onPressFun(item)}
                    style={{
                      flexDirection: 'row',
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor: '#94C036',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Image
                        source={item.icon}
                        style={{
                          height: 22,
                          width: 22,
                          tintColor: 'white',
                          resizeMode: 'contain',
                          marginLeft: 15,
                        }}
                      />
                    </View>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View>
                    {/* // Admin Modal */}
                    <Modal isVisible={modalVisibleAdmin} backdropOpacity={0.35}>
                      <View
                        style={{
                          width: wp('80%'),
                          height: hp('80%'),
                          backgroundColor: '#fff',
                          alignSelf: 'center',
                        }}>
                        <View
                          style={{
                            backgroundColor: '#412916',
                            height: hp('7%'),
                            flexDirection: 'row',
                          }}>
                          <View
                            style={{
                              flex: 3,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Text style={{fontSize: 16, color: '#fff'}}>
                              {translate('ADMIN')}
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() => this.setAdminModalVisible(false)}>
                              <Image
                                source={img.cancelIcon}
                                style={{
                                  height: 22,
                                  width: 22,
                                  tintColor: 'white',
                                  resizeMode: 'contain',
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <ScrollView
                          style={{marginBottom: hp('2%')}}
                          showsVerticalScrollIndicator={false}>
                          <View
                            style={{
                              padding: hp('3%'),
                            }}>
                            {adminArr && adminArr.length > 0 ? (
                              <View style={{}}>
                                {adminArr.map((item, index) => {
                                  return (
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.adminModalFun(item, index)
                                      }
                                      style={{
                                        height: hp('7%'),
                                        width: wp('70%'),
                                        backgroundColor: '#EEEEEE',
                                        alignSelf: 'center',
                                        marginTop: hp('1.8%'),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}>
                                      <Text style={{fontSize: 16}}>
                                        {item.name}
                                      </Text>
                                    </TouchableOpacity>
                                  );
                                })}
                              </View>
                            ) : null}
                          </View>
                        </ScrollView>
                      </View>
                    </Modal>
                    {/* SetUp Modal */}
                    <Modal isVisible={modalVisibleSetup} backdropOpacity={0.35}>
                      <View
                        style={{
                          width: wp('80%'),
                          height: hp('80%'),
                          backgroundColor: '#fff',
                          alignSelf: 'center',
                        }}>
                        <View
                          style={{
                            backgroundColor: '#412916',
                            height: hp('7%'),
                            flexDirection: 'row',
                          }}>
                          <View
                            style={{
                              flex: 3,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Text style={{fontSize: 16, color: '#fff'}}>
                              {translate('Setup')}
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() => this.setAdminModalVisible(false)}>
                              <Image
                                source={img.cancelIcon}
                                style={{
                                  height: 22,
                                  width: 22,
                                  tintColor: 'white',
                                  resizeMode: 'contain',
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <ScrollView style={{marginBottom: hp('2%')}}>
                          <View
                            style={{
                              padding: hp('3%'),
                            }}>
                            <View style={{}}>
                              <TouchableOpacity
                                style={{
                                  height: hp('5%'),
                                  width: wp('50%'),
                                  backgroundColor: '#94C036',
                                  alignSelf: 'center',
                                  marginTop: hp('5%'),
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <Text style={{color: '#fff', fontSize: 16}}>
                                  {translate('Collapse All')}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </ScrollView>
                      </View>
                    </Modal>
                    {/* INBOX MODAL  */}
                    <Modal isVisible={modalVisibleInbox} backdropOpacity={0.35}>
                      <View
                        style={{
                          width: wp('80%'),
                          height: hp('80%'),
                          backgroundColor: '#fff',
                          alignSelf: 'center',
                        }}>
                        <View
                          style={{
                            backgroundColor: '#412916',
                            height: hp('7%'),
                            flexDirection: 'row',
                          }}>
                          <View
                            style={{
                              flex: 3,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Text style={{fontSize: 16, color: '#fff'}}>
                              {translate('INBOX')}
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() => this.setAdminModalVisible(false)}>
                              <Image
                                source={img.cancelIcon}
                                style={{
                                  height: 22,
                                  width: 22,
                                  tintColor: 'white',
                                  resizeMode: 'contain',
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <ScrollView style={{marginBottom: hp('2%')}}>
                          <View
                            style={{
                              padding: hp('3%'),
                            }}>
                            <View style={{}}>
                              <TouchableOpacity
                                style={{
                                  height: hp('5%'),
                                  width: wp('50%'),
                                  backgroundColor: '#94C036',
                                  alignSelf: 'center',
                                  marginTop: hp('5%'),
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <Text style={{color: '#fff', fontSize: 16}}>
                                  {translate('Collapse All')}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </ScrollView>
                      </View>
                    </Modal>
                  </View>
                </View>
              );
            })}
          </View>
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
