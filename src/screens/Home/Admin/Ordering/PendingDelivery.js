import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../../../constants/images';
import SubHeader from '../../../../components/SubHeader';
import Header from '../../../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../../../redux/actions/UserTokenAction';
import {
  getMyProfileApi,
  draftOrderingApi,
  reviewOrderApi,
  historyOrderApi,
} from '../../../../connectivity/api';
import moment from 'moment';
import styles from './style';

import {translate} from '../../../../utils/translations';

class PendingDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      recipeLoader: false,
      buttonsSubHeader: [],
      finalName: '',
      modalLoaderDrafts: true,
      deliveryPendingData: [],
      deliveryPendingDataBackup: [],
      listId: '',
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
    const {listId} = this.props.route && this.props.route.params;
    this.setState(
      {
        listId,
      },
      () => this.getFinalData(),
    );
  }

  getFinalData = () => {
    const {listId} = this.state;
    if (listId === 2) {
      this.getDeliveryPendingData();
    } else if (listId === 3) {
      this.getReviewOrdersData();
    } else if (listId === 4) {
      this.getHistoryOrdersData();
    }
  };

  getDeliveryPendingData = () => {
    draftOrderingApi()
      .then(res => {
        this.setState({
          deliveryPendingData: res.data,
          deliveryPendingDataBackup: res.data,
          modalLoaderDrafts: false,
        });
      })
      .catch(err => {
        console.warn('err', err);
      });
  };

  getReviewOrdersData = () => {
    reviewOrderApi()
      .then(res => {
        this.setState({
          deliveryPendingData: res.data,
          deliveryPendingDataBackup: res.data,
          modalLoaderDrafts: false,
        });
      })
      .catch(err => {
        console.warn('err', err);
      });
  };

  getHistoryOrdersData = () => {
    historyOrderApi()
      .then(res => {
        this.setState({
          deliveryPendingData: res.data,
          deliveryPendingDataBackup: res.data,
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

  onPressFun = () => {
    this.props.navigation.goBack();
  };

  render() {
    const {
      buttonsSubHeader,
      recipeLoader,
      modalLoaderDrafts,
      deliveryPendingData,
      listId,
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
                <Text style={styles.adminTextStyle}>
                  {listId === 2
                    ? translate('Pending Deliveries')
                    : listId === 3
                    ? translate('Review')
                    : listId === 4
                    ? translate('History')
                    : null}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* <View
            style={{
              padding: hp('3%'),
            }}>
            <View style={{}}>
              <View style={{}}>
                <View style={{}}>
                  <Text style={{color: 'grey'}}>{translate('Search')} : </Text>
                </View>
              </View>
              <TextInput
                placeholder="Search"
                // value={searchItem}
                style={{
                  flexDirection: 'row',
                  height: hp('5%'),
                  width: wp('70%'),
                  marginTop: 10,
                  paddingLeft: 10,
                  borderWidth: 1,
                  alignSelf: 'center',
                  borderColor: '#C9CCD7',
                }}
                // onChangeText={value => this.searchFun(value)}
              />
            </View>
          </View> */}

          {recipeLoader ? (
            <ActivityIndicator size="small" color="#94C036" />
          ) : (
            <View style={{}}>
              <ScrollView>
                {modalLoaderDrafts ? (
                  <ActivityIndicator size="large" color="grey" />
                ) : (
                  <View
                    style={{
                      padding: hp('3%'),
                    }}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      <View>
                        <View
                          style={{
                            paddingVertical: 15,
                            paddingHorizontal: 5,
                            marginTop: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            backgroundColor: '#EFFBCF',
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                          }}>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                color: '#161C27',
                                fontFamily: 'Inter-SemiBold',
                              }}>
                              Order#
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
                                fontFamily: 'Inter-SemiBold',
                              }}>
                              Supplier
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
                                fontFamily: 'Inter-SemiBold',
                              }}>
                              {listId === 2 ? 'Delivery date' : 'Order date'}
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
                                fontFamily: 'Inter-SemiBold',
                              }}>
                              Total HTVA
                            </Text>
                          </View>
                        </View>
                        <View>
                          {deliveryPendingData && deliveryPendingData.length > 0
                            ? deliveryPendingData.map((item, index) => {
                                return (
                                  <View
                                    style={{
                                      paddingVertical: 10,
                                      paddingHorizontal: 5,
                                      flexDirection: 'row',
                                      backgroundColor:
                                        index % 2 === 0 ? '#FFFFFF' : '#F7F8F5',
                                    }}>
                                    <View
                                      style={{
                                        width: wp('30%'),
                                        alignItems: 'center',
                                      }}>
                                      <Text style={{textAlign: 'center'}}>
                                        {item.orderReference}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        width: wp('30%'),
                                        alignItems: 'center',
                                      }}>
                                      <Text>{item.supplierName}</Text>
                                    </View>
                                    <View
                                      style={{
                                        width: wp('30%'),
                                        alignItems: 'center',
                                      }}>
                                      <Text>
                                        {moment(item.deliveryDate).format('L')}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        width: wp('30%'),
                                        alignItems: 'center',
                                      }}>
                                      <Text>{item && item.htva}</Text>
                                    </View>
                                  </View>
                                );
                              })
                            : null}
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
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

export default connect(mapStateToProps, {UserTokenAction})(PendingDelivery);
