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
  unMapProductAdminApi,
  lookupDepartmentsApi,
  lookupCategoriesApi,
  addBasketApi,
  updateBasketApi,
  updateInventoryProductApi,
} from '../../../../../connectivity/api';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import styles from '../style';
import Accordion from 'react-native-collapsible/Accordion';
import {translate} from '../../../../../utils/translations';
import LoaderComp from '../../../../../components/Loader';
import moment from 'moment';

class SupplierList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      recipeLoader: false,
      buttonsSubHeader: [],
      modalLoader: false,
      actionModalStatus: false,
      mapStatus: '',
      finalBasketData: [],
      supplierId: '',
      mapModalStatus: false,
      activeSections: [],
      screenType: 'New',
      basketId: '',
      navigateType: '',
      supplierName: '',
      basketLoader: false,
      loaderCompStatus: false,
      orderingThreeModal: false,
      pageData: '',
      viewModalStatus: false,
      todayDate: new Date(),
      privatePriceValue: '',
      privatePrice: true,
      discountPrice: false,
      discountPriceValue: '',
      priceFinalBackup: '',
      userDefinedUnit: '',
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
    this.props.navigation.addListener('focus', () => {
      const {
        supplierId,
        catName,
        screenType,
        basketId,
        navigateType,
        supplierName,
      } = this.props.route && this.props.route.params;
      this.createFirstData();
      this.setState(
        {
          supplierId,
          catName,
          screenType,
          basketId,
          navigateType,
          finalBasketData: [],
          supplierName,
        },
        () => this.getInsideCatFun(),
      );
    });
  }

  createFirstData = () => {
    lookupDepartmentsApi()
      .then(res => {
        let finalArray = res.data.map((item, index) => {
          return {
            title: item.name,
            content: item.id,
          };
        });

        const result = finalArray;

        console.log('res', res);
        console.log('result', result);

        this.setState({
          SECTIONS: [...result],
          recipeLoader: false,
          SECTIONS_SEC: [...result],
        });
      })
      .catch(err => {
        Alert.alert(`Error - ${err.response.status}`, 'Something went wrong', [
          {
            text: 'Okay',
          },
        ]);
      });
  };

  getInsideCatFun = () => {
    const {supplierId, catName} = this.state;
    this.setState(
      {
        modalLoader: true,
      },
      () =>
        getSupplierProductsApi(supplierId, catName)
          .then(res => {
            const finalArr = res.data;
            finalArr.forEach(function (item) {
              item.isSelected = false;
              item.quantityProduct = '';
            });

            this.setState({
              modalData: [...finalArr],
              modalLoader: false,
            });
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
          }),
    );
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = () => {
    this.props.navigation.goBack();
  };

  orderNowFun = item => {
    this.props.navigation.navigate('OrderNowInventoryAdminScreen', {
      item,
    });
  };

  actionFun = data => {
    console.log('data', data);
    this.setState({
      actionModalStatus: true,
      inventoryId: data.id,
      productId: data.inventoryMapping && data.inventoryMapping.productId,
      mapStatus: data.isMapped,
    });
  };

  setModalVisibleFalse = visible => {
    this.setState({
      actionModalStatus: visible,
      mapModalStatus: visible,
    });
  };

  hitMapApi = () => {
    this.setState({
      mapModalStatus: true,
    });
  };

  unMapInventoryFun = () => {
    const {mapStatus} = this.state;
    if (mapStatus) {
      this.setState(
        {
          actionModalStatus: false,
        },
        () =>
          setTimeout(() => {
            Alert.alert('Grainz', 'Would you like to unmap this product?', [
              {
                text: 'Yes',
                onPress: () =>
                  this.setState(
                    {
                      loaderCompStatus: true,
                    },
                    () => this.hitUnMapApi(),
                  ),
              },
              {
                text: 'No',
                onPress: () =>
                  this.setState({
                    loaderCompStatus: false,
                  }),
              },
            ]);
          }, 300),
      );
    } else {
      this.setState(
        {
          actionModalStatus: false,
        },
        () =>
          setTimeout(() => {
            Alert.alert('Grainz', 'Would you like to map this product?', [
              {
                text: 'Yes',
                onPress: () =>
                  this.setState(
                    {
                      loaderCompStatus: true,
                    },
                    () => this.hitMapApi(),
                  ),
              },
              {
                text: 'No',
              },
            ]);
          }, 300),
      );
    }
  };

  hitUnMapApi = () => {
    const {inventoryId, productId} = this.state;
    let payload = {
      inventoryId: inventoryId,
      productId: productId,
    };
    console.log('payload', payload);
    unMapProductAdminApi(payload)
      .then(res => {
        this.setState({
          loaderCompStatus: false,
        });
        Alert.alert('Grainz', 'Product unmapped successfully', [
          {
            text: 'Okay',
            onPress: () => this.getInsideCatFun(),
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

  editQuantityFun = (index, type, value, data) => {
    this.setState(
      {
        inventoryId: data.id,
      },
      () => this.editQuantityFunSec(index, type, value, data),
    );
  };

  editQuantityFunSec = (index, type, value, data) => {
    console.log('data', data);
    const {modalData, screenType} = this.state;
    const isSelectedValue = value !== '' ? true : false;
    if (data.isMapped === true) {
      let newArr = modalData.map((item, i) =>
        index === i
          ? {
              ...item,
              [type]: value,
              ['isSelected']: isSelectedValue,
            }
          : item,
      );
      console.log('newArr', newArr);

      var filteredArray = newArr.filter(function (itm) {
        if (itm.quantityProduct !== '') {
          return itm.isSelected === true;
        }
      });

      console.log('filteredArray', filteredArray);

      const finalArr = [];
      filteredArray.map(item => {
        console.log('item', item);
        finalArr.push({
          inventoryId:
            item.inventoryMapping && item.inventoryMapping.inventoryId,
          inventoryProductMappingId:
            item.inventoryMapping && item.inventoryMapping.id,
          unitPrice: item.price,
          quantity: Number(item.quantityProduct),
          action:
            screenType === 'New'
              ? 'New'
              : screenType === 'Update'
              ? 'New'
              : 'String',
          value: Number(item.quantityProduct * item.price * item.packSize),
        });
      });
      this.setState({
        modalData: [...newArr],
        finalBasketData: [...finalArr],
      });
    }
  };

  mapAlertShow = data => {
    this.setState(
      {
        inventoryId: data.id,
      },
      () =>
        Alert.alert('Grainz', 'Do you want to map this product?', [
          {
            text: 'Yes',
            onPress: () => this.hitMapApi(),
            style: 'default',
          },
          {
            text: 'No',
          },
        ]),
    );
  };

  addToBasketFun = () => {
    this.setState(
      {
        basketLoader: true,
      },
      () => this.addToBasketFunSec(),
    );
  };

  addToBasketFunSec = () => {
    const {
      finalBasketData,
      supplierId,
      screenType,
      basketId,
      navigateType,
      productId,
      supplierName,
    } = this.state;

    if (screenType === 'New') {
      if (finalBasketData.length > 0) {
        let payload = {
          supplierId: supplierId,
          shopingBasketItemList: finalBasketData,
        };
        console.log('Payload', payload);
        addBasketApi(payload)
          .then(res => {
            this.setState(
              {
                basketLoader: false,
              },
              () => this.navigateToBasket(res),
            );
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
        Alert.alert('Grainz', 'Please select atleast one item', [
          {
            text: 'okay',
            onPress: () => this.closeBasketLoader(),
            style: 'default',
          },
        ]);
      }
    } else {
      let payload = {
        supplierId: supplierId,
        shopingBasketItemList: finalBasketData,
        id: basketId,
      };
      console.log('Paylaod', payload);
      if (finalBasketData.length > 0) {
        updateBasketApi(payload)
          .then(res => {
            console.log('res', res);
            if (navigateType === 'EditDraft') {
              this.setState(
                {
                  basketLoader: false,
                },
                () => this.navigateToEditDraft(res),
              );
            } else {
              this.setState(
                {
                  basketLoader: false,
                },
                () => this.navigateToBasket(res),
              );
            }
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
        Alert.alert('Grainz', 'Please select atleast one item', [
          {
            text: 'okay',
            onPress: () => this.closeBasketLoader(),
          },
        ]);
      }
    }
  };

  closeBasketLoader = () => {
    this.setState({
      basketLoader: false,
    });
  };

  navigateToEditDraft = res => {
    const {basketId, productId, supplierName} = this.state;
    this.props.navigation.navigate('EditDraftOrderScreen', {
      productId,
      basketId,
      supplierName,
    });
  };

  navigateToBasket = res => {
    const {supplierId, supplierName} = this.state;
    this.props.navigation.navigate('BasketOrderScreen', {
      finalData: res.data && res.data.id,
      supplierId,
      itemType: 'Supplier',
      supplierName,
    });
  };

  _renderHeader = (section, index, isActive) => {
    return (
      <View
        style={{
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          borderWidth: 0.5,
          borderColor: '#F0F0F0',
          height: 60,
          marginTop: hp('2%'),
          alignItems: 'center',
          borderRadius: 6,
        }}>
        <Image
          style={{
            height: 18,
            width: 18,
            resizeMode: 'contain',
            marginLeft: wp('2%'),
          }}
          source={isActive ? img.upArrowIcon : img.arrowRightIcon}
        />
        <Text
          style={{
            color: '#492813',
            fontSize: 14,
            marginLeft: wp('2%'),
            fontFamily: 'Inter-Regular',
          }}>
          {section ? section.title : null}
        </Text>
      </View>
    );
  };

  openListFun = (item, index, section) => {
    const {inventoryId} = this.state;
    console.log('inve', inventoryId);
    this.setState(
      {
        mapModalStatus: false,
      },
      () =>
        this.props.navigation.navigate('MapProductsListScreen', {
          item,
          section,
          inventoryId,
        }),
    );
  };

  _renderContent = section => {
    const {categoryLoader, catArray} = this.state;
    return (
      <View>
        {categoryLoader ? (
          <ActivityIndicator size="large" color="#94C036" />
        ) : (
          <View>
            {catArray &&
              catArray.map((item, index) => {
                return (
                  <View>
                    <TouchableOpacity
                      onPress={() => this.openListFun(item, index, section)}
                      style={{
                        borderWidth: 1,
                        paddingVertical: 15,
                        paddingHorizontal: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        width: wp('70%'),
                        borderRadius: 6,
                        borderColor: '#00000099',
                      }}>
                      <View style={{}}>
                        <Text
                          style={{textAlign: 'center', color: '#161C27'}}
                          numberOfLines={1}>
                          {item.name}{' '}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
          </View>
        )}
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState(
      {
        activeSections,
        categoryLoader: true,
      },
      () => this.updateSubFun(),
    );
  };

  updateSubFun = () => {
    const {SECTIONS, activeSections} = this.state;
    if (activeSections.length > 0) {
      const deptId = SECTIONS[activeSections].content;
      console.log('deptId', deptId);

      lookupCategoriesApi(deptId)
        .then(res => {
          console.log('res', res);

          this.setState({
            catArray: res.data,
            categoryLoader: false,
          });
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
      this.setState({
        activeSections: [],
        categoryLoader: false,
      });
    }
  };

  saveProductConfigFun = () => {
    const {
      userDefinedQuantity,
      pageData,
      userDefinedUnit,
      privatePriceValue,
      discountPriceValue,
    } = this.state;
    let payload = {
      discount: discountPriceValue,
      id: pageData.inventoryProductMappingId,
      privatePrice: privatePriceValue,
      userDefinedQuantity: userDefinedQuantity,
      userDefinedUnit: userDefinedUnit,
    };
    console.log('payload', payload);
    updateInventoryProductApi(payload)
      .then(res => {
        console.log('res', res);
        Alert.alert('Grainz', 'Inventory updated successfully', [
          {
            text: 'Oky',
            onPress: () =>
              this.setState(
                {
                  orderingThreeModal: false,
                },
                () => this.getInsideCatFun(),
              ),
          },
        ]);
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  viewInventoryFun = () => {
    this.setState(
      {
        actionModalStatus: false,
      },
      () =>
        setTimeout(() => {
          this.openViewModal();
        }, 300),
    );
  };

  openViewModal = () => {
    this.setState({
      viewModalStatus: true,
    });
  };

  changeDiscountFun = value => {
    const {priceFinalBackup} = this.state;
    this.setState(
      {
        discountPriceValue: value,
        priceFinal: priceFinalBackup,
      },
      () => this.changeDiscountFunSec(),
    );
  };

  changeDiscountFunSec = () => {
    const {priceFinalBackup, discountPriceValue, priceFinal} = this.state;

    console.log('priceFinalBackup', priceFinalBackup);
    console.log('discountPriceValue', discountPriceValue / 100);

    const finalDiscountVal = priceFinalBackup * (discountPriceValue / 100);
    console.log('finalDiscountVal', finalDiscountVal);

    const finalPriceCal = priceFinalBackup - finalDiscountVal;
    console.log('finalPriceCal', finalPriceCal);

    if (discountPriceValue) {
      this.setState({
        priceFinal: finalPriceCal,
      });
    } else {
      this.setState({
        priceFinal: priceFinalBackup,
      });
    }
  };

  changePriceFun = value => {
    this.setState(
      {
        privatePriceValue: value,
        discountPriceValue: '',
      },
      () => this.changePriceFunSec(),
    );
  };

  changePriceFunSec = () => {
    const {privatePriceValue, priceFinalBackup, pageData} = this.state;
    console.log('privatePriceValue', privatePriceValue);
    console.log('priceFinalBackup', priceFinalBackup);

    const finalPriceCal = pageData.packSize * privatePriceValue;
    if (privatePriceValue) {
      this.setState({
        priceFinal: finalPriceCal,
      });
    } else {
      this.setState({
        priceFinal: priceFinalBackup,
      });
    }
  };

  openModalFun = item => {
    const priceFinal = item.productPrice * item.packSize;
    const finalDiscountVal = priceFinal * (item.discount / 100);

    const finalPriceCal = priceFinal - finalDiscountVal;
    console.log('finalPriceCal', finalPriceCal);
    let finalPrice =
      item && item.discount ? finalPriceCal : item.price * item.packSize;
    this.setState({
      orderingThreeModal: true,
      priceFinal: finalPrice,
      priceFinalBackup: item.productPrice * item.packSize,
      userDefinedQuantity: item.userDefinedQuantity,
      pageData: item,
      userDefinedUnit: item.userDefinedUnit,
      privatePriceValue: item.privatePrice,
      discountPriceValue: item.discount,
    });
  };

  render() {
    const {
      buttonsSubHeader,
      recipeLoader,
      modalData,
      modalLoader,
      actionModalStatus,
      mapStatus,
      mapModalStatus,
      SECTIONS,
      activeSections,
      catName,
      finalBasketData,
      screenType,
      navigateType,
      basketLoader,
      loaderCompStatus,
      orderingThreeModal,
      pageData,
      viewModalStatus,
      todayDate,
      supplierName,
      priceFinal,
      privatePriceValue,
      privatePrice,
      discountPrice,
      userDefinedQuantity,
      discountPriceValue,
      userDefinedUnit,
    } = this.state;

    // console.log('modalData', modalData);
    console.log('finalBasketData', finalBasketData);

    console.log('navigateType', navigateType);

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
        <LoaderComp loaderComp={loaderCompStatus} />
        <ScrollView
          style={{marginBottom: hp('2%')}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            <View style={styles.firstContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.adminTextStyle}>{catName}</Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {basketLoader ? (
              <View
                style={{
                  height: hp('6%'),
                  width: wp('80%'),
                  backgroundColor: '#94C036',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('3%'),
                  borderRadius: 100,
                  marginBottom: hp('2%'),
                }}>
                <View
                  style={{
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => this.addToBasketFun()}
                style={{
                  height: hp('6%'),
                  width: wp('80%'),
                  backgroundColor: '#94C036',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('3%'),
                  borderRadius: 100,
                  marginBottom: hp('2%'),
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
                    {screenType === 'New' ? 'Add to basket' : 'Update basket'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {recipeLoader ? (
            <ActivityIndicator size="small" color="#94C036" />
          ) : (
            <View style={{}}>
              <ScrollView>
                {modalLoader ? (
                  <ActivityIndicator size="large" color="grey" />
                ) : (
                  <View
                    style={{
                      padding: hp('2%'),
                    }}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}>
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
                                <Text>Name</Text>
                              </View>
                              <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}>
                                <Text>Code</Text>
                              </View>
                              <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}>
                                <Text>Stock</Text>
                              </View>
                              <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}>
                                <Text>Price</Text>
                              </View>
                              <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}>
                                <Text style={{textAlign: 'center'}}>
                                  In Stock?
                                </Text>
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
                                  console.log('item', item);
                                  return (
                                    <View
                                      key={index}
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
                                          width: wp('30%'),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        {item.isMapped ? (
                                          <TextInput
                                            placeholder="0"
                                            keyboardType="number-pad"
                                            value={item.Quantity}
                                            style={{
                                              borderWidth: 1,
                                              borderRadius: 6,
                                              padding: 10,
                                              width: wp('22%'),
                                            }}
                                            onChangeText={value =>
                                              this.editQuantityFun(
                                                index,
                                                'quantityProduct',
                                                value,
                                                item,
                                              )
                                            }
                                          />
                                        ) : (
                                          <TouchableOpacity
                                            onPress={() =>
                                              this.mapAlertShow(item)
                                            }
                                            style={{
                                              borderRadius: 6,
                                              padding: 10,
                                              width: wp('22%'),
                                              backgroundColor: '#94C036',
                                              alignItems: 'center',
                                            }}>
                                            <Text
                                              style={{
                                                color: '#fff',
                                                fontFamily: 'Inter-Regular',
                                              }}>
                                              Map
                                            </Text>
                                          </TouchableOpacity>
                                        )}
                                      </View>

                                      <TouchableOpacity
                                        onPress={() => this.openModalFun(item)}
                                        style={{
                                          width: wp('40%'),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        <Text>{item.name}</Text>
                                      </TouchableOpacity>
                                      <View
                                        style={{
                                          width: wp('30%'),
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}>
                                        <Text>{item.code}</Text>
                                      </View>
                                      <View
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        <Text>
                                          {item.grainzVolume} {item.unit}
                                        </Text>
                                      </View>
                                      <View
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        <Text>
                                          {Number(item.price).toFixed(2)} $ /{' '}
                                          {item.unit}
                                        </Text>
                                      </View>
                                      <View
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        <CheckBox
                                          disabled={true}
                                          value={item.isInStock}
                                          // onValueChange={() =>
                                          //   this.setState({htvaIsSelected: !htvaIsSelected})
                                          // }
                                          style={{
                                            height: 20,
                                            width: 20,
                                          }}
                                        />
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
                                  );
                                })
                              ) : (
                                <View style={{marginTop: hp('3%')}}>
                                  <Text style={{color: 'red', fontSize: 20}}>
                                    No data available
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </ScrollView>
                      </View>
                    </ScrollView>
                  </View>
                )}
              </ScrollView>
            </View>
          )}

          <Modal isVisible={mapModalStatus} backdropOpacity={0.35}>
            <View
              style={{
                width: wp('80%'),
                height: hp('70%'),
                backgroundColor: '#F0F4FE',
                alignSelf: 'center',
                borderRadius: 14,
              }}>
              <View
                style={{
                  backgroundColor: '#93BA3A',
                  height: hp('7%'),
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
                    Map Products
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
              {recipeLoader ? (
                <ActivityIndicator color="#94C036" size="large" />
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{marginBottom: hp('2%')}}>
                  <View
                    style={{marginTop: hp('2%'), marginHorizontal: wp('5%')}}>
                    <Accordion
                      underlayColor="#fff"
                      sections={SECTIONS}
                      activeSections={activeSections}
                      renderHeader={this._renderHeader}
                      renderContent={this._renderContent}
                      onChange={this._updateSections}
                    />
                  </View>
                </ScrollView>
              )}
            </View>
          </Modal>
          <Modal isVisible={actionModalStatus} backdropOpacity={0.35}>
            <View
              style={{
                width: wp('80%'),
                height: hp('23%'),
                backgroundColor: '#fff',
                alignSelf: 'center',
                borderRadius: 14,
              }}>
              <TouchableOpacity
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => this.unMapInventoryFun()}>
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
                    {mapStatus ? 'Unmap Inventory' : 'Map Inventory'}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flex: 1, justifyContent: 'center'}}
                onPress={() => this.viewInventoryFun()}>
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
                    View Inventory
                  </Text>
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
          <Modal isVisible={viewModalStatus} backdropOpacity={0.35}>
            <View
              style={{
                width: wp('80%'),
                height: hp('75%'),
                backgroundColor: '#F0F4FE',
                alignSelf: 'center',
                borderRadius: 14,
              }}>
              <View
                style={{
                  backgroundColor: '#7EA52D',
                  height: hp('6%'),
                  flexDirection: 'row',
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
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
                    {translate('Order Line Item')}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        viewModalStatus: false,
                        pageData: '',
                      })
                    }>
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
              <ScrollView
                style={{marginBottom: hp('5%')}}
                showsVerticalScrollIndicator={false}>
                <View style={{marginTop: hp('3%'), marginHorizontal: wp('5%')}}>
                  <View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Date :
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          editable={false}
                          value={moment(todayDate).format('L')}
                          placeholder="Date"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Supplier :
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          editable={false}
                          value={supplierName}
                          placeholder="Supplier"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    {/* <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Product Code :{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          editable={false}
                          value={pageData.productCode}
                          placeholder="Product Code"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View> */}
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Product Name :{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={pageData.productName}
                          editable={false}
                          placeholder="Product Name"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Pack Size:{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={String(pageData.packSize)}
                          editable={false}
                          placeholder="Pack Size"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Price :{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={
                            String(pageData.productPrice) +
                            ' / ' +
                            String(pageData.productUnit)
                          }
                          editable={false}
                          placeholder="Price"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Order value :{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={`€ ${Number(priceFinal).toFixed(2)}`}
                          editable={false}
                          placeholder="Price"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Inventory Item:{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={pageData.name}
                          editable={false}
                          placeholder="Inventory Item"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Inventory Unit (default):{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={pageData.unit}
                          editable={false}
                          placeholder="Inventory Unit"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Delta :{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={String(pageData.delta)}
                          editable={false}
                          placeholder="Delta"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          This order :{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={String(pageData.delta)}
                          editable={false}
                          placeholder="This order"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Current Level :{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={String(pageData.delta)}
                          editable={false}
                          placeholder="Current Level"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          On Order :
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={String(pageData.delta)}
                          editable={false}
                          placeholder="On Order"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Target :
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={String(pageData.reorderLevel)}
                          editable={false}
                          placeholder="Target"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: wp('10%'),
                    justifyContent: 'center',
                  }}>
                  <View style={{}}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          viewModalStatus: false,
                          pageData: '',
                        })
                      }
                      style={{
                        height: hp('6%'),
                        width: wp('25%'),
                        backgroundColor: '#E7943B',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20,
                        borderRadius: 5,
                      }}>
                      <View style={{}}>
                        <Text style={{color: 'white'}}>Close</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </Modal>
          <Modal isVisible={orderingThreeModal} backdropOpacity={0.35}>
            <View
              style={{
                width: wp('80%'),
                height: hp('75%'),
                backgroundColor: '#F0F4FE',
                alignSelf: 'center',
                borderRadius: 14,
              }}>
              <View
                style={{
                  backgroundColor: '#7EA52D',
                  height: hp('6%'),
                  flexDirection: 'row',
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
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
                    {translate('Product Configuration')}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        orderingThreeModal: false,
                        pageData: '',
                        priceFinal: '',
                        priceFinalBackup: '',
                        userDefinedQuantity: '',
                        userDefinedUnit: '',
                      })
                    }>
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
              <ScrollView
                style={{marginBottom: hp('5%')}}
                showsVerticalScrollIndicator={false}>
                <View style={{marginTop: hp('3%'), marginHorizontal: wp('5%')}}>
                  <View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Supplier :
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          editable={false}
                          value={supplierName}
                          placeholder="Supplier"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    {/* <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Product Code :{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          editable={false}
                          value={pageData.productCode}
                          placeholder="Product Code"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View> */}
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Product Name :{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={pageData.productName}
                          editable={false}
                          placeholder="Product Name"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Pack Size:{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={String(pageData.packSize)}
                          editable={false}
                          placeholder="Pack Size"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          List Price :{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={
                            String(pageData.productPrice) +
                            ' / ' +
                            String(pageData.productUnit)
                          }
                          editable={false}
                          placeholder="List Price"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Inventory Item:{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={pageData.name}
                          editable={false}
                          placeholder="Inventory Item"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Inventory Unit (default):{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={pageData.unit}
                          editable={false}
                          placeholder="Inventory Unit"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          marginBottom: hp('2%'),
                        }}>
                        <Text
                          style={{fontFamily: 'Inter-Regular', fontSize: 15}}>
                          Price:{' '}
                        </Text>
                      </View>
                      <View style={{}}>
                        <TextInput
                          value={`€ ${Number(priceFinal).toFixed(2)}`}
                          editable={false}
                          placeholder="Price"
                          style={{
                            padding: 10,
                            width: wp('70%'),
                            borderRadius: 5,
                            backgroundColor: '#fff',
                          }}
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
                          width: wp('30%'),
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: hp('2%'),
                        }}>
                        <View style={{}}>
                          <CheckBox
                            value={privatePrice}
                            onValueChange={() =>
                              this.setState({
                                privatePrice: !privatePrice,
                                discountPrice: false,
                                priceFinal: this.state.priceFinalBackup,
                                discountPriceValue: '',
                              })
                            }
                            style={{
                              backgroundColor: '#E9ECEF',
                              height: 20,
                              width: 20,
                            }}
                          />
                        </View>
                        <Text style={{marginLeft: 10}}>Private price: </Text>
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{marginRight: 5}}>€ </Text>
                        <TextInput
                          value={String(privatePriceValue)}
                          editable={privatePrice ? true : false}
                          keyboardType="number-pad"
                          style={{
                            padding: 10,
                            width: wp('45%'),
                            borderRadius: 5,
                            backgroundColor: privatePrice ? '#fff' : '#E9ECEF',
                          }}
                          onChangeText={value => this.changePriceFun(value)}
                        />
                        <Text style={{marginLeft: 5}}>STK</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: hp('3%'),
                      }}>
                      <View
                        style={{
                          width: wp('30%'),
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: hp('2%'),
                        }}>
                        <View style={{}}>
                          <CheckBox
                            value={discountPrice}
                            onValueChange={() =>
                              this.setState({
                                discountPrice: !discountPrice,
                                privatePrice: false,
                                privatePriceValue: '',
                                priceFinal: this.state.priceFinalBackup,
                              })
                            }
                            style={{
                              backgroundColor: '#E9ECEF',
                              height: 20,
                              width: 20,
                            }}
                          />
                        </View>
                        <Text style={{marginLeft: 10}}>Discount: </Text>
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TextInput
                          value={String(discountPriceValue)}
                          editable={discountPrice ? true : false}
                          keyboardType="number-pad"
                          style={{
                            padding: 10,
                            width: wp('50%'),
                            borderRadius: 5,
                            backgroundColor: discountPrice ? '#fff' : '#E9ECEF',
                          }}
                          onChangeText={value => this.changeDiscountFun(value)}
                        />
                        <Text style={{marginLeft: 5}}>%</Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      <View>
                        <View
                          style={{flexDirection: 'row', marginTop: hp('3%')}}>
                          <View style={{width: wp('40%')}}>
                            <Text>Order * 1</Text>
                          </View>
                          <View style={{width: wp('40%')}}>
                            <Text>Quantity</Text>
                          </View>
                          <View style={{width: wp('40%')}}>
                            <Text>Unit</Text>
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
                                width: wp('40%'),
                              }}>
                              <Text>Grainz suggested: </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: wp('40%'),
                              }}>
                              <TextInput
                                value={String(pageData.grainzVolume)}
                                editable={false}
                                style={{
                                  padding: 10,
                                  width: wp('25%'),
                                  borderRadius: 5,
                                  backgroundColor: '#fff',
                                }}
                              />
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: wp('40%'),
                              }}>
                              <TextInput
                                value={pageData.grainzUnit}
                                editable={false}
                                style={{
                                  padding: 10,
                                  width: wp('25%'),
                                  borderRadius: 5,
                                  backgroundColor: '#fff',
                                }}
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
                                width: wp('40%'),
                              }}>
                              <Text>User Defined: </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: wp('40%'),
                              }}>
                              <TextInput
                                value={String(userDefinedQuantity)}
                                style={{
                                  padding: 10,
                                  width: wp('25%'),
                                  borderRadius: 5,
                                  backgroundColor: '#fff',
                                }}
                                onChangeText={value =>
                                  this.setState({
                                    userDefinedQuantity: value,
                                  })
                                }
                              />
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: wp('40%'),
                              }}>
                              <TextInput
                                value={userDefinedUnit}
                                // editable={false}
                                style={{
                                  borderRadius: 5,
                                  backgroundColor: '#fff',
                                  padding: 10,
                                  width: wp('25%'),
                                }}
                                onChangeText={value =>
                                  this.setState({
                                    userDefinedUnit: value,
                                  })
                                }
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginHorizontal: wp('10%'),
                  }}>
                  <View style={{}}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          orderingThreeModal: false,
                          pageData: '',
                          priceFinal: '',
                          priceFinalBackup: '',
                          userDefinedQuantity: '',
                          userDefinedUnit: '',
                        })
                      }
                      style={{
                        height: hp('6%'),
                        width: wp('25%'),
                        backgroundColor: '#E7943B',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20,
                        borderRadius: 5,
                      }}>
                      <View style={{}}>
                        <Text style={{color: 'white'}}>Cancel</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{}}>
                    <TouchableOpacity
                      onPress={() => this.saveProductConfigFun()}
                      style={{
                        height: hp('6%'),
                        width: wp('25%'),
                        backgroundColor: '#94C036',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20,
                        borderRadius: 5,
                      }}>
                      <View style={{}}>
                        <Text style={{color: 'white', marginLeft: 5}}>
                          Save
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
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

export default connect(mapStateToProps, {UserTokenAction})(SupplierList);
