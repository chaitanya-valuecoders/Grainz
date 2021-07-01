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
  getOrderCategoriesApi,
  unMapProductAdminApi,
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
    const {item, section, supplierId} =
      this.props.route && this.props.route.params;
    console.log('item', item);
    this.setState(
      {
        sectionName: section.title,
        finalName: item.name,
        supplierId,
        catId: item.id,
      },
      () => this.getInsideCatFun(),
    );
  }

  getInsideCatFun = () => {
    const {catId, supplierId} = this.state;
    this.setState(
      {
        modalLoader: true,
      },
      () =>
        getOrderCategoriesApi(catId, supplierId)
          .then(res => {
            this.setState({
              modalData: res.data,
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

    console.log('payload', payload);
  };

  editQuantityFun = (index, type, value) => {
    const {modalData} = this.state;

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
  };

  render() {
    const {
      buttonsSubHeader,
      recipeLoader,
      modalData,
      finalName,
      modalLoader,
      sectionName,
      actionModalStatus,
    } = this.state;

    console.log('modaData', modalData);

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
                <Text style={styles.adminTextStyle}>
                  {' '}
                  {sectionName} - {finalName}
                </Text>
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
                        {modalData && modalData.length > 0 ? (
                          modalData.map((item, index) => {
                            return (
                              <View style={{marginTop: hp('2%')}} key={index}>
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
                                      <Text>{item.name}</Text>
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
                                      }}>
                                      <Text>Preferred</Text>
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
                                    {item.productMappings.length > 0 ? (
                                      item.productMappings.map(
                                        (subItem, subIndex) => {
                                          return (
                                            <View
                                              key={subIndex}
                                              style={{
                                                paddingVertical: 10,
                                                paddingHorizontal: 5,
                                                flexDirection: 'row',
                                                backgroundColor:
                                                  subIndex % 2 === 0
                                                    ? '#FFFFFF'
                                                    : '#F7F8F5',
                                              }}>
                                              <View
                                                style={{
                                                  width: wp('30%'),
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                }}></View>
                                              <View
                                                style={{
                                                  width: wp('30%'),
                                                  justifyContent: 'center',
                                                  alignItems: 'center',
                                                }}>
                                                <CheckBox
                                                  disabled={true}
                                                  value={subItem.isInStock}
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
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                }}>
                                                <Text>
                                                  {subItem.productCode}
                                                </Text>
                                              </View>
                                              <View
                                                style={{
                                                  width: wp('30%'),
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                }}>
                                                <Text>
                                                  {subItem.productName}
                                                </Text>
                                              </View>
                                              <View
                                                style={{
                                                  width: wp('30%'),
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                }}>
                                                <Text>
                                                  {subItem.userDefinedQuantity}{' '}
                                                  {subItem.unit}
                                                </Text>
                                              </View>
                                              <View
                                                style={{
                                                  width: wp('30%'),
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                }}>
                                                <Text>
                                                  {subItem.comparePrice} /{' '}
                                                  {subItem.compareUnit}
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
                                                    )
                                                  }
                                                />
                                              </View>
                                              <View
                                                style={{
                                                  width: wp('30%'),
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                }}>
                                                <CheckBox
                                                  disabled={true}
                                                  value={subItem.isPreferred}
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
                                                onPress={() =>
                                                  this.actionFun(subItem)
                                                }
                                                style={{
                                                  width: wp('30%'),
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                }}>
                                                <View
                                                  style={{
                                                    backgroundColor: '#86AC32',
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
                                                onPress={() =>
                                                  this.actionFun(subItem)
                                                }
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
                                        },
                                      )
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
                    </ScrollView>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => alert('Place Order')}
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
