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
  FlatList,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../../../../constants/images';
import SubHeader from '../../../../../components/SubHeader';
import Header from '../../../../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../../../../redux/actions/UserTokenAction';
import {
  getMyProfileApi,
  getSupplierListAdminApi,
  getCurrentLocUsersAdminApi,
  clonePreviousApi,
} from '../../../../../connectivity/api';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styles from '../style';

import {translate} from '../../../../../utils/translations';

class NewOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      modalVisible: false,
      firstName: '',
      recipeLoader: false,
      pageLoading: false,
      selectedItemObjects: '',
      buttonsSubHeader: [],
      supplierValue: '',
      finalOrderDate: '',
      isDatePickerVisibleOrderDate: false,
      finalDeliveryDate: '',
      placedByValue: '',
      supplierList: [],
      usersList: [],
      clonePreviouseModalStatus: false,
      cloneLoader: false,
      cloneOrderData: [],
      sentValue: 'No',
      apiDeliveryDate: '',
      apiOrderDate: '',
    };
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@appToken');
      if (value !== null) {
        this.setState(
          {
            token: value,
            recipeLoader: true,
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

          buttonsSubHeader: [
            {name: translate('ADMIN')},
            {name: translate('Setup')},
            {name: translate('INBOX')},
          ],
        });
      })
      .catch(err => {
        console.warn('ERr', err);
      });
  };

  componentDidMount() {
    this.getData();
    this.getSupplierListData();
    this.getUsersListData();
  }

  getUsersListData = () => {
    getCurrentLocUsersAdminApi()
      .then(res => {
        const {data} = res;
        let finalUsersList = data.map((item, index) => {
          return {
            label: item.firstName,
            value: item.id,
          };
        });
        this.setState({
          usersList: finalUsersList,
          recipeLoader: false,
        });
      })
      .catch(err => {
        console.log('ERR', err);
      });
  };

  getSupplierListData = () => {
    getSupplierListAdminApi()
      .then(res => {
        const {data} = res;
        let finalSupplierList = data.map((item, index) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.setState({
          supplierList: finalSupplierList,
          recipeLoader: false,
        });
      })
      .catch(err => {
        console.log('ERR', err);
      });
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  cloneFun = item => {
    const {supplierValue} = this.state;
    if (supplierValue) {
      this.setState(
        {
          clonePreviouseModalStatus: true,
          cloneLoader: true,
        },
        () => this.hitCloneApi(),
      );
    } else {
      alert('Please select supplier first');
    }
  };

  hitCloneApi = () => {
    const {supplierValue} = this.state;
    clonePreviousApi(supplierValue)
      .then(res => {
        this.setState({
          cloneLoader: false,
          cloneOrderData: res.data,
        });
      })
      .catch(err => {
        this.setState({
          cloneLoader: false,
        });
        console.warn('errClone', err);
      });
  };

  handleConfirmOrderDate = date => {
    console.log('date', date);
    let newdate = moment(date).format('MM/DD/YYYY');
    let apiOrderDate = date.toISOString();
    this.setState({
      finalOrderDate: newdate,
      apiOrderDate,
    });
    this.hideDatePickerOrderDate();
  };

  hideDatePickerOrderDate = () => {
    this.setState({
      isDatePickerVisibleOrderDate: false,
    });
  };

  handleConfirmDeliveryDate = date => {
    console.log('date', date);
    let newdate = moment(date).format('MM/DD/YYYY');
    let apiDeliveryDate = date.toISOString();
    this.setState({
      finalDeliveryDate: newdate,
      apiDeliveryDate,
    });
    this.hideDatePickerDeliveryDate();
  };

  hideDatePickerDeliveryDate = () => {
    this.setState({
      isDatePickerVisibleDeliveryDate: false,
    });
  };

  showDatePickerOrderDate = () => {
    this.setState({
      isDatePickerVisibleOrderDate: true,
    });
  };

  showDatePickerDeliveryDate = () => {
    this.setState({
      isDatePickerVisibleDeliveryDate: true,
    });
  };

  setModalVisibleFalse = visible => {
    this.setState({
      clonePreviouseModalStatus: visible,
    });
  };

  addItemsFun = () => {
    const {supplierValue, apiDeliveryDate, apiOrderDate, placedByValue} =
      this.state;
    if (supplierValue && apiDeliveryDate && apiOrderDate && placedByValue) {
      this.props.navigation.navigate('AddItemsOrderScreen', {
        supplierValue,
        apiDeliveryDate,
        apiOrderDate,
        placedByValue,
      });
    } else {
      alert('Please select all fields');
    }
  };

  render() {
    const {
      recipeLoader,
      pageLoading,
      firstName,
      buttonsSubHeader,
      supplierValue,
      finalOrderDate,
      isDatePickerVisibleOrderDate,
      isDatePickerVisibleDeliveryDate,
      finalDeliveryDate,
      placedByValue,
      supplierList,
      usersList,
      clonePreviouseModalStatus,
      cloneLoader,
      cloneOrderData,
      sentValue,
    } = this.state;

    return (
      <View style={styles.container}>
        <Header
          logout={firstName}
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {recipeLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} index={0} />
        )}
        <ScrollView
          style={{marginBottom: hp('2%')}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            <View style={styles.firstContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.adminTextStyle}>
                  {translate('New Order')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => this.cloneFun()}
            style={{
              flexDirection: 'row',
              height: hp('6%'),
              width: wp('80%'),
              backgroundColor: '#94C036',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: hp('2%'),
              alignSelf: 'center',
              borderRadius: 100,
            }}>
            <View style={{}}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Inter-SemiBold',
                  fontSize: 15,
                }}>
                {translate('Clone previous')}
              </Text>
            </View>
          </TouchableOpacity>

          {pageLoading ? (
            <ActivityIndicator color="#94C036" size="large" />
          ) : (
            <View style={{marginHorizontal: wp('3%')}}>
              <View>
                <View
                  style={{
                    marginTop: hp('2%'),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: wp('90%'),
                      backgroundColor: '#fff',
                      paddingVertical: Platform.OS === 'ios' ? 15 : 5,
                      borderRadius: 5,
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        width: wp('80%'),
                        alignSelf: 'center',
                        justifyContent: 'center',
                      }}>
                      <RNPickerSelect
                        placeholder={{
                          label: 'Select supplier*',
                          value: null,
                          color: 'black',
                        }}
                        placeholderTextColor="red"
                        onValueChange={value => {
                          this.setState({
                            supplierValue: value,
                          });
                        }}
                        style={{
                          inputIOS: {
                            fontSize: 14,
                            paddingHorizontal: '3%',
                            color: '#161C27',
                            width: '100%',
                            alignSelf: 'center',
                          },
                          inputAndroid: {
                            fontSize: 14,
                            paddingHorizontal: '3%',
                            color: '#161C27',
                            width: '100%',
                            alignSelf: 'center',
                          },
                          iconContainer: {
                            top: '40%',
                          },
                        }}
                        items={supplierList}
                        value={supplierValue}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>
                    <View style={{marginRight: wp('5%')}}>
                      <Image
                        source={img.arrowDownIcon}
                        resizeMode="contain"
                        style={{
                          height: 18,
                          width: 18,
                          resizeMode: 'contain',
                          marginTop: Platform.OS === 'ios' ? 0 : 15,
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: hp('3%'),
                  }}>
                  <View style={{}}>
                    <TouchableOpacity
                      onPress={() => this.showDatePickerOrderDate()}
                      style={{
                        width: wp('90%'),
                        padding: Platform.OS === 'ios' ? 15 : 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: '#fff',
                        borderRadius: 5,
                      }}>
                      <TextInput
                        placeholder="Order Date"
                        value={finalOrderDate}
                        editable={false}
                      />
                      <Image
                        source={img.calenderIcon}
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: 'contain',
                          marginTop: Platform.OS === 'android' ? 15 : 0,
                          marginRight: Platform.OS === 'android' ? 15 : 0,
                        }}
                      />
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisibleOrderDate}
                      mode={'date'}
                      onConfirm={this.handleConfirmOrderDate}
                      onCancel={this.hideDatePickerOrderDate}
                    />
                  </View>
                </View>
                <View
                  style={{
                    marginTop: hp('3%'),
                  }}>
                  <View style={{}}>
                    <TouchableOpacity
                      onPress={() => this.showDatePickerDeliveryDate()}
                      style={{
                        width: wp('90%'),
                        padding: Platform.OS === 'ios' ? 15 : 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: '#fff',
                        borderRadius: 5,
                      }}>
                      <TextInput
                        placeholder="Delivery Date"
                        value={finalDeliveryDate}
                        editable={false}
                      />
                      <Image
                        source={img.calenderIcon}
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: 'contain',
                          marginTop: Platform.OS === 'android' ? 15 : 0,
                          marginRight: Platform.OS === 'android' ? 15 : 0,
                        }}
                      />
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisibleDeliveryDate}
                      mode={'date'}
                      onConfirm={this.handleConfirmDeliveryDate}
                      onCancel={this.hideDatePickerDeliveryDate}
                    />
                  </View>
                </View>
              </View>
              <View>
                <View
                  style={{
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: wp('90%'),
                      backgroundColor: '#fff',
                      paddingVertical: Platform.OS === 'ios' ? 15 : 5,
                      borderRadius: 5,
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        width: wp('80%'),
                        alignSelf: 'center',
                        justifyContent: 'center',
                      }}>
                      <RNPickerSelect
                        placeholder={{
                          label: 'Select placed by*',
                          value: null,
                          color: 'grey',
                        }}
                        onValueChange={value => {
                          this.setState({
                            placedByValue: value,
                          });
                        }}
                        style={{
                          inputIOS: {
                            fontSize: 14,
                            paddingHorizontal: '3%',
                            color: '#161C27',
                            width: '100%',
                            alignSelf: 'center',
                          },
                          inputAndroid: {
                            fontSize: 14,
                            paddingHorizontal: '3%',
                            color: '#161C27',
                            width: '100%',
                            alignSelf: 'center',
                          },
                          iconContainer: {
                            top: '40%',
                          },
                        }}
                        items={usersList}
                        value={placedByValue}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>
                    <View style={{marginRight: wp('5%')}}>
                      <Image
                        source={img.arrowDownIcon}
                        resizeMode="contain"
                        style={{
                          height: 20,
                          width: 20,
                          marginTop: Platform.OS === 'ios' ? 0 : 15,
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: hp('3%'),
                  }}>
                  <View style={{}}>
                    <TextInput
                      editable={false}
                      value={sentValue}
                      placeholder="Sent"
                      style={{
                        width: wp('90%'),
                        padding: 15,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: '#fff',
                        borderRadius: 5,
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
          <Modal isVisible={clonePreviouseModalStatus} backdropOpacity={0.35}>
            <View
              style={{
                width: wp('80%'),
                height: hp('70%'),
                backgroundColor: '#F0F4FE',
                alignSelf: 'center',
                borderRadius: 6,
              }}>
              <View
                style={{
                  backgroundColor: '#83AB2F',
                  height: hp('6%'),
                  flexDirection: 'row',
                  borderTopRightRadius: 6,
                  borderTopLeftRadius: 6,
                }}>
                <View
                  style={{
                    flex: 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#fff',
                      fontFamily: 'Inter-Regular',
                    }}>
                    {translate('Previous order item')}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => this.setModalVisibleFalse(false)}>
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

              <ScrollView showsVerticalScrollIndicator={false}>
                {cloneLoader ? (
                  <ActivityIndicator color="grey" size="large" />
                ) : (
                  <View style={{marginTop: hp('2%')}}>
                    {cloneOrderData.length > 0 ? (
                      <View>
                        {cloneOrderData.map(item => {
                          return (
                            <View style={{marginLeft: wp('5%')}}>
                              <Text
                                style={{
                                  marginVertical: hp('2%'),
                                  color: '#151B26',
                                  fontFamily: 'Inter-Regular',
                                }}>
                                {moment(item.orderDate).format('LL')}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    ) : (
                      <View
                        style={{
                          marginTop: hp('5%'),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 20, color: 'red'}}>
                          No data available
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>
              <View style={{alignSelf: 'center'}}>
                <TouchableOpacity
                  onPress={() => this.setModalVisibleFalse(false)}
                  style={{
                    height: hp('6%'),
                    width: wp('70%'),
                    backgroundColor: '#E7943B',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                    borderRadius: 100,
                  }}>
                  <View style={{}}>
                    <Text style={{color: 'white', marginLeft: 5}}>Close</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => this.addItemsFun()}
              style={{
                height: hp('6%'),
                width: wp('80%'),
                backgroundColor: '#94C036',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: hp('3%'),
                borderRadius: 100,
                marginBottom: hp('5%'),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={img.addIcon}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: '#fff',
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    color: 'white',
                    marginLeft: 10,
                    fontFamily: 'Inter-SemiBold',
                  }}>
                  Add items
                </Text>
              </View>
            </TouchableOpacity>
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

export default connect(mapStateToProps, {UserTokenAction})(NewOrder);
