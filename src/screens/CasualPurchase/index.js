// import React, {Component} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   ActivityIndicator,
//   Switch,
//   TextInput,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {connect} from 'react-redux';
// import img from '../../constants/images';
// import SubHeader from '../../components/SubHeader';
// import Header from '../../components/Header';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {UserTokenAction} from '../../redux/actions/UserTokenAction';
// import {getMyProfileApi} from '../../connectivity/api';

// var minTime = new Date();
// minTime.setHours(0);
// minTime.setMinutes(0);
// minTime.setMilliseconds(0);

// class index extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       buttons: [{name: 'Back'}],
//       token: '',
//       modalVisible: false,
//       firstName: '',
//     };
//   }

//   getProfileDataFun = async () => {
//     try {
//       const value = await AsyncStorage.getItem('@appToken');
//       if (value !== null) {
//         this.setState(
//           {
//             token: value,
//           },
//           () => this.getProfileData(),
//         );
//       }
//     } catch (e) {
//       console.warn('ErrHome', e);
//     }
//   };

//   getProfileData = () => {
//     getMyProfileApi()
//       .then(res => {
//         this.setState({
//           firstName: res.data.firstName,
//         });
//       })
//       .catch(err => {
//         console.warn('ERr', err);
//       });
//   };

//   componentDidMount() {
//     this.getProfileDataFun();
//   }

//   myProfileFun = () => {
//     this.props.navigation.navigate('MyProfile');
//   };

//   onPressFun = item => {
//     if (item.name === 'Back') {
//       this.props.navigation.goBack();
//     }
//   };

//   render() {
//     const {firstName, buttons} = this.state;
//     return (
//       <View style={{flex: 1, backgroundColor: '#fff'}}>
//         <Header
//           logout={firstName}
//           logoutFun={this.myProfileFun}
//           logoFun={() => this.props.navigation.navigate('HomeScreen')}
//         />
//         <SubHeader />
//         <ScrollView style={{marginBottom: hp('5%')}}>
//           <View
//             style={{
//               backgroundColor: '#412916',
//               alignItems: 'center',
//               paddingVertical: hp('3%'),
//             }}>
//             <Text style={{fontSize: 22, color: 'white'}}>CASUAL PURCHASE</Text>
//             {buttons.map((item, index) => {
//               return (
//                 <View style={{}} key={index}>
//                   <TouchableOpacity
//                     onPress={() => this.onPressFun(item)}
//                     style={{
//                       height: hp('6%'),
//                       width: wp('70%'),
//                       backgroundColor: '#94C036',
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       marginTop: 20,
//                     }}>
//                     <View style={{}}>
//                       <Text style={{color: 'white', marginLeft: 5}}>
//                         {item.name}
//                       </Text>
//                     </View>
//                   </TouchableOpacity>
//                 </View>
//               );
//             })}
//           </View>
//           <View style={{justifyContent: 'center', alignItems: 'center'}}>
//             <Text> Work in progress</Text>
//           </View>
//         </ScrollView>
//       </View>
//     );
//   }
// }

// const mapStateToProps = state => {
//   return {
//     UserTokenReducer: state.UserTokenReducer,
//     GetMyProfileReducer: state.GetMyProfileReducer,
//   };
// };

// export default connect(mapStateToProps, {UserTokenAction})(index);

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
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../constants/images';
import SubHeader from '../../components/SubHeader';
import Header from '../../components/Header';
import CheckBox from '@react-native-community/checkbox';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {
  getMyProfileApi,
  getCasualPurchasesApi,
  getSupplierListApi,
  addOrderApi,
  deleteOrderApi,
} from '../../connectivity/api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

var minTime = new Date();
minTime.setHours(0);
minTime.setMinutes(0);
minTime.setMilliseconds(0);

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      modalVisible: false,
      firstName: '',
      casualPurchases: [],
      showPurchaseList: true,
      showNewPurchaseForm: false,
      showEditPurchaseForm: false,
      isDatePickerVisible: false,
      finalDate: '',
      purchaseLines: [1],
      htva: false,
      htvaIsSelected: true,
      auditIsSelected: false,
      note: '',
      supplierList: [],
      object: {
        date: '',
        supplier: '',
        items: [{name: '', quantity: null, price: null}],
      },
      showSuppliers: false,
      supplier: 'Select Supplier',
      editDisabled: true,
      editColor: '#E9ECEF',
      swapButton: false,
      yourOrder: {},
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
    getCasualPurchasesApi()
      .then(res => {
        this.setState({casualPurchases: res.data});
      })
      .catch(err => {
        console.warn('errR', err);
      });
  }

  getSupplierListData() {
    getSupplierListApi()
      .then(res => {
        this.setState({supplierList: res.data});
      })
      .catch(error => {
        console.warn('erro', error);
      });
  }

  componentDidMount() {
    this.getProfileDataFun();
    this.getCasualPurchasesData();
    this.getSupplierListData();
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
    this.setState({showNewPurchaseForm: true});
    this.setState({showEditPurchaseForm: false});
    this.setState({showPurchaseList: false});
  }

  showEditCasualPurchase(order) {
    this.setState({
      showEditPurchaseForm: true,
      showNewPurchaseForm: false,
      showPurchaseList: false,
      yourOrder: order,
      supplier: order.supplierName,
    });
  }

  showCasualPurchases() {
    this.setState({
      showPurchaseList: true,
      showNewPurchaseForm: false,
      showEditPurchaseForm: false,
    });
  }

  editCasualPurchase() {
    this.setState({
      editDisabled: false,
      editColor: '#FFFFFF',
      swapButton: true,
    });
  }

  deleteCasualPurchase(param) {
    Alert.alert('Are you sure?', "You won't be able to revert this!", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () =>
          deleteOrderApi('a3bbce88-0be9-4256-b2aa-c7175918f120')
            .then(this.getCasualPurchasesData())
            .catch(error => {
              console.warn('error', error.response);
            }),
      },
    ]);
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

  addCasualPurchase() {
    let payload = {
      supplierId: '62af8215-e861-4e40-958d-ff2f56bc8a2e',
      orderDate: '2021-04-18T16:39:59.042Z',
      ambientTemp: 0,
      chilledTemp: 0,
      customerReference: '',
      deliveredDate: '',
      deliveryDate: '',
      frozenTemp: 0,
      images: [],
      invoiceNumber: '',
      isAuditComplete: false,
      isPlaced: false,
      isTDC: true,
      notes: 'test',
      orderDate: '2021-04-18T16:39:59.042Z',
      orderItems: [
        {
          action: 'New',
          id: '',
          inventoryId: '9414590d-dc62-4219-82c9-9b0ee2a16a7f',
          inventoryProductMappingId: '',
          isCorrect: false,
          notes: '',
          position: 1,
          quantityOrdered: 12,
          tdcVolume: 0,
          unitId: '01470493-50b7-4ebc-a3e7-8fafd6d7c85c',
          unitPrice: 3,
        },
      ],
      placedBy: '',
      supplieReference: '',
    };

    addOrderApi(payload)
      .then(() => {
        this.getCasualPurchasesData();
      })
      .catch(error => {
        console.warn('addfailed', error);
      });

    this.showCasualPurchases();
  }

  showSupplierList() {
    this.setState({showSuppliers: !this.state.showSuppliers});
  }

  selectSupplier(param) {
    this.setState({supplier: param});
    this.showSupplierList();
  }

  reverseList() {
    let temp = this.state.casualPurchases.reverse();
    this.setState({casualPurchases: temp});
  }

  render() {
    const {
      firstName,
      buttons,
      casualPurchases,
      showPurchaseList,
      showNewPurchaseForm,
      showEditPurchaseForm,
      isDatePickerVisible,
      finalDate,
      purchaseLines,
      htva,
      htvaIsSelected,
      auditIsSelected,
      note,
      showSuppliers,
      supplierList,
      supplier,
      editDisabled,
      editColor,
      swapButton,
      yourOrder,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfileFun}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        <SubHeader />
        <ScrollView style={{paddingBottom: '50%'}}>
          <View
            style={{
              backgroundColor: '#412916',
              alignItems: 'center',
              paddingVertical: hp('3%'),
            }}>
            <Text style={{fontSize: 22, color: 'white'}}>CASUAL PURCHASE</Text>
            <View style={{}} key={index}>
              {showPurchaseList ? (
                <View>
                  <TouchableOpacity
                    onPress={() => this.newCasualPurchase()}
                    style={{
                      paddingVertical: '3%',
                      width: wp('70%'),
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>New</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            {showEditPurchaseForm ? (
              <View>
                {swapButton ? (
                  <View>
                    <TouchableOpacity
                      onPress={() => this.deleteCasualPurchase(yourOrder.id)}
                      style={{
                        paddingVertical: '3%',
                        width: wp('70%'),
                        backgroundColor: '#FF2121',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20,
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          source={img.cancelIcon}
                          style={{}}
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                            tintColor: 'white',
                          }}
                        />
                        <Text style={{color: 'white', marginLeft: 5}}>
                          Delete
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity
                      onPress={() => this.editCasualPurchase()}
                      style={{
                        paddingVertical: '3%',
                        width: wp('70%'),
                        backgroundColor: '#94C036',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20,
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          source={img.editIcon}
                          style={{}}
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                            tintColor: 'white',
                          }}
                        />
                        <Text style={{color: 'white', marginLeft: 5}}>
                          Edit
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                <View>
                  <TouchableOpacity
                    onPress={() => this.showCasualPurchases()}
                    style={{
                      paddingVertical: '3%',
                      width: wp('70%'),
                      backgroundColor: '#E7943B',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>Back</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
            {showNewPurchaseForm ? (
              <View>
                <TouchableOpacity
                  onPress={() => this.showCasualPurchases()}
                  style={{
                    paddingVertical: '3%',
                    width: wp('70%'),
                    backgroundColor: '#E7943B',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                  <View style={{}}>
                    <Text style={{color: 'white', marginLeft: 5}}>Back</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          {showEditPurchaseForm ? (
            <View style={{margin: 15}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 3}}>
                  <Text>Date</Text>
                </View>
                <View style={{flex: 4}}>
                  <TouchableOpacity
                    disabled={editDisabled}
                    onPress={() => this.showDatePickerFun()}
                    style={{
                      backgroundColor: editColor,
                      borderWidth: 1,
                      padding: 10,
                      marginBottom: hp('2%'),
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TextInput
                      placeholder={yourOrder.orderDate}
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
                    disabled={editDisabled}
                    onPress={() => this.showSupplierList()}
                    style={{
                      backgroundColor: editColor,
                      borderWidth: 1,
                      padding: 10,
                      marginBottom: hp('2%'),
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text>{supplier}</Text>
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
              <View style={{}}>
                {showSuppliers ? (
                  <ScrollView style={{}}>
                    <View style={{alignItems: 'space-between', margin: 10}}>
                      {supplierList.map(item => {
                        return (
                          <View>
                            <Pressable
                              disabled={editDisabled}
                              onPress={() => this.selectSupplier(item.name)}>
                              <Text>{item.name}</Text>
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>
                  </ScrollView>
                ) : null}
              </View>
              <View>
                {purchaseLines.map(item => {
                  return (
                    <View>
                      <View>
                        <View style={{marginLeft: -11}}>
                          <Pressable
                            disabled={editDisabled}
                            onPress={() => this.deletePurchaseLine()}>
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
                            disabled={editDisabled}
                            style={{
                              backgroundColor: editColor,
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
                            backgroundColor: editColor,
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
                              backgroundColor: editColor,
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
                {editDisabled ? null : (
                  <View>
                    <TouchableOpacity
                      disabled={editDisabled}
                      onPress={() => this.addPurchaseLine()}
                      style={{
                        paddingVertical: 10,
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
                )}
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
                    disabled={editDisabled}
                    value={htvaIsSelected}
                    onValueChange={() => this.setState({htva: true})}
                    style={{
                      backgroundColor: editColor,
                      margin: 5,
                      height: 20,
                      width: 20,
                    }}
                  />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text>Audit Complete</Text>
                  <CheckBox
                    disabled={editDisabled}
                    value={auditIsSelected}
                    style={{
                      backgroundColor: editColor,
                      margin: 5,
                      height: 20,
                      width: 20,
                    }}
                  />
                </View>
              </View>
              {editDisabled ? null : (
                <View>
                  <TouchableOpacity
                    style={{
                      paddingVertical: 10,
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
              )}

              <View style={{margin: 15, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={{}}>Note </Text>
                </View>
                <View
                  style={{
                    flex: 6,
                    borderWidth: 1,
                    borderColor: '#A2A2A2',
                  }}>
                  <TextInput
                    style={{
                      backgroundColor: editColor,
                      paddingVertical: '40%',
                    }}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={note => this.setState({note})}
                    value={this.state.note}
                  />
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => this.showCasualPurchases()}
                  style={{
                    paddingVertical: '2%',
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
            </View>
          ) : null}
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
                    onPress={() => this.showSupplierList()}
                    style={{
                      borderWidth: 1,
                      padding: 10,
                      marginBottom: hp('2%'),
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text>{supplier}</Text>
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
              <View style={{}}>
                {showSuppliers ? (
                  <ScrollView style={{}}>
                    <View style={{alignItems: 'space-between', margin: 10}}>
                      {supplierList.map(item => {
                        return (
                          <View>
                            <Pressable
                              onPress={() => this.selectSupplier(item.name)}>
                              <Text>{item.name}</Text>
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>
                  </ScrollView>
                ) : null}
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
                      paddingVertical: 10,
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
                    paddingVertical: 10,
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
                    style={{paddingVertical: '40%'}}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={note => this.setState({note})}
                    value={this.state.note}
                  />
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => this.showCasualPurchases()}
                  style={{
                    paddingVertical: '2%',
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
                  onPress={() => this.addCasualPurchase()}
                  style={{
                    paddingVertical: '2%',
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
          ) : null}
          {showPurchaseList ? (
            <View style={{justifyContent: 'center', padding: 5, margin: 5}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'row', padding: 10}}>
                  <Pressable onPress={() => this.reverseList()}>
                    <Image
                      style={{
                        width: 15,
                        height: 15,
                        resizeMode: 'contain',
                      }}
                      source={img.doubleArrowIcon}
                    />
                  </Pressable>
                  <Text>Date</Text>
                </View>
                <View style={{flexDirection: 'row', padding: 10}}>
                  <Pressable>
                    <Image
                      style={{
                        width: 15,
                        height: 15,
                        resizeMode: 'contain',
                      }}
                      source={img.doubleArrowIcon}
                    />
                  </Pressable>
                  <Text>Supplier</Text>
                </View>
                <View style={{flexDirection: 'row', padding: 10}}>
                  <Pressable>
                    <Image
                      style={{
                        width: 15,
                        height: 15,
                        resizeMode: 'contain',
                      }}
                      source={img.doubleArrowIcon}
                    />
                  </Pressable>

                  <Text>$ Total HTVA</Text>
                </View>
              </View>
              {casualPurchases.map(item => {
                const date = moment(item.orderDate).format('MM/DD/YYYY');
                const price = Math.round(item.htva);
                return (
                  <View>
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() => this.showEditCasualPurchase(item)}>
                      <View style={{margin: 5}}>
                        <Text>{date}</Text>
                      </View>
                      <View style={{margin: 5}}>
                        <Text>{item.supplierName}</Text>
                      </View>
                      <View style={{margin: 5}}>
                        <Text>${price}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ) : null}
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
