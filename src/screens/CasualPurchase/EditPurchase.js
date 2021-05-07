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
import DropDownPicker from 'react-native-dropdown-picker';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
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
  deleteOrderApi,
  updateOrderApi,
  getOrderByIdApi,
  getInventoryByIdApi,
  getInventoryListApi,
} from '../../connectivity/api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {translate} from '../../utils/translations';

var minTime = new Date();
minTime.setHours(0);
minTime.setMinutes(0);
minTime.setMilliseconds(0);

let list = [];
let total = 0;

class EditPurchase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      modalVisible: false,
      firstName: '',
      casualPurchases: [],
      isDatePickerVisible: false,
      finalDate: '',
      productionDate: '',
      purchaseLines: [0],
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
      supplierId: '',
      supplieReference: '',
      itemsTypesArr: [],
      departmentName: '',
      loading: false,
      items: [],
      selectedItems: [],
      selectedItemObjects: '',
      yourOrderItems: [
        {
          name: null,
          departmentName: null,
          action: null,
          id: null,
          inventoryId: null,
          inventoryProductMappingId: null,
          isCorrect: null,
          notes: null,
          position: null,
          quantityOrdered: null,
          tdcVolume: null,
          unitId: null,
          unitPrice: null,
        },
      ],
      newOrderItems: [],
      departmentName: '',
      testItem: null,
      orderTotal: null,
      photo: null,
      editDataLoader: true,
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
    const {route} = this.props;
    const order = route.params.orderData;
    this.showEditCasualPurchase(order);
  }

  myProfileFun = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    if (item.name === 'Back') {
      this.props.navigation.goBack();
    }
  };

  showEditCasualPurchase(order) {
    total = 0;
    this.getOrderById(order.id);
    this.setState({
      supplier: order.supplierName,
      yourOrder: order,

      departmentName: order.departmentName,
    });
    list = [];

    // this.getInventoryList('9df266dc-bf87-454e-b678-21c14647a23d');
  }

  getOrderById(id) {
    getOrderByIdApi(id)
      .then(res => {
        this.setState({yourOrder: res.data});
        // console.warn(res.data.orderItems);
        res.data.orderItems.map(item => {
          // this.getInventoryList(item.id);
          this.getItem(item.inventoryId, item);
        });
      })
      .catch(error => console.warn(error));
  }

  getItem(id, item) {
    let obj = {};
    getInventoryByIdApi(id)
      .then(res => {
        total = total + item.orderValue;
        obj = {
          name: res.data.name,
          departmentName: res.data.departmentName,
          quantityOrdered:
            item.quantityOrdered && item.quantityOrdered.toString(),
          unitPrice: item.unitPrice && item.unitPrice.toString(),
        };
        list.push(obj);
        this.setState({orderTotal: total});
        this.setState({yourOrderItems: list, editDataLoader: false});
      })
      .catch(error => console.warn('invIdError', error));
  }

  addItemLine() {
    let obj = {
      name: 'Select',
      departmentName: 'Select',
      quantityOrdered: null,
      unitPrice: null,
    };

    list.push(obj);
    this.setState({yourOrderitems: list});
  }

  showCasualPurchases() {
    this.setState({
      editDisabled: true,
      editColor: '#E9ECEF',
      swapButton: false,
    });
  }

  editCasualPurchase() {
    this.setState({
      editDisabled: false,
      editColor: '#FFFFFF',
      swapButton: true,
    });
  }

  createUpdatedOrder() {
    console.warn(this.state.selectedItemObjects);
  }

  updateCasualPurchase(updatedOrder) {
    let payload = {
      id: 'b0fc7c8e-2f19-4254-b2d4-7dbdd373fba8',
      supplierId: '61c4df4d-8b48-4090-98a1-5d222e09a8b0',
      isAuditComplete: false,
      orderDate: '2021-04-24T15:25:35.303Z',
      notes: '',
      orderItems: [
        {
          action: 'Update',
          id: '185454da-4e14-4b06-9a01-fccc998b144f',
          inventoryId: '9414590d-dc62-4219-82c9-9b0ee2a16a7f',
          inventoryProductMappingId: '',
          isCorrect: false,
          notes: '',
          position: 1,
          quantityOrdered: 100,
          tdcVolume: 0,
          unitId: '01470493-50b7-4ebc-a3e7-8fafd6d7c85c',
          unitPrice: 10,
        },
      ],
      images: [],
      // images: [
      //   {
      //     id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      //     description: 'string',
      //     position: 0,
      //     type: 'string',
      //     imageText: 'string',
      //     action: 'string',
      //     name: 'string',
      //   },
      // ],
    };

    console.log('PAYLOAD', payload);

    updateOrderApi(payload)
      .then(res => {
        Alert.alert('Grainz', 'Order updated successfully', [
          {text: 'OK', onPress: () => this.goBackFun()},
        ]);
      })
      .catch(error => {
        console.warn('updateFailed', error.response);
      });
  }

  deleteCasualPurchase(param) {
    Alert.alert('Are you sure?', "You won't be able to revert this!", [
      {
        text: 'Cancel',
        onPress: () => this.showCasualPurchases(),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => this.deleteFun(param),
      },
    ]);
  }

  deleteFun = param => {
    deleteOrderApi(param)
      .then(res => {
        this.showCasualPurchases();
        Alert.alert('Grainz', 'Order deleted successfully', [
          {
            text: 'Okay',
            onPress: () => this.goBackFun(),
          },
        ]);
      })
      .catch(error => {
        console.warn('DELETEerror', error.response);
      });
  };

  handleConfirm = date => {
    let newdate = moment(date).format('L');
    this.setState({
      finalDate: newdate,
      productionDate: date,
    });

    this.hideDatePicker();
  };

  handleChoosePhoto() {
    alert('Phots');
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
    let obj = {
      name: null,
      departmentName: null,
      action: null,
      id: null,
      inventoryId: null,
      inventoryProductMappingId: null,
      isCorrect: null,
      notes: null,
      position: null,
      quantityOrdered: null,
      tdcVolume: null,
      unitId: null,
      unitPrice: null,
    };
    let temp = this.state.purchaseLines;
    let temp2 = [];
    temp.push(temp[temp.length - 1] + 1);
    this.setState({purchaseLines: temp});

    for (i = 0; i < temp.length; i++) {
      temp2.push(obj);
    }

    this.setState({yourOrderItems: temp2});
  }

  deletePurchaseLine() {
    let temp = this.state.purchaseLines;
    temp.pop();
    this.setState({purchaseLines: temp});
  }

  showSupplierList() {
    this.setState({showSuppliers: !this.state.showSuppliers});
  }

  selectSupplier(param, id, ref) {
    this.setState({supplier: param, supplierId: id, supplieReference: ref});
    this.showSupplierList();
  }

  reverseList() {
    let temp = this.state.casualPurchases.reverse();
    this.setState({casualPurchases: temp});
  }

  selectDepartementNameFun = item => {
    this.setState(
      {
        departmentName: item.value,
        loading: true,
        viewStatus: true,
      },
      () => this.getManualData(),
    );
  };

  getManualData = () => {
    // this.getRecipesTypesData();
    this.getItemListData();
  };

  // getRecipesTypesData = () => {
  //   getManualLogTypes()
  //     .then(res => {
  //       console.warn('RES', res);
  //       const {data} = res;
  //       let newData = [];
  //       data.map(item => {
  //         const obj = {};
  //         obj.label = item.name;
  //         obj.value = item.id;
  //         newData = [...newData, obj];
  //       });
  //       this.setState({
  //         itemsTypesArr: newData,
  //       });
  //     })
  //     .catch(err => {
  //       console.warn('Err', err);
  //     });
  // };

  getItemListData = () => {
    const {departmentName} = this.state;
    getInventoryListApi()
      .then(res => {
        const {data} = res;
        let firstArr = data.filter(item => {
          return item.departmentName === departmentName;
        });

        function groupByKey(array, key) {
          return array.reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, {
              [obj[key]]: (hash[obj[key]] || []).concat(obj),
            });
          }, {});
        }

        let groupedCategory = groupByKey(firstArr, 'categoryName');

        let finalArray = Object.keys(groupedCategory).map((item, index) => {
          return {
            name: item,
            id: item,
            children: groupedCategory[item],
          };
        });

        this.setState({
          items: [...finalArray],
          loading: false,
        });
      })
      .catch(err => {
        console.warn('GETITEMSErr', err.response);
      });
  };

  filterData(array) {
    const restArray = array.filter(
      item => item.departmentName === 'Restaurant',
    );
    restArray.sort();
    const barArray = array.filter(item => item.departmentName === 'Bar');
    barArray.sort();
    const otherArray = array.filter(item => item.departmentName === 'Other');
    otherArray.sort();
    const retailArray = array.filter(item => item.departmentName === 'Retail');
    retailArray.sort();
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems});
  };

  onSelectedItemObjectsChange = selectedItemObjects => {
    this.setState({selectedItemObjects});
    let temp = [];
    temp.push(selectedItemObjects[0]);
    // console.warn('temp', temp);
    this.setState({newOrderItems: temp});
    // this.setState({selectedItemObjects : ''})
    // console.warn('slctdobjcts', selectedItemObjects);
  };

  goBackFun = () => {
    this.props.navigation.goBack();
  };

  render() {
    const {
      firstName,
      buttons,
      casualPurchases,
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
      items,
      notes,
      loading,
      departmentName,
      itemsTypesArr,
      selectedItemObjects,
      testItem,
      yourOrderItems,
      orderTotal,
      photo,
      newOrderItems,
      editDataLoader,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfileFun}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {/* <SubHeader /> */}
        <ScrollView style={{marginBottom: hp('2%')}}>
          <View
            style={{
              backgroundColor: '#412916',
              alignItems: 'center',
              paddingVertical: hp('3%'),
            }}>
            <Text style={{fontSize: 22, color: 'white'}}>
              CASUAL PURCHASE TITLE
            </Text>

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
                      marginTop: 10,
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
                        {translate('Delete')}
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
                      marginTop: 10,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        source={img.editIcon}
                        style={{}}
                        style={{
                          width: 15,
                          height: 15,
                          resizeMode: 'contain',
                          tintColor: 'white',
                          marginRight: 5,
                        }}
                      />
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                        }}>
                        Edit
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              <View>
                <TouchableOpacity
                  onPress={() => this.goBackFun()}
                  style={{
                    paddingVertical: '3%',
                    width: wp('70%'),
                    backgroundColor: '#E7943B',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                  <View style={{}}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                      }}>
                      {translate('Back')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {editDataLoader ? (
            <ActivityIndicator color="grey" size="large" />
          ) : (
            <View style={{marginHorizontal: wp('6%'), marginTop: hp('5%')}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 3}}>
                  <Text>{translate('Date')}:</Text>
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
                      placeholder={moment(yourOrder.orderDate).format(
                        'MM/DD/YYYY',
                      )}
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

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 3}}>
                  <Text>{translate('Supplier')}:</Text>
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
              <View style={{flex: 2}}>
                {showSuppliers ? (
                  <View
                    style={{
                      width: wp('85%'),
                      alignItems: 'center',
                      borderWidth: 0.5,
                      marginTop: hp('2%'),
                    }}>
                    {supplierList.map(item => {
                      return (
                        <View style={{marginVertical: 5, borderBottomWidth: 1}}>
                          <Pressable
                            disabled={editDisabled}
                            onPress={() =>
                              this.selectSupplier(
                                item.name,
                                item.id,
                                item.reference,
                              )
                            }>
                            <Text>{item.name}</Text>
                          </Pressable>
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </View>
              <View>
                {yourOrderItems.map(ele => {
                  return (
                    <View style={{marginBottom: hp('6%')}}>
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
                        <View style={{marginTop: -7}}>
                          <View>
                            <DropDownPicker
                              disabled={editDisabled}
                              defaultValue={ele.departmentName}
                              items={[
                                {
                                  label: 'Bar',
                                  value: 'Bar',
                                },
                                {
                                  label: 'Restaurant',
                                  value: 'Restaurant',
                                },
                                {
                                  label: 'Retail',
                                  value: 'Retail',
                                },
                                {
                                  label: 'Other',
                                  value: 'Other',
                                },
                              ]}
                              zIndex={1000000}
                              containerStyle={{
                                height: 50,
                                marginBottom: hp('1%'),
                              }}
                              style={{
                                backgroundColor: editColor,
                                borderColor: 'black',
                              }}
                              itemStyle={{
                                justifyContent: 'flex-start',
                              }}
                              dropDownStyle={{backgroundColor: '#fff'}}
                              onChangeItem={item =>
                                this.selectDepartementNameFun(item)
                              }
                            />
                            <SectionedMultiSelect
                              disabled={editDisabled}
                              styles={{
                                container: {
                                  paddingTop: hp('2%'),
                                  marginTop: hp('7%'),
                                },
                                selectToggle: {
                                  backgroundColor: editColor,
                                  borderWidth: 1,
                                  paddingVertical: 10,
                                  paddingHorizontal: 5,
                                },
                              }}
                              loadingComponent={
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <ActivityIndicator
                                    size="large"
                                    color="#94C036"
                                  />
                                </View>
                              }
                              loading={this.state.loading}
                              // hideSearch={true}
                              single={true}
                              items={items}
                              IconRenderer={Icon}
                              uniqueKey="id"
                              subKey="children"
                              selectText={ele.name}
                              showDropDowns={true}
                              readOnlyHeadings={true}
                              onSelectedItemObjectsChange={
                                this.onSelectedItemObjectsChange
                              }
                              onSelectedItemsChange={this.onSelectedItemsChange}
                              selectedItems={this.state.selectedItems}
                            />

                            <View>
                              <TextInput
                                placeholder="Quantity"
                                style={{
                                  backgroundColor: editColor,
                                  borderWidth: 1,
                                  padding: 10,
                                  marginBottom: hp('1%'),
                                  marginTop: hp('1%'),
                                }}
                                onChangeText={value => {
                                  // let y = yourOrderItems
                                  // let x = yourOrderItems[ele];
                                  // x.quantityOrdered = value;
                                  // y[ele] = x
                                }}
                                value={ele.quantityOrdered}
                              />
                            </View>
                            <View style={{flexDirection: 'row'}}>
                              <View style={{flex: 1}}>
                                <Text>$</Text>
                              </View>
                              <View style={{flex: 15}}>
                                <TextInput
                                  placeholder={ele.unitPrice}
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
                          {translate('Add line')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={{alignItems: 'space-between', margin: 20}}>
                <View>
                  <Text>{translate('Total')}</Text>
                </View>
                <View>
                  <Text>$ {orderTotal}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text>{translate('HTVA')}?</Text>
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
                  <Text>{translate('Audit Complete')}</Text>
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
                    onPress={() => this.handleChoosePhoto()}
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
                        {translate('Add image')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              <View style={{margin: 15, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={{}}>{translate('Note')} </Text>
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
                  onPress={() => this.goBackFun()}
                  style={{
                    paddingVertical: '2%',
                    width: wp('90%'),
                    backgroundColor: '#E7943B',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                    flexDirection: 'row',
                  }}>
                  {editDisabled ? null : (
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
                  )}
                  <View style={{}}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        marginLeft: 5,
                      }}>
                      {editDisabled ? translate('Back') : translate('Cancel')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {editDisabled ? null : (
                <View>
                  <TouchableOpacity
                    onPress={() => this.updateCasualPurchase()}
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
                        {translate('Save')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
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

export default connect(mapStateToProps, {UserTokenAction})(EditPurchase);