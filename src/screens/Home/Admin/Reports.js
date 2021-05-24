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
import img from '../../../constants/images';
import SubHeader from '../../../components/SubHeader';
import Header from '../../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../../redux/actions/UserTokenAction';
import {
  getMyProfileApi,
  getDepartmentsAdminApi,
  getDepartmentsReportsAdminApi,
  menuAnalysisAdminApi,
} from '../../../connectivity/api';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';

import {translate} from '../../../utils/translations';

class Reports extends Component {
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
          firstName: res.data.firstName,
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

  goBackFun = () => {
    this.setState({
      backStatus: false,
      gmReportsArr: [],
      departmentArr: [],
      grossMarginStatus: false,
      menuAnalysisStatus: false,
      SECTIONS: [],
    });
  };

  grossMarginFun = () => {
    this.setState(
      {
        grossMarginStatus: true,
        backStatus: true,
        menuAnalysisStatus: false,
      },
      () => {
        getDepartmentsAdminApi()
          .then(res => {
            const finalArr = [];
            res.data.map(item => {
              finalArr.push({
                label: item.name,
                value: item.id,
              });
            });
            this.setState({
              departmentArr: [...finalArr],
            });
          })
          .catch(err => {
            console.warn('ERr', err);
          });
      },
    );
  };

  menuAnalysisFun = () => {
    this.setState(
      {
        grossMarginStatus: false,
        backStatus: true,
        menuAnalysisStatus: true,
        menuAnalysisLoader: true,
      },
      () => {
        menuAnalysisAdminApi()
          .then(res => {
            console.log('res', res);
            const {menus, location} = res.data;

            const name = location;

            let finalArray = menus.map((item, index) => {
              return {
                title: item.name,
                content: item.categories,
              };
            });

            const result = finalArray;

            this.setState(
              {
                SECTIONS: [...result],
                menuAnalysisLoader: false,
                locationName: name,
              },
              () => this.createSecFun(),
            );
          })
          .catch(err => {
            this.setState({
              gmReportsArrStatus: false,
              menuAnalysisLoader: false,
            });
            console.warn('ERr', err);
          });
      },
    );
  };

  createSecFun = () => {
    const {SECTIONS} = this.state;
    let secondArray =
      SECTIONS &&
      SECTIONS.map((item, index) => {
        return item.content.map((secItem, secIndex) => {
          return {
            title: secItem.name,
            content: secItem.menuItems,
          };
        });
      });

    this.setState({
      SECTIONS_SEC: [...secondArray],
    });

    console.log('secondArray-->', secondArray);
  };

  _renderHeader = (section, index, isActive) => {
    return (
      <View
        style={{
          backgroundColor: '#EAEAF1',
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: '#D1D1D6',
          height: 60,
          marginTop: hp('2%'),
          alignItems: 'center',
        }}>
        <Image
          style={{
            height: 18,
            width: 18,
            resizeMode: 'contain',
            marginLeft: wp('2%'),
          }}
          source={isActive ? img.arrowDownIcon : img.arrowRightIcon}
        />
        <Text
          style={{
            color: '#98989B',
            fontSize: 15,
            fontWeight: 'bold',
            marginLeft: wp('2%'),
          }}>
          {section.title}
        </Text>
      </View>
    );
  };

  openListFun = () => {};

  _renderContent = section => {
    const {SECTIONS_SEC, activeSections} = this.state;

    return (
      <View style={{}}>
        {section.content.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => this.openListFun(index)}
              style={{
                borderWidth: 1,
                padding: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Text>{item.name}</Text>
              <Image
                source={img.arrowDownIcon}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          );
        })}
        {/* <Accordion
          expandMultiple
          underlayColor="#fff"
          sections={SECTIONS}
          activeSections={activeSections}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          onChange={this._updateSections}
        /> */}
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({
      activeSections,
    });
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
      SECTIONS,
      activeSections,
      firstName,
      buttonsSubHeader,
      backStatus,
      grossMarginStatus,
      menuAnalysisStatus,
      departmentArr,
      gmReportsArrStatus,
      gmReportsArr,
      periodName,
      menuAnalysisLoader,
      locationName,
      SECTIONS_SEC,
    } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {recipeLoader ? (
          <ActivityIndicator color="grey" size="small" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )}
        <ScrollView
          style={{marginBottom: hp('5%')}}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: '#412916',
              alignItems: 'center',
              paddingVertical: hp('3%'),
            }}>
            <Text style={{fontSize: 22, color: 'white'}}>
              {grossMarginStatus
                ? translate('Reports')
                : menuAnalysisStatus
                ? translate('Menu Analysis')
                : translate('Reports & Analysis')}
            </Text>
            {backStatus ? (
              <View style={{}}>
                <TouchableOpacity
                  onPress={() => this.goBackFun()}
                  style={{
                    flexDirection: 'row',
                    height: hp('6%'),
                    width: wp('70%'),
                    backgroundColor: '#94C036',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                  <View style={{}}>
                    <Text style={{color: 'white', marginLeft: 5}}>Back</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          {!backStatus ? (
            <View style={{}}>
              <TouchableOpacity
                onPress={() => this.grossMarginFun()}
                style={{
                  flexDirection: 'row',
                  height: hp('6%'),
                  width: wp('70%'),
                  backgroundColor: '#94C036',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                  alignSelf: 'center',
                }}>
                <View style={{}}>
                  <Text style={{color: 'white', marginLeft: 5}}>
                    {translate('Gross Margin')}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.menuAnalysisFun()}
                style={{
                  flexDirection: 'row',
                  height: hp('6%'),
                  width: wp('70%'),
                  backgroundColor: '#94C036',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                  alignSelf: 'center',
                }}>
                <View style={{}}>
                  <Text style={{color: 'white', marginLeft: 5}}>
                    {translate('Menu Analysis')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}

          {grossMarginStatus && backStatus ? (
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
          ) : null}
          {menuAnalysisStatus && backStatus ? (
            <View style={{marginHorizontal: wp('5%')}}>
              <View style={{alignSelf: 'center', marginTop: hp('2%')}}>
                <Text>{locationName}</Text>
              </View>
              {menuAnalysisLoader ? (
                <ActivityIndicator color="grey" size="large" />
              ) : (
                <View style={{}}>
                  <Accordion
                    expandMultiple
                    underlayColor="#fff"
                    sections={SECTIONS}
                    activeSections={activeSections}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                    onChange={this._updateSections}
                  />
                </View>
              )}
            </View>
          ) : null}
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

export default connect(mapStateToProps, {UserTokenAction})(Reports);
