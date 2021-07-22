import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
  Alert,
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
  unMapProductAdminApi,
  getInsideInventoryNewApi,
  addBasketApi,
  updateBasketApi,
} from '../../../../../connectivity/api';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import styles from '../style';

import {translate} from '../../../../../utils/translations';

class InventoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      recipeLoader: false,
      buttonsSubHeader: [],
      finalName: '',
      sectionName: '',
      modalLoader: false,
      supplierId: '',
      modalData: [],
      catId: '',
      inventoryId: '',
      productId: '',
      catName: '',
      finalBasketData: [],
      screenType: 'New',
      basketId: '',
      navigateType: '',
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
    const {supplierId, catName, catId, screenType, basketId, navigateType} =
      this.props.route && this.props.route.params;
    this.props.navigation.addListener('focus', () => {
      this.setState(
        {
          supplierId,
          catName,
          catId,
          screenType,
          basketId,
          navigateType,
        },
        () => this.getInsideCatFun(),
      );
    });
  }

  getInsideCatFun = () => {
    const {catId, supplierId} = this.state;
    console.log('catID', catId);
    console.log('supplierId', supplierId);
    this.setState(
      {
        modalLoader: true,
      },
      () =>
        getInsideInventoryNewApi(catId, supplierId)
          .then(res => {
            console.log('res', res);
            const finalArr = res.data;
            finalArr.forEach(function (item) {
              item.isSelected = false;
              item.quantityProduct = '';
              item.deltaNew = item.delta;
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
                  onPress: () => this.props.navigation.goBack(),
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

  actionFun = data => {
    this.setState({
      actionModalStatus: true,
      inventoryId: data.id,
      productId: data.productId,
    });
  };

  setModalVisibleFalse = visible => {
    this.setState({
      actionModalStatus: visible,
    });
  };

  unMapInventoryFun = () => {
    this.setState(
      {
        actionModalStatus: false,
      },
      () =>
        setTimeout(() => {
          Alert.alert('Grainz', 'Would you like to unmap this product?', [
            {
              text: 'Yes',
              onPress: () => this.hitUnMapApi(),
            },
            {
              text: 'No',
            },
          ]);
        }, 300),
    );
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
    // console.log('index', index, type, 'type', 'val', value);
    const {modalData, screenType} = this.state;
    const deltaOriginal = Number(data.delta);
    const isSelectedValue = value !== '' ? true : false;
    const newDeltaVal =
      value !== ''
        ? Number(data.delta) - Number(value) * Number(data.volume)
        : deltaOriginal;

    let newArr = modalData.map((item, i) =>
      index === i
        ? {
            ...item,
            [type]: value,
            ['deltaNew']: newDeltaVal,
            ['isSelected']: isSelectedValue,
          }
        : item,
    );
    var filteredArray = newArr.filter(function (itm) {
      if (itm.quantityProduct !== '') {
        return itm.isSelected === true;
      }
    });
    const finalArr = [];
    filteredArray.map(item => {
      finalArr.push({
        inventoryId: item.id,
        inventoryProductMappingId: item.inventoryProductMappingId,
        unitPrice: item.productPrice,
        quantity: Number(item.quantityProduct),
        action:
          screenType === 'New'
            ? 'New'
            : screenType === 'Update'
            ? 'New'
            : 'String',
        value: Number(item.quantityProduct * item.productPrice * item.packSize),
      });
    });
    console.log('filteredArray', filteredArray);
    this.setState({
      modalData: [...newArr],
      finalBasketData: [...finalArr],
    });
  };

  addToBasketFun = () => {
    const {
      finalBasketData,
      supplierId,
      screenType,
      basketId,
      navigateType,
      productId,
    } = this.state;
    if (screenType === 'New') {
      if (finalBasketData.length > 0) {
        let payload = {
          supplierId: supplierId,
          shopingBasketItemList: finalBasketData,
        };
        console.log('Paylaod', payload);
        addBasketApi(payload)
          .then(res => {
            console.log('res', res);
            this.props.navigation.navigate('BasketOrderScreen', {
              finalData: res.data && res.data.id,
              supplierId,
              itemType: 'Inventory',
              productId,
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
        alert('Please select atleast one item');
      }
    } else {
      let payload = {
        supplierId: supplierId,
        shopingBasketItemList: finalBasketData,
        id: basketId,
      };
      console.log('Paylaod', payload);
      updateBasketApi(payload)
        .then(res => {
          console.log('res', res);
          if (navigateType === 'EditDraft') {
            this.props.navigation.navigate('EditDraftOrderScreen', {
              productId,
              basketId,
            });
          } else {
            this.props.navigation.navigate('BasketOrderScreen', {
              finalData: res.data && res.data.id,
              supplierId,
              itemType: 'Inventory',
              productId,
            });
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
    }
  };

  render() {
    const {
      buttonsSubHeader,
      recipeLoader,
      modalData,
      modalLoader,
      catName,
      actionModalStatus,
      finalBasketData,
      screenType,
      productId,
    } = this.state;

    console.log('finalBasketData', finalBasketData);
    // console.log('screenType', screenType);

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
                <Text style={styles.adminTextStyle}>{catName}</Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
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
                        <View style={{marginTop: hp('2%')}}>
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

                              {/* <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}>
                                <Text>Action</Text>
                              </View> */}

                              <View
                                style={{
                                  width: wp('40%'),
                                  alignItems: 'center',
                                }}>
                                <Text>Name</Text>
                              </View>

                              <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}>
                                <Text>Product Name</Text>
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
                                <Text>In stock ?</Text>
                              </View>
                              <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}></View>
                            </View>
                            <View>
                              {modalData.length > 0 ? (
                                modalData.map((item, index) => {
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
                                      </View>

                                      {/* <TouchableOpacity
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}
                                        onPress={() =>
                                          this.editQuantityFun(
                                            index,
                                            'isSelected',
                                            item.isSelected,
                                            item,
                                          )
                                        }>
                                        <View
                                          style={{
                                            backgroundColor: '#86AC32',
                                            padding: 5,
                                            borderRadius: 6,
                                          }}>
                                          <View
                                            style={{
                                              backgroundColor: '#86AC32',
                                              padding: 10,
                                              borderRadius: 6,
                                            }}>
                                            {item.isSelected ? (
                                              <Image
                                                source={img.dashIcon}
                                                style={{
                                                  height: 18,
                                                  width: 18,
                                                  resizeMode: 'contain',
                                                  tintColor: '#fff',
                                                }}
                                              />
                                            ) : (
                                              <Image
                                                source={img.plusIcon}
                                                style={{
                                                  height: 22,
                                                  width: 22,
                                                  resizeMode: 'contain',
                                                  tintColor: '#fff',
                                                }}
                                              />
                                            )}
                                          </View>
                                        </View>
                                      </TouchableOpacity> */}
                                      <View
                                        style={{
                                          width: wp('40%'),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        <Text>{item.name}</Text>
                                        {item.deltaNew > 0 ? (
                                          <Text style={{color: 'red'}}>
                                            ( Δ {item.deltaNew} {item.unit} )
                                          </Text>
                                        ) : (
                                          <Text style={{color: 'black'}}>
                                            {/* ( Δ {item.deltaNew} {item.unit} ) */}
                                            ( Δ 0 {item.unit} )
                                          </Text>
                                        )}
                                      </View>

                                      <View
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        <Text>{item.productName}</Text>
                                      </View>
                                      <View
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        <Text>
                                          {item.volume} {item.unit}
                                        </Text>
                                      </View>
                                      <View
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        <Text>
                                          {item.comparePrice} /{' '}
                                          {item.compareUnit}
                                        </Text>
                                      </View>

                                      <View
                                        style={{
                                          width: wp('30%'),
                                          justifyContent: 'center',
                                          alignItems: 'center',
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
                                  <Text
                                    style={{
                                      color: 'red',
                                      fontSize: 20,
                                    }}>
                                    No data available
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
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
                  {screenType === 'New' ? 'Add to basket' : 'Update basket'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
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
                    Unmap Inventory
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

export default connect(mapStateToProps, {UserTokenAction})(InventoryList);
