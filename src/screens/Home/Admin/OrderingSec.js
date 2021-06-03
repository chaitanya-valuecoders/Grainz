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
import img from '../../../constants/images';
import SubHeader from '../../../components/SubHeader';
import Header from '../../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../../redux/actions/UserTokenAction';
import {getMyProfileApi} from '../../../connectivity/api';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {translate} from '../../../utils/translations';

class OrderingSec extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {name: translate('Clone previous'), id: 0},
        {name: translate('Back'), id: 1},
        {name: translate('Save'), id: 2},
        {name: translate('Send'), id: 3},
      ],
      token: '',
      modalVisible: false,
      firstName: '',
      recipeLoader: false,
      pageLoading: false,
      selectedItemObjects: '',
      buttonsSubHeader: [],
      accountName: '',
      businessName: '',
      url: '',
      mainAddress: '',
      contractSigned: '',
      isActive: '',
      tcsAccepted: '',
      updateLoader: false,
      supplierValue: '',
      finalOrderDate: '',
      isDatePickerVisibleOrderDate: false,
      finalDeliveryDate: '',
      placedByValue: '',
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
          recipeLoader: false,
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
  }

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    if (item.id === 0) {
      alert('Clone previous');
    } else if (item.id === 1) {
      this.props.navigation.goBack();
    } else if (item.id === 2) {
      alert('Save');
    } else {
      alert('Send');
    }
  };

  handleConfirmOrderDate = date => {
    console.log('date', date);
    let newdate = moment(date).format('MM/DD/YYYY');
    this.setState({
      finalOrderDate: newdate,
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
    this.setState({
      finalDeliveryDate: newdate,
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

  render() {
    const {
      recipeLoader,
      pageLoading,
      firstName,
      buttons,
      buttonsSubHeader,
      accountName,
      businessName,
      url,
      streetAddress,
      town,
      supplierValue,
      finalOrderDate,
      isDatePickerVisibleOrderDate,
      isDatePickerVisibleDeliveryDate,
      finalDeliveryDate,
      placedByValue,
    } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {recipeLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )}
        <ScrollView
          style={{marginBottom: hp('5%')}}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: '#412916',
              alignItems: 'center',
              paddingVertical: hp('3%'),
            }}>
            <Text style={{fontSize: 22, color: 'white'}}>
              {translate('New Order').toLocaleUpperCase()}
            </Text>
            {buttons.map((item, index) => {
              return (
                <View style={{}} key={index}>
                  <TouchableOpacity
                    onPress={() => this.onPressFun(item)}
                    style={{
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {pageLoading ? (
            <ActivityIndicator color="#94C036" size="large" />
          ) : (
            <View style={{marginTop: hp('3%'), marginHorizontal: wp('5%')}}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Supplier: </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: wp('50%'),
                      backgroundColor: '#fff',
                      marginLeft: 10,
                      paddingVertical: 11,
                      borderWidth: 1,
                    }}>
                    <View
                      style={{
                        width: wp('42%'),
                        alignSelf: 'center',
                        justifyContent: 'center',
                      }}>
                      <RNPickerSelect
                        placeholder={{
                          label: 'Select supplier*',
                          value: null,
                          color: 'grey',
                        }}
                        onValueChange={value => {
                          this.setState({
                            supplierValue: value,
                          });
                        }}
                        style={{
                          inputIOS: {
                            fontSize: 14,
                            paddingHorizontal: '3%',
                            color: 'grey',
                            width: '100%',
                            alignSelf: 'center',
                          },
                          inputAndroid: {
                            fontSize: 14,
                            paddingHorizontal: '3%',
                            color: 'grey',
                            width: '100%',
                            alignSelf: 'center',
                          },
                          iconContainer: {
                            top: '40%',
                          },
                        }}
                        items={[{label: 'testing', value: 'testing'}]}
                        value={supplierValue}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>
                    <View style={{}}>
                      <Image
                        source={img.arrowDownIcon}
                        resizeMode="contain"
                        style={{height: 20, width: 20}}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Order Date: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TouchableOpacity
                      onPress={() => this.showDatePickerOrderDate()}
                      style={{
                        width: wp('50%'),
                        borderWidth: 1,
                        padding: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TextInput
                        placeholder="dd-mm-yy"
                        value={finalOrderDate}
                        editable={false}
                      />
                      <Image
                        source={img.calenderIcon}
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: 'contain',
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
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Delivery date: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TouchableOpacity
                      onPress={() => this.showDatePickerDeliveryDate()}
                      style={{
                        width: wp('50%'),
                        borderWidth: 1,
                        padding: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TextInput
                        placeholder="dd-mm-yy"
                        value={finalDeliveryDate}
                        editable={false}
                      />
                      <Image
                        source={img.calenderIcon}
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: 'contain',
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
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Placed by: </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: wp('50%'),
                      backgroundColor: '#fff',
                      marginLeft: 10,
                      paddingVertical: 11,
                      borderWidth: 1,
                    }}>
                    <View
                      style={{
                        width: wp('42%'),
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
                            color: 'grey',
                            width: '100%',
                            alignSelf: 'center',
                          },
                          inputAndroid: {
                            fontSize: 14,
                            paddingHorizontal: '3%',
                            color: 'grey',
                            width: '100%',
                            alignSelf: 'center',
                          },
                          iconContainer: {
                            top: '40%',
                          },
                        }}
                        items={[
                          {label: 'placedByValue', value: 'placedByValue'},
                        ]}
                        value={placedByValue}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>
                    <View style={{}}>
                      <Image
                        source={img.arrowDownIcon}
                        resizeMode="contain"
                        style={{height: 20, width: 20}}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Sent: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TextInput
                      editable={false}
                      value={town}
                      placeholder="Sent"
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        width: wp('50%'),
                      }}
                      onChangeText={value =>
                        this.setState({
                          town: value,
                        })
                      }
                    />
                  </View>
                </View>
              </View>
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                    <View style={{flexDirection: 'row', marginTop: hp('3%')}}>
                      <View style={{width: wp('40%')}}>
                        <Text>Inventory item</Text>
                      </View>
                      <View style={{width: wp('40%')}}>
                        <Text>Quantity</Text>
                      </View>
                      <View style={{width: wp('40%')}}>
                        <Text>$HTVA</Text>
                      </View>
                    </View>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: hp('3%'),
                        }}>
                        <View style={{width: wp('40%')}}>
                          <Text>Total HTVA: </Text>
                        </View>
                        {/* <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View> */}
                      </View>
                    </View>
                  </View>
                </ScrollView>
                <View style={{alignSelf: 'center', marginVertical: hp('3%')}}>
                  <Text>Order from :</Text>
                </View>
                <View style={{alignSelf: 'center'}}>
                  <TouchableOpacity
                    onPress={() => alert('Inventory List')}
                    style={{
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>
                        Inventory List
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{alignSelf: 'center'}}>
                  <TouchableOpacity
                    onPress={() => alert(' Supplier catalog')}
                    style={{
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>
                        Supplier catalog
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{alignSelf: 'center'}}>
                  <TouchableOpacity
                    onPress={() => alert('Save draft')}
                    style={{
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>
                        Save draft
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{alignSelf: 'center'}}>
                  <TouchableOpacity
                    onPress={() => alert('Send')}
                    style={{
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>Send</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{alignSelf: 'center'}}>
                  <TouchableOpacity
                    onPress={() => alert('View')}
                    style={{
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>View</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
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

export default connect(mapStateToProps, {UserTokenAction})(OrderingSec);
