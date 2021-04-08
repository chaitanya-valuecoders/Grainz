import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Switch,
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
  getPendingMepsApi,
  deleteMepApi,
  getMepsHistoryApi,
  getMepsOldHistoryApi,
} from '../../connectivity/api';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {name: 'History', icon: img.historyIcon},
        {name: 'Add new', icon: img.addIcon},
        {name: 'Back'},
      ],
      token: '',
      modalVisible: false,
      firstName: '',
      modalVisibleAdd: false,
      activeSections: [],
      SECTIONS: [],
      recipeLoader: false,
      modalVisibleRecipeDetails: false,
      sectionData: {},
      isMakeMeStatus: true,
      makeMeText: 'Make me',
      SECTIONS_HISTORY: [],
      activeSectionsHistory: [],
      recipeLoaderHistory: true,
    };
  }

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  setModalVisibleAdd = visible => {
    this.setState({modalVisibleAdd: visible});
  };

  setModalVisibleRecipeDetails = (visible, data) => {
    this.setState({
      modalVisibleRecipeDetails: visible,
      sectionData: data,
    });
  };

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
        });
      })
      .catch(err => {
        console.warn('ERr', err);
      });
  };

  getPendingMepsData = () => {
    this.setState(
      {
        recipeLoader: true,
      },
      () =>
        getPendingMepsApi()
          .then(res => {
            this.setState({
              SECTIONS: res.data,
              recipeLoader: false,
            });
          })
          .catch(err => {
            console.log('ERR MEP', err);

            this.setState({
              recipeLoader: false,
            });
          }),
    );
  };

  componentDidMount() {
    this.getData();
    this.getPendingMepsData();
    this.getHistoryMepData();
  }

  getHistoryMepData = () => {
    this.setState(
      {
        recipeLoaderHistory: true,
      },
      () =>
        getMepsHistoryApi()
          .then(res => {
            this.setState({
              SECTIONS_HISTORY: res.data,
              recipeLoaderHistory: false,
            });
          })
          .catch(err => {
            console.log('ERR MEP', err);

            this.setState({
              recipeLoaderHistory: false,
            });
          }),
    );
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    if (item.name === 'History') {
      this.setModalVisible(true);
      this.getHistoryMepData();
    } else if (item.name === 'Add new') {
      this.setModalVisibleAdd(true);
    } else if (item.name === 'Back') {
      this.props.navigation.goBack();
    }
  };

  onPressCollapseFun = () => {
    this.setState({
      activeSections: [],
    });
  };

  onPressCollapseHisFun = () => {
    this.setState({
      activeSectionsHistory: [],
    });
  };

  _renderHeader = section => {
    const finalData = moment(section.productionDate).format(
      'dddd, MMM DD YYYY',
    );
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
          source={img.arrowRightIcon}
        />
        <Text
          style={{
            color: '#98989B',
            fontSize: 15,
            fontWeight: 'bold',
            marginLeft: wp('2%'),
          }}>
          {finalData}
        </Text>
      </View>
    );
  };
  _renderHeaderHistory = section => {
    const finalData = moment(section.productionDate).format(
      'dddd, MMM DD YYYY',
    );
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
          source={img.arrowRightIcon}
        />
        <Text
          style={{
            color: '#98989B',
            fontSize: 15,
            fontWeight: 'bold',
            marginLeft: wp('2%'),
          }}>
          {finalData}
        </Text>
      </View>
    );
  };

  _renderContent = section => {
    return (
      <View style={{marginTop: hp('2%')}}>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 2}}>
              <TouchableOpacity
                onPress={() =>
                  this.setModalVisibleRecipeDetails(true, section)
                }>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {section.name}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text>{section.quantity} g</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <TouchableOpacity
                style={{backgroundColor: '#94C036', padding: 5}}>
                <Text style={{fontSize: 13, color: '#fff'}}>View Recipe</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={{fontSize: 12, marginLeft: wp('5%')}}>
              {section.notes}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  _renderContentHistory = section => {
    return (
      <View style={{marginTop: hp('2%')}}>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 2}}>
              <TouchableOpacity
                onPress={() =>
                  this.setState(
                    {
                      modalVisible: false,
                    },
                    () =>
                      setTimeout(() => {
                        this.setModalVisibleRecipeDetails(true, section);
                      }, 500),
                  )
                }>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {section.name}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text>{section.quantity} g</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({
      activeSections,
    });
  };
  _updateSectionsHistory = activeSectionsHistory => {
    this.setState({
      activeSectionsHistory,
    });
  };

  saveRecipeDetailsFun = () => {
    alert('Details Saved');
  };

  toggleSwitchNotif = () => {
    const {isMakeMeStatus} = this.state;
    if (isMakeMeStatus) {
      this.setState({
        isMakeMeStatus: false,
        makeMeText: 'Done',
      });
    } else {
      this.setState({
        isMakeMeStatus: true,
        makeMeText: 'Make me',
      });
    }
  };

  deleteMepFun = () => {
    const {sectionData} = this.state;
    console.warn('sect', sectionData);
    let payload = {
      id: sectionData.id,
      recipeVersionId: sectionData.recipeVersionId,
      userId: sectionData.userId,
      preparedById: 'string',
      madeBy: 'string',
      requestedBy: 'string',
      preparedBy: 'string',
      isPrepared: sectionData.isPrepared,
      isRecycled: sectionData.isRecycled,
      isTracked: sectionData.isTracked,
      name: sectionData.name,
      unit: sectionData.unit,
      productionDate: sectionData.productionDate,
      preparedDate: sectionData.preparedDate,
      recipeId: sectionData.recipeId,
      quantity: sectionData.quantity,
      notes: sectionData.notes,
    };
    deleteMepApi(payload)
      .then(res => {
        this.setState(
          {
            modalVisibleRecipeDetails: false,
            sectionData: '',
          },
          () => this.getPendingMepsData(),
        );
      })
      .catch(err => {
        console.warn('ERRDeleteMep', err);
      });
  };

  getOldMepHistoryData = () => {
    const {SECTIONS_HISTORY} = this.state;
    this.setState(
      {
        recipeLoaderHistory: true,
      },
      () =>
        getMepsOldHistoryApi()
          .then(res => {
            this.setState({
              SECTIONS_HISTORY: [...SECTIONS_HISTORY, ...res.data],
              recipeLoaderHistory: false,
            });
          })
          .catch(err => {
            console.log('ERR MEP', err);

            this.setState({
              recipeLoaderHistory: false,
            });
          }),
    );
  };

  render() {
    const {
      modalVisible,
      modalVisibleAdd,
      recipeLoader,
      SECTIONS,
      activeSections,
      firstName,
      buttons,
      modalVisibleRecipeDetails,
      sectionData,
      isMakeMeStatus,
      makeMeText,
      SECTIONS_HISTORY,
      activeSectionsHistory,
      recipeLoaderHistory,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        <SubHeader />
        <ScrollView style={{marginBottom: hp('5%')}}>
          <View
            style={{
              backgroundColor: '#412916',
              alignItems: 'center',
              height: hp('35%'),
            }}>
            <Text style={{fontSize: 22, color: 'white', marginTop: 8}}>
              MISE-EN-PLACE
            </Text>
            {buttons.map((item, index) => {
              return (
                <View style={{}} key={index}>
                  <TouchableOpacity
                    onPress={() => this.onPressFun(item)}
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
                      <Image
                        source={item.icon}
                        style={{
                          height: 22,
                          width: 22,
                          tintColor: 'white',
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View>
                    <Modal isVisible={modalVisible} backdropOpacity={0.35}>
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
                              MISE-EN-PLACE HISTORY
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() => this.setModalVisible(false)}>
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
                        <ScrollView style={{marginBottom: hp('2%')}}>
                          <View
                            style={{
                              padding: hp('5%'),
                            }}>
                            <View style={{}}>
                              <TouchableOpacity
                                onPress={() => this.onPressCollapseHisFun()}
                                style={{
                                  height: hp('5%'),
                                  width: wp('50%'),
                                  backgroundColor: '#94C036',
                                  alignSelf: 'center',
                                  marginTop: hp('5%'),
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <Text style={{color: '#fff', fontSize: 16}}>
                                  Collapse All
                                </Text>
                              </TouchableOpacity>
                              {recipeLoaderHistory ? (
                                <ActivityIndicator
                                  color="#94C036"
                                  size="large"
                                />
                              ) : (
                                <View
                                  style={{
                                    marginTop: hp('3%'),
                                  }}>
                                  <Accordion
                                    expandMultiple
                                    underlayColor="#fff"
                                    sections={SECTIONS_HISTORY}
                                    activeSections={activeSectionsHistory}
                                    renderHeader={this._renderHeaderHistory}
                                    renderContent={this._renderContentHistory}
                                    onChange={this._updateSectionsHistory}
                                  />
                                  <TouchableOpacity
                                    onPress={() => this.getOldMepHistoryData()}
                                    style={{
                                      height: hp('8%'),
                                      width: wp('60%'),
                                      backgroundColor: '#F5F5F5',
                                      alignSelf: 'center',
                                      marginTop: hp('5%'),
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}>
                                    <Text
                                      style={{color: '#717171', fontSize: 16}}>
                                      View More (7 more days)
                                    </Text>
                                  </TouchableOpacity>
                                  <View style={{marginVertical: hp('3%')}}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.setModalVisible(false)
                                      }
                                      style={{
                                        width: wp('50%'),
                                        height: hp('5%'),
                                        alignSelf: 'center',
                                        backgroundColor: '#E7943B',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <Text
                                        style={{
                                          color: '#fff',
                                          fontSize: 15,
                                          fontWeight: 'bold',
                                        }}>
                                        Close
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              )}
                            </View>
                          </View>
                        </ScrollView>
                      </View>
                    </Modal>
                    <Modal isVisible={modalVisibleAdd} backdropOpacity={0.35}>
                      <View
                        style={{
                          width: wp('80%'),
                          height: hp('70%'),
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
                              MISE-EN-PLACE BUILDER
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() => this.setModalVisibleAdd(false)}>
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
                          <View style={{padding: hp('5%')}}>
                            <View
                              style={{
                                height: hp('50%'),
                              }}>
                              <TouchableOpacity
                                style={{
                                  height: hp('5%'),
                                  width: wp('50%'),
                                  backgroundColor: '#94C036',
                                  alignSelf: 'center',
                                  marginTop: hp('5%'),
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <Text style={{color: '#fff', fontSize: 16}}>
                                  Collapse All
                                </Text>
                              </TouchableOpacity>
                            </View>
                            <View style={{}}>
                              <TouchableOpacity
                                onPress={() => this.setModalVisibleAdd(false)}
                                style={{
                                  width: wp('15%'),
                                  height: hp('5%'),
                                  alignSelf: 'flex-end',
                                  backgroundColor: '#E7943B',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                  }}>
                                  Close
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </ScrollView>
                      </View>
                    </Modal>

                    <Modal
                      isVisible={modalVisibleRecipeDetails}
                      backdropOpacity={0.35}>
                      <View
                        style={{
                          width: wp('80%'),
                          height: hp('90%'),
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
                              MISE-EN-PLACE DETAILS
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() =>
                                this.setModalVisibleRecipeDetails(false)
                              }>
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
                          <View style={{padding: hp('5%')}}>
                            <View
                              style={{
                                height: hp('80%'),
                              }}>
                              <View
                                style={{
                                  height: hp('12%'),
                                }}>
                                <Text
                                  style={{
                                    color: '#7F7F7F',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                  }}>
                                  {sectionData !== undefined
                                    ? sectionData.name
                                    : null}
                                </Text>
                                <View
                                  style={{
                                    marginTop: hp('1%'),
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <Switch
                                    style={{width: '20%'}}
                                    trackColor={{
                                      false: '#767577',
                                      true: '#94C036',
                                    }}
                                    value={isMakeMeStatus}
                                    onValueChange={() =>
                                      this.toggleSwitchNotif()
                                    }
                                    thumbColor="#fff"
                                  />
                                  <Text
                                    style={{
                                      color: '#7F7F7F',
                                      marginLeft: wp('4%'),
                                      fontWeight: '900',
                                    }}>
                                    {makeMeText}
                                  </Text>
                                </View>
                              </View>

                              <TouchableOpacity
                                style={{
                                  height: hp('5%'),
                                  width: wp('62%'),
                                  backgroundColor: 'red',
                                  alignSelf: 'center',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexDirection: 'row',
                                }}
                                onPress={() => this.deleteMepFun()}>
                                <Image
                                  source={img.cancelIcon}
                                  style={{
                                    height: 22,
                                    width: 22,
                                    tintColor: 'white',
                                    resizeMode: 'contain',
                                  }}
                                />
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    marginLeft: 10,
                                  }}>
                                  Delete
                                </Text>
                              </TouchableOpacity>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <TouchableOpacity
                                onPress={() => this.saveRecipeDetailsFun()}
                                style={{
                                  width: wp('30%'),
                                  height: hp('5%'),
                                  backgroundColor: '#94C036',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                  }}>
                                  Save
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.setModalVisibleRecipeDetails(false)
                                }
                                style={{
                                  width: wp('30%'),
                                  height: hp('5%'),
                                  backgroundColor: '#E7943B',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                  }}>
                                  Close
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </ScrollView>
                      </View>
                    </Modal>
                  </View>
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            onPress={() => this.onPressCollapseFun()}
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
              <Text style={{color: 'white', marginLeft: 5}}>Collapse All</Text>
            </View>
          </TouchableOpacity>
          {recipeLoader ? (
            <ActivityIndicator color="#94C036" size="large" />
          ) : (
            <View style={{marginTop: hp('3%'), marginHorizontal: wp('5%')}}>
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
