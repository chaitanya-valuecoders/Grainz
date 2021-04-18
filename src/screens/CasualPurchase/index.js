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
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../constants/images';
import SubHeader from '../../components/SubHeader';
import Header from '../../components/Header';
import CheckBox from '@react-native-community/checkbox';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {getMyProfileApi, getCasualPurchases} from '../../connectivity/api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

var minTime = new Date();
minTime.setHours(0);
minTime.setMinutes(0);
minTime.setMilliseconds(0);

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [{name: 'New'}],
      token: '',
      modalVisible: false,
      firstName: '',
      casualPurchases: [],
      showNewPurchaseForm: true,
      isDatePickerVisible: false,
      finalDate: '',
      purchaseLines: [1],
      htva: false,
      htvaIsSelected: true,
      auditIsSelected: false,
      note: '',
    };
  }

  getProfileDataFun = async () => {
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

  getCasualPurchasesData() {
    getCasualPurchases()
      .then(res => {
        this.setState({casualPurchases: res.data});
      })
      .catch(err => {
        console.warn('errR', err);
      });
  }

  componentDidMount() {
    this.getProfileDataFun();
    this.getCasualPurchasesData();
  }

  myProfileFun = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    if (item.name === 'Back') {
      this.props.navigation.goBack();
    }
  };

  newCasualPurchase() {
    this.setState({showNewPurchaseForm: !this.state.showNewPurchaseForm});
  }

  hideDatePicker = () => {
    this.setState({
      isDatePickerVisible: false,
    });
  };

  showDatePickerFun = () => {
    this.setState({
      isDatePickerVisible: true,
    });
  };

  addPurchaseLine() {
    let temp = this.state.purchaseLines;
    temp.push(1);
    this.setState({purchaseLines: temp});

    if (temp.length > 5) {
      this.setState({purchaseLines: []});
    }
  }

  deletePurchaseLine() {
    let temp = this.state.purchaseLines;
    temp.pop();
    this.setState({purchaseLines: temp});
  }

  render() {
    const {
      firstName,
      buttons,
      casualPurchases,
      showNewPurchaseForm,
      isDatePickerVisible,
      finalDate,
      purchaseLines,
      htva,
      htvaIsSelected,
      auditIsSelected,
      note,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfileFun}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        <SubHeader />
        <ScrollView style={{marginBottom: hp('5%')}}>
          <View
            style={{
              backgroundColor: '#412916',
              alignItems: 'center',
              paddingVertical: hp('3%'),
            }}>
            <Text style={{fontSize: 22, color: 'white'}}>CASUAL PURCHASE</Text>
            {buttons.map((item, index) => {
              return (
                <View style={{}} key={index}>
                  {showNewPurchaseForm ? (
                    <View>
                      <TouchableOpacity
                        onPress={() => this.newCasualPurchase()}
                        style={{
                          height: hp('6%'),
                          width: wp('70%'),
                          backgroundColor: '#E7943B',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 20,
                        }}>
                        <View style={{}}>
                          <Text style={{color: 'white', marginLeft: 5}}>
                            Back
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View>
                      <TouchableOpacity
                        onPress={() => this.newCasualPurchase()}
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
                  )}
                </View>
              );
            })}
          </View>
          {showNewPurchaseForm ? (
            <View style={{margin: 15}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 3}}>
                  <Text>Date</Text>
                </View>
                <View style={{flex: 4}}>
                  <TouchableOpacity
                    onPress={() => this.showDatePickerFun()}
                    style={{
                      borderWidth: 1,
                      padding: 10,
                      marginBottom: hp('2%'),
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TextInput
                      placeholder="dd-mm-yy"
                      value={finalDate}
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
                </View>
              </View>

              <DateTimePickerModal
                // is24Hour={true}
                isVisible={isDatePickerVisible}
                mode={'date'}
                onConfirm={this.handleConfirm}
                onCancel={this.hideDatePicker}
                minimumDate={minTime}

                // maximumDate={maxTime}
                // minimumDate={new Date()}
              />

              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 3}}>
                  <Text>Supplier</Text>
                </View>
                <View style={{flex: 4}}>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      padding: 10,
                      marginBottom: hp('2%'),
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text>Select Supplier</Text>
                    <Image
                      source={img.arrowDownIcon}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                {purchaseLines.map(item => {
                  return (
                    <View>
                      <View>
                        <View style={{marginLeft: -11}}>
                          <Pressable onPress={() => this.deletePurchaseLine()}>
                            <Image
                              source={img.cancelIcon}
                              style={{
                                width: 20,
                                height: 20,
                                resizeMode: 'contain',
                              }}
                            />
                          </Pressable>
                        </View>
                        <View>
                          <TouchableOpacity
                            style={{
                              marginTop: -9,
                              borderWidth: 1,
                              padding: 10,
                              marginBottom: hp('1%'),
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text>Select</Text>
                            <Image
                              source={img.arrowDownIcon}
                              style={{
                                width: 20,
                                height: 20,
                                resizeMode: 'contain',
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <TextInput
                          placeholder="Quantity"
                          style={{
                            borderWidth: 1,
                            padding: 10,
                            marginBottom: hp('1%'),
                          }}
                        />
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                          <Text>$</Text>
                        </View>
                        <View style={{flex: 15}}>
                          <TextInput
                            placeholder="Price"
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              marginBottom: hp('1%'),
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View>
                <View>
                  <TouchableOpacity
                    onPress={() => this.addPurchaseLine()}
                    style={{
                      height: hp('5%'),
                      width: wp('50%'),
                      backgroundColor: '#94C01F',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          marginLeft: 5,
                        }}>
                        Add line
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{alignItems: 'space-between', margin: 20}}>
                <View>
                  <Text>Total</Text>
                </View>
                <View>
                  <Text>$ 0.00</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text>HTVA?</Text>
                  <CheckBox
                    value={htvaIsSelected}
                    onValueChange={() => this.setState({htva: true})}
                    style={{
                      margin: 5,
                      height: 20,
                      width: 20,
                    }}
                  />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text>Audit Complete</Text>
                  <CheckBox
                    value={auditIsSelected}
                    style={{
                      margin: 5,
                      height: 20,
                      width: 20,
                    }}
                  />
                </View>
              </View>
              <View>
                <TouchableOpacity
                  style={{
                    height: hp('5%'),
                    width: wp('50%'),
                    backgroundColor: '#94C01F',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                  <View style={{}}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        marginLeft: 5,
                      }}>
                      Add Image
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{margin: 15, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={{}}>Note </Text>
                </View>

                <View
                  style={{
                    flex: 6,
                    borderWidth: 1,
                    borderColor: '#A2A2A2',
                    padding: 10,
                  }}>
                  <TextInput
                    style={{height: '14%'}}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={note => this.setState({note})}
                    value={this.state.note}
                  />
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => this.newCasualPurchase()}
                  style={{
                    height: hp('5%'),
                    width: wp('90%'),
                    backgroundColor: '#E7943B',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                    flexDirection: 'row',
                  }}>
                  <View>
                    <Image
                      source={img.cancelIcon}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        tintColor: 'white',
                      }}
                    />
                  </View>
                  <View style={{}}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        marginLeft: 5,
                      }}>
                      Cancel
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  onPress={() => this.newCasualPurchase()}
                  style={{
                    height: hp('5%'),
                    width: wp('90%'),
                    backgroundColor: '#94C01F',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    flexDirection: 'row',
                  }}>
                  <View>
                    <Image
                      source={img.checkIcon}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        tintColor: 'white',
                      }}
                    />
                  </View>
                  <View style={{}}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        marginLeft: 5,
                      }}>
                      Save
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{justifyContent: 'center', padding: 5, margin: 5}}>
              {casualPurchases.map(item => {
                return (
                  <View style={{flexDirection: 'row'}}>
                    <View style={{margin: 5}}>
                      <Text>{item.orderDate}</Text>
                    </View>
                    <View style={{margin: 5}}>
                      <Text>{item.supplierName}</Text>
                    </View>
                    <View style={{margin: 5}}>
                      <Text>{item.htva}</Text>
                    </View>
                  </View>
                );
              })}
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

export default connect(mapStateToProps, {UserTokenAction})(index);
