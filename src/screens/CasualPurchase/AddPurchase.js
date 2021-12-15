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
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {
  getMyProfileApi,
  getSupplierListApi,
  addOrderApi,
  getInventoryListApi,
} from '../../connectivity/api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {translate} from '../../utils/translations';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import styles from './style';
import RNPickerSelect from 'react-native-picker-select';
import ModalPicker from '../../components/ModalPicker';

var minTime = new Date();
minTime.setHours(0);
minTime.setMinutes(0);
minTime.setMilliseconds(0);

let todayDate = moment(new Date()).format('DD-MM-YY');
let todayDateProd = moment.utc(new Date()).format();

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      isDatePickerVisible: false,
      finalDate: todayDate,
      placeHolderTextDept: 'Select Supplier',
      productionDate: todayDateProd,
      htvaIsSelected: true,
      auditIsSelected: false,
      note: '',
      dataListLoader: false,
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
      selectedTextUser: '',
      selectedItemObjects: [],
      supplierListLoader: false,
      quantityList: [],
      quantityName: '',
      orderItemsFinal: [],
      // orderItemsFinal: [
      //   {
      //     action: 'New',
      //     id: '',
      //     inventoryId: '',
      //     inventoryProductMappingId: '',
      //     isCorrect: false,
      //     notes: '',
      //     position: '',
      //     quantityOrdered: '',
      //     tdcVolume: 0,
      //     unitId: '',
      //     unitPrice: '',
      //     name: '',
      //   },
      // ],
      quantityValue: '',
      price: '',
      orderTotal: 0,
      saveLoader: false,
      saveTouchableStatus: false,
      imageModalStatus: false,
      imageDesc: '',
      imageName: '',
      imageData: '',
      imageShow: false,
      recipeLoader: true,
      buttonsSubHeader: [],
      chooseImageModalStatus: false,
      quantityError: '',
      priceError: '',
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

  getSupplierListData() {
    this.setState(
      {
        supplierListLoader: true,
        dataListLoader: true,
      },
      () =>
        getSupplierListApi()
          .then(res => {
            const finalArr = [];
            res.data.map(item => {
              finalArr.push({
                name: item.name,
                id: item.id,
              });
            });
            this.setState({
              supplierList: [...finalArr],
              supplierListLoader: false,
              dataListLoader: false,
            });
          })
          .catch(error => {
            this.setState({supplierListLoader: false});
          }),
    );
  }

  async componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.clearData();
      this.getSupplierListData();
    });
    this.getProfileDataFun();
  }

  clearData = () => {
    this.setState({
      imageData: '',
      imageDesc: '',
      imageName: '',
      quantityValue: '',
    });
  };

  myProfileFun = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    if (item.name === 'Back') {
      this.props.navigation.goBack();
    }
  };

  newCasualPurchase() {
    this.props.navigation.navigate('AddPurchaseScreen');
  }

  navigateToEditFun(order) {
    this.props.navigation.navigate('EditPurchase', {
      orderData: order,
    });
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
    this.setState({
      chooseImageModalStatus: true,
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

  // addPurchaseLine() {
  //   const {
  //     quantityValue,
  //     price,
  //     selectedItemObjects,
  //     orderItemsFinal,
  //     orderTotal,
  //   } = this.state;

  //   let obj = {};
  //   let newlist = [];
  //   obj = {
  //     action: 'New',
  //     id: '',
  //     inventoryId: '',
  //     inventoryProductMappingId: '',
  //     isCorrect: false,
  //     notes: '',
  //     position: '',
  //     quantityOrdered: '',
  //     tdcVolume: 0,
  //     unitId: '',
  //     unitPrice: '',
  //     name: '',
  //   };

  //   const finalTotal = parseInt(orderTotal) + parseInt(price);

  //   newlist.push(obj);
  //   this.setState({
  //     orderItemsFinal: [...orderItemsFinal, ...newlist],
  //     quantityValue: '',
  //     price: '',
  //     orderTotal: finalTotal,
  //   });
  // }

  deletePurchaseLine(index) {
    if (index > 0) {
      let temp = this.state.orderItemsFinal;
      temp.splice(index, 1);
      this.setState({orderItemsFinal: temp});
    }
  }

  payloadValidation = () => {
    let formIsValid = true;
    const {orderItemsFinal} = this.state;
    console.log('order---->', orderItemsFinal);
    if (orderItemsFinal.length > 0) {
      for (let i of orderItemsFinal) {
        if (i.quantityOrdered === '') {
          i.error = 'Quantity is required';
          formIsValid = false;
          // this.setState({
          //   quantityError: 'Quantity is required',
          // });
        } else if (i.unitPrice === '') {
          i.error = 'Price is required';
          formIsValid = false;
          // this.setState({
          //   priceError: 'Price is required',
          // });
        }
      }
    }
    this.setState({
      orderItemsFinal,
    });
    return formIsValid;
  };

  createOrder() {
    const {
      productionDate,
      note,
      supplierId,
      supplieReference,
      htvaIsSelected,
      auditIsSelected,
      orderItemsFinal,
      imageData,
      imageDesc,
      imageName,
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
      images: imageData
        ? [
            {
              action: 'New',
              description: imageDesc,
              id: null,
              imageText: `data:image/png;base64,${imageData.data}`,
              name: imageName,
              type: 'png',
            },
          ]
        : [],
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
    if (this.payloadValidation()) {
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
                this.props.navigation.goBack();
              })
              .catch(err => {
                this.setState({
                  saveLoader: false,
                  saveTouchableStatus: false,
                });
                Alert.alert(
                  `Error - ${err.response.status}`,
                  'Something went wrong',
                  [
                    {
                      text: 'Okay',
                      onPress: () => this.props.navigation.goBack(),
                    },
                  ],
                );
              }),
        );
      }
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

  selectDepartementNameFun = value => {
    this.setState(
      {
        departmentName: value,
        loading: true,
        items: [],
        selectedItemObjects: [],
        selectedItems: [],
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
      })
      .catch(err => {
        console.warn('ErrITEMSS', err);
      });
  };

  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems});
  };

  onSelectedItemObjectsChange = async (index, type, value, finalValue) => {
    const {orderItemsFinal} = this.state;

    let finalArray = finalValue.map((item, index) => {
      const finalUnits = item.units.map((subItem, subIndex) => {
        return {
          label: subItem.name,
          value: subItem.id,
        };
      });

      return {
        action: 'New',
        id: '',
        inventoryId: item.id,
        inventoryProductMappingId: '',
        isCorrect: false,
        notes: '',
        position: index + 1,
        quantityOrdered: '',
        tdcVolume: 0,
        unitId: item.units[0].id,
        unitPrice: '',
        name: item.name,
        units: finalUnits,
      };
    });

    // let finalArrayUnit = finalValue.map((item, index) => {
    //   console.log('item', item);
    //   return {
    //     label: item,
    //     value: item,
    //   };
    // });

    this.setState(
      {
        selectedItemObjects: finalValue,
        orderItemsFinal: [...finalArray],
      },
      // ,
      // () => this.addDataFun(index, type, value, finalValue),
    );
  };

  // storeDataFun = async () => {
  //   const {orderItemsFinal} = this.state;
  // };

  setModalVisibleImage = () => {
    this.setState({
      imageModalStatus: false,
      chooseImageModalStatus: false,
    });
  };

  deleteImageFun = () => {
    this.setState({
      imageModalStatus: false,
      imageData: '',
      imageShow: false,
    });
  };

  saveImageFun = () => {
    this.setState({
      imageModalStatus: false,
      imageShow: true,
    });
  };

  addDataFun = (index, type, value, finalValue) => {
    const {orderItemsFinal, selectedItemObjects} = this.state;
    // const finalUnitId =
    //   selectedItemObjects && selectedItemObjects[0].units[0].id;
    let newArr = orderItemsFinal.map((item, i) =>
      index === i
        ? {
            ...item,
            [type]: value,
            // ['unitId']: finalUnitId,
            // ['position']: index,
          }
        : item,
    );
    this.setState({
      orderItemsFinal: [...newArr],
      // selectedItems: finalValue,
    });
  };

  selectUserNameFun = item => {
    this.setState({
      supplier: item.name,
      selectedTextUser: item.name,
      supplierId: item.id,
      supplieReference: item.reference,
    });
  };

  choosePhotoFun = () => {
    this.setState(
      {
        chooseImageModalStatus: false,
      },
      () =>
        setTimeout(() => {
          ImagePicker.openPicker({
            width: 300,
            height: 400,
            includeBase64: true,
            cropping: true,
          }).then(image => {
            this.setState({
              imageModalStatus: true,
              imageData: image,
            });
          });
        }, 500),
    );
  };

  clickPhotoFun = () => {
    this.setState(
      {
        chooseImageModalStatus: false,
      },
      () =>
        setTimeout(() => {
          ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
          }).then(image => {
            this.setState({
              imageModalStatus: true,
              imageData: image,
            });
          });
        }, 500),
    );
  };

  render() {
    const {
      isDatePickerVisible,
      finalDate,
      htvaIsSelected,
      auditIsSelected,
      note,
      showSuppliers,
      supplierList,
      supplierListLoader,
      supplier,
      items,
      loading,
      orderItemsFinal,
      orderTotal,
      saveLoader,
      saveTouchableStatus,
      imageModalStatus,
      imageDesc,
      imageName,
      imageData,
      imageShow,
      buttonsSubHeader,
      recipeLoader,
      dataListLoader,
      placeHolderTextDept,
      selectedTextUser,
      supplierId,
      productionDate,
      departmentName,
      selectedItemObjects,
      chooseImageModalStatus,
      selectedItems,
      quantityList,
      quantityName,
    } = this.state;
    console.log('orderItemsFinal', orderItemsFinal);
    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfileFun}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {/* {recipeLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )} */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: hp('2%')}}
          ref={ref => {
            this.scrollListReftop = ref;
          }}>
          <View>
            <View style={styles.subContainer}>
              <View style={styles.firstContainer}>
                <View style={{flex: 1}}>
                  <Text style={styles.adminTextStyle}>
                    {translate('Casual purchase')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={styles.goBackContainer}>
                  <Text style={styles.goBackTextStyle}>
                    {translate('Go Back')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginHorizontal: wp('6%'), marginTop: hp('2%')}}>
              {supplierListLoader ? (
                <ActivityIndicator color="grey" size="large" />
              ) : (
                <View>
                  <View style={{}}>
                    <View style={{}}>
                      <TouchableOpacity
                        onPress={() => this.showDatePickerFun()}
                        style={{
                          backgroundColor: '#fff',
                          padding: 15,
                          marginBottom: hp('3%'),
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          borderRadius: 6,
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
                    isVisible={isDatePickerVisible}
                    mode={'date'}
                    onConfirm={this.handleConfirm}
                    onCancel={this.hideDatePicker}
                    // minimumDate={minTime}
                  />

                  <View style={{marginBottom: hp('3%')}}>
                    <ModalPicker
                      dataListLoader={dataListLoader}
                      placeHolderLabel={placeHolderTextDept}
                      placeHolderLabelColor="grey"
                      dataSource={supplierList}
                      selectedLabel={selectedTextUser}
                      onSelectFun={item => this.selectUserNameFun(item)}
                    />
                  </View>

                  <View
                    style={{
                      marginBottom: hp('3%'),
                      width: wp('70%'),
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        borderRadius: 5,
                        backgroundColor: '#fff',
                      }}>
                      <View
                        style={{
                          alignSelf: 'center',
                          justifyContent: 'center',
                          width: index > 0 ? wp('60%') : wp('80%'),
                        }}>
                        <RNPickerSelect
                          placeholder={{
                            label: 'Select Department*',
                            value: null,
                            color: 'black',
                          }}
                          onValueChange={value => {
                            this.selectDepartementNameFun(value);
                          }}
                          style={{
                            inputIOS: {
                              fontSize: 14,
                              paddingHorizontal: '3%',
                              color: '#161C27',
                              width: '100%',
                              alignSelf: 'center',
                              paddingVertical: 15,
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
                          value={departmentName}
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
                            marginTop: Platform.OS === 'ios' ? 15 : 15,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                  <View>
                    <SectionedMultiSelect
                      styles={{
                        container: {
                          paddingTop: hp('2%'),
                          marginTop: hp('7%'),
                        },
                        selectToggle: {
                          backgroundColor: '#fff',
                          paddingVertical: 14,
                          paddingHorizontal: 5,
                          borderRadius: 6,
                        },
                      }}
                      loadingComponent={
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <ActivityIndicator size="large" color="#94C036" />
                        </View>
                      }
                      loading={loading}
                      // hideSearch={true}
                      // single={true}
                      items={items}
                      IconRenderer={Icon}
                      uniqueKey="id"
                      subKey="children"
                      showDropDowns={true}
                      readOnlyHeadings={true}
                      // onConfirm={() => this.storeDataFun()}
                      onSelectedItemObjectsChange={value =>
                        this.onSelectedItemObjectsChange(
                          index,
                          'inventoryId',
                          value[0],
                          value,
                        )
                      }
                      // onSelectedItemsChange={value =>
                      //   this.addDataFun(
                      //     index,
                      //     'inventoryId',
                      //     value[0],
                      //     value,
                      //   )
                      // }
                      onSelectedItemsChange={this.onSelectedItemsChange}
                      selectedItems={this.state.selectedItems}
                      // selectedItems={[item.inventoryId]}
                    />
                  </View>

                  {orderItemsFinal.length > 0 &&
                    orderItemsFinal.map((item, index) => {
                      return (
                        <View style={{}}>
                          <View style={{}}>
                            <View>
                              <View style={{}}>
                                <View>
                                  {/* <View
                                    style={{
                                      marginBottom: hp('3%'),
                                      width: wp('70%'),
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        borderRadius: 5,
                                        backgroundColor: '#fff',
                                      }}>
                                      <View
                                        style={{
                                          alignSelf: 'center',
                                          justifyContent: 'center',
                                          width:
                                            index > 0 ? wp('60%') : wp('80%'),
                                        }}>
                                        <RNPickerSelect
                                          placeholder={{
                                            label: 'Select Department*',
                                            value: null,
                                            color: 'black',
                                          }}
                                          placeholderTextColor="red"
                                          onValueChange={value => {
                                            this.selectDepartementNameFun(
                                              value,
                                            );
                                          }}
                                          style={{
                                            inputIOS: {
                                              fontSize: 14,
                                              paddingHorizontal: '3%',
                                              color: '#161C27',
                                              width: '100%',
                                              alignSelf: 'center',
                                              paddingVertical: 15,
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
                                          value={item.supplierValue}
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
                                            marginTop:
                                              Platform.OS === 'ios' ? 15 : 15,
                                          }}
                                        />
                                      </View>
                                    </View>
                                    {index > 0 ? (
                                      <TouchableOpacity
                                        onPress={() =>
                                          this.deletePurchaseLine(index)
                                        }
                                        style={{marginLeft: wp('5%')}}>
                                        <Text
                                          style={{
                                            fontFamily: 'Inter-Regular',
                                            color: '#FF0303',
                                            fontSize: 16,
                                            textDecorationLine: 'underline',
                                          }}>
                                          {translate('Remove')}
                                        </Text>
                                      </TouchableOpacity>
                                    ) : null}
                                  </View> */}
                                  {/* <SectionedMultiSelect
                                    styles={{
                                      container: {
                                        paddingTop: hp('2%'),
                                        marginTop: hp('7%'),
                                      },
                                      selectToggle: {
                                        backgroundColor: '#fff',
                                        paddingVertical: 15,
                                        paddingHorizontal: 5,
                                        borderRadius: 6,
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
                                    // single={true}
                                    items={items}
                                    IconRenderer={Icon}
                                    uniqueKey="id"
                                    subKey="children"
                                    showDropDowns={true}
                                    readOnlyHeadings={true}
                                    onSelectedItemObjectsChange={value =>
                                      this.onSelectedItemObjectsChange(
                                        index,
                                        'inventoryId',
                                        value[0],
                                        value,
                                      )
                                    }
                                    // onSelectedItemsChange={value =>
                                    //   this.addDataFun(
                                    //     index,
                                    //     'inventoryId',
                                    //     value[0],
                                    //     value,
                                    //   )
                                    // }
                                    onSelectedItemsChange={
                                      this.onSelectedItemsChange
                                    }
                                    selectedItems={this.state.selectedItems}
                                    // selectedItems={[item.inventoryId]}
                                  /> */}

                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginTop: hp('2%'),
                                      flex: 1,
                                    }}>
                                    <View
                                      style={{
                                        flex: 0.7,
                                      }}>
                                      <Text>{item.name}</Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        flex: 2,
                                        marginLeft: wp('2%'),
                                      }}>
                                      <View>
                                        <TextInput
                                          placeholder="Quantity"
                                          style={{
                                            padding: 12,
                                            borderTopLeftRadius: 5,
                                            borderBottomLeftRadius: 5,
                                            backgroundColor: '#fff',
                                            width: wp('20%'),
                                          }}
                                          keyboardType="number-pad"
                                          value={item.quantityOrdered}
                                          onChangeText={value =>
                                            this.addDataFun(
                                              index,
                                              'quantityOrdered',
                                              value,
                                            )
                                          }
                                        />
                                      </View>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        }}>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            borderTopRightRadius: 5,
                                            borderBottomRightRadius: 5,
                                            backgroundColor: '#68AFFF',
                                          }}>
                                          <View
                                            style={{
                                              alignSelf: 'center',
                                              justifyContent: 'center',
                                              width: wp('15%'),
                                            }}>
                                            <RNPickerSelect
                                              placeholder={{
                                                label: 'Unit*',
                                                value: null,
                                                color: 'black',
                                              }}
                                              onValueChange={value => {
                                                this.addDataFun(
                                                  index,
                                                  'unitId',
                                                  value,
                                                );
                                              }}
                                              style={{
                                                inputIOS: {
                                                  fontSize: 14,
                                                  paddingHorizontal: '3%',
                                                  color: '#fff',
                                                  width: '100%',
                                                  alignSelf: 'center',
                                                  paddingVertical: 12,
                                                  marginLeft: 10,
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
                                              items={item.units}
                                              value={item.unitId}
                                              useNativeAndroidPickerStyle={
                                                false
                                              }
                                            />
                                          </View>
                                          <View style={{marginRight: wp('4%')}}>
                                            <Image
                                              source={img.arrowDownIcon}
                                              resizeMode="contain"
                                              style={{
                                                height: 15,
                                                width: 15,
                                                resizeMode: 'contain',
                                                tintColor: '#fff',
                                                marginTop:
                                                  Platform.OS === 'ios'
                                                    ? 12
                                                    : 15,
                                              }}
                                            />
                                          </View>
                                        </View>
                                      </View>
                                    </View>

                                    {/* <View
                                      style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderRadius: 6,
                                        backgroundColor: '#fff',
                                      }}>
                                      <TextInput
                                        placeholder="Quantity"
                                        style={{
                                          padding: 15,
                                        }}
                                        value={item.quantityOrdered}
                                        onChangeText={value =>
                                          this.addDataFun(
                                            index,
                                            'quantityOrdered',
                                            value,
                                          )
                                        }
                                      />
                                      <Text
                                        style={{
                                          textAlign: 'center',
                                          backgroundColor: '#F7F8F5',
                                        }}>
                                        {translate('Unit')}
                                      </Text>
                                    </View> */}
                                    <View
                                      style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <Text style={{}}>€</Text>
                                      <TextInput
                                        placeholder="Price"
                                        style={{
                                          padding: 15,
                                          marginLeft: wp('2%'),
                                          width: wp('18%'),
                                          backgroundColor: '#fff',
                                          borderRadius: 6,
                                        }}
                                        onChangeText={value =>
                                          this.addDataFun(
                                            index,
                                            'unitPrice',
                                            value,
                                          )
                                        }
                                        value={item.unitPrice}
                                      />
                                    </View>
                                  </View>
                                  {item.error ? (
                                    <View>
                                      <Text
                                        style={{
                                          color: 'red',
                                          fontSize: 12,
                                          fontFamily: 'Inter-Regular',
                                          marginTop: 5,
                                        }}>
                                        {item.error}
                                      </Text>
                                    </View>
                                  ) : null}
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  {/* <View>
                    <TouchableOpacity
                      onPress={() => this.addPurchaseLine()}
                      style={{
                        marginBottom: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: hp('3%'),
                      }}>
                      <View style={{}}>
                        <Image
                          source={img.addIconNew}
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                            tintColor: '#94C01F',
                          }}
                        />
                      </View>
                      <View style={{}}>
                        <Text
                          style={{
                            color: '#94C01F',
                            fontSize: 18,
                            fontFamily: 'Inter-Regular',
                            marginLeft: 10,
                          }}>
                          {translate('Add line')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View> */}

                  <View style={{marginTop: hp('3%')}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: hp('2%'),
                      }}>
                      <View>
                        <Text
                          style={{
                            fontFamily: 'Inter-Regular',
                            fontSize: 16,
                            color: '#151B26',
                          }}>
                          {translate('Total')}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            fontFamily: 'Inter-Regular',
                            fontSize: 16,
                            color: '#151B26',
                          }}>
                          {orderTotal}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: hp('2%'),
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Inter-Regular',
                          fontSize: 15,
                          color: '#151B26',
                        }}>
                        HTVA?
                      </Text>
                      <CheckBox
                        value={htvaIsSelected}
                        onValueChange={() =>
                          this.setState({htvaIsSelected: !htvaIsSelected})
                        }
                        style={{
                          height: 20,
                          width: 20,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: hp('2%'),
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Inter-Regular',
                          fontSize: 15,
                          color: '#151B26',
                        }}>
                        {translate('Audit Complete')}
                      </Text>
                      <CheckBox
                        value={auditIsSelected}
                        style={{
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
                        marginTop: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View style={{}}>
                        <Image
                          source={img.addIconNew}
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                            tintColor: '#94C01F',
                          }}
                        />
                      </View>
                      <View style={{}}>
                        <Text
                          style={{
                            color: '#94C01F',
                            fontSize: 18,
                            fontFamily: 'Inter-Regular',
                            marginLeft: 10,
                          }}>
                          {translate('Add image')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {imageShow ? (
                    <View style={{marginTop: 15}}>
                      <Image
                        style={{
                          width: wp('60%'),
                          height: 100,
                          resizeMode: 'cover',
                        }}
                        source={{uri: imageData.path}}
                      />
                    </View>
                  ) : null}
                  <View style={{}}>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        borderRadius: 6,
                        marginTop: hp('3%'),
                      }}>
                      <TextInput
                        placeholder="Notes"
                        style={{
                          paddingVertical: '20%',
                          paddingLeft: 20,
                          paddingTop: 10,
                        }}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={note => this.setState({note})}
                        value={note}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
          <Modal isVisible={imageModalStatus} backdropOpacity={0.35}>
            <View
              style={{
                width: wp('80%'),
                height: hp('70%'),
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
                    {translate('Manual Log small')} -{' '}
                    {translate('Add new item')}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => this.setModalVisibleImage(false)}>
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
              <ScrollView>
                <View style={{padding: hp('3%')}}>
                  <View>
                    <Image
                      style={{
                        width: wp('60%'),
                        height: 100,
                        resizeMode: 'cover',
                      }}
                      source={{uri: imageData.path}}
                    />
                  </View>
                  <View style={{}}>
                    <TextInput
                      placeholder="Enter Name"
                      value={imageName}
                      style={{
                        borderWidth: 1,
                        padding: 12,
                        marginBottom: hp('3%'),
                        justifyContent: 'space-between',
                        marginTop: 20,
                      }}
                      onChangeText={value => {
                        this.setState({
                          imageName: value,
                        });
                      }}
                    />
                  </View>
                  <View style={{}}>
                    <TextInput
                      placeholder="Enter Description"
                      value={imageDesc}
                      style={{
                        borderWidth: 1,
                        padding: 12,
                        marginBottom: hp('3%'),
                        justifyContent: 'space-between',
                      }}
                      onChangeText={value => {
                        this.setState({
                          imageDesc: value,
                        });
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => this.deleteImageFun()}
                    style={{
                      width: wp('70%'),
                      height: hp('5%'),
                      alignSelf: 'flex-end',
                      backgroundColor: 'red',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      {translate('Delete')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.saveImageFun()}
                    style={{
                      width: wp('70%'),
                      height: hp('5%'),
                      alignSelf: 'flex-end',
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      {translate('Save')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Modal>
          <Modal isVisible={chooseImageModalStatus} backdropOpacity={0.35}>
            <View
              style={{
                width: wp('80%'),
                height: hp('25%'),
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
                    {translate('Add image')}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => this.setModalVisibleImage(false)}>
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
              <ScrollView>
                <View style={{padding: hp('3%')}}>
                  <TouchableOpacity
                    onPress={() => this.choosePhotoFun()}
                    style={{
                      width: wp('70%'),
                      height: hp('5%'),
                      alignSelf: 'flex-end',
                      backgroundColor: 'red',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      {translate('Choose image from gallery')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.clickPhotoFun()}
                    style={{
                      width: wp('70%'),
                      height: hp('5%'),
                      alignSelf: 'flex-end',
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      {translate('Click Photo')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Modal>
        </ScrollView>
        <View style={{}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: hp('2%'),
            }}>
            {supplierId === '' ||
            productionDate === '' ||
            departmentName === '' ||
            selectedItemObjects === '' ? (
              <View
                opacity={0.5}
                style={{
                  width: wp('30%'),
                  height: hp('5%'),
                  alignSelf: 'flex-end',
                  backgroundColor: '#94C036',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}>
                  {saveLoader ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    translate('Save')
                  )}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                disabled={saveTouchableStatus}
                onPress={() => this.createOrder()}
                style={{
                  width: wp('30%'),
                  height: hp('5%'),
                  alignSelf: 'flex-end',
                  backgroundColor: '#94C036',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}>
                  {saveLoader ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    translate('Save')
                  )}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{
                width: wp('30%'),
                height: hp('5%'),
                alignSelf: 'flex-end',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: wp('2%'),
                borderRadius: 100,
                borderWidth: 1,
                borderColor: '#482813',
              }}>
              <Text
                style={{
                  color: '#482813',
                  fontSize: 15,
                  fontWeight: 'bold',
                }}>
                {translate('Cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
