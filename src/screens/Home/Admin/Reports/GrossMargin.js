import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
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
  getDepartmentsReportsAdminApi,
} from '../../../../connectivity/api';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from './style';
import {translate} from '../../../../utils/translations';

class MenuAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      modalVisible: false,
      recipeLoader: false,
      sectionData: {},
      isMakeMeStatus: true,
      productionDate: '',
      recipeID: '',
      selectedItems: [],
      items: [],
      departmentId: '',
      itemTypes: '',
      loading: false,
      selectedItemObjects: '',
      buttonsSubHeader: [],
      backStatus: false,
      grossMarginStatus: false,
      menuAnalysisStatus: false,
      periodName: 'Select Period',
      departmentArr: [],
      gmReportsArrStatus: false,
      menuAnalysisLoader: false,
      locationName: '',
      showSubList: false,
      SECTIONS_SEC: [],
      finalName: '',
      modalVisibleSetup: false,
      modalData: [],
      modalLoader: false,
      finalName: '',
      sectionName: '',
    };
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@appToken');
      if (value !== null) {
        this.setState(
          {
            recipeLoader: true,
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
        this.setState({
          recipeLoader: false,
        });
        console.warn('ERr', err);
      });
  };

  componentDidMount() {
    this.getData();
  }

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  selectDepartementNameFun = item => {
    this.setState(
      {
        departmentId: item.value,
        gmReportsArrStatus: true,
        periodName: 'Monthly',
      },
      () => {
        getDepartmentsReportsAdminApi(item.value, 'Monthly')
          .then(res => {
            this.setState({
              gmReportsArr: res.data.reverse(),
              gmReportsArrStatus: false,
            });
          })
          .catch(err => {
            this.setState({
              gmReportsArrStatus: false,
            });
            console.warn('ERr', err);
          });
      },
    );
  };

  selectPeriodtNameFun = item => {
    const {departmentId} = this.state;
    this.setState(
      {
        periodName: item.value,
        gmReportsArrStatus: true,
      },
      () => {
        getDepartmentsReportsAdminApi(departmentId, item.value)
          .then(res => {
            this.setState({
              gmReportsArr: res.data,
              gmReportsArrStatus: false,
            });
          })
          .catch(err => {
            this.setState({
              gmReportsArrStatus: false,
            });
            console.warn('ERr', err);
          });
      },
    );
  };

  render() {
    const {
      recipeLoader,
      buttonsSubHeader,
      departmentArr,
      gmReportsArrStatus,
      gmReportsArr,
      periodName,
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
          style={{marginBottom: hp('5%')}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            <View style={styles.firstContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.adminTextStyle}>
                  {translate('Reports & Analysis')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{marginHorizontal: wp('10%')}}>
            <View style={{alignSelf: 'center', marginVertical: hp('2%')}}>
              <Text>GM ({periodName})</Text>
            </View>
            <View>
              <DropDownPicker
                placeholder="Select Department"
                items={departmentArr}
                zIndex={1000000000}
                containerStyle={{
                  height: 50,
                  marginBottom: hp('3%'),
                }}
                style={{
                  backgroundColor: '#fff',
                  borderColor: 'black',
                }}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{backgroundColor: '#fff'}}
                onChangeItem={item => this.selectDepartementNameFun(item)}
              />
              <DropDownPicker
                placeholder={periodName}
                items={[
                  {
                    label: 'Weekly',
                    value: 'Weekly',
                  },
                  {
                    label: 'Monthly',
                    value: 'Monthly',
                  },
                  {
                    label: 'Annual',
                    value: 'Annual',
                  },
                ]}
                containerStyle={{
                  height: 50,
                  marginBottom: hp('3%'),
                }}
                style={{
                  backgroundColor: '#fff',
                  borderColor: 'black',
                }}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{backgroundColor: '#fff'}}
                onChangeItem={item => this.selectPeriodtNameFun(item)}
              />
              <TouchableOpacity
                onPress={() => alert('Print')}
                style={{
                  flexDirection: 'row',
                  height: hp('6%'),
                  width: wp('70%'),
                  backgroundColor: '#94C036',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                  alignSelf: 'center',
                }}>
                <View style={{}}>
                  <Text style={{color: 'white', marginLeft: 5}}>
                    {translate('Print')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {gmReportsArrStatus ? (
            <ActivityIndicator size="large" color="grey" />
          ) : (
            <View>
              {gmReportsArr && gmReportsArr.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View
                    style={{
                      marginHorizontal: wp('2%'),
                      flexDirection: 'row',
                    }}>
                    <View style={{}}>
                      <View
                        style={{
                          width: wp('30%'),
                          height: hp('6%'),
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          $
                        </Text>
                      </View>
                      <View
                        style={{
                          width: wp('30%'),
                          height: hp('10%'),
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          Sales HTVA
                        </Text>
                      </View>
                      <View
                        style={{
                          width: wp('30%'),
                          height: hp('10%'),
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          Cost of sales (29%)
                        </Text>
                      </View>
                      <View
                        style={{
                          width: wp('30%'),
                          height: hp('10%'),
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          Waste (1%)
                        </Text>
                      </View>
                      <View
                        style={{
                          width: wp('30%'),
                          height: hp('10%'),
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          Staff (1%)
                        </Text>
                      </View>
                      <View
                        style={{
                          width: wp('30%'),
                          height: hp('10%'),
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          R & D (1%)
                        </Text>
                      </View>
                      <View
                        style={{
                          width: wp('30%'),
                          height: hp('10%'),
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          Other (1%)
                        </Text>
                      </View>
                      <View
                        style={{
                          width: wp('30%'),
                          height: hp('10%'),
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          Grainz correction (1%)
                        </Text>
                      </View>
                      <View
                        style={{
                          width: wp('30%'),
                          height: hp('10%'),
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          Total costs(1%)
                        </Text>
                      </View>
                      <View
                        style={{
                          width: wp('30%'),
                          height: hp('10%'),
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          Gross Margin (1%)
                        </Text>
                      </View>
                    </View>
                    {gmReportsArr.map((item, index) => {
                      console.log('iTEM', item.data);
                      const {data} = item;
                      return (
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              height: hp('6%'),
                              width: wp('40%'),
                              alignItems: 'center',
                            }}>
                            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                              {item.title}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={{
                              width: wp('40%'),
                              height: hp('10%'),
                              justifyContent: 'center',
                            }}>
                            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                              {data.salesHTVA}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              width: wp('40%'),
                              height: hp('10%'),
                              justifyContent: 'center',
                            }}>
                            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                              {data.costOfSales} {data.percentageCostOfSales}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              width: wp('40%'),
                              height: hp('10%'),
                              justifyContent: 'center',
                            }}>
                            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                              {data.waste} {data.percentageWaste}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              width: wp('40%'),
                              height: hp('10%'),
                              justifyContent: 'center',
                            }}>
                            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                              {data.stafFood} {data.percentageStaffFood}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              width: wp('40%'),
                              height: hp('10%'),
                              justifyContent: 'center',
                            }}>
                            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                              {data.rAndD} {data.percentageRAndD}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              width: wp('40%'),
                              height: hp('10%'),
                              justifyContent: 'center',
                            }}>
                            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                              {data.other} {data.percentageOther}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              width: wp('40%'),
                              height: hp('10%'),
                              justifyContent: 'center',
                            }}>
                            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                              {data.grainZError} {data.percentageGrainzError}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              width: wp('40%'),
                              height: hp('10%'),
                              justifyContent: 'center',
                            }}>
                            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                              {data.totalCost} {data.percentageTotalCost}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              width: wp('40%'),
                              height: hp('10%'),
                              justifyContent: 'center',
                            }}>
                            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                              {data.grossMargin} {data.percentageGrossMargin}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              ) : null}
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

export default connect(mapStateToProps, {UserTokenAction})(MenuAnalysis);
