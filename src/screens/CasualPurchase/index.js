import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../constants/images';
import SubHeader from '../../components/SubHeader';
import Header from '../../components/Header';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {getMyProfileApi, getCasualPurchasesApi} from '../../connectivity/api';
import {translate} from '../../utils/translations';
import styles from './style';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      casualPurchases: [],
      productionDate: '',
      selectedItems: [],
      selectedItemObjects: '',
      testItem: null,
      photo: null,
      casualListLoader: false,
      arrayObjPosition: 1,
      quantityValue: '',
      recipeLoader: true,
      buttonsSubHeader: [],
    };
  }

  getProfileDataFun = async () => {
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
          recipeLoader: false,
          buttonsSubHeader: [
            {name: translate('ADMIN')},
            {name: translate('Setup')},
            {name: translate('INBOX')},
          ],
        });
      })
      .catch(err => {
        console.warn('ERr', err);
      });
  };

  getCasualPurchasesData() {
    this.setState(
      {
        casualListLoader: true,
      },
      () =>
        getCasualPurchasesApi()
          .then(res => {
            this.setState({casualPurchases: res.data, casualListLoader: false});
          })
          .catch(err => {
            this.setState({casualListLoader: false});
            console.warn('errR', err);
          }),
    );
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getCasualPurchasesData();
    });
    this.getProfileDataFun();
  }

  myProfileFun = () => {
    this.props.navigation.navigate('MyProfile');
  };

  newCasualPurchase() {
    this.props.navigation.navigate('AddPurchaseScreen');
  }

  navigateToEditFun(order) {
    this.props.navigation.navigate('EditPurchase', {
      orderData: order,
    });
  }

  render() {
    const {casualPurchases, casualListLoader, buttonsSubHeader, recipeLoader} =
      this.state;
    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfileFun}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {recipeLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )}
        <ScrollView
          style={{marginBottom: hp('2%')}}
          ref={ref => {
            this.scrollListReftop = ref;
          }}>
          <View>
            <View style={styles.subContainer}>
              <View style={styles.firstContainer}>
                <View style={{flex: 1}}>
                  <Text style={styles.adminTextStyle}>
                    {translate('Casual purchase')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={styles.goBackContainer}>
                  <Text style={styles.goBackTextStyle}>Go Back</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{}}>
              <View>
                <TouchableOpacity
                  onPress={() => this.newCasualPurchase()}
                  style={{
                    height: hp('6%'),
                    width: wp('80%'),
                    backgroundColor: '#94C036',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    alignSelf: 'center',
                    marginBottom: hp('4%'),
                    marginTop: hp('2%'),
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
          </View>
          <View style={{}}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomColor: '#EAEAF0',
                marginHorizontal: wp('3%'),
                backgroundColor: '#EFFBCF',
                paddingHorizontal: 10,
                paddingVertical: 15,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>{translate('Date')}</Text>
                <Pressable>
                  <Image
                    style={{
                      width: 10,
                      height: 10,
                      resizeMode: 'contain',
                      marginLeft: 5,
                    }}
                    source={img.doubleArrowIconNew}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>
                  {translate('Supplier')}
                </Text>
                <Pressable>
                  <Image
                    style={{
                      width: 10,
                      height: 10,
                      resizeMode: 'contain',
                      marginLeft: 5,
                    }}
                    source={img.doubleArrowIconNew}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>
                  $ {translate('Total')} HTVA
                </Text>
                <Pressable>
                  <Image
                    style={{
                      width: 10,
                      height: 10,
                      resizeMode: 'contain',
                      marginLeft: 5,
                    }}
                    source={img.doubleArrowIconNew}
                  />
                </Pressable>
              </View>
            </View>
            {casualListLoader ? (
              <ActivityIndicator color="grey" size="large" />
            ) : (
              casualPurchases.map((item, index) => {
                const date = moment(item.orderDate).format('MM/DD/YYYY');
                const price = Math.round(item.htva);
                return (
                  <View
                    style={{
                      borderBottomColor: '#EAEAF0',
                      marginHorizontal: wp('3%'),
                      backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F7F8F5',
                      paddingVertical: 10,
                    }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        paddingLeft: 10,
                        alignItems: 'flex-start',
                      }}
                      onPress={() => this.navigateToEditFun(item)}>
                      <View style={{margin: 5, flex: 3}}>
                        <Text style={{fontWeight: 'bold'}}>{date}</Text>
                      </View>
                      <View style={{margin: 5, flex: 3, paddingLeft: 50}}>
                        <Text style={{fontWeight: 'bold'}}>
                          {item.supplierName}
                        </Text>
                      </View>
                      <View style={{margin: 5, flex: 2, paddingLeft: 50}}>
                        <Text style={{fontWeight: 'bold'}}>$ {price}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>
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

export default connect(mapStateToProps, {UserTokenAction})(index);
