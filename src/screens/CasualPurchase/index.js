import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
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
  addOrderApi,
  getInventoryListApi,
} from '../../connectivity/api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'react-native-image-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {translate} from '../../utils/translations';
import ImagePicker from 'react-native-image-crop-picker';

var minTime = new Date();
minTime.setHours(0);
minTime.setMinutes(0);
minTime.setMilliseconds(0);

let list = [];

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      firstName: '',
      casualPurchases: [],
      showPurchaseList: true,
      isDatePickerVisible: false,
      finalDate: '',
      productionDate: '',
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
      supplierId: '',
      supplieReference: '',
      departmentName: '',
      loading: false,
      items: [],
      selectedItems: [],
      selectedItemObjects: '',
      departmentName: '',
      testItem: null,
      photo: null,
      casualListLoader: false,
      supplierListLoader: false,
      orderItemsFinal: [],
      arrayObjPosition: 1,
      quantityValue: '',
      price: '',
      orderTotal: 0,
      saveLoader: false,
      saveTouchableStatus: false,
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
    this.setState(
      {
        casualListLoader: true,
      },
      () =>
        getCasualPurchasesApi()
          .then(res => {
            this.setState({casualPurchases: res.data, casualListLoader: false});
          })
          .catch(err => {
            this.setState({casualListLoader: false});
            console.warn('errR', err);
          }),
    );
  }

  getSupplierListData() {
    this.setState(
      {
        supplierListLoader: true,
      },
      () =>
        getSupplierListApi()
          .then(res => {
            this.setState({supplierList: res.data, supplierListLoader: false});
          })
          .catch(error => {
            this.setState({supplierListLoader: false});
            console.warn('erro', error);
          }),
    );
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getCasualPurchasesData();
    });
    this.getProfileDataFun();
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
    this.setState(
      {
        showPurchaseList: false,
        casualPurchases: [],
        orderItemsFinal: [],
      },
      () => this.getSupplierListData(),
    );
  }

  navigateToEditFun(order) {
    this.props.navigation.navigate('EditPurchase', {
      orderData: order,
    });
  }

  showCasualPurchases() {
    this.setState(
      {
        showPurchaseList: true,
        saveLoader: false,
        saveTouchableStatus: false,
      },
      () => this.getCasualPurchasesData(),
    );
  }

  handleConfirm = date => {
    let newdate = moment(date).format('L');
    this.setState({
      finalDate: newdate,
      productionDate: date,
    });

    this.hideDatePicker();
  };

  handleChoosePhoto() {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
    });
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

  addNewPurchaseLine() {
    const {selectedItemObjects} = this.state;

    let firstArray = [];
    firstArray.push(selectedItemObjects);
    console.warn('frist array', firstArray)

    // let obj = {
    //   name: null,
    //   departmentName: null,
    //   action: null,
    //   id: null,
    //   inventoryId: null,
    //   inventoryProductMappingId: null,
    //   isCorrect: null,
    //   notes: null,
    //   position: null,
    //   quantityOrdered: null,
    //   tdcVolume: null,
    //   unitId: null,
    //   unitPrice: null,
    // };
    // let temp = [];
    // temp.push(obj);
    // this.setState({newOrderItems});
  }

  addPurchaseLine() {
    const {
      quantityValue,
      price,
      arrayObjPosition,
      selectedItemObjects,
      orderItemsFinal,
      orderTotal,
    } = this.state;
    const unitIdFinal =
      selectedItemObjects[0] && selectedItemObjects[0].units[0].id;
    let obj = {
      action: 'New',
      id: '',
      inventoryId: selectedItemObjects[0].id,
      inventoryProductMappingId: '',
      isCorrect: false,
      notes: '',
      position: arrayObjPosition,
      quantityOrdered: quantityValue,
      tdcVolume: 0,
      unitId: unitIdFinal,
      unitPrice: price,
      name: selectedItemObjects[0].name,
    };
    if (quantityValue === '' || price === '') {
      alert('Please fill all values');
    } else {
      let arrayData = [];

      arrayData.push(obj);

      const finalTotal = parseInt(orderTotal) + parseInt(price);

      this.setState({
        quantityValue: '',
        price: '',
        orderItemsFinal: [...orderItemsFinal, ...arrayData],
        arrayObjPosition: arrayObjPosition + 1,
        orderTotal: finalTotal,
      });
    }

    this.setState({yourOrderItems: temp2});
    // console.warn( this.state.yourOrderItems);
    // console.warn( this.state.purchaseLines);
  }

  deletePurchaseLine(item, index) {
    let temp = this.state.orderItemsFinal;
    // temp.pop();
    temp.splice(index, 1);
    this.setState({orderItemsFinal: temp});
  }

  createOrder() {
    const {
      productionDate,
      note,
      supplierId,
      supplieReference,
      htvaIsSelected,
      auditIsSelected,
      orderItemsFinal,
    } = this.state;

    let payload = {
      supplierId: supplierId,
      orderDate: productionDate,
      ambientTemp: 0,
      chilledTemp: 0,
      customerReference: '',
      deliveredDate: '',
      deliveryDate: '',
      frozenTemp: 0,
      images: [
        {
          action: 'New',
          description: 'Desc',
          id: null,
          imageText: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAno',
          name: 'Handshake',
          type: 'png',
        },
      ],
      invoiceNumber: 0,
      isAuditComplete: auditIsSelected,
      isPlaced: false,
      isTDC: htvaIsSelected,
      notes: note,
      orderDate: productionDate,
      orderItems: orderItemsFinal,
      placedBy: '',
      supplieReference: '',
    };

    if (orderItemsFinal.length === 0) {
      alert('Please enter values first');
    } else {
      this.setState(
        {
          saveLoader: true,
          saveTouchableStatus: true,
        },
        () =>
          addOrderApi(payload)
            .then(res => {
              Alert.alert('Grainz', 'Order added successfully', [
                {text: 'OK', onPress: () => this.showCasualPurchases()},
              ]);
            })
            .catch(error => {
              console.warn('addfailed', error.response);
            }),
      );
    }
  }

  showSupplierList() {
    this.setState({showSuppliers: !this.state.showSuppliers});
  }

  selectSupplier(param, id, ref) {
    this.setState({supplier: param, supplierId: id, supplieReference: ref});
    this.showSupplierList();
    this.scrollListReftop.scrollTo({x: 0, y: 0, animated: true});
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
    this.getItemListData();
  };

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
        console.warn(this.state.items);
      })
      .catch(err => {
        console.warn('Err', err.response);
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
    // let temp = [];
    // temp.push(selectedItemObjects[0]);
    // console.warn('temp', temp);
    console.warn('selectedItemObjects', selectedItemObjects);
  };

  render() {
    const {
      firstName,
      casualPurchases,
      casualListLoader,
      showPurchaseList,
      isDatePickerVisible,
      finalDate,
      htvaIsSelected,
      auditIsSelected,
      quantityValue,
      price,
      note,
      showSuppliers,
      supplierList,
      supplierListLoader,
      supplier,
      items,
      notes,
      loading,
      orderItemsFinal,
      departmentName,
      orderTotal,
      saveLoader,
      saveTouchableStatus,
    } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfileFun}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {/* <SubHeader /> */}
        <ScrollView
          style={{marginBottom: hp('3%')}}
          ref={ref => {
            this.scrollListReftop = ref;
          }}>
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
                      <Text
                        style={{
                          color: 'white',
                          marginLeft: 5,
                          fontWeight: 'bold',
                        }}>
                        {translate('New')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
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
                      <Text
                        style={{
                          color: 'white',
                          marginLeft: 5,
                          fontWeight: 'bold',
                        }}>
                        {translate('Back')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          {showPurchaseList ? (
            <View style={{}}>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomColor: '#EAEAF0',
                  borderBottomWidth: 2,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                    marginLeft: 20,
                    flex: 1,
                  }}>
                  <Text style={{fontWeight: 'bold'}}>{translate('Date')}</Text>
                  <Pressable>
                    <Image
                      style={{
                        width: 15,
                        height: 15,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={img.doubleArrowIcon}
                    />
                  </Pressable>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                    marginLeft: 15,
                    flex: 1,
                  }}>
                  <Text style={{fontWeight: 'bold'}}>
                    {translate('Supplier')}
                  </Text>
                  <Pressable>
                    <Image
                      style={{
                        width: 15,
                        height: 15,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={img.doubleArrowIcon}
                    />
                  </Pressable>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                    flex: 1,
                  }}>
                  <Text style={{fontWeight: 'bold'}}>
                    $ {translate('Total')} HTVA
                  </Text>
                  <Pressable>
                    <Image
                      style={{
                        width: 15,
                        height: 15,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={img.doubleArrowIcon}
                    />
                  </Pressable>
                </View>
              </View>
              {casualListLoader ? (
                <ActivityIndicator color="grey" size="large" />
              ) : (
                casualPurchases.map(item => {
                  const date = moment(item.orderDate).format('MM/DD/YYYY');
                  const price = Math.round(item.htva);
                  return (
                    <View
                      style={{
                        borderBottomColor: '#EAEAF0',
                        borderBottomWidth: 1,
                        marginBottom: hp('2%'),
                      }}>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          paddingLeft: 10,
                          alignItems: 'flex-start',
                        }}
                        onPress={() => this.navigateToEditFun(item)}>
                        <View style={{margin: 5, flex: 3}}>
                          <Text style={{fontWeight: 'bold'}}>{date}</Text>
                        </View>
                        <View style={{margin: 5, flex: 3, paddingLeft: 50}}>
                          <Text style={{fontWeight: 'bold'}}>
                            {item.supplierName}
                          </Text>
                        </View>
                        <View style={{margin: 5, flex: 2, paddingLeft: 50}}>
                          <Text style={{fontWeight: 'bold'}}>$ {price}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>
          ) : (
            <View style={{marginHorizontal: wp('6%'), marginTop: hp('5%')}}>
              {supplierListLoader ? (
                <ActivityIndicator color="grey" size="large" />
              ) : (
                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 3}}>
                      <Text>{translate('Date')}:</Text>
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

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 3}}>
                      <Text>{translate('Supplier')}:</Text>
                    </View>
                    <View style={{flex: 4}}>
                      <TouchableOpacity
                        onPress={() => this.showSupplierList()}
                        style={{
                          borderWidth: 1,
                          padding: 10,
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
                      <View
                        style={{
                          width: wp('85%'),
                          alignItems: 'center',
                          borderWidth: 0.5,
                          marginTop: hp('2%'),
                        }}>
                        {supplierList.map(item => {
                          return (
                            <View
                              style={{marginVertical: 5, borderBottomWidth: 1}}>
                              <Pressable
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
                  <View style={{marginTop: hp('3%')}}>
                    <View style={{marginBottom: hp('6%')}}>
                      <View>
                        <View style={{}}>
                          <View>
                            <DropDownPicker
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
                                backgroundColor: '#FFFFFF',
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
                              styles={{
                                container: {
                                  paddingTop: hp('2%'),
                                  marginTop: hp('7%'),
                                },
                                selectToggle: {
                                  backgroundColor: '#FFFFFF',
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
                              loading={loading}
                              // hideSearch={true}
                              single={true}
                              items={items}
                              IconRenderer={Icon}
                              uniqueKey="id"
                              subKey="children"
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
                                  backgroundColor: '#FFFFFF',
                                  borderWidth: 1,
                                  padding: 10,
                                  marginBottom: hp('1%'),
                                  marginTop: hp('1%'),
                                }}
                                value={quantityValue}
                                onChangeText={value =>
                                  this.setState({
                                    quantityValue: value,
                                  })
                                }
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
                                    backgroundColor: '#FFFFFF',
                                    borderWidth: 1,
                                    padding: 10,
                                    marginBottom: hp('1%'),
                                  }}
                                  value={price}
                                  onChangeText={value =>
                                    this.setState({
                                      price: value,
                                    })
                                  }
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => this.addPurchaseLine()}
                      style={{
                        paddingVertical: 10,
                        width: wp('50%'),
                        backgroundColor: '#94C01F',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 20,
                      }}>
                      <View style={{}}>
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: 'bold',
                            marginLeft: 5,
                          }}>
                          {translate('Add Data')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View>
                    {orderItemsFinal.length > 0 &&
                      orderItemsFinal.map((item, index) => {
                        console.log('ITEM', item);
                        return (
                          <View style={{marginBottom: hp('6%')}}>
                            <View>
                              <View style={{marginLeft: -11}}>
                                <Pressable
                                  onPress={() =>
                                    this.deletePurchaseLine(item, index)
                                  }>
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
                                  <TextInput
                                    placeholder="Department Name"
                                    editable={false}
                                    style={{
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      padding: 10,
                                      marginBottom: hp('1%'),
                                    }}
                                    value={departmentName}
                                  />

                                  <View>
                                    <TextInput
                                      placeholder="Value"
                                      editable={false}
                                      style={{
                                        backgroundColor: '#FFFFFF',
                                        borderWidth: 1,
                                        padding: 10,
                                        marginBottom: hp('1%'),
                                        marginTop: hp('1%'),
                                      }}
                                      value={item.name}
                                    />
                                  </View>

                                  <View>
                                    <TextInput
                                      placeholder="Quantity"
                                      editable={false}
                                      style={{
                                        backgroundColor: '#FFFFFF',
                                        borderWidth: 1,
                                        padding: 10,
                                        marginBottom: hp('1%'),
                                        marginTop: hp('1%'),
                                      }}
                                      value={item.quantityOrdered}
                                    />
                                  </View>
                                  <View style={{flexDirection: 'row'}}>
                                    <View style={{flex: 1}}>
                                      <Text>$</Text>
                                    </View>
                                    <View style={{flex: 15}}>
                                      <TextInput
                                        placeholder="Price"
                                        editable={false}
                                        style={{
                                          backgroundColor: '#FFFFFF',
                                          borderWidth: 1,
                                          padding: 10,
                                          marginBottom: hp('1%'),
                                        }}
                                        value={item.unitPrice}
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

                  <View style={{alignItems: 'space-between', margin: 20}}>
                    <View>
                      <Text>{translate('Total')}</Text>
                    </View>
                    <View>
                      <Text>{orderTotal}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text>HTVA?</Text>
                      <CheckBox
                        value={htvaIsSelected}
                        onValueChange={() =>
                          this.setState({htvaIsSelected: !htvaIsSelected})
                        }
                        style={{
                          margin: 5,
                          height: 20,
                          width: 20,
                        }}
                      />
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text>{translate('Audit Complete')}</Text>
                      <CheckBox
                        value={auditIsSelected}
                        style={{
                          margin: 5,
                          height: 20,
                          width: 20,
                        }}
                        onValueChange={() =>
                          this.setState({auditIsSelected: !auditIsSelected})
                        }
                      />
                    </View>
                  </View>
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
                  <View style={{margin: 15, flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      <Text style={{}}>{translate('Note')} </Text>
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
                        value={note}
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
                          {translate('Cancel')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      disabled={saveTouchableStatus}
                      onPress={() => this.createOrder()}
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
                          {saveLoader ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            translate('Save')
                          )}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
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

export default connect(mapStateToProps, {UserTokenAction})(index);
