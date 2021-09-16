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
  getMepRecipesApi,
  newMepListApi,
  getMepRecipeByIdsApi,
} from '../../connectivity/api';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {MultipleSelectPicker} from 'react-native-multi-select-picker';
import {translate} from '../../utils/translations';
import styles from './style';

var minTime = new Date();
minTime.setHours(0);
minTime.setMinutes(0);
minTime.setMilliseconds(0);

class AddBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      modalVisible: false,
      firstName: '',
      recipeLoader: false,
      modalVisibleRecipeDetails: false,
      isDatePickerVisible: false,
      finalDate: '',
      selectectedItems: [],
      isShownPicker: false,
      items: [],
      productionDate: '',
      applyStatus: false,
      buttonsSubHeader: [],
      applyClickStatus: false,
      buttonLoader: false,
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
        console.warn('ERr', err);
      });
  };

  componentDidMount() {
    this.getData();
  }

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressApplyFun = () => {
    const {selectectedItems, productionDate, applyStatus} = this.state;
    if (productionDate === '' || selectectedItems.length === 0) {
      alert('Please select date and recipe');
    } else if (applyStatus === false) {
      this.setState(
        {
          isShownPicker: false,
          applyStatus: true,
          applyClickStatus: true,
        },
        () => this.createpayloadFun(),
      );
    }
  };

  createpayloadFun = () => {
    let newData = [];
    const {selectectedItems, productionDate} = this.state;
    selectectedItems.map(item => {
      const obj = {};
      obj.isSelected = true;
      obj.notes = '';
      obj.productionDate = productionDate;
      obj.quantity = item.quantity;
      obj.recipeId = item.value;
      obj.name = item.label;
      obj.unit = item.unit;
      newData = [...newData, obj];
    });
    this.setState({
      selectectedItems: newData,
    });
  };

  hideDatePicker = () => {
    this.setState({
      isDatePickerVisible: false,
    });
  };

  getRecipesData = () => {
    const {finalDate} = this.state;
    getMepRecipesApi(finalDate)
      .then(res => {
        const {data} = res;
        let newData = [];
        data.map(item => {
          const obj = {};
          obj.label = item.name;
          obj.value = item.id;
          obj.quantity = item.batchQuantity;
          obj.unit = item.batchUnit;
          newData = [...newData, obj];
        });
        this.setState({
          items: newData,
        });
      })
      .catch(err => {
        console.warn('Err', err);
      });
  };

  handleConfirm = date => {
    let newdate = moment(date).format('L');
    this.setState(
      {
        finalDate: newdate,
        productionDate: date,
      },
      () => this.getRecipesData(),
    );

    this.hideDatePicker();
  };

  showDatePickerFun = () => {
    this.setState({
      isDatePickerVisible: true,
    });
  };

  addMepListFun = () => {
    const {selectectedItems, productionDate} = this.state;

    if (productionDate === '' || selectectedItems.length === 0) {
      alert('Please select date and recipe');
    } else {
      this.setState(
        {
          buttonLoader: true,
        },
        () => this.hitAddApi(),
      );
    }
  };

  hitAddApi = () => {
    const {selectectedItems} = this.state;
    newMepListApi(selectectedItems)
      .then(res => {
        Alert.alert('Grainz', 'Mep added successfully', [
          {
            text: 'Okay',
            onPress: () =>
              this.setState(
                {
                  selectectedItems: [],
                  buttonLoader: false,
                },
                () => this.props.navigation.goBack(),
              ),
          },
        ]);
      })
      .catch(err => {
        console.warn('ERRDeleteMep', err.response);
      });
  };

  openRecipeDropDown = () => {
    const {applyStatus, finalDate} = this.state;
    if (finalDate) {
      if (applyStatus) {
        this.setState({
          isShownPicker: false,
        });
      } else {
        this.setState({
          isShownPicker: true,
        });
      }
    } else {
      alert('Please select date first.');
    }
  };

  editQuantityFun = (index, type, value) => {
    const {selectectedItems} = this.state;

    let newArr = selectectedItems.map((item, i) =>
      index === i
        ? {
            ...item,
            [type]: value,
          }
        : item,
    );
    this.setState({
      selectectedItems: [...newArr],
    });
  };

  render() {
    const {
      recipeLoader,
      firstName,
      isDatePickerVisible,
      finalDate,
      isShownPicker,
      selectectedItems,
      items,
      applyStatus,
      buttonsSubHeader,
      applyClickStatus,
      buttonLoader,
    } = this.state;

    return (
      <View style={styles.container}>
        <Header
          logout={firstName}
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {/* {recipeLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )} */}
        <ScrollView style={{marginBottom: hp('2%')}}>
          <View>
            <View style={styles.subContainer}>
              <View style={styles.firstContainer}>
                <View style={{flex: 1}}>
                  <Text style={styles.adminTextStyle}>
                    {translate('Mise-en-Place')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={styles.goBackContainer}>
                  <Text style={styles.goBackTextStyle}>
                    {translate('Go Back')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{}}>
              <View>
                <View>
                  <ScrollView>
                    <View style={{padding: hp('3%')}}>
                      <View style={{}}>
                        <TouchableOpacity
                          onPress={() => this.showDatePickerFun()}
                          style={{
                            padding: 14,
                            marginBottom: hp('3%'),
                            backgroundColor: '#fff',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderRadius: 6,
                          }}>
                          <TextInput
                            placeholder="dd-mm-yy"
                            value={finalDate}
                            editable={false}
                          />
                          <Image
                            source={img.calenderIcon}
                            style={{
                              width: 20,
                              height: 20,
                              resizeMode: 'contain',
                            }}
                          />
                        </TouchableOpacity>

                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <TouchableOpacity
                            onPress={() => {
                              this.openRecipeDropDown();
                            }}
                            style={{
                              padding: 14,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              backgroundColor: '#fff',
                              borderRadius: 6,
                              width: wp('70%'),
                            }}>
                            {selectectedItems.length > 0 ? (
                              <View>
                                {applyStatus ? (
                                  <View>
                                    {selectectedItems.map(item => {
                                      return (
                                        <View style={{marginTop: hp('1%')}}>
                                          <Text>{item.name}</Text>
                                        </View>
                                      );
                                    })}
                                  </View>
                                ) : selectectedItems.length > 0 ? (
                                  <View>
                                    {selectectedItems.map(item => {
                                      return (
                                        <View style={{marginTop: hp('1%')}}>
                                          <Text>{item.label}</Text>
                                        </View>
                                      );
                                    })}
                                  </View>
                                ) : null}
                              </View>
                            ) : (
                              <Text style={{color: '#D6D7D9'}}>
                                Select recipe
                              </Text>
                            )}
                            <Image
                              source={img.arrowDownIcon}
                              style={{
                                width: 15,
                                height: 15,
                                resizeMode: 'contain',
                              }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            disabled={applyClickStatus}
                            onPress={() => {
                              this.onPressApplyFun();
                            }}
                            style={{
                              padding: 14,
                            }}>
                            <Text
                              style={{
                                fontFamily: 'Inter-SemiBold',
                                textDecorationLine: 'underline',
                                textDecorationColor: '#7AA62D',
                                color: '#7AA62D',
                                fontSize: 16,
                              }}>
                              Apply
                            </Text>
                          </TouchableOpacity>
                        </View>

                        {isShownPicker ? (
                          <MultipleSelectPicker
                            items={items}
                            onSelectionsChange={ele => {
                              this.setState({selectectedItems: ele});
                            }}
                            selectedItems={selectectedItems}
                            buttonStyle={{
                              height: 100,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            buttonText="hello"
                            checkboxStyle={{height: 20, width: 20}}
                          />
                        ) : null}

                        {applyStatus ? (
                          <View
                            style={{
                              marginTop: hp('3%'),
                            }}>
                            {selectectedItems.map((item, index) => {
                              return (
                                <View>
                                  <View>
                                    <Text
                                      style={{
                                        fontFamily: 'Inter-Regular',
                                        fontSize: 18,
                                      }}>
                                      {item.name}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      marginBottom: hp('3%'),
                                      marginTop: hp('3%'),
                                      backgroundColor: '#fff',
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      borderRadius: 6,
                                    }}>
                                    <View style={{flex: 3}}>
                                      <TextInput
                                        placeholder="Quantity"
                                        value={String(item.quantity)}
                                        style={{
                                          padding: 14,
                                        }}
                                        onChangeText={value =>
                                          this.editQuantityFun(
                                            index,
                                            'quantity',
                                            value,
                                          )
                                        }
                                      />
                                    </View>
                                    <View
                                      style={{
                                        backgroundColor: '#F7F8F5',
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderTopRightRadius: 6,
                                        borderBottomRightRadius: 6,
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: 15,
                                          fontFamily: 'Inter-Regular',
                                        }}>
                                        {item.unit}
                                      </Text>
                                    </View>
                                  </View>

                                  <View
                                    style={{
                                      padding: 14,
                                      marginBottom: hp('3%'),
                                      backgroundColor: '#fff',
                                      borderRadius: 6,
                                    }}>
                                    <TextInput
                                      placeholder="Notes"
                                      value={item.notes}
                                      onChangeText={value =>
                                        this.editQuantityFun(
                                          index,
                                          'notes',
                                          value,
                                        )
                                      }
                                    />
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        ) : null}

                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: hp('5%'),
                            }}>
                            {buttonLoader ? (
                              <View
                                style={{
                                  width: wp('30%'),
                                  height: hp('5%'),
                                  alignSelf: 'flex-end',
                                  backgroundColor: '#94C036',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: 100,
                                }}>
                                <ActivityIndicator color="#fff" size="small" />
                              </View>
                            ) : (
                              <TouchableOpacity
                                onPress={() => this.addMepListFun()}
                                style={{
                                  width: wp('30%'),
                                  height: hp('5%'),
                                  alignSelf: 'flex-end',
                                  backgroundColor: '#94C036',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: 100,
                                }}>
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                  }}>
                                  {translate('Save')}
                                </Text>
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity
                              onPress={() => this.props.navigation.goBack()}
                              style={{
                                width: wp('30%'),
                                height: hp('5%'),
                                alignSelf: 'flex-end',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft: wp('2%'),
                                borderRadius: 100,
                                borderWidth: 1,
                                borderColor: '#482813',
                              }}>
                              <Text
                                style={{
                                  color: '#482813',
                                  fontSize: 15,
                                  fontWeight: 'bold',
                                }}>
                                {translate('Cancel')}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <DateTimePickerModal
                          // is24Hour={true}
                          isVisible={isDatePickerVisible}
                          mode={'date'}
                          onConfirm={this.handleConfirm}
                          onCancel={this.hideDatePicker}
                          minimumDate={minTime}

                          // maximumDate={maxTime}
                          // minimumDate={new Date()}
                        />
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
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

export default connect(mapStateToProps, {UserTokenAction})(AddBuilder);
