import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../constants/images';
import SubHeader from '../../components/SubHeader';
import Header from '../../components/Header';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {
  getMyProfileApi,
  getDepartmentsApi,
  lookupInventoryApi,
} from '../../connectivity/api';
import styles from './style';
import CheckBox from '@react-native-community/checkbox';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RNPickerSelect from 'react-native-picker-select';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {translate} from '../../utils/translations';

const todayDate = new Date().toISOString();
var tomorrow = new Date();
tomorrow.setDate(new Date().getDate() + 1);
// let newdate = moment(tomorrow).format('MM/DD/YYYY');
const endDate = tomorrow.toISOString();

class NewStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      buttonsSubHeader: [],
      loader: true,
      startDateStatus: true,
      endDateStatus: false,
      startDateValue: todayDate,
      endDateValue: endDate,
      departmentName: '',
      topValueStatus: true,
      categoriesStatus: false,
      topValue: '0',
      departmentArr: [],
      categoryArr: [],
      pageDate: todayDate,
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
        this.setState({
          loader: false,
        });
      });
  };

  componentDidMount() {
    this.getData();
    this.getDeparmentData();
  }

  getDeparmentData = () => {
    getDepartmentsApi()
      .then(res => {
        let finalUsersList = res.data.map((item, index) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.setState({
          departmentArr: finalUsersList,
        });
      })
      .catch(err => {
        console.log('ERR MEP', err);
      });
  };

  getCategoryData = departmentId => {
    lookupInventoryApi(departmentId)
      .then(res => {
        console.log('res', res);
        let finalUsersList = res.data.map((item, index) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.setState({
          categoryArr: finalUsersList,
        });
      })
      .catch(err => {
        console.log('ERR MEP', err);
      });
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  selectDepartementNameFun = value => {
    this.setState(
      {
        departmentName: value,
      },
      () => this.getCategoryData(value),
    );
  };

  selectCategoryFun = value => {
    this.setState({
      categoryName: value,
    });
  };

  categoryStatusFun = () => {
    const {departmentName, categoriesStatus} = this.state;
    this.setState({
      categoriesStatus: !categoriesStatus,
      topValueStatus: false,
    });
  };

  getDataFun = () => {
    const {departmentName, categoryName, topValue, pageDate} = this.state;
    if (departmentName && categoryName) {
      this.props.navigation.navigate('StockScreen', {
        departmentId: departmentName,
        categoryId: categoryName,
        topValue,
        pageDate,
      });
    } else {
      alert('Select Department or Category First');
    }
  };

  render() {
    const {
      buttonsSubHeader,
      loader,
      startDateStatus,
      departmentName,
      endDateStatus,
      topValueStatus,
      categoriesStatus,
      topValue,
      categoryName,
      departmentArr,
      categoryArr,
    } = this.state;

    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {loader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )}
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            <View style={styles.firstContainer}>
              <View style={styles.flex}>
                <Text style={styles.adminTextStyle}>
                  {translate('Stock Take')} - New
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: hp('4%'),
                marginHorizontal: wp('5%'),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                }}>
                <CheckBox
                  value={startDateStatus}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                  onValueChange={() =>
                    this.setState({
                      startDateStatus: !startDateStatus,
                      endDateStatus: false,
                      pageDate: todayDate,
                    })
                  }
                />
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 15,
                    color: '#151B26',
                    marginLeft: wp('3%'),
                  }}>
                  {translate('Start')}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                }}>
                <CheckBox
                  value={endDateStatus}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                  onValueChange={() =>
                    this.setState({
                      endDateStatus: !endDateStatus,
                      startDateStatus: false,
                      pageDate: endDate,
                    })
                  }
                />
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 15,
                    color: '#151B26',
                    marginLeft: wp('3%'),
                  }}>
                  {translate('End')}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 10,
                backgroundColor: '#fff',
                marginHorizontal: wp('5%'),
                marginVertical: hp('2%'),
              }}>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: wp('80%'),
                  height: hp('6%'),
                }}>
                <RNPickerSelect
                  placeholder={{
                    label: 'Select Department*',
                    value: null,
                    color: 'black',
                  }}
                  onValueChange={value => {
                    this.selectDepartementNameFun(value);
                  }}
                  style={{
                    inputIOS: {
                      fontSize: 14,
                      paddingHorizontal: '5%',
                      color: '#161C27',
                      width: '100%',
                      alignSelf: 'center',
                      paddingVertical: 15,
                    },
                    inputAndroid: {
                      fontSize: 14,
                      paddingHorizontal: '3%',
                      color: '#161C27',
                      width: '100%',
                      alignSelf: 'center',
                    },
                    iconContainer: {
                      top: '40%',
                    },
                  }}
                  items={departmentArr}
                  value={departmentName}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
              <View style={{marginRight: wp('5%')}}>
                <Image
                  source={img.arrowDownIcon}
                  resizeMode="contain"
                  style={{
                    height: 18,
                    width: 18,
                    resizeMode: 'contain',
                    marginTop: Platform.OS === 'ios' ? 12 : 15,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: hp('4%'),
                marginHorizontal: wp('5%'),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                }}>
                <CheckBox
                  value={topValueStatus}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                  onValueChange={() =>
                    this.setState({
                      topValueStatus: !topValueStatus,
                      categoriesStatus: false,
                    })
                  }
                />
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 15,
                    color: '#151B26',
                    marginLeft: wp('3%'),
                  }}>
                  {translate('Top')}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                }}>
                <CheckBox
                  value={categoriesStatus}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                  onValueChange={() => this.categoryStatusFun()}
                />
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 15,
                    color: '#151B26',
                    marginLeft: wp('3%'),
                  }}>
                  {translate('Categories')}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: hp('2%'),
                marginHorizontal: wp('5%'),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                }}>
                <TextInput
                  placeholder="0"
                  value={topValue}
                  style={{
                    borderWidth: 1,
                    width: '70%',
                    paddingVertical: 8,
                    paddingLeft: 5,
                    borderRadius: 5,
                    borderColor: 'grey',
                  }}
                  returnKeyType="done"
                  keyboardType="numeric"
                  onChangeText={value =>
                    this.setState({
                      topValue: value,
                    })
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    borderRadius: 5,
                    backgroundColor: '#fff',
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                      width: '70%',
                    }}>
                    <RNPickerSelect
                      placeholder={{
                        label: 'Categories*',
                        value: null,
                        color: 'black',
                      }}
                      onValueChange={value => {
                        this.selectCategoryFun(value);
                      }}
                      style={{
                        inputIOS: {
                          fontSize: 14,
                          paddingHorizontal: '5%',
                          color: '#161C27',
                          width: '100%',
                          alignSelf: 'center',
                        },
                        inputAndroid: {
                          fontSize: 14,
                          paddingHorizontal: '3%',
                          color: '#161C27',
                          width: '100%',
                          alignSelf: 'center',
                        },
                        iconContainer: {
                          top: '40%',
                        },
                      }}
                      items={categoryArr}
                      value={categoryName}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>
                  <View style={{}}>
                    <Image
                      source={img.arrowDownIcon}
                      resizeMode="contain"
                      style={{
                        height: 15,
                        width: 15,
                        resizeMode: 'contain',
                        marginTop: Platform.OS === 'ios' ? 8 : 15,
                        marginLeft: 20,
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => this.getDataFun()}
              style={{
                width: wp('30%'),
                height: hp('5%'),
                backgroundColor: '#94C036',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                marginTop: hp('2%'),
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 'bold',
                  fontFamily: 'Inter-Regular',
                }}>
                Get Data
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
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

export default connect(mapStateToProps, {UserTokenAction})(NewStock);
