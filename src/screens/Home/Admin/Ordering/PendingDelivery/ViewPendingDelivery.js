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
} from '../../../../../connectivity/api';
import styles from '../style';
import {translate} from '../../../../../utils/translations';
import moment from 'moment';
import CheckBox from '@react-native-community/checkbox';

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
      },
      () => this.getOrderFun(),
    );
  }

  getOrderFun = () => {
    const {productId} = this.state;
    getOrderByIdApi(productId)
      .then(res => {
        console.log('res', res);

        this.setState({
          pageData: res.data,
        });
      })
      .catch(err => {
        console.log('ERR MEP', err);

        this.setState({
          recipeLoader: false,
        });
      });
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    alert('Work in Progress');
  };

  saveFun = () => {
    alert('save');
  };

  render() {
    const {buttonsSubHeader, loader, managerName, pageData} = this.state;
    console.log('pageDa', pageData && pageData.orderItems.length);

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
                      value={moment(pageData.orderDate).format('L')}
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
                    />
                  </View>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Delivery date"
                      value={moment(pageData.deliveryDate).format('L')}
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
                        backgroundColor: '#fff',
                      }}
                    />
                  </View>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Arrived date"
                      value={
                        pageData.deliveredDate &&
                        moment(pageData.deliveredDate).format('L')
                      }
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
                        backgroundColor: '#fff',
                      }}
                    />
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
                        backgroundColor: '#fff',
                      }}
                    />
                  </View>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Invoice number"
                      value={pageData.invoiceNumber}
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
                        backgroundColor: '#fff',
                      }}
                    />
                  </View>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Delivery note reference"
                      value={pageData.deliveryNoteReference}
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
                        backgroundColor: '#fff',
                      }}
                    />
                  </View>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Ambient Temperature"
                      value={pageData.ambientTemp}
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
                        backgroundColor: '#fff',
                      }}
                    />
                  </View>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Chilled Temperature"
                      value={pageData.chilledTemp}
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
                        backgroundColor: '#fff',
                      }}
                    />
                  </View>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Frozen Temperature"
                      value={pageData.frozenTemp}
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
                        backgroundColor: '#fff',
                      }}
                    />
                  </View>
                  <View style={{marginBottom: hp('3%')}}>
                    <TextInput
                      placeholder="Notes"
                      value={pageData.notes}
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
                        backgroundColor: '#fff',
                      }}
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
                        backgroundColor: '#fff',
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
                          width: wp('30%'),
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
                          $ HTVA
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
                      {pageData && pageData.orderItems.length > 0
                        ? pageData.orderItems.map((item, index) => {
                            console.log('item', item);
                            return (
                              <View
                                key={index}
                                style={{
                                  paddingVertical: 10,
                                  paddingHorizontal: 5,
                                  flexDirection: 'row',
                                  backgroundColor: '#fff',
                                }}>
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
                                    {item.productName}
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
                                    {item.productName}
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
                                    {item.productName}
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
                                    {item.productName}
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
                                    {item.productName}
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
                                    {item.productName}
                                  </Text>
                                </View>
                              </View>
                            );
                          })
                        : null}
                    </View>
                  </View>
                </ScrollView>
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
