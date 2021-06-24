import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../constants/images';
import SubHeader from '../../components/SubHeader';
import Header from '../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {
  getMyProfileApi,
  lookupInventoryApi,
  getStockDataApi,
} from '../../connectivity/api';
import Accordion from 'react-native-collapsible/Accordion';
import styles from './style';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {translate} from '../../utils/translations';
import moment from 'moment';

class StockScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      modalVisible: false,
      firstName: '',
      activeSections: [],
      SECTIONS: [],
      subHeaderLoader: true,
      recipeLoader: false,
      buttonsSubHeader: [],
      SECTIONS_SEC: [],
      SECTIONS: [],
      modalVisibleSetup: false,
      sectionName: '',
      categoryLoader: false,
      departmentData: '',
      finalDate: '',
      isDatePickerVisible: false,
      pageDate: '',
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
          firstName: res.data.firstName,
          subHeaderLoader: false,
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

  getManualLogsData = () => {
    this.setState(
      {
        recipeLoader: true,
      },
      () => this.createFirstData(),
    );
  };

  createFirstData = () => {
    const {departmentData} = this.state;
    console.log('de', departmentData);
    lookupInventoryApi(departmentData.id)
      .then(res => {
        console.log('res', res);
        let finalArray = res.data.map((item, index) => {
          return {
            title: item.name,
            content: item.id,
            departmentId: item.departmentId,
          };
        });

        const result = finalArray;

        this.setState({
          SECTIONS: [...result],
          recipeLoader: false,
          SECTIONS_SEC: [...result],
        });
      })
      .catch(err => {
        console.log('ERR MEP', err);

        this.setState({
          recipeLoader: false,
        });
      });
  };

  componentDidMount() {
    const {departmentData} = this.props.route && this.props.route.params;
    this.getData();

    this.setState({
      departmentData,
    });
  }

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = () => {
    this.props.navigation.goBack();
  };

  _renderHeader = (section, index, isActive) => {
    return (
      <View
        style={{
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          borderWidth: 0.5,
          borderColor: '#F0F0F0',
          height: 60,
          marginTop: hp('2%'),
          alignItems: 'center',
          borderRadius: 6,
        }}>
        <Image
          style={{
            height: 18,
            width: 18,
            resizeMode: 'contain',
            marginLeft: wp('2%'),
          }}
          source={isActive ? img.upArrowIcon : img.arrowRightIcon}
        />
        <Text
          style={{
            color: '#492813',
            fontSize: 14,
            marginLeft: wp('2%'),
            fontFamily: 'Inter-Regular',
          }}>
          {section.title}
        </Text>
      </View>
    );
  };

  editUnitsFun = item => {
    const {pageDate, departmentData} = this.state;
    this.setState(
      {
        activeSections: [],
        catArray: [],
        categoryLoader: false,
      },
      () =>
        this.props.navigation.navigate('EditStockScreen', {
          item,
          pageDate,
          inventoryId: item.inventoryId,
          departmentData,
        }),
    );
  };

  _renderContent = section => {
    const {categoryLoader, catArray} = this.state;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{backgroundColor: '#fff', height: hp('30%')}}>
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: 15,
              marginHorizontal: wp('5%'),
            }}>
            <View style={{width: wp('40%')}}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#161C27',
                  fontFamily: 'Inter-SemiBold',
                }}>
                Name
              </Text>
            </View>
            <View style={{width: wp('40')}}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#161C27',
                  fontFamily: 'Inter-SemiBold',
                }}>
                System says
              </Text>
            </View>
            <View style={{width: wp('30%')}}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#161C27',
                  fontFamily: 'Inter-SemiBold',
                }}>
                Stock Take
              </Text>
            </View>
            <View style={{width: wp('20%')}}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#161C27',
                  fontFamily: 'Inter-SemiBold',
                }}>
                Correction
              </Text>
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
                      style={{
                        flexDirection: 'row',
                        borderTopWidth: 1,
                        paddingVertical: 10,
                        marginHorizontal: wp('5%'),
                        borderTopColor: '#0000001A',
                      }}>
                      <TouchableOpacity
                        onPress={() => this.editUnitsFun(item)}
                        style={{
                          flexDirection: 'row',
                        }}>
                        <View style={{width: wp('40%')}}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#161C27',
                              fontFamily: 'Inter-Regular',
                            }}>
                            {item.name && item.name}
                          </Text>
                        </View>
                        <View style={{width: wp('40%')}}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#161C27',
                              fontFamily: 'Inter-Regular',
                            }}
                            numberOfLines={1}>
                            {item.systemSays && item.systemSays.toFixed(2)}{' '}
                            {item.unit}
                          </Text>
                        </View>
                        <View style={{width: wp('30%')}}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#161C27',
                              fontFamily: 'Inter-Regular',
                            }}>
                            {item.quantity} {item.unit}
                          </Text>
                        </View>
                        <View style={{width: wp('30%')}}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#161C27',
                              fontFamily: 'Inter-Regular',
                            }}>
                            {item.correction} {item.unit}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })
              ) : (
                <View style={{paddingVertical: 10, marginHorizontal: wp('5%')}}>
                  <Text style={{color: 'red', fontFamily: 'Inter-Regular'}}>
                    No data available
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    );
  };

  _updateSections = activeSections => {
    this.setState(
      {
        activeSections,
        categoryLoader: true,
      },
      () => this.updateSubFun(),
    );
  };

  updateSubFun = () => {
    const {SECTIONS, activeSections, pageDate} = this.state;
    if (activeSections.length > 0) {
      const deptId = SECTIONS[activeSections].content;
      const catId = SECTIONS[activeSections].departmentId;
      getStockDataApi(deptId, catId, pageDate)
        .then(res => {
          this.setState({
            catArray: res.data,
            categoryLoader: false,
          });
        })
        .catch(err => {
          console.log('ERR', err);
        });
    } else {
      this.setState({
        activeSections: [],
        categoryLoader: false,
        catArray: [],
      });
    }
  };

  setAdminModalVisible = visible => {
    this.setState({
      modalVisibleSetup: visible,
    });
  };

  showDatePickerFun = () => {
    this.setState({
      isDatePickerVisible: true,
    });
  };

  handleConfirm = date => {
    console.log('date', date);
    let newdate = moment(date).format('MM/DD/YYYY');
    let finalPageDate = date.toISOString();
    this.setState(
      {
        finalDate: newdate,
        topCount: '',
        buttonStatus: '',
        pageDate: finalPageDate,
      },

      () => this.getManualLogsData(),
    );
    this.hideDatePicker();
  };
  hideDatePicker = () => {
    this.setState({
      isDatePickerVisible: false,
    });
  };

  render() {
    const {
      recipeLoader,
      SECTIONS,
      activeSections,
      buttonsSubHeader,
      departmentData,
      isDatePickerVisible,
      finalDate,
      subHeaderLoader,
    } = this.state;

    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {subHeaderLoader ? (
          <ActivityIndicator color="#94C036" size="small" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )}
        <ScrollView
          style={{marginBottom: hp('2%')}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            <View style={styles.firstContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.adminTextStyle}>
                  {translate('Stock Take')} - {departmentData.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View style={styles.firstContainer}>
              <TouchableOpacity style={{flex: 1}}>
                <Text style={styles.adminTextStyle}>{translate('New')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <View>
                  <TouchableOpacity
                    onPress={() => this.showDatePickerFun()}
                    style={{
                      width: wp('40%'),
                      borderWidth: 1,
                      padding: Platform.OS === 'ios' ? 10 : 2,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      borderColor: '#CFD7E2',
                      backgroundColor: '#fff',
                      borderRadius: 6,
                    }}>
                    <TextInput
                      placeholder="dd-mm-yy"
                      value={finalDate}
                      editable={false}
                      placeholderTextColor="black"
                    />
                    <Image
                      source={img.calenderIcon}
                      style={{
                        width: 17,
                        height: 17,
                        marginTop: Platform.OS === 'android' ? 13 : 0,
                        marginRight: Platform.OS === 'android' ? 10 : 0,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode={'date'}
                    onConfirm={this.handleConfirm}
                    onCancel={this.hideDatePicker}
                    // maximumDate={tomorrow}
                    // minimumDate={new Date()}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {recipeLoader ? (
            <ActivityIndicator color="#94C036" size="large" />
          ) : (
            <View style={{marginTop: hp('2%'), marginHorizontal: wp('5%')}}>
              <Accordion
                underlayColor="#fff"
                sections={SECTIONS}
                activeSections={activeSections}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
                onChange={this._updateSections}
              />
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

export default connect(mapStateToProps, {UserTokenAction})(StockScreen);
