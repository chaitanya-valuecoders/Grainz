import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
  Switch,
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
  getOrderByIdApi,
  processPendingOrderApi,
  processPendingOrderItemApi,
} from '../../../../../connectivity/api';
import styles from '../style';
import {translate} from '../../../../../utils/translations';
import moment from 'moment';
import CheckBox from '@react-native-community/checkbox';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LoaderComp from '../../../../../components/Loader';

class ViewPendingDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      buttonsSubHeader: [],
      loader: true,
      userId: '',
      userArr: [],
      pageData: '',
      finalOfferListArr: [],
      productId: '',
      isDatePickerVisibleDeliveryDate: false,
      finalDeliveryDate: '',
      apiDeliveryDate: '',
      isDatePickerVisibleArrivalDate: false,
      finalArrivalDate: '',
      apiArrivalDate: '',
      pageInvoiceNumber: '',
      pageDeliveryNoteReference: '',
      pageAmbientTemp: '',
      pageChilledTemp: '',
      pageFrozenTemp: '',
      pageNotes: '',
      pageOrderItems: [],
      finalApiData: [],
      loaderCompStatus: false,
      arrivalDataStatus: false,
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
          loader: false,

          buttonsSubHeader: [
            {name: translate('ADMIN')},
            {name: translate('Setup')},
            {name: translate('INBOX')},
          ],
        });
      })
      .catch(err => {
        console.warn('ERr', err.response);
      });
  };

  removeToken = async () => {
    await AsyncStorage.removeItem('@appToken');
    this.props.UserTokenAction(null);
  };

  componentDidMount() {
    this.getData();
    const {item} = this.props.route && this.props.route.params;
    this.setState(
      {
        productId: item.id,
        arrivalDataStatus: false,
      },
      () => this.getOrderFun(),
    );
  }

  getOrderFun = () => {
    const {productId} = this.state;
    getOrderByIdApi(productId)
      .then(res => {
        console.log('res', res);
        const {data} = res;
        this.setState(
          {
            pageData: data,
            finalDeliveryDate: data.deliveryDate,
            pageInvoiceNumber: data.invoiceNumber,
            pageDeliveryNoteReference: data.deliveryNoteReference,
            pageAmbientTemp: data.ambientTemp,
            pageChilledTemp: data.chilledTemp,
            pageFrozenTemp: data.frozenTemp,
            pageNotes: data.notes,
            apiDeliveryDate: data.deliveryDate,
            pageOrderItems: data.orderItems,
            apiArrivalDate: data.deliveredDate,
            finalArrivalDate: data.deliveredDate,
            loaderCompStatus: false,
          },
          () => this.createFinalData(),
        );
      })
      .catch(err => {
        console.log('ERR MEP', err);

        this.setState({
          recipeLoader: false,
        });
      });
  };

  createFinalData = () => {
    const {pageOrderItems} = this.state;
    let finalArray = pageOrderItems.map((item, index) => {
      return {
        arrivedDate: item.arrivedDate,
        id: item.id,
        inventoryId: item.inventoryId,
        inventoryProductMappingId:
          item.inventoryMapping && item.inventoryMapping.id,
        isCorrect: item.isCorrect,
        notes: item.notes,
        orderValue: item.orderValue,
        pricePaid: item.pricePaid,
        quantityDelivered: item.quantityDelivered,
        quantityInvoiced: item.quantityInvoiced,
        quantityOrdered: item.quantityOrdered,
        userQuantityDelivered: item.userQuantityDelivered,
        userQuantityInvoiced: item.userQuantityInvoiced,
      };
    });

    const result = finalArray;
    this.setState({
      finalApiData: [...result],
    });
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  saveFun = () => {
    this.setState(
      {
        loaderCompStatus: true,
      },
      () => this.hitProcessOrderApi(),
    );
  };

  hitProcessOrderApi = () => {
    const {
      apiDeliveryDate,
      apiArrivalDate,
      pageInvoiceNumber,
      pageDeliveryNoteReference,
      pageAmbientTemp,
      pageChilledTemp,
      pageFrozenTemp,
      pageNotes,
      pageData,
      finalApiData,
      productId,
    } = this.state;
    let payload = {
      ambientTemp: pageAmbientTemp,
      chilledTemp: pageChilledTemp,
      deliveredDate: apiArrivalDate,
      deliveryDate: apiDeliveryDate,
      deliveryNoteReference: pageDeliveryNoteReference,
      frozenTemp: pageFrozenTemp,
      id: productId,
      invoiceNumber: pageInvoiceNumber,
      isAuditComplete: pageData.isAuditComplete,
      notes: pageNotes,
      orderDate: pageData.orderDate,
      orderItems: finalApiData,
      orderReference: pageData.orderReference,
      placedBy: pageData.placedByNAme,
    };

    console.log('payloadOrderProcess', payload);
    processPendingOrderApi(payload)
      .then(res => {
        this.setState({
          loaderCompStatus: false,
        });
        Alert.alert(`Grainz`, 'Order processed successfully', [
          {
            text: 'Okay',
            onPress: () => this.navigateToOrderScreen(),
          },
        ]);
      })
      .catch(err => {
        Alert.alert(`Error - ${err.response.status}`, 'Something went wrong', [
          {
            text: 'Okay',
          },
        ]);
      });
  };

  navigateToOrderScreen = () => {
    const {arrivalDataStatus} = this.state;
    if (arrivalDataStatus) {
      this.setState(
        {
          loaderCompStatus: true,
        },
        () => this.getOrderFun(),
      );
    } else {
      this.props.navigation.navigate('OrderingAdminScreen');
    }
  };

  deleteFun = item => {
    Alert.alert(
      `Grainz`,
      'Are you sure you want to delete this order line item?',
      [
        {
          text: 'Yes',
          onPress: () =>
            this.setState(
              {
                loaderCompStatus: true,
              },
              () => this.hitDeleteApi(item),
            ),
        },
        {
          text: 'No',
        },
      ],
    );
  };

  hitDeleteApi = item => {
    let payload = {
      action: 'Delete',
      id: item.id,
      inventoryId: item.inventoryId,
      inventoryProductMappingId:
        item.inventoryMapping && item.inventoryMapping.id,
      isCorrect: !item.isCorrect,
      notes: item.notes,
      orderId: item.orderId,
      orderValue: item.orderValue,
      position: item.position,
      pricePaid: item.pricePaid,
      quantityDelivered: item.quantityDelivered,
      quantityInvoiced: item.quantityInvoiced,
      quantityOrdered: item.quantityOrdered,
      userQuantityDelivered: item.userQuantityDelivered,
      userQuantityInvoiced: item.userQuantityInvoiced,
    };
    console.log('payloadDelete', payload);

    processPendingOrderItemApi(payload)
      .then(res => {
        console.log('res', res);
        this.setState({
          loaderCompStatus: false,
        });
        Alert.alert(`Grainz`, 'Order line item deleted successfully', [
          {
            text: 'Okay',
            onPress: () =>
              this.setState(
                {
                  loaderCompStatus: true,
                },

                () => this.getOrderFun(),
              ),
          },
        ]);
      })
      .catch(err => {
        Alert.alert(`Error - ${err.response.status}`, 'Something went wrong', [
          {
            text: 'Okay',
          },
        ]);
      });
  };

  showDatePickerDeliveryDate = () => {
    this.setState({
      isDatePickerVisibleDeliveryDate: true,
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

  showDatePickerArrivalDate = () => {
    this.setState({
      isDatePickerVisibleArrivalDate: true,
    });
  };

  handleConfirmArrivalDate = date => {
    console.log('date', date);
    let newdate = moment(date).format('MM/DD/YYYY');
    let apiArrivalDate = date.toISOString();
    this.hideDatePickerArrivalDate();
    this.setState(
      {
        finalArrivalDate: newdate,
        apiArrivalDate,
        arrivalDataStatus: true,
      },
      () =>
        setTimeout(() => {
          this.editArrivalDateFun();
        }, 300),
    );
  };

  editArrivalDateFun = index => {
    const {finalApiData, apiArrivalDate} = this.state;
    const arrivedDate = apiArrivalDate;
    let newArr = finalApiData.map((item, i) =>
      index === i
        ? {
            ...item,
            ['arrivedDate']: arrivedDate,
          }
        : {
            ...item,
            ['arrivedDate']: arrivedDate,
          },
    );
    console.log('newArr', newArr);

    this.setState(
      {
        finalApiData: [...newArr],
      },
      () => this.saveFun(),
    );
  };

  hideDatePickerArrivalDate = () => {
    this.setState({
      isDatePickerVisibleArrivalDate: false,
    });
  };
  updateCorrectStatus = item => {
    this.setState(
      {
        loaderCompStatus: true,
      },
      () => this.updateCorrectStatusSec(item),
    );
  };

  updateCorrectStatusSec = item => {
    let payload = {
      action: 'Update',
      arrivedDate: item.arrivedDate,
      id: item.id,
      inventoryId: item.inventoryId,
      inventoryProductMappingId:
        item.inventoryMapping && item.inventoryMapping.id,
      isCorrect: !item.isCorrect,
      notes: item.notes,
      orderId: item.orderId,
      orderValue: item.orderValue,
      position: item.position,
      pricePaid: item.pricePaid,
      quantityDelivered: item.quantityDelivered,
      quantityInvoiced: item.quantityInvoiced,
      quantityOrdered: item.quantityOrdered,
      userQuantityDelivered: item.userQuantityDelivered,
      userQuantityInvoiced: item.userQuantityInvoiced,
    };
    console.log('payloadUpdate', payload);
    if (item.arrivedDate) {
      processPendingOrderItemApi(payload)
        .then(res => {
          this.setState({
            loaderCompStatus: false,
          });
          Alert.alert(`Grainz`, 'Correct status updated successfully', [
            {
              text: 'Okay',
              onPress: () =>
                this.setState(
                  {
                    loaderCompStatus: true,
                  },

                  () => this.getOrderFun(),
                ),
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
      Alert.alert(`Grainz`, 'Kildly fill arrived date first', [
        {
          text: 'Okay',
          onPress: () => this.closeLoader(),
        },
      ]);
    }
  };

  closeLoader = () => {
    this.setState({
      loaderCompStatus: false,
    });
  };

  render() {
    const {
      buttonsSubHeader,
      loader,
      managerName,
      pageData,
      isDatePickerVisibleDeliveryDate,
      finalDeliveryDate,
      isDatePickerVisibleArrivalDate,
      finalArrivalDate,
      pageInvoiceNumber,
      pageDeliveryNoteReference,
      pageAmbientTemp,
      pageChilledTemp,
      pageFrozenTemp,
      pageNotes,
      pageOrderItems,
      loaderCompStatus,
    } = this.state;

    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {loader ? (
          <ActivityIndicator size="small" color="#98C13E" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} index={0} />
        )}
        <LoaderComp loaderComp={loaderCompStatus} />
        <View style={{...styles.subContainer, flex: 1}}>
          <View style={styles.firstContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.adminTextStyle}>{pageData.supplierName}</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.goBackContainer}>
              <Text style={styles.goBackTextStyle}>Go Back</Text>
            </TouchableOpacity>
          </View>

          <View style={{flex: 1}}>
            <ScrollView style={{}} showsVerticalScrollIndicator={false}>
              <View style={{padding: hp('3%')}}>
                <View style={{}}>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      editable={false}
                      placeholder="Order Date"
                      value={
                        pageData.orderDate &&
                        moment(pageData.orderDate).format('L')
                      }
                      style={{
                        padding: 14,
                        justifyContent: 'space-between',
                        elevation: 3,
                        shadowOpacity: 2.0,
                        shadowColor: 'rgba(0, 0, 0, 0.05)',
                        shadowOffset: {
                          width: 2,
                          height: 2,
                        },
                        shadowRadius: 10,
                        borderRadius: 5,
                        backgroundColor: '#E9ECEF',
                        borderWidth: 0.2,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      marginBottom: hp('3%'),
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
                          value={
                            finalDeliveryDate &&
                            moment(finalDeliveryDate).format('L')
                          }
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
                  <View
                    style={{
                      marginBottom: hp('3%'),
                    }}>
                    <View style={{}}>
                      <TouchableOpacity
                        onPress={() => this.showDatePickerArrivalDate()}
                        style={{
                          width: wp('90%'),
                          padding: Platform.OS === 'ios' ? 15 : 5,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          backgroundColor: '#fff',
                          borderRadius: 5,
                        }}>
                        <TextInput
                          placeholder="Arrived Date"
                          value={
                            finalArrivalDate &&
                            moment(finalArrivalDate).format('L')
                          }
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
                        isVisible={isDatePickerVisibleArrivalDate}
                        mode={'date'}
                        onConfirm={this.handleConfirmArrivalDate}
                        onCancel={this.hideDatePickerArrivalDate}
                      />
                    </View>
                  </View>

                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Order reference"
                      value={pageData.orderReference}
                      editable={false}
                      style={{
                        padding: 14,
                        justifyContent: 'space-between',
                        elevation: 3,
                        shadowOpacity: 2.0,
                        shadowColor: 'rgba(0, 0, 0, 0.05)',
                        shadowOffset: {
                          width: 2,
                          height: 2,
                        },
                        shadowRadius: 10,
                        borderRadius: 5,
                        backgroundColor: '#E9ECEF',
                        borderWidth: 0.2,
                      }}
                    />
                  </View>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Invoice number"
                      value={pageInvoiceNumber}
                      style={{
                        padding: 14,
                        justifyContent: 'space-between',
                        elevation: 3,
                        shadowOpacity: 2.0,
                        shadowColor: 'rgba(0, 0, 0, 0.05)',
                        shadowOffset: {
                          width: 2,
                          height: 2,
                        },
                        shadowRadius: 10,
                        borderRadius: 5,
                        backgroundColor: '#fff',
                      }}
                      onChangeText={value =>
                        this.setState({
                          pageInvoiceNumber: value,
                        })
                      }
                    />
                  </View>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Delivery note reference"
                      value={pageDeliveryNoteReference}
                      style={{
                        padding: 14,
                        justifyContent: 'space-between',
                        elevation: 3,
                        shadowOpacity: 2.0,
                        shadowColor: 'rgba(0, 0, 0, 0.05)',
                        shadowOffset: {
                          width: 2,
                          height: 2,
                        },
                        shadowRadius: 10,
                        borderRadius: 5,
                        backgroundColor: '#fff',
                      }}
                      onChangeText={value =>
                        this.setState({
                          pageDeliveryNoteReference: value,
                        })
                      }
                    />
                  </View>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Ambient Temperature"
                      value={pageAmbientTemp && String(pageAmbientTemp)}
                      style={{
                        padding: 14,
                        justifyContent: 'space-between',
                        elevation: 3,
                        shadowOpacity: 2.0,
                        shadowColor: 'rgba(0, 0, 0, 0.05)',
                        shadowOffset: {
                          width: 2,
                          height: 2,
                        },
                        shadowRadius: 10,
                        borderRadius: 5,
                        backgroundColor: '#fff',
                      }}
                      onChangeText={value =>
                        this.setState({
                          pageAmbientTemp: value,
                        })
                      }
                    />
                  </View>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Chilled Temperature"
                      value={pageChilledTemp && String(pageChilledTemp)}
                      style={{
                        padding: 14,
                        justifyContent: 'space-between',
                        elevation: 3,
                        shadowOpacity: 2.0,
                        shadowColor: 'rgba(0, 0, 0, 0.05)',
                        shadowOffset: {
                          width: 2,
                          height: 2,
                        },
                        shadowRadius: 10,
                        borderRadius: 5,
                        backgroundColor: '#fff',
                      }}
                      onChangeText={value =>
                        this.setState({
                          pageChilledTemp: value,
                        })
                      }
                    />
                  </View>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Frozen Temperature"
                      value={pageFrozenTemp && String(pageFrozenTemp)}
                      style={{
                        padding: 14,
                        justifyContent: 'space-between',
                        elevation: 3,
                        shadowOpacity: 2.0,
                        shadowColor: 'rgba(0, 0, 0, 0.05)',
                        shadowOffset: {
                          width: 2,
                          height: 2,
                        },
                        shadowRadius: 10,
                        borderRadius: 5,
                        backgroundColor: '#fff',
                      }}
                      onChangeText={value =>
                        this.setState({
                          pageFrozenTemp: value,
                        })
                      }
                    />
                  </View>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Notes"
                      value={pageNotes}
                      style={{
                        padding: 14,
                        justifyContent: 'space-between',
                        elevation: 3,
                        shadowOpacity: 2.0,
                        shadowColor: 'rgba(0, 0, 0, 0.05)',
                        shadowOffset: {
                          width: 2,
                          height: 2,
                        },
                        shadowRadius: 10,
                        borderRadius: 5,
                        backgroundColor: '#fff',
                      }}
                      onChangeText={value =>
                        this.setState({
                          pageNotes: value,
                        })
                      }
                    />
                  </View>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Placed by"
                      value={pageData.placedByNAme}
                      editable={false}
                      style={{
                        padding: 14,
                        justifyContent: 'space-between',
                        elevation: 3,
                        shadowOpacity: 2.0,
                        shadowColor: 'rgba(0, 0, 0, 0.05)',
                        shadowOffset: {
                          width: 2,
                          height: 2,
                        },
                        shadowRadius: 10,
                        borderRadius: 5,
                        backgroundColor: '#E9ECEF',
                        borderWidth: 0.2,
                      }}
                    />
                  </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                    <View
                      style={{
                        paddingVertical: 15,
                        paddingHorizontal: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: '#EFFBCF',
                        marginTop: hp('3%'),
                        borderRadius: 6,
                      }}>
                      <View
                        style={{
                          width: wp('50%'),
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#161C27',
                            fontSize: 14,
                            fontFamily: 'Inter-SemiBold',
                          }}>
                          Inventory item
                        </Text>
                      </View>
                      <View
                        style={{
                          width: wp('30%'),
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#161C27',
                            fontSize: 14,
                            fontFamily: 'Inter-SemiBold',
                          }}>
                          Arrived date
                        </Text>
                      </View>
                      <View
                        style={{
                          width: wp('30%'),
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#161C27',
                            fontSize: 14,
                            fontFamily: 'Inter-SemiBold',
                          }}>
                          Quantity
                        </Text>
                      </View>
                      <View
                        style={{
                          width: wp('30%'),
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#161C27',
                            fontSize: 14,
                            fontFamily: 'Inter-SemiBold',
                          }}>
                          € HTVA
                        </Text>
                      </View>
                      <View
                        style={{
                          width: wp('30%'),
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#161C27',
                            fontSize: 14,
                            fontFamily: 'Inter-SemiBold',
                          }}>
                          Correct ?
                        </Text>
                      </View>

                      <View
                        style={{
                          width: wp('30%'),
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#161C27',
                            fontSize: 14,
                            fontFamily: 'Inter-SemiBold',
                          }}>
                          Action
                        </Text>
                      </View>
                    </View>
                    <View>
                      {pageData && pageOrderItems.length > 0
                        ? pageOrderItems.map((item, index) => {
                            return (
                              <View
                                key={index}
                                style={{
                                  paddingVertical: 10,
                                  paddingHorizontal: 5,
                                  flexDirection: 'row',
                                  backgroundColor: '#fff',
                                }}>
                                <TouchableOpacity
                                  onPress={() => alert('yo')}
                                  style={{
                                    width: wp('50%'),
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#161C27',
                                      fontSize: 14,
                                      fontFamily: 'Inter-SemiBold',
                                      marginBottom: 8,
                                    }}>
                                    {item.inventoryMapping &&
                                      item.inventoryMapping.inventoryName}
                                  </Text>
                                  <Text
                                    style={{
                                      color: '#161C27',
                                      fontSize: 14,
                                      fontFamily: 'Inter-Regular',
                                    }}>
                                    {item.productName}
                                  </Text>
                                </TouchableOpacity>
                                <View
                                  style={{
                                    width: wp('30%'),
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#161C27',
                                      fontSize: 14,
                                      fontFamily: 'Inter-Regular',
                                    }}>
                                    {item.arrivedDate &&
                                      moment(item.arrivedDate).format('L')}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    width: wp('30%'),
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#161C27',
                                      fontSize: 14,
                                      fontFamily: 'Inter-SemiBold',
                                      marginBottom: 8,
                                    }}>
                                    {item.grainzVolume} {item.grainzUnit}
                                  </Text>
                                  <Text
                                    style={{
                                      color: '#161C27',
                                      fontSize: 14,
                                      fontFamily: 'Inter-Regular',
                                    }}>
                                    {`${item.quantityOrdered} X ${item.packSize}/${item.unit}`}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    width: wp('30%'),
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#161C27',
                                      fontSize: 14,
                                      fontFamily: 'Inter-Regular',
                                    }}>
                                    € {Number(item.orderValue).toFixed(2)}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    width: wp('30%'),
                                    alignItems: 'center',
                                  }}>
                                  <Switch
                                    style={{}}
                                    trackColor={{
                                      false: '#767577',
                                      true: '#94C036',
                                    }}
                                    value={item.isCorrect}
                                    onValueChange={() =>
                                      this.updateCorrectStatus(item)
                                    }
                                    thumbColor="#fff"
                                  />
                                </View>
                                <TouchableOpacity
                                  onPress={() => this.deleteFun(item)}
                                  style={{
                                    width: wp('30%'),
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      backgroundColor: 'red',
                                      paddingHorizontal: 15,
                                      paddingVertical: 10,
                                      borderRadius: 5,
                                    }}>
                                    <Image
                                      source={img.deleteIconNew}
                                      style={{
                                        width: 18,
                                        height: 18,
                                        tintColor: '#fff',
                                        resizeMode: 'contain',
                                      }}
                                    />
                                  </View>
                                </TouchableOpacity>
                              </View>
                            );
                          })
                        : null}
                    </View>
                  </View>
                </ScrollView>

                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      flex: 1,
                      backgroundColor: '#FFFFFF',
                      paddingVertical: hp('3%'),
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}></View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{}}>Total HTVA</Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text> $ --</Text>
                      {/* <Text> $ {Number(totalHTVAVal).toFixed(2)}</Text> */}
                    </View>
                  </View>
                </View>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: hp('2%'),
                    marginBottom: hp('3%'),
                  }}>
                  <TouchableOpacity
                    onPress={() => this.saveFun()}
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
                      {translate('Save')}
                    </Text>
                  </TouchableOpacity>
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
            </ScrollView>
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

export default connect(mapStateToProps, {UserTokenAction})(ViewPendingDelivery);
