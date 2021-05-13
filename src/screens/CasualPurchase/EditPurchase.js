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
import Modal from 'react-native-modal';
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
  getSupplierListApi,
  deleteOrderApi,
  updateOrderApi,
  getOrderByIdApi,
  getInventoryByIdApi,
  getInventoryListApi,
  getOrderImagesByIdApi,
} from '../../connectivity/api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {translate} from '../../utils/translations';
import ImagePicker from 'react-native-image-crop-picker';

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
      yourOrderItems: [],
      newOrderItems: [],
      departmentName: '',
      testItem: null,
      orderTotal: null,
      photo: null,
      editDataLoader: true,
      orderId: '',
      orderItemsFinal: [],
      deleteLoader: false,
      updateLoader: false,
      imageData: '',
      imageShow: false,
      imageModalStatus: false,
      imageName: '',
      imageDesc: '',
      imageDataEdit: '',
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
    this.getSupplierListData();
    const {route} = this.props;
    const order = route.params.orderData;
    this.showEditCasualPurchase(order);
    this.getImagesFun(order);
  }

  getImagesFun = order => {
    const id = order.id;
    getOrderImagesByIdApi(id)
      .then(res => {
        console.log('IMAGESSSS', res);
        this.setState({
          imageData: res.data.length > 0 ? res.data[0] : '',
        });
      })
      .catch(error => {
        console.warn(error);
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

  showEditCasualPurchase(order) {
    console.log('ORDRE', order);
    total = 0;
    this.getOrderById(order.id);
    this.setState({
      supplier: order.supplierName,
      yourOrder: order,
      departmentName: order.departmentName,
      orderId: order.id,
      supplierId: order.supplierId,
      productionDate: order.orderDate,
      auditIsSelected: order.isAuditComplete,
      note: order.notes,
    });
    list = [];

    // this.getInventoryList('9df266dc-bf87-454e-b678-21c14647a23d');
  }

  getOrderById(id) {
    let list = [];
    let obj = {};
    getOrderByIdApi(id)
      .then(res => {
        // console.log('res', res);

        this.setState({
          yourOrder: res.data,
        });
        res.data.orderItems.map(item => {
          this.getItem(item.inventoryId, item);
          this.getFinalArray(item);
        });
      })
      .catch(error => console.warn(error));
  }

  getFinalArray = item => {
    // console.log('itemm', item);
    const {orderItemsFinal} = this.state;
    let objSec = {};
    let newlist = [];
    objSec = {
      action: 'Update',
      id: item.id,
      inventoryId: item.inventoryId,
      inventoryProductMappingId: '',
      isCorrect: false,
      notes: '',
      position: 1,
      quantityOrdered: item.quantityOrdered,
      tdcVolume: 0,
      unitId: item.unitId,
      unitPrice: item.unitPrice,
    };

    newlist.push(objSec);
    this.setState({
      orderItemsFinal: [...orderItemsFinal, ...newlist],
    });
  };

  getItem(id, item) {
    let obj = {};

    getInventoryByIdApi(id)
      .then(res => {
        // console.log('InventoryRes', res);

        total = total + item.orderValue;
        obj = {
          action: 'Update',
          id: item.id,
          inventoryId: item.inventoryId,
          inventoryProductMappingId: '',
          isCorrect: false,
          notes: '',
          position: 1,
          quantityOrdered:
            item.quantityOrdered && item.quantityOrdered.toString(),
          tdcVolume: 0,
          unitId: item.unitId,
          unitPrice: item.unitPrice && item.unitPrice.toString(),
          name: res.data.name,
          departmentName: res.data.departmentName,
        };

        // obj = {
        //   name: res.data.name,
        //   departmentName: res.data.departmentName,
        //   quantityOrdered:
        //     item.quantityOrdered && item.quantityOrdered.toString(),
        //   unitPrice: item.unitPrice && item.unitPrice.toString(),
        // };
        list.push(obj);
        this.setState({
          orderTotal: total,
          yourOrderItems: list.reverse(),
          editDataLoader: false,
        });
      })
      .catch(error => console.warn('invIdError', error));
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

  updateCasualPurchase() {
    const {
      note,
      auditIsSelected,
      supplierId,
      productionDate,
      orderId,
      orderItemsFinal,
      imageName,
      imageDesc,
      imageData,
      imageDataEdit,
    } = this.state;
    let payload = {
      id: orderId,
      supplierId: supplierId,
      isAuditComplete: auditIsSelected,
      orderDate: productionDate,
      notes: note,
      orderItems: orderItemsFinal,
      images: [],
      images: imageDataEdit
        ? [
            {
              // id: '',
              description: imageDesc,
              position: 0,
              type: 'png',
              imageText: `data:image/png;base64,${imageDataEdit.data}`,
              action: 'New',
              name: imageName,
            },
          ]
        : imageData
        ? [
            {
              action: null,
              description: imageData.description,
              id: imageData.id,
              imageText: `${imageData.imageText}`,
              name: imageData.name,
              position: 0,
              type: 'png       ',
            },
          ]
        : [],
    };

    console.log('PAYLOAD', payload);

    this.setState(
      {
        updateLoader: true,
      },
      () =>
        updateOrderApi(payload)
          .then(res => {
            this.setState({
              updateLoader: false,
            });
            Alert.alert('Grainz', 'Order updated successfully', [
              {text: 'OK', onPress: () => this.goBackFun()},
            ]);
          })
          .catch(error => {
            this.setState({
              updateLoader: false,
            });
            console.warn('updateFailed', error.response);
          }),
    );
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
    this.setState(
      {
        deleteLoader: true,
      },
      () =>
        deleteOrderApi(param)
          .then(res => {
            this.showCasualPurchases();
            this.setState({
              deleteLoader: false,
            });
            Alert.alert('Grainz', 'Order deleted successfully', [
              {
                text: 'Okay',
                onPress: () => this.goBackFun(),
              },
            ]);
          })
          .catch(error => {
            this.setState({
              deleteLoader: false,
            });
            console.warn('DELETEerror', error.response);
          }),
    );
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
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      includeBase64: true,
      cropping: true,
    }).then(image => {
      this.setState({
        imageModalStatus: true,
        imageDataEdit: image,
      });
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

    // for (i = 0; i < temp.length; i++) {
    //   temp2.push(obj);
    // }

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
    // console.log('asdasdaasdasdas', selectedItems);
    this.setState({selectedItems});
  };

  goBackFun = () => {
    this.props.navigation.goBack();
  };

  selectDepartementNameFun = (index, type, item) => {
    const {yourOrderItems} = this.state;
    const value = item.value;

    let newArr = yourOrderItems.map(
      (item, i) =>
        index === i
          ? {
              ...item,
              [type]: value,
            }
          : item,
      //   if (index === i) {
      //     if (type === 'quantityOrdered') {
      //       return item.quantityOrdered === value;
      //     }
      //   }
    );
    this.setState(
      {
        yourOrderItems: [...newArr],
        orderItemsFinal: [...newArr],
        departmentName: item.value,
        loading: true,
        viewStatus: true,
      },
      () => this.getManualData(),
    );
  };

  onSelectedItemObjectsChange = (
    index,
    type,
    selectedItemObjects,
    id,
    invId,
  ) => {
    const {yourOrderItems} = this.state;
    // console.log('index|tye|value', index, type, selectedItemObjects, id, invId);

    const value = selectedItemObjects[0].name;
    const unitId = selectedItemObjects[0].units[0].id;
    const inventoryId = selectedItemObjects[0].units[0].inventoryId;

    // console.log('unitId', unitId);
    // console.log('vinventoryIdalue', inventoryId);

    let newArr = yourOrderItems.map((item, i) =>
      index === i
        ? {
            ...item,
            [type]: value,
            [id]: unitId,
            [invId]: inventoryId,
          }
        : item,
    );
    this.setState({
      selectedItemObjects,
      yourOrderItems: [...newArr],
      orderItemsFinal: [...newArr],
    });
  };

  editQuantityPriceFun = (index, type, value) => {
    const {yourOrderItems} = this.state;

    let newArr = yourOrderItems.map((item, i) =>
      index === i
        ? {
            ...item,
            [type]: value,
          }
        : item,
    );
    this.setState({
      yourOrderItems: [...newArr],
      orderItemsFinal: [...newArr],
    });
    // console.log('yourOrderItems', yourOrderItems);
  };

  setModalVisibleImage = () => {
    this.setState({
      imageModalStatus: false,
      imageDataEdit: '',
    });
  };

  deleteImageFun = () => {
    this.setState({
      imageModalStatus: false,
      imageDataEdit: '',
      imageShow: false,
    });
  };

  saveImageFun = () => {
    this.setState({
      imageModalStatus: false,
      imageShow: true,
    });
  };

  render() {
    const {
      firstName,
      buttons,
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
      deleteLoader,
      updateLoader,
      imageData,
      imageShow,
      imageModalStatus,
      imageDesc,
      imageName,
      imageDataEdit,
    } = this.state;
    // console.log('imageData', imageData);
    // console.log('imageDataEdit', imageDataEdit);

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
                        {deleteLoader ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          translate('Delete')
                        )}
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
                {yourOrderItems.map((ele, index) => {
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
                                this.selectDepartementNameFun(
                                  index,
                                  'departmentName',
                                  item,
                                )
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
                              onSelectedItemObjectsChange={obj =>
                                this.onSelectedItemObjectsChange(
                                  index,
                                  'name',
                                  obj,
                                  'unitId',
                                  'inventoryId',
                                )
                              }
                              onSelectedItemsChange={this.onSelectedItemsChange}
                              // selectedItems={this.state.selectedItems}
                            />

                            <View>
                              <TextInput
                                editable={!editDisabled}
                                placeholder="Quantity"
                                // placeholder={ele.quantityOrdered}
                                style={{
                                  backgroundColor: editColor,
                                  borderWidth: 1,
                                  padding: 10,
                                  marginBottom: hp('1%'),
                                  marginTop: hp('1%'),
                                }}
                                onChangeText={value => {
                                  this.editQuantityPriceFun(
                                    index,
                                    'quantityOrdered',
                                    value,
                                  );
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
                                  editable={!editDisabled}
                                  placeholder="Price"
                                  // placeholder={ele.unitPrice}
                                  style={{
                                    backgroundColor: editColor,
                                    borderWidth: 1,
                                    padding: 10,
                                    marginBottom: hp('1%'),
                                  }}
                                  value={ele.unitPrice}
                                  onChangeText={value => {
                                    this.editQuantityPriceFun(
                                      index,
                                      'unitPrice',
                                      value,
                                    );
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
                    onValueChange={() =>
                      this.setState({htvaIsSelected: !htvaIsSelected})
                    }
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
                    onValueChange={() =>
                      this.setState({auditIsSelected: !auditIsSelected})
                    }
                    style={{
                      backgroundColor: editColor,
                      margin: 5,
                      height: 20,
                      width: 20,
                    }}
                  />
                </View>
              </View>
              {editDisabled && imageData ? (
                <View style={{marginTop: 15}}>
                  <Image
                    style={{
                      width: wp('60%'),
                      height: 100,
                      resizeMode: 'cover',
                    }}
                    source={{uri: imageData && imageData.imageText}}
                  />
                </View>
              ) : null}
              {imageShow ? (
                <TouchableOpacity
                  style={{marginTop: 15}}
                  onPress={() =>
                    this.setState({
                      imageModalStatus: true,
                    })
                  }>
                  <Image
                    style={{
                      width: wp('60%'),
                      height: 100,
                      resizeMode: 'cover',
                    }}
                    source={{uri: imageDataEdit.path}}
                  />
                </TouchableOpacity>
              ) : null}
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

              {/* {imageData && imageShow === false ? (
                <View style={{marginTop: 15}}>
                  <Image
                    style={{
                      width: wp('60%'),
                      height: 100,
                      resizeMode: 'cover',
                    }}
                    source={{uri: imageData && imageData.imageText}}
                  />
                </View>
              ) : null} */}

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
                    editable={!editDisabled}
                    style={{
                      backgroundColor: editColor,
                      paddingVertical: '40%',
                      paddingLeft: 10,
                      paddingTop: 10,
                    }}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={value => this.setState({note: value})}
                    value={note}
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
                        {updateLoader ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          translate('Save')
                        )}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
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
                      source={{uri: imageDataEdit.path}}
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
