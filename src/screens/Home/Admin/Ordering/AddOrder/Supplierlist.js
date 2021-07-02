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
} from '../../../../../connectivity/api';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import styles from '../style';

import {translate} from '../../../../../utils/translations';

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
      finalBaketData: [],
      apiDeliveryDate: '',
      apiOrderDate: '',
      placedByValue: '',
      supplierId: '',
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
    const {supplierId, catName, apiDeliveryDate, apiOrderDate, placedByValue} =
      this.props.route && this.props.route.params;
    this.setState(
      {
        supplierId,
        catName,
        apiDeliveryDate,
        apiOrderDate,
        placedByValue,
      },
      () => this.getInsideCatFun(),
    );
  }

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
            console.warn('err', err);
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
    });
  };

  hitMapApi = () => {
    alert('Map');
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
                onPress: () => this.hitUnMapApi(),
              },
              {
                text: 'No',
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
                onPress: () => this.hitMapApi(),
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
        Alert.alert('Grainz', 'Product unmapped successfully', [
          {
            text: 'Okay',
            onPress: () => this.getInsideCatFun(),
          },
        ]);
      })
      .catch(err => {
        console.warn('err', err);
      });
  };

  editQuantityFun = (index, type, value, data) => {
    console.log('data', data);
    const {modalData} = this.state;
    if (data.isMapped === true) {
      if (type === 'isSelected') {
        let newArr = modalData.map((item, i) =>
          index === i && item.quantityProduct !== ''
            ? {
                ...item,
                [type]: !value,
              }
            : item,
        );

        var filteredArray = newArr.filter(function (itm) {
          if (itm.quantityProduct !== '') {
            return itm.isSelected === true;
          }
        });

        console.log('fil', filteredArray);

        this.setState({
          modalData: [...newArr],
          finalBaketData: filteredArray,
        });
      } else {
        let newArr = modalData.map((item, i) =>
          index === i
            ? {
                ...item,
                [type]: value,
              }
            : item,
        );
        this.setState({
          modalData: [...newArr],
        });
      }
    } else {
      Alert.alert('Grainz', 'Please map this product to an inventory item', [
        {
          text: 'Yes',
          onPress: () => alert('Lets map'),
          style: 'default',
        },
        {
          text: 'No',
        },
      ]);
    }
  };

  placeOrderFun = () => {
    const {
      finalBaketData,
      apiDeliveryDate,
      apiOrderDate,
      placedByValue,
      supplierId,
    } = this.state;
    if (finalBaketData.length > 0) {
      this.props.navigation.navigate('BasketOrderScreen', {
        finalData: finalBaketData,
        apiDeliveryDate,
        apiOrderDate,
        placedByValue,
        supplierId,
      });
    } else {
      alert('Please select atleast one item');
    }
  };

  render() {
    const {
      buttonsSubHeader,
      recipeLoader,
      modalData,
      modalLoader,
      actionModalStatus,
      mapStatus,
    } = this.state;

    console.log('modaldata', modalData);

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
                <Text style={styles.adminTextStyle}></Text>
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
                                <Text style={{textAlign: 'center'}}>
                                  In Stock?
                                </Text>
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
                                <Text>Name</Text>
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
                                <Text>Quantity</Text>
                              </View>
                              <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}></View>
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
                                      <View
                                        style={{
                                          width: wp('30%'),
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}>
                                        <Text>{item.code}</Text>
                                      </View>
                                      <TouchableOpacity
                                        onPress={() =>
                                          this.props.navigation.navigate(
                                            'OrderingThreeAdminScreen',
                                          )
                                        }
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
                                        <TextInput
                                          placeholder="quantityProduct"
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

                                      <TouchableOpacity
                                        onPress={() =>
                                          this.editQuantityFun(
                                            index,
                                            'isSelected',
                                            item.isSelected,
                                            item,
                                          )
                                        }
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}>
                                        <View
                                          style={{
                                            backgroundColor: item.isSelected
                                              ? '#86AC32'
                                              : '#C2C2C1',
                                            padding: 10,
                                            borderRadius: 6,
                                          }}>
                                          <Image
                                            source={img.cartIcon}
                                            style={{
                                              height: 25,
                                              width: 25,
                                              resizeMode: 'contain',
                                            }}
                                          />
                                        </View>
                                      </TouchableOpacity>
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
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => this.placeOrderFun()}
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
                  Place Order
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
                    {mapStatus ? 'Unmap Inventory' : 'Map Inventory'}
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

export default connect(mapStateToProps, {UserTokenAction})(SupplierList);
