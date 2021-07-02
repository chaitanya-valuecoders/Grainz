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
  addOrderApi,
} from '../../../../../connectivity/api';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import styles from '../style';

import {translate} from '../../../../../utils/translations';

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
    const {
      finalData,
      apiDeliveryDate,
      apiOrderDate,
      placedByValue,
      supplierId,
    } = this.props.route && this.props.route.params;
    const finalArr = [];
    finalData.map(item => {
      finalArr.push({
        inventoryProductMappingId:
          item.inventoryMapping && item.inventoryMapping.id,
        quantityOrdered: item.quantityProduct,
        unitPrice: item.inventoryMapping && item.inventoryMapping.price,
      });
    });

    this.setState({
      modalData: finalData,
      apiDeliveryDate,
      apiOrderDate,
      placedByValue,
      supplierId,
      finalApiData: [...finalArr],
    });
    console.log('final', finalData);
    // this.setState(
    //   {
    //     supplierId,
    //     catName,
    //   },
    //   () => this.getInsideCatFun(),
    // );
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

  actionFun = data => {
    console.log('data', data);
    this.setState({
      actionModalStatus: true,
      inventoryId: data.id,
      productId: data.inventoryMapping && data.inventoryMapping.productId,
    });
  };

  setModalVisibleFalse = visible => {
    this.setState({
      actionModalStatus: visible,
    });
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

  sendFun = () => {
    alert('Send');
  };

  editInventoryFun = () => {
    alert('edit Inventory');
  };

  deleteInventoryFun = () => {
    alert('delete Inventory');
  };

  saveDraftFun = () => {
    const {
      apiDeliveryDate,
      apiOrderDate,
      placedByValue,
      supplierId,
      finalApiData,
    } = this.state;
    let payload = {
      deliveryDate: apiDeliveryDate,
      isAdhoc: false,
      orderDate: apiOrderDate,
      orderItems: finalApiData,
      placedBy: placedByValue,
      supplierId: supplierId,
    };
    console.log('payload', payload);
    addOrderApi(payload)
      .then(res => {
        Alert.alert('Grainz', 'Order added successfully', [
          {
            text: 'okay',
            onPress: () =>
              this.props.navigation.navigate('OrderingAdminScreen'),
          },
        ]);
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  flatListFun = item => {
    if (item.id === 0) {
      alert('Add items');
    } else if (item.id === 1) {
      this.saveDraftFun();
    } else {
      alert('view');
    }
  };

  render() {
    const {
      buttonsSubHeader,
      recipeLoader,
      modalData,
      modalLoader,
      actionModalStatus,
      buttons,
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
          <View style={{}}>
            <View style={styles.firstContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.adminTextStyle}>Supplier - Biofresh</Text>
              </View>
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
                                      {item.isSelected === true ? (
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
                                            <Text>{item.name}</Text>
                                          </View>
                                          <View
                                            style={{
                                              width: wp('30%'),
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                            }}>
                                            <Text>{item.quantityProduct}</Text>
                                          </View>
                                          <View
                                            style={{
                                              width: wp('30%'),
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                            }}>
                                            <Text>{item.HTVA}</Text>
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
                                      ) : null}
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
                                  <Text>1,1224 $</Text>
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
              </ScrollView>
            </View>
          )}
          <View style={{marginVertical: hp('3%')}}>
            <FlatList
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
              numColumns={3}
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
