import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Switch,
  TextInput,
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
  lookupDepartmentsApi,
  lookupCategoriesApi,
  lookupInsideCategoriesApi,
} from '../../../../connectivity/api';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import styles from './style';

import {translate} from '../../../../utils/translations';

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      modalVisible: false,
      firstName: '',
      activeSections: [],
      SECTIONS: [],
      recipeLoader: false,
      sectionData: {},
      isMakeMeStatus: true,
      productionDate: '',
      recipeID: '',
      selectedItems: [],
      items: [],
      departmentName: '',
      itemTypes: '',
      loading: false,
      selectedItemObjects: '',
      buttonsSubHeader: [],
      finalName: '',
      SECTIONS_SEC: [],
      modalVisibleSetup: false,
      modalData: [],
      modalLoader: false,
      sectionName: '',
      categoryLoader: false,
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
    lookupDepartmentsApi()
      .then(res => {
        let finalArray = res.data.map((item, index) => {
          return {
            title: item.name,
            content: item.id,
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
    this.getData();
    this.getManualLogsData();
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

  openListFun = (item, index, section) => {
    console.log('item', item);
    this.setState(
      {
        finalName: item.name,
        modalVisibleSetup: true,
        modalLoader: true,
        sectionName: section.title,
      },
      () => this.getInsideCatFun(item.id),
    );
  };

  getInsideCatFun = catId => {
    lookupInsideCategoriesApi(catId)
      .then(res => {
        this.setState({
          modalData: res.data,
          modalLoader: false,
        });
      })
      .catch(err => {
        console.warn('err', err);
      });
  };

  _renderContent = section => {
    const {categoryLoader, catArray} = this.state;
    return (
      <View>
        {categoryLoader ? (
          <ActivityIndicator size="large" color="#94C036" />
        ) : (
          <View>
            {catArray &&
              catArray.map((item, index) => {
                return (
                  // <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                    <TouchableOpacity
                      onPress={() => this.openListFun(item, index, section)}
                      style={{
                        borderWidth: 1,
                        paddingVertical: 15,
                        paddingHorizontal: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        width: wp('89%'),
                        borderRadius: 6,
                        borderColor: '#00000099',
                      }}>
                      <View
                        style={
                          {
                            // width: wp('25%'),
                            // alignItems: 'center',
                          }
                        }>
                        <Text
                          style={{textAlign: 'center', color: '#161C27'}}
                          numberOfLines={1}>
                          {item.name}{' '}
                        </Text>
                      </View>
                      <View
                        style={
                          {
                            // width: wp('25%'),
                            // alignItems: 'center',
                          }
                        }>
                        <Text style={{textAlign: 'center', color: '#161C27'}}>
                          Current inventory
                        </Text>
                      </View>
                      <View
                        style={
                          {
                            // width: wp('25%'),
                            // alignItems: 'center',
                          }
                        }>
                        <Text style={{textAlign: 'center', color: '#161C27'}}>
                          On Order
                        </Text>
                      </View>
                      {/* <View
                          style={{
                            width: wp('30%'),
                            alignItems: 'center',
                          }}>
                          <Text>Events(+7d)</Text>
                        </View>
                        <View
                          style={{
                            width: wp('30%'),
                            alignItems: 'center',
                          }}>
                          <Text>Target</Text>
                        </View>
                        <View
                          style={{
                            width: wp('30%'),
                            alignItems: 'center',
                          }}>
                          <Text>Delta</Text>
                        </View>
                        <View
                          style={{
                            width: wp('30%'),
                            alignItems: 'center',
                          }}>
                          <Text>Order Now</Text>
                        </View> */}
                    </TouchableOpacity>
                  </View>
                  // </ScrollView>
                );
              })}
          </View>
        )}
      </View>
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
    const {SECTIONS, activeSections} = this.state;
    if (activeSections.length > 0) {
      const deptId = SECTIONS[activeSections].content;
      lookupCategoriesApi(deptId)
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
      });
    }
  };

  setAdminModalVisible = visible => {
    this.setState({
      modalVisibleSetup: visible,
    });
  };

  render() {
    const {
      recipeLoader,
      SECTIONS,
      activeSections,
      firstName,
      buttonsSubHeader,
      modalVisibleSetup,
      modalData,
      modalLoader,
      finalName,
      sectionName,
    } = this.state;

    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {recipeLoader ? (
          <ActivityIndicator color="#94C036" size="small" />
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
                  {translate('Inventory Level')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
          {recipeLoader ? (
            <ActivityIndicator color="#94C036" size="large" />
          ) : (
            <View style={{marginTop: hp('2%'), marginHorizontal: wp('5%')}}>
              <Accordion
                // expandMultiple
                underlayColor="#fff"
                sections={SECTIONS}
                activeSections={activeSections}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
                onChange={this._updateSections}
              />
            </View>
          )}
          <Modal isVisible={modalVisibleSetup} backdropOpacity={0.35}>
            <View
              style={{
                width: wp('80%'),
                height: hp('80%'),
                backgroundColor: '#fff',
                alignSelf: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#412916',
                  height: hp('7%'),
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flex: 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: '#fff'}}>
                    {sectionName}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => this.setAdminModalVisible(false)}>
                    <Image
                      source={img.cancelIcon}
                      style={{
                        height: 22,
                        width: 22,
                        tintColor: 'white',
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView>
                {modalLoader ? (
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
                            borderWidth: 1,
                          }}>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text style={{textAlign: 'center'}}>
                              {finalName}
                            </Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>Current inventory</Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>On Order</Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>Events(+7d)</Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>Target</Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>Delta</Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>Order Now</Text>
                          </View>
                        </View>
                        <View>
                          {modalData && modalData.length > 0 ? (
                            modalData.map((item, index) => {
                              return (
                                <View
                                  style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 5,
                                    flexDirection: 'row',
                                  }}>
                                  <View
                                    style={{
                                      width: wp('30%'),
                                      alignItems: 'center',
                                    }}>
                                    <Text style={{textAlign: 'center'}}>
                                      {item.name}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      width: wp('30%'),
                                      alignItems: 'center',
                                    }}>
                                    <Text>{item.currentInventory}</Text>
                                  </View>
                                  <View
                                    style={{
                                      width: wp('30%'),
                                      alignItems: 'center',
                                    }}>
                                    <Text>{item.onOrder}</Text>
                                  </View>
                                  <View
                                    style={{
                                      width: wp('30%'),
                                      alignItems: 'center',
                                    }}>
                                    <Text>{item.eventsOnOrder}</Text>
                                  </View>
                                  <View
                                    style={{
                                      width: wp('30%'),
                                      alignItems: 'center',
                                    }}>
                                    <Text>{item.targetInventory}</Text>
                                  </View>
                                  <View
                                    style={{
                                      width: wp('30%'),
                                      alignItems: 'center',
                                    }}>
                                    <Text>{item.delta}</Text>
                                  </View>
                                  <TouchableOpacity
                                    onPress={() => alert('ORDER NOW')}
                                    style={{
                                      width: wp('30%'),
                                      alignItems: 'center',
                                    }}>
                                    <Text>ORDER NOW</Text>
                                  </TouchableOpacity>
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
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                )}
              </ScrollView>
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

export default connect(mapStateToProps, {UserTokenAction})(Inventory);
