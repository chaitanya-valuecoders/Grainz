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
  getOrderByIdApi,
  deleteOrderApi,
} from '../../../../../connectivity/api';
import moment from 'moment';
import styles from '../style';
import Modal from 'react-native-modal';

import {translate} from '../../../../../utils/translations';

class ViewDraftOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      recipeLoader: false,
      buttonsSubHeader: [],
      finalName: '',
      modalLoaderDrafts: true,
      draftsOrderData: [],
      supplierName: '',
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
    const {supplierName, productId} =
      this.props.route && this.props.route.params;
    this.props.navigation.addListener('focus', () => {
      this.setState(
        {
          supplierName,
          productId,
          modalLoaderDrafts: true,
        },
        () => this.getDraftOrderData(),
      );
    });
  }

  getDraftOrderData = () => {
    const {productId} = this.state;
    getOrderByIdApi(productId)
      .then(res => {
        this.setState({
          draftsOrderData: res.data,
          modalLoaderDrafts: false,
        });
      })
      .catch(err => {
        console.warn('err', err);
      });
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  editFun = () => {
    const {productId} = this.state;
    this.props.navigation.navigate('EditDraftOrderScreen', {
      productId,
    });
  };

  deleteFun = () => {
    setTimeout(() => {
      Alert.alert('Grainz', 'Are you sure you want to delete this order?', [
        {
          text: 'Yes',
          onPress: () => this.hitDeleteApi(),
        },
        {
          text: 'No',
          style: 'cancel',
        },
      ]);
    }, 100);
  };

  hitDeleteApi = () => {
    const {draftsOrderData, productId} = this.state;
    let payload = draftsOrderData;
    deleteOrderApi(productId, payload)
      .then(res => {
        Alert.alert('Grainz', 'Order deleted successfully', [
          {
            text: 'Okay',
            onPress: () =>
              this.props.navigation.navigate('OrderingAdminScreen'),
          },
        ]);
      })
      .catch(error => {
        this.setState({
          deleteLoader: false,
        });
        console.warn('DELETEerror', error.response);
      });
  };

  addItemsFun = () => {
    this.props.navigation.navigate('NewOrderScreen');
  };

  render() {
    const {
      buttonsSubHeader,
      recipeLoader,
      modalLoaderDrafts,
      draftsOrderData,
      supplierName,
      actionModalStatus,
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
                <Text style={styles.adminTextStyle}>{supplierName}</Text>
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
              <TouchableOpacity
                style={{flex: 1}}
                onPress={() => this.editFun()}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Inter-SemiBold',
                    color: '#87AC33',
                  }}>
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.deleteFun()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>

          {recipeLoader ? (
            <ActivityIndicator size="small" color="#94C036" />
          ) : (
            <View style={{marginTop: hp('3%')}}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {modalLoaderDrafts ? (
                  <ActivityIndicator size="large" color="grey" />
                ) : (
                  <View
                    style={{
                      marginHorizontal: wp('4%'),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flex: 1,
                        backgroundColor: '#EFFBCF',
                        paddingVertical: hp('3%'),
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                      }}>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#161C27',
                            fontFamily: 'Inter-SemiBold',
                          }}>
                          Name
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#161C27',
                            fontFamily: 'Inter-SemiBold',
                          }}>
                          Quantity
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#161C27',
                            fontFamily: 'Inter-SemiBold',
                          }}>
                          HTVA $
                        </Text>
                      </View>
                    </View>
                    {draftsOrderData &&
                      draftsOrderData.orderItems.map((item, index) => {
                        console.log('item', item);
                        return (
                          <View>
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                flex: 1,
                                backgroundColor:
                                  index % 2 === 0 ? '#FFFFFF' : '#F7F8F5',
                                paddingVertical: hp('3%'),
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                              }}>
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Text style={{}}>{item.productName}</Text>
                              </View>
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Text style={{}}>
                                  {Number(
                                    item.grainzVolume * item.quantityOrdered,
                                  ).toFixed(2)}{' '}
                                  {item.unit}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Text>
                                  ${' '}
                                  {Number(
                                    item.quantityOrdered * item.productPrice,
                                  ).toFixed(2)}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        );
                      })}
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
                          <Text>1,124 $</Text>
                        </View>
                      </View>
                    </View>
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
                          }}>
                          <Text style={{}}>Supplier:</Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{}}>{draftsOrderData.supplierName}</Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}></View>
                      </View>
                    </View>
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
                          }}>
                          <Text style={{}}>Placed By:</Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{}}>{draftsOrderData.placedByNAme}</Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}></View>
                      </View>
                    </View>
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
                          }}>
                          <Text style={{}}>Order Date:</Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{}}>
                            {draftsOrderData.orderDate &&
                              moment(draftsOrderData.orderDate).format('L')}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}></View>
                      </View>
                    </View>
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
                          }}>
                          <Text style={{}}>Delivery date:</Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{}}>
                            {draftsOrderData.deliveryDate &&
                              moment(draftsOrderData.deliveryDate).format('L')}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}></View>
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </ScrollView>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => this.addItemsFun()}
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
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={img.addIcon}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: '#fff',
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: 'white',
                  marginLeft: 10,
                  fontFamily: 'Inter-SemiBold',
                }}>
                Add New
              </Text>
            </View>
          </TouchableOpacity>
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

export default connect(mapStateToProps, {UserTokenAction})(ViewDraftOrders);
