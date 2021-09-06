import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
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
  deliveryPendingApi,
  reviewOrderApi,
  historyOrderApi,
} from '../../../../../connectivity/api';
import moment from 'moment';
import styles from '../style';

import {translate} from '../../../../../utils/translations';

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
      type: '',
      arrangeStatusSupplier: 0,
      arrangeStatusDate: 0,
      arrangeStatusHTVA: 0,
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
    this.props.navigation.addListener('focus', () => {
      this.setState(
        {
          listId,
          modalLoaderDrafts: true,
        },
        () => this.getFinalData(),
      );
    });
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
    deliveryPendingApi()
      .then(res => {
        this.setState({
          deliveryPendingData: res.data,
          deliveryPendingDataBackup: res.data,
          modalLoaderDrafts: false,
          type: 'Pending',
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
          type: 'Review',
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
          type: 'History',
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

  searchFun = txt => {
    this.setState(
      {
        searchItem: txt,
      },
      () => this.filterData(txt),
    );
  };

  filterData = text => {
    //passing the inserted text in textinput

    const newData = this.state.deliveryPendingDataBackup.filter(function (
      item,
    ) {
      console.log('item', item);
      //applying filter for the inserted text in search bar
      const itemData = item.supplierName
        ? item.supplierName.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      deliveryPendingData: newData,
      searchItem: text,
    });
  };

  viewFun = item => {
    const {listId} = this.state;
    if (listId === 2) {
      this.props.navigation.navigate('ViewPendingDeliveryScreen', {
        item,
      });
    } else if (listId === 3) {
      this.props.navigation.navigate('ViewReviewOrderScreen', {
        item,
      });
    } else if (listId === 4) {
      this.props.navigation.navigate('ViewHistoryOrderScreen', {
        item,
      });
    }
  };

  arrangeListSupplierFun = funType => {
    // if(
    //   funType === 'SUPPLIER'
    // ) {

    // } else if (funType === 'DATE') {

    // } else if(funType === '')
    this.setState(
      {
        arrangeStatusSupplier: Number(1) + this.state.arrangeStatusSupplier,
      },
      () => this.arrangeListSupplierFunSec(),
    );
  };

  arrangeListSupplierFunSec = () => {
    const {arrangeStatusSupplier} = this.state;
    if (arrangeStatusSupplier % 2 == 0) {
      this.ascendingOrderSupplierFun();
    } else {
      this.descendingOrderSupplierFun();
    }
  };

  ascendingOrderSupplierFun = () => {
    const {deliveryPendingData} = this.state;
    const finalData = deliveryPendingData.reverse();

    this.setState({
      deliveryPendingData: finalData,
    });
  };

  descendingOrderSupplierFun = () => {
    const {deliveryPendingData} = this.state;
    // deliveryPendingData.sort();
    function dynamicSort(property) {
      var sortOrder = 1;
      if (property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
      }
      return function (a, b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        var result =
          a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        return result * sortOrder;
      };
    }

    const finalData = deliveryPendingData.sort(dynamicSort('supplierName'));
    console.log('supplierName', finalData);

    this.setState({
      deliveryPendingData: finalData,
    });
  };

  arrangeListDateFun = () => {
    this.setState(
      {
        arrangeStatusDate: Number(1) + this.state.arrangeStatusDate,
      },
      () => this.arrangeListDateFunSec(),
    );
  };

  arrangeListDateFunSec = () => {
    const {arrangeStatusDate} = this.state;
    if (arrangeStatusDate % 2 == 0) {
      this.ascendingOrderDateFun();
    } else {
      this.descendingOrderDateFun();
    }
  };

  ascendingOrderDateFun = () => {
    const {deliveryPendingData} = this.state;
    const finalData = deliveryPendingData.reverse();
    this.setState({
      deliveryPendingData: finalData,
    });
  };

  descendingOrderDateFun = () => {
    const {deliveryPendingData} = this.state;
    // deliveryPendingData.sort();
    function dynamicSort(property) {
      var sortOrder = 1;
      if (property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
      }
      return function (a, b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        var result =
          a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        return result * sortOrder;
      };
    }
    const finalData = deliveryPendingData.sort(dynamicSort('deliveryDate'));
    console.log('date', finalData);
    this.setState({
      deliveryPendingData: finalData,
    });
  };

  arrangeListHTVAFun = () => {
    this.setState(
      {
        arrangeStatusHTVA: Number(1) + this.state.arrangeStatusHTVA,
      },
      () => this.arrangeListHTVAFunSec(),
    );
  };

  arrangeListHTVAFunSec = () => {
    const {arrangeStatusHTVA} = this.state;
    if (arrangeStatusHTVA % 2 == 0) {
      this.ascendingOrderHTVAFun();
    } else {
      this.descendingOrderHTVAFun();
    }
  };

  ascendingOrderHTVAFun = () => {
    const {deliveryPendingData} = this.state;
    const finalData = deliveryPendingData.reverse();
    this.setState({
      deliveryPendingData: finalData,
    });
  };

  descendingOrderHTVAFun = () => {
    const {deliveryPendingData} = this.state;
    // deliveryPendingData.sort();
    function dynamicSort(property) {
      var sortOrder = 1;
      if (property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
      }
      return function (a, b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        var result =
          a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        return result * sortOrder;
      };
    }
    const finalData = deliveryPendingData.sort(dynamicSort('htva'));
    console.log('htva', finalData);
    this.setState({
      deliveryPendingData: finalData,
    });
  };

  render() {
    const {
      buttonsSubHeader,
      recipeLoader,
      modalLoaderDrafts,
      deliveryPendingData,
      listId,
      searchItem,
      type,
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

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#E2E8F0',
              height: hp('7%'),
              width: wp('90%'),
              borderRadius: 100,
              backgroundColor: '#fff',
              alignSelf: 'center',
              justifyContent: 'space-between',
              marginVertical: hp('1.5%'),
            }}>
            <TextInput
              placeholder="Search"
              value={searchItem}
              style={{
                padding: 15,
                width: wp('75%'),
              }}
              onChangeText={value => this.searchFun(value)}
            />
            <Image
              style={{
                height: 18,
                width: 18,
                resizeMode: 'contain',
                marginRight: wp('5%'),
              }}
              source={img.searchIcon}
            />
          </View>

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
                      padding: hp('2%'),
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
                              flexDirection: 'row',
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                color: '#161C27',
                                fontFamily: 'Inter-SemiBold',
                              }}>
                              Supplier
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                this.arrangeListSupplierFun('SUPPLIER')
                              }>
                              <Image
                                style={{
                                  width: 13,
                                  height: 13,
                                  resizeMode: 'contain',
                                  marginLeft: 5,
                                }}
                                source={img.doubleArrowIconNew}
                              />
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                              flexDirection: 'row',
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                color: '#161C27',
                                fontFamily: 'Inter-SemiBold',
                              }}>
                              {listId === 2 ? 'Delivery date' : 'Order date'}
                            </Text>
                            <TouchableOpacity
                              onPress={() => this.arrangeListDateFun('DATE')}>
                              <Image
                                style={{
                                  width: 13,
                                  height: 13,
                                  resizeMode: 'contain',
                                  marginLeft: 5,
                                }}
                                source={img.doubleArrowIconNew}
                              />
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                              flexDirection: 'row',
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                color: '#161C27',
                                fontFamily: 'Inter-SemiBold',
                              }}>
                              Total HTVA
                            </Text>
                            <TouchableOpacity
                              onPress={() => this.arrangeListHTVAFun('HTVA')}>
                              <Image
                                style={{
                                  width: 13,
                                  height: 13,
                                  resizeMode: 'contain',
                                  marginLeft: 5,
                                }}
                                source={img.doubleArrowIconNew}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View>
                          {deliveryPendingData && deliveryPendingData.length > 0
                            ? deliveryPendingData.map((item, index) => {
                                return (
                                  <TouchableOpacity
                                    onPress={() => this.viewFun(item)}
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
                                        {type === 'Pending'
                                          ? moment(item.deliveryDate).format(
                                              'DD/MM/YY',
                                            )
                                          : type === 'Review'
                                          ? moment(item.orderDate).format(
                                              'DD/MM/YY',
                                            )
                                          : type === 'History'
                                          ? moment(item.orderDate).format(
                                              'DD/MM/YY',
                                            )
                                          : null}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        width: wp('30%'),
                                        alignItems: 'center',
                                      }}>
                                      <Text>
                                        $ {item && Number(item.htva).toFixed(2)}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
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
