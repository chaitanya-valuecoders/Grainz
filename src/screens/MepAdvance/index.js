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
  getAdvanceRecipeByIdsApi,
} from '../../connectivity/api';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {MultipleSelectPicker} from 'react-native-multi-select-picker';

var minTime = new Date();
minTime.setHours(0);
minTime.setMinutes(0);
minTime.setMilliseconds(0);

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [{name: 'Edit'}, {name: 'Back'}],
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
      isDatePickerVisible: false,
      finalDate: '',
      selectectedItems: [],
      isShownPicker: false,
      items: [],
      productionDate: '',
      applyStatus: false,
      detailsLoader: false,
      quantity: '',
      notes: '',
      advanceDetailsLoader: true,
      sectionAdvanceData: {},
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
          firstName: res.data.firstName,
        });
      })
      .catch(err => {
        console.warn('ERr', err);
      });
  };

  componentDidMount() {
    this.getProfileDataFun();
    this.setState(
      {
        recipeID: this.props.route && this.props.route.params.recipeID,
      },
      () => this.getAdvanceRecipeDetails(),
    );
  }

  myProfileFun = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    if (item.name === 'Edit') {
      //   this.setModalVisible(true);
      //   this.getHistoryMepData();
    } else if (item.name === 'Back') {
      this.props.navigation.goBack();
    }
  };

  getAdvanceRecipeDetails = () => {
    const {recipeID} = this.state;
    this.setState(
      {
        advanceDetailsLoader: true,
      },
      () =>
        getAdvanceRecipeByIdsApi(recipeID)
          .then(res => {
            this.setState({
              sectionAdvanceData: res.data,
              advanceDetailsLoader: false,
            });
          })
          .catch(err => {
            this.setState({
              advanceDetailsLoader: false,
            });
            console.warn('ERR', err);
          }),
    );
  };

  render() {
    const {
      firstName,
      buttons,
      advanceDetailsLoader,
      sectionAdvanceData,
      notes,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfileFun}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        <SubHeader />
        <ScrollView style={{marginBottom: hp('5%')}}>
          <View
            style={{
              backgroundColor: '#412916',
              alignItems: 'center',
              paddingVertical: hp('3%'),
            }}>
            <Text style={{fontSize: 22, color: 'white'}}>RECIPE DETAILS</Text>
            {buttons.map((item, index) => {
              return (
                <View style={{}} key={index}>
                  <TouchableOpacity
                    onPress={() => this.onPressFun(item)}
                    style={{
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          {advanceDetailsLoader ? (
            <ActivityIndicator color="#94C036" size="large" />
          ) : (
            <ScrollView>
              <View style={{padding: hp('3%')}}>
                <View style={{}}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 8,
                      }}>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          marginLeft: wp('5%'),
                        }}>
                        <Text
                          style={{
                            color: '#4C4B4B',
                            fontWeight: 'bold',
                          }}>
                          Recipe Name
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          marginLeft: wp('5%'),
                        }}>
                        <Text style={{color: '#212529'}}>
                          {sectionAdvanceData.name}
                        </Text>
                      </View>
                    </View>
                  </ScrollView>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 8,
                      }}>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          marginLeft: wp('5%'),
                        }}>
                        <Text
                          style={{
                            color: '#4C4B4B',
                            fontWeight: 'bold',
                          }}>
                          Version Name
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          marginLeft: wp('5%'),
                        }}>
                        <Text style={{color: '#212529'}}>
                          {sectionAdvanceData.name}
                        </Text>
                      </View>
                    </View>
                  </ScrollView>

                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: '#E5E5E5',
                      marginVertical: hp('2%'),
                    }}></View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text
                        style={{
                          color: '#4C4B4B',
                          fontWeight: 'bold',
                        }}>
                        Ingredient
                      </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text style={{color: '#212529'}}>Quantity</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: '#E5E5E5',
                      marginVertical: hp('1%'),
                    }}></View>
                  {Object.keys(sectionAdvanceData).length !== 0
                    ? sectionAdvanceData.recipeVersions[0].ingredients.map(
                        item => {
                          return (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 10,
                              }}>
                              <View
                                style={{
                                  flex: 1,
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    color: '#4C4B4B',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                  }}>
                                  {item.name}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flex: 1,
                                  alignItems: 'center',
                                }}>
                                <Text style={{color: '#212529'}}>
                                  {item.quantity} g
                                </Text>
                              </View>
                            </View>
                          );
                        },
                      )
                    : null}

                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: '#E5E5E5',
                      marginVertical: hp('1%'),
                    }}></View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text
                        style={{
                          color: '#4C4B4B',
                          fontWeight: 'bold',
                        }}>
                        Total
                      </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text style={{color: '#212529'}}>50 g</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      padding: 10,
                      marginTop: hp('2%'),
                      height: hp('20%'),
                      borderColor: '#C9CCD7',
                    }}>
                    <Text>
                      {Object.keys(sectionAdvanceData).length !== 0
                        ? sectionAdvanceData.recipeVersions[0].instructions
                        : null}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => alert('Print Done')}
                  style={{
                    width: wp('50%'),
                    height: hp('5%'),
                    backgroundColor: '#E2E6EA',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: hp('2%'),
                  }}>
                  <Text
                    style={{
                      color: '#64686C',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    Print fiche technique
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
