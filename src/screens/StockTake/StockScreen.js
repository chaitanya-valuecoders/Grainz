import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../constants/images';
import SubHeader from '../../components/SubHeader';
import Header from '../../components/Header';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {
  getMyProfileApi,
  getStockDataApi,
  getNewTopStockTakeApi,
} from '../../connectivity/api';
import styles from './style';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {translate} from '../../utils/translations';
import moment from 'moment';

class StockScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      buttonsSubHeader: [],
      loader: true,
      departmentId: '',
      categoryId: '',
      pageDate: '',
      topValue: '',
      categoryLoader: true,
      catArray: [],
      topValueStatus: true,
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
    const {departmentId, categoryId, pageDate, topValue, topValueStatus} =
      this.props.route && this.props.route.params;
    this.props.navigation.addListener('focus', () => {
      this.setState(
        {
          departmentId,
          categoryId,
          pageDate,
          topValue,
          categoryLoader: true,
          topValueStatus,
        },
        () => this.getFinalData(),
      );
    });
  }

  getFinalData = () => {
    const {topValueStatus} = this.state;
    if (topValueStatus) {
      this.getTopDataFun();
    } else {
      this.getStockDataFun();
    }
  };

  getTopDataFun = () => {
    const {departmentId, topValue, pageDate} = this.state;
    let newdate = moment(pageDate).format('MM/DD/YYYY');
    getNewTopStockTakeApi(departmentId, newdate, topValue)
      .then(res => {
        this.setState({
          catArray: res.data,
          categoryLoader: false,
        });
      })
      .catch(err => {
        console.log('ERR', err);
      });
  };

  getStockDataFun = () => {
    const {departmentId, categoryId, pageDate} = this.state;
    console.log('Date', pageDate);
    getStockDataApi(departmentId, categoryId, pageDate)
      .then(res => {
        this.setState({
          catArray: res.data,
          categoryLoader: false,
        });
      })
      .catch(err => {
        console.log('ERR', err);
      });
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  editUnitsFun = item => {
    const {pageDate, departmentId, categoryId} = this.state;
    this.props.navigation.navigate('EditStockScreen', {
      item,
      pageDate,
      inventoryId: item.inventoryId,
      departmentId,
      categoryId,
      screenType: 'New',
    });
  };

  render() {
    const {buttonsSubHeader, loader, categoryLoader, catArray} = this.state;
    console.log('catArray', catArray);

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
        <View style={styles.subContainer}>
          <View style={styles.firstContainer}>
            <View style={styles.flex}>
              <Text style={styles.adminTextStyle}>
                {translate('Stock Take')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.goBackContainer}>
              <Text style={styles.goBackTextStyle}>Go Back</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.renderContentContainer}>
              <View style={styles.renderContentSubContainer}>
                <View style={styles.boxSize}>
                  <Text style={styles.boxTextHeadingStyling}>Name</Text>
                </View>
                <View style={{...styles.boxSize, marginLeft: wp('2%')}}>
                  <Text style={styles.boxTextHeadingStyling}>System says</Text>
                </View>
                <View
                  style={{
                    ...styles.boxSize,
                    marginLeft: wp('2%'),
                  }}>
                  <Text style={styles.boxTextHeadingStyling}>Stock Take</Text>
                </View>
                <View
                  style={{
                    width: wp('10%'),
                  }}></View>
                <View style={{...styles.boxSize, marginLeft: wp('2%')}}>
                  <Text style={styles.boxTextHeadingStyling}>Correction</Text>
                </View>
              </View>
              {categoryLoader ? (
                <ActivityIndicator size="large" color="#94C036" />
              ) : (
                <ScrollView nestedScrollEnabled>
                  {catArray && catArray.length > 0 ? (
                    catArray.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={styles.renderHeaderContentContainer}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <View style={styles.boxSizeSec}>
                              <Text style={styles.boxTextDataStyling}>
                                {item.name && item.name}
                              </Text>
                            </View>
                            <View
                              style={{
                                ...styles.boxSizeSec,
                                marginLeft: wp('2%'),
                              }}>
                              <Text
                                style={styles.boxTextDataStyling}
                                numberOfLines={1}>
                                {item.systemSays && item.systemSays.toFixed(2)}{' '}
                                {item.unit}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => this.editUnitsFun(item)}
                              style={{
                                ...styles.boxSizeSec,
                                marginLeft: wp('2%'),
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: item.quantity
                                  ? '#E9ECEF'
                                  : '#FDF851',
                                paddingVertical: 10,
                              }}>
                              <Text style={styles.boxTextDataStyling}>
                                {item.quantity}
                              </Text>
                            </TouchableOpacity>
                            <View
                              style={{
                                width: wp('10%'),
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: '#161C27',
                                  fontFamily: 'Inter-Regular',
                                }}>
                                {item.unit}
                              </Text>
                            </View>

                            <View
                              style={{
                                ...styles.boxSizeSec,
                                marginLeft: wp('2%'),
                              }}>
                              <Text style={styles.boxTextDataStyling}>
                                {item.correction}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <View style={styles.notAvailableContainer}>
                      <Text style={styles.notAvailableStyling}>
                        No data available
                      </Text>
                    </View>
                  )}
                </ScrollView>
              )}
            </View>
          </ScrollView>
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

export default connect(mapStateToProps, {UserTokenAction})(StockScreen);
