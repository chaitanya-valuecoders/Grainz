import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  TextInput,
  FlatList,
  Platform,
  PermissionsAndroid,
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
  getSupplierProductsApi,
  addDraftApi,
  getCurrentLocUsersAdminApi,
  getBasketApi,
  updateBasketApi,
  sendOrderApi,
  viewShoppingBasketApi,
  downloadPDFApi,
} from '../../../../../connectivity/api';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import styles from '../style';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {translate} from '../../../../../utils/translations';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';

class Basket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      recipeLoader: false,
      buttonsSubHeader: [],
      modalLoader: false,
      actionModalStatus: false,
      buttons: [],
      apiDeliveryDate: '',
      apiOrderDate: '',
      placedByValue: '',
      supplierId: '',
      finalApiData: [],
      modalVisible: false,
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
      itemType: '',
      basketId: '',
      finalArrData: [],
      editStatus: false,
      totalHTVAVal: '',
      mailModalVisible: false,
      productId: '',
      toRecipientValue: '',
      mailMessageValue: '',
      ccRecipientValue: '',
      mailTitleValue: '',
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
          recipeLoader: false,
          buttonsSubHeader: [
            {name: translate('ADMIN')},
            {name: translate('Setup')},
            {name: translate('INBOX')},
          ],
          buttons: [
            {
              name: 'Add items',
              icon: img.addIconNew,
              id: 0,
            },
            {
              name: translate('Save draft'),
              icon: img.draftIcon,
              id: 1,
            },

            {
              name: translate('View'),
              icon: img.pendingIcon,
              id: 2,
            },
          ],
        });
      })
      .catch(err => {
        this.setState({
          recipeLoader: false,
        });
        console.warn('ERr', err);
      });
  };

  componentDidMount() {
    this.getData();
    this.getUsersListData();
    const {finalData, supplierId, itemType, productId} =
      this.props.route && this.props.route.params;
    this.setState(
      {
        supplierId,
        itemType,
        basketId: finalData,
        modalLoader: true,
        finalOrderDate: moment(new Date()).format('L'),
        apiOrderDate: new Date().toISOString(),
        productId,
      },
      () => this.getBasketDataFun(),
    );
  }

  getBasketDataFun = () => {
    const {basketId} = this.state;
    console.log('basketId', basketId);
    getBasketApi(basketId)
      .then(res => {
        console.log('res', res);
        this.setState(
          {
            modalData: res.data && res.data.shopingBasketItemList,
            modalLoader: false,
            totalHTVAVal: res.data && res.data.totalValue,
            placedByValue: res.data && res.data.placedBy,
          },
          () => this.createApiData(),
        );
      })
      .catch(err => {
        Alert.alert(`Error - ${err.response.status}`, 'Something went wrong', [
          {
            text: 'Okay',
          },
        ]);
      });
  };

  createApiData = () => {
    const {modalData} = this.state;
    const finalArr = [];
    modalData.map(item => {
      console.log('item', item);
      finalArr.push({
        id: item.id,
        inventoryId: item.inventoryId,
        inventoryProductMappingId: item.inventoryProductMappingId,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        action: 'string',
        value: item.value,
      });
    });
    this.setState({
      finalApiData: [...finalArr],
    });
  };

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

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  actionFun = data => {
    console.log('data', data);
    this.setState({
      actionModalStatus: true,
      finalArrData: data,
    });
  };

  setModalVisibleFalse = visible => {
    this.setState({
      actionModalStatus: visible,
      mailModalVisible: visible,
    });
  };

  editQuantityFun = (index, type, value) => {
    const {modalData} = this.state;

    let newArr = modalData.map((item, i) =>
      index === i
        ? {
            ...item,
            [type]: value,
            ['action']: 'Update',
          }
        : item,
    );
    this.setState({
      modalData: [...newArr],
    });
  };

  sendFun = () => {
    const {
      apiOrderDate,
      placedByValue,
      supplierId,
      finalApiData,
      basketId,
      apiDeliveryDate,
    } = this.state;
    if (
      apiOrderDate &&
      placedByValue &&
      supplierId &&
      finalApiData &&
      apiDeliveryDate
    ) {
      let payload = {
        id: basketId,
        supplierId: supplierId,
        orderDate: apiOrderDate,
        deliveryDate: apiDeliveryDate,
        placedBy: placedByValue,
        shopingBasketItemList: finalApiData,
      };
      addDraftApi(payload)
        .then(res => {
          console.log('res', res);
          Alert.alert('Grainz', 'Order added successfully', [
            {
              text: 'okay',
              onPress: () =>
                this.setState({
                  mailModalVisible: true,
                  toRecipientValue:
                    res.data && res.data.emailDetails.toRecipient,
                  ccRecipientValue:
                    res.data && res.data.emailDetails.ccRecipients,
                  mailTitleValue: res.data && res.data.emailDetails.subject,
                  mailMessageValue: res.data && res.data.emailDetails.text,
                }),
            },
          ]);
        })
        .catch(err => {
          Alert.alert(
            `Error - ${err.response.status}`,
            'Something went wrong',
            [
              {
                text: 'Okay',
              },
            ],
          );
        });
    } else {
      alert('Please select all values');
    }
  };

  editInventoryFun = () => {
    this.setState({
      actionModalStatus: false,
      editStatus: true,
    });
  };

  deleteInventoryFun = () => {
    this.setState(
      {
        actionModalStatus: false,
      },
      () =>
        setTimeout(() => {
          Alert.alert('Grainz', 'Are you sure you want to delete it?', [
            {
              text: 'Yes',
              onPress: () => this.hitDeleteApiFun(),
            },
            {
              text: 'No',
            },
          ]);
        }, 100),
    );
  };

  hitDeleteApiFun = () => {
    const {supplierId, basketId, finalArrData} = this.state;
    let payload = {
      supplierId: supplierId,
      shopingBasketItemList: [
        {
          id: finalArrData.id,
          inventoryId: finalArrData.inventoryId,
          inventoryProductMappingId: finalArrData.inventoryProductMappingId,
          unitPrice: finalArrData.unitPrice,
          quantity: finalArrData.quantity,
          action: 'Delete',
          value: finalArrData.value,
        },
      ],
      id: basketId,
    };

    console.log('finalArrData', finalArrData);

    console.log('Paylaod', payload);
    updateBasketApi(payload)
      .then(res => {
        console.log('res', res);
        this.setState(
          {
            modalLoader: true,
          },
          () => this.getBasketDataFun(),
        );
      })
      .catch(err => {
        Alert.alert(`Error - ${err.response.status}`, 'Something went wrong', [
          {
            text: 'Okay',
          },
        ]);
      });
  };

  saveDraftFun = () => {
    const {
      apiDeliveryDate,
      apiOrderDate,
      placedByValue,
      supplierId,
      finalApiData,
      basketId,
      modalData,
    } = this.state;
    console.log('finalApiData', finalApiData);
    let payload = {
      id: basketId,
      supplierId: supplierId,
      orderDate: apiOrderDate,
      deliveryDate: apiDeliveryDate,
      placedBy: placedByValue,
      shopingBasketItemList: finalApiData,
    };
    console.log('payoad', payload);
    if (apiOrderDate && placedByValue && supplierId && finalApiData) {
      addDraftApi(payload)
        .then(res => {
          console.log('res', res);
          Alert.alert('Grainz', 'Order added successfully', [
            {
              text: 'okay',
              onPress: () =>
                this.props.navigation.navigate('OrderingAdminScreen'),
            },
          ]);
        })
        .catch(err => {
          Alert.alert(
            `Error - ${err.response.status}`,
            'Something went wrong',
            [
              {
                text: 'Okay',
              },
            ],
          );
        });
    } else {
      alert('Please select all values.');
    }
  };

  flatListFun = item => {
    const {basketId} = this.state;
    if (item.id === 0) {
      this.props.navigation.navigate('AddItemsOrderScreen', {
        screen: 'Update',
        basketId: basketId,
      });
    } else if (item.id === 1) {
      this.saveDraftFun();
    } else {
      alert('VIEW');
      // this.downLoadPdf('data');
      // this.viewFun();
      // this.viewFunSec();
    }
  };

  viewFun = () => {
    const {
      apiOrderDate,
      placedByValue,
      supplierId,
      finalApiData,
      basketId,
      apiDeliveryDate,
    } = this.state;
    let payload = {
      id: basketId,
      supplierId: supplierId,
      orderDate: apiOrderDate,
      deliveryDate: apiDeliveryDate,
      placedBy: placedByValue,
      shopingBasketItemList: finalApiData,
    };
    if (
      apiDeliveryDate &&
      placedByValue &&
      apiDeliveryDate &&
      basketId &&
      finalApiData &&
      supplierId
    ) {
      addDraftApi(payload)
        .then(res => {
          Alert.alert('Grainz', 'Order added successfully', [
            {
              text: 'okay',
              onPress: () => this.viewFunSec(),
            },
          ]);
        })
        .catch(err => {
          Alert.alert(
            `Error - ${err.response.status}`,
            'Something went wrong',
            [
              {
                text: 'Okay',
              },
            ],
          );
        });
    } else {
      alert('Please select all values');
    }
  };

  viewFunSec = () => {
    const {basketId} = this.state;
    console.log('bas', basketId);
    downloadPDFApi(basketId)
      .then(res => {
        // this.downLoadPdf(res.data);
        console.log('res', res);
      })
      .catch(err => {
        Alert.alert(`Error - ${err.response.status}`, 'Something went wrong', [
          {
            text: 'Okay',
          },
        ]);
      });
    // viewShoppingBasketApi(basketId)
    //   .then(res => {
    //     this.downLoadPdf(res.data);
    //     console.log('res', res);
    //   })
    //   .catch(err => {
    //     console.log('Err', err);
    //   });
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

  updateBasketFun = () => {
    const {supplierId, basketId, modalData} = this.state;
    let payload = {
      supplierId: supplierId,
      shopingBasketItemList: modalData,
      id: basketId,
    };
    updateBasketApi(payload)
      .then(res => {
        console.log('res', res);
        this.setState(
          {
            modalLoader: true,
            editStatus: false,
          },
          () => this.getBasketDataFun(),
        );
      })
      .catch(err => {
        Alert.alert(`Error - ${err.response.status}`, 'Something went wrong', [
          {
            text: 'Okay',
          },
        ]);
      });
  };

  sendMailFun = () => {
    const {
      basketId,
      toRecipientValue,
      mailMessageValue,
      ccRecipientValue,
      mailTitleValue,
    } = this.state;
    let payload = {
      emailDetails: {
        ccRecipients: ccRecipientValue,
        subject: mailTitleValue,
        text: mailMessageValue,
        toRecipient: toRecipientValue,
      },
      shopingBasketId: basketId,
    };

    console.log('payload', payload);

    sendOrderApi(payload)
      .then(res => {
        console.log('res', res);
        this.setState(
          {
            mailModalVisible: false,
          },
          () => this.props.navigation.navigate('OrderingAdminScreen'),
        );
      })
      .catch(err => {
        Alert.alert(`Error - ${err.response.status}`, 'Something went wrong', [
          {
            text: 'Okay',
          },
        ]);
      });
  };

  closeMailModal = () => {
    this.setState(
      {
        mailModalVisible: false,
      },
      () => this.props.navigation.navigate('OrderingAdminScreen'),
    );
  };

  downLoadPdf = data => {
    this.historyDownload(data);
  };

  historyDownload = data => {
    if (Platform.OS === 'ios') {
      this.downloadHistory(data);
    } else {
      try {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'storage title',
            message: 'storage_permission',
          },
        ).then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //Once user grant the permission start downloading
            // console.log('Storage Permission Granted.');
            this.downloadHistory(data);
          } else {
            //If permission denied then show alert 'Storage Permission Not Granted'
            Alert.alert('Please grant storage permission');
          }
        });
      } catch (err) {
        //To handle permission related issue
        // console.log('error', err);
      }
    }
  };

  downloadHistory = async data => {
    // console.warn('receipt', data);
    var pdf_url = data.receipt;
    let PictureDir =
      Platform.OS === 'ios'
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DownloadDir;
    let date = new Date();
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/grainz_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          '.pdf',
        description: 'Order File',
      },
    };
    RNFetchBlob.config(options)
      .fetch('GET', 'http://www.africau.edu/images/default/sample.pdf')
      .then(res => {
        console.log('res', res);
        Alert.alert('Ticket receipt downloaded successfully!');
      })
      .catch(err => {
        console.log('PDFErr', err);
      });
  };

  render() {
    const {
      buttonsSubHeader,
      recipeLoader,
      modalData,
      modalLoader,
      actionModalStatus,
      buttons,
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
      editStatus,
      totalHTVAVal,
      mailModalVisible,
      toRecipientValue,
      mailMessageValue,
      ccRecipientValue,
      mailTitleValue,
    } = this.state;

    return (
      <View style={styles.container}>
        <Header
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
                <Text style={styles.adminTextStyle}>Basket</Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginHorizontal: wp('3%')}}>
            <View>
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
            </View>
          </View>

          {recipeLoader ? (
            <ActivityIndicator size="small" color="#94C036" />
          ) : (
            <View style={{marginTop: hp('2%')}}>
              {modalLoader ? (
                <ActivityIndicator size="large" color="grey" />
              ) : (
                <View
                  style={{
                    padding: hp('2%'),
                  }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        <View>
                          <View
                            style={{
                              paddingVertical: 15,
                              paddingHorizontal: 5,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              backgroundColor: '#EFFBCF',
                            }}>
                            <View
                              style={{
                                width: wp('40%'),
                                alignItems: 'center',
                              }}>
                              <Text style={{textAlign: 'center'}}>Name</Text>
                            </View>
                            <View
                              style={{
                                width: wp('30%'),
                                alignItems: 'center',
                              }}>
                              <Text>Quantity</Text>
                            </View>
                            <View
                              style={{
                                width: wp('30%'),
                                alignItems: 'center',
                              }}>
                              <Text>HTVA ($)</Text>
                            </View>

                            <View
                              style={{
                                width: wp('30%'),
                                alignItems: 'center',
                              }}></View>
                          </View>
                          <View>
                            {modalData && modalData.length > 0 ? (
                              modalData.map((item, index) => {
                                return (
                                  <View key={index}>
                                    <View
                                      style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 5,
                                        flexDirection: 'row',
                                        backgroundColor:
                                          index % 2 === 0
                                            ? '#FFFFFF'
                                            : '#F7F8F5',
                                      }}>
                                      <View
                                        style={{
                                          width: wp('40%'),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        <Text>
                                          {item.inventoryMapping &&
                                            item.inventoryMapping.productName}
                                        </Text>
                                      </View>
                                      {editStatus ? (
                                        <View
                                          style={{
                                            width: wp('30%'),
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                          }}>
                                          <TextInput
                                            value={String(item.quantity)}
                                            style={{
                                              borderWidth: 1,
                                              borderRadius: 6,
                                              padding: 10,
                                              width: wp('22%'),
                                            }}
                                            onChangeText={value =>
                                              this.editQuantityFun(
                                                index,
                                                'quantity',
                                                value,
                                                item,
                                              )
                                            }
                                          />
                                        </View>
                                      ) : (
                                        <View
                                          style={{
                                            width: wp('30%'),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                          }}>
                                          <Text>
                                            {Number(
                                              item.calculatedQuantity,
                                            ).toFixed(2)}{' '}
                                            {item.unit}
                                          </Text>
                                        </View>
                                      )}
                                      <View
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        <Text>
                                          $ {Number(item.value).toFixed(2)}
                                        </Text>
                                      </View>

                                      <TouchableOpacity
                                        onPress={() => this.actionFun(item)}
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        <Image
                                          source={img.threeDotsIcon}
                                          style={{
                                            height: 15,
                                            width: 15,
                                            resizeMode: 'contain',
                                          }}
                                        />
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                );
                              })
                            ) : (
                              <View style={{marginTop: hp('3%')}}>
                                <Text style={{color: 'red', fontSize: 20}}>
                                  No data available
                                </Text>
                              </View>
                            )}
                            <View
                              style={{
                                paddingVertical: 15,
                                paddingHorizontal: 5,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                backgroundColor: '#FFFFFF',
                              }}>
                              <View
                                style={{
                                  width: wp('40%'),
                                  alignItems: 'center',
                                }}></View>
                              <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}>
                                <Text>Total HTVA</Text>
                              </View>
                              <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}>
                                <Text>
                                  {' '}
                                  $ {Number(totalHTVAVal).toFixed(2)}
                                </Text>
                              </View>

                              <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}></View>
                            </View>
                          </View>
                        </View>
                      </ScrollView>
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
          )}
          {editStatus ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => this.updateBasketFun()}
                style={{
                  height: hp('6%'),
                  width: wp('80%'),
                  backgroundColor: '#94C036',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                  marginTop: hp('2%'),
                }}>
                <View
                  style={{
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      marginLeft: 10,
                      fontFamily: 'Inter-SemiBold',
                    }}>
                    {translate('Update')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={{marginVertical: hp('3%')}}>
            <FlatList
              horizontal
              data={buttons}
              renderItem={({item}) => (
                <View style={styles.itemContainer}>
                  <TouchableOpacity
                    onPress={() => this.flatListFun(item)}
                    style={{
                      backgroundColor: '#fff',
                      flex: 1,
                      margin: 10,
                      borderRadius: 8,
                      padding: 15,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={item.icon}
                        style={{
                          height: 40,
                          width: 40,
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 13,
                          textAlign: 'center',
                          fontFamily: 'Inter-Regular',
                        }}
                        numberOfLines={1}>
                        {' '}
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.id}
              // numColumns={3}
            />
          </View>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => this.sendFun()}
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
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    marginLeft: 10,
                    fontFamily: 'Inter-SemiBold',
                  }}>
                  {translate('Send')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Modal isVisible={mailModalVisible} backdropOpacity={0.35}>
            <View
              style={{
                width: wp('80%'),
                height: hp('65%'),
                backgroundColor: '#F0F4FE',
                alignSelf: 'center',
                borderRadius: 6,
              }}>
              <View
                style={{
                  backgroundColor: '#87AF30',
                  height: hp('6%'),
                  flexDirection: 'row',
                  borderTopRightRadius: 6,
                  borderTopLeftRadius: 6,
                }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: '#fff'}}>Send Mail</Text>
                </View>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    padding: hp('3%'),
                  }}>
                  <View style={{}}>
                    <View style={{}}>
                      <TextInput
                        value={mailTitleValue}
                        placeholder="Title"
                        style={{
                          padding: 15,
                          width: '100%',
                          backgroundColor: '#fff',
                          borderRadius: 5,
                        }}
                        onChangeText={value =>
                          this.setState({
                            mailTitleValue: value,
                          })
                        }
                      />
                    </View>
                    <View style={{marginTop: hp('3%')}}>
                      <TextInput
                        value={toRecipientValue}
                        placeholder="To"
                        style={{
                          padding: 15,
                          width: '100%',
                          backgroundColor: '#fff',
                          borderRadius: 5,
                        }}
                        onChangeText={value =>
                          this.setState({
                            toRecipientValue: value,
                          })
                        }
                      />
                    </View>
                    <View style={{marginTop: hp('3%')}}>
                      <TextInput
                        value={ccRecipientValue}
                        placeholder="CC"
                        style={{
                          padding: 15,
                          width: '100%',
                          backgroundColor: '#fff',
                          borderRadius: 5,
                        }}
                        onChangeText={value =>
                          this.setState({
                            ccRecipientValue: value,
                          })
                        }
                      />
                    </View>

                    <View style={{marginTop: hp('3%')}}>
                      <TextInput
                        value={mailMessageValue}
                        placeholder="Message"
                        style={{
                          padding: 15,
                          width: '100%',
                          backgroundColor: '#fff',
                          borderRadius: 5,
                        }}
                        onChangeText={value =>
                          this.setState({
                            mailMessageValue: value,
                          })
                        }
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: hp('4%'),
                      }}>
                      <TouchableOpacity
                        onPress={() => this.sendMailFun()}
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
                          {translate('Confirm')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.closeMailModal()}
                        style={{
                          width: wp('30%'),
                          height: hp('5%'),
                          alignSelf: 'flex-end',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginLeft: wp('2%'),
                          borderRadius: 100,
                          borderColor: '#482813',
                          borderWidth: 1,
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
              </ScrollView>
            </View>
          </Modal>
          <Modal isVisible={actionModalStatus} backdropOpacity={0.35}>
            <View
              style={{
                width: wp('80%'),
                height: hp('19%'),
                backgroundColor: '#fff',
                alignSelf: 'center',
                borderRadius: 14,
              }}>
              <TouchableOpacity
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => this.editInventoryFun()}>
                <View
                  style={{
                    paddingHorizontal: wp('8%'),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#161C27',
                      fontFamily: 'Inter-Regular',
                      fontSize: 18,
                    }}>
                    Edit Inventory
                  </Text>
                  <Image
                    source={img.editIconNew}
                    style={{
                      height: 15,
                      width: 15,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => this.deleteInventoryFun()}>
                <View
                  style={{
                    paddingHorizontal: wp('8%'),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#94C01F',
                      fontFamily: 'Inter-Regular',
                      fontSize: 18,
                    }}>
                    Delete Inventory
                  </Text>
                  <Image
                    source={img.deleteIconNew}
                    style={{
                      height: 15,
                      width: 15,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setModalVisibleFalse(false)}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{}}>
                  <Text
                    style={{
                      color: '#161C27',
                      fontFamily: 'Inter-Regular',
                      fontSize: 18,
                    }}>
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>
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

export default connect(mapStateToProps, {UserTokenAction})(Basket);
