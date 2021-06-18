import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
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
  getUserNameEventsApi,
  getEventDetailsAdminApi,
} from '../../../../connectivity/api';
import styles from './style';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {translate} from '../../../../utils/translations';
import ModalPicker from '../../../../components/ModalPicker';
import moment from 'moment';
import CheckBox from '@react-native-community/checkbox';

class EditEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [],
      token: '',
      buttonsSubHeader: [],
      loader: true,
      isDatePickerVisible: false,
      finalDate: '',
      hideEventDetails: false,
      kitchenItems: [],
      kitchenInstructions: false,
      timeValue: '',
      clientValue: '',
      peopleValue: '',
      placeHolderTextDept: 'Select User',
      selectedTextUser: '',
      userId: '',
      userArr: [],
      contactValue: '',
      externalNotesValue: '',
      internalNotesValue: '',
      kitchenNotesValue: '',
      productionDate: '',
      isConfirmedVaue: false,
      isPaidValue: false,
      pageData: '',
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
          buttons: [
            {
              name: translate('Invoice'),
              icon: img.addIconNew,
              // screen: 'GrossMarginAdminScreen',
            },
            {
              name: translate('Pro forma'),
              icon: img.menuAnalysisIcon,
              // screen: 'MenuAnalysisAdminScreen',
            },
          ],
          kitchenItems: [
            {
              id: 0,
              name: 'Add Menu Items',
              icon: img.addIconNew,
            },
            {
              id: 1,
              name: 'Margin',
              icon: img.marginIcon,
            },
          ],
          buttonsSubHeader: [
            {name: translate('ADMIN')},
            {name: translate('Setup')},
            {name: translate('INBOX')},
          ],
        });
      })
      .catch(err => {
        console.warn('ERr', err.response);
        Alert.alert('Grainz', 'Session Timeout', [
          {text: 'OK', onPress: () => this.removeToken()},
        ]);
      });
  };

  removeToken = async () => {
    await AsyncStorage.removeItem('@appToken');
    this.props.UserTokenAction(null);
  };

  componentDidMount() {
    this.getData();
    this.getUserData();
    const {detailsId} = this.props.route && this.props.route.params;
    this.getPageData(detailsId);
  }

  getPageData = detailsId => {
    getEventDetailsAdminApi(detailsId)
      .then(res => {
        console.log('Re', res);
        this.setState({
          pageData: res.data,
          timeValue: res.data && res.data.eventTime,
          clientValue: res.data && res.data.clientName,
          peopleValue: String(res.data && res.data.pax),
          placeHolderTextDept: 'Select User',
          selectedTextUser: '',
          contactValue: res.data && res.data.clientDetails,
          externalNotesValue: res.data && res.data.externalNotes,
          internalNotesValue: res.data && res.data.internalNotes,
          kitchenNotesValue: res.data && res.data.kitchenNotes,
          isConfirmedVaue: res.data && res.data.isConfirmed,
          isPaidValue: res.data && res.data.isPaid,
          finalDate: moment(res.data && res.data.eventDate).format('L'),
        });
      })
      .catch(err => {
        console.warn('ERr', err);
      });
  };

  getUserData = () => {
    getUserNameEventsApi()
      .then(res => {
        const finalArr = [];
        res.data.map(item => {
          finalArr.push({
            name: item.firstName,
            id: item.id,
          });
        });
        this.setState({
          userArr: [...finalArr],
          dataListLoader: false,
        });
      })
      .catch(err => {
        console.warn('ERr', err);
      });
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    alert('Work in Progress');
  };

  showDatePickerFun = () => {
    this.setState({
      isDatePickerVisible: true,
    });
  };

  handleConfirm = date => {
    let newdate = moment(date).format('L');
    let productionDate = moment(date).format();
    this.setState({
      finalDate: newdate,
      productionDate,
    });

    this.hideDatePicker();
  };

  hideDatePicker = () => {
    this.setState({
      isDatePickerVisible: false,
    });
  };
  showEventDetails = () => {
    this.setState({
      hideEventDetails: !this.state.hideEventDetails,
    });
  };

  showKitchenIns = () => {
    this.setState({
      kitchenInstructions: !this.state.kitchenInstructions,
    });
  };

  selectUserNameFun = item => {
    this.setState({
      userId: item.id,
      selectedTextUser: item.name,
    });
  };

  updateFun = () => {
    const {
      productionDate,
      clientValue,
      peopleValue,
      contactValue,
      userId,
      isConfirmedVaue,
      isPaidValue,
      externalNotesValue,
      internalNotesValue,
      kitchenNotesValue,
      timeValue,
    } = this.state;
    let payload = {
      clientDetails: contactValue,
      clientName: clientValue,
      eventDate: productionDate,
      eventItemList: [],
      eventManager: userId,
      eventOfferList: [],
      eventTime: timeValue,
      externalNotes: externalNotesValue,
      internalNotes: internalNotesValue,
      isConfirmed: isConfirmedVaue,
      isPaid: isPaidValue,
      kitchenNotes: kitchenNotesValue,
      pax: peopleValue,
    };
    console.log('Payload', payload);

    // addEventAdminApi(payload)
    //   .then(res => {
    //     Alert.alert('Grainz', 'Event added successfully', [
    //       {
    //         text: 'Okay',
    //         onPress: () => this.props.navigation.goBack(),
    //       },
    //     ]);
    //   })
    //   .catch(err => {
    //     console.log('err', err);
    //   });
  };

  render() {
    const {
      buttons,
      buttonsSubHeader,
      loader,
      isDatePickerVisible,
      finalDate,
      hideEventDetails,
      kitchenItems,
      kitchenInstructions,
      timeValue,
      clientValue,
      peopleValue,
      dataListLoader,
      placeHolderTextDept,
      userArr,
      selectedTextUser,
      contactValue,
      externalNotesValue,
      internalNotesValue,
      kitchenNotesValue,
      isConfirmedVaue,
      isPaidValue,
    } = this.state;

    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {loader ? (
          <ActivityIndicator size="small" color="#98C13E" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} index={0} />
        )}

        <View style={{...styles.subContainer, flex: 1}}>
          <View style={styles.firstContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.adminTextStyle}>
                {translate('Events')} EDITTTT
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.goBackContainer}>
              <Text style={styles.goBackTextStyle}>Go Back</Text>
            </TouchableOpacity>
          </View>

          <View style={{flex: 1}}>
            <ScrollView style={{}} showsVerticalScrollIndicator={false}>
              <View style={{padding: hp('3%')}}>
                <View style={{flexDirection: 'row'}}>
                  {buttons.map((item, index) => {
                    return (
                      <View style={styles.itemContainer} key={index}>
                        <TouchableOpacity
                          onPress={() => this.onPressFun(item)}
                          style={{
                            backgroundColor: '#fff',
                            flex: 1,
                            borderRadius: 8,
                            padding: 10,
                            marginRight: wp('5%'),
                            elevation: 3,
                            shadowOpacity: 1.0,
                            shadowOffset: {
                              width: 1,
                              height: 1,
                            },
                            shadowRadius: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.05)',
                          }}>
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              source={item.icon}
                              style={{
                                height: 50,
                                width: 50,
                                resizeMode: 'contain',
                              }}
                            />
                          </View>
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontSize: 13,
                                textAlign: 'center',
                                fontFamily: 'Inter-Regular',
                              }}
                              numberOfLines={1}>
                              {item.name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
                <TouchableOpacity
                  onPress={() => this.showEventDetails()}
                  style={{
                    padding: 13,
                    marginBottom: hp('3%'),
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    elevation: 3,
                    shadowOpacity: 2.0,
                    shadowColor: 'rgba(0, 0, 0, 0.05)',
                    shadowOffset: {
                      width: 2,
                      height: 2,
                    },
                    shadowRadius: 10,
                    borderRadius: 5,
                    marginTop: hp('3%'),
                  }}>
                  {hideEventDetails ? (
                    <Image
                      source={img.plusIcon}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        tintColor: '#492813',
                      }}
                    />
                  ) : (
                    <Image
                      source={img.dashIcon}
                      style={{
                        width: 15,
                        height: 15,
                        resizeMode: 'contain',
                        tintColor: '#492813',
                      }}
                    />
                  )}
                  <Text
                    style={{
                      marginLeft: 10,
                      fontFamily: 'Inter-Regular',
                      color: '#492813',
                    }}>
                    Event Details
                  </Text>
                </TouchableOpacity>
                {hideEventDetails ? null : (
                  <View style={{}}>
                    <TouchableOpacity
                      onPress={() => this.showDatePickerFun()}
                      style={{
                        padding: 12,
                        marginBottom: hp('3%'),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: '#fff',
                        elevation: 3,
                        shadowOpacity: 2.0,
                        shadowColor: 'rgba(0, 0, 0, 0.05)',
                        shadowOffset: {
                          width: 2,
                          height: 2,
                        },
                        shadowRadius: 10,
                        borderRadius: 5,
                      }}>
                      <TextInput
                        placeholder="Select Date"
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

                    <View style={{marginBottom: hp('3%')}}>
                      <TextInput
                        placeholder="Time"
                        value={timeValue}
                        style={{
                          padding: 14,
                          justifyContent: 'space-between',
                          elevation: 3,
                          shadowOpacity: 2.0,
                          shadowColor: 'rgba(0, 0, 0, 0.05)',
                          shadowOffset: {
                            width: 2,
                            height: 2,
                          },
                          shadowRadius: 10,
                          borderRadius: 5,
                          backgroundColor: '#fff',
                        }}
                        keyboardType="number-pad"
                        onChangeText={value => {
                          this.setState({
                            timeValue: value,
                          });
                        }}
                      />
                    </View>
                    <View style={{marginBottom: hp('3%')}}>
                      <TextInput
                        placeholder="Client Name"
                        value={clientValue}
                        style={{
                          padding: 14,
                          justifyContent: 'space-between',
                          elevation: 3,
                          shadowOpacity: 2.0,
                          shadowColor: 'rgba(0, 0, 0, 0.05)',
                          shadowOffset: {
                            width: 2,
                            height: 2,
                          },
                          shadowRadius: 10,
                          borderRadius: 5,
                          backgroundColor: '#fff',
                        }}
                        keyboardType="number-pad"
                        onChangeText={value => {
                          this.setState({
                            clientValue: value,
                          });
                        }}
                      />
                    </View>
                    <View style={{marginBottom: hp('3%')}}>
                      <TextInput
                        placeholder="No. of people"
                        value={peopleValue}
                        style={{
                          padding: 14,
                          justifyContent: 'space-between',
                          elevation: 3,
                          shadowOpacity: 2.0,
                          shadowColor: 'rgba(0, 0, 0, 0.05)',
                          shadowOffset: {
                            width: 2,
                            height: 2,
                          },
                          shadowRadius: 10,
                          borderRadius: 5,
                          backgroundColor: '#fff',
                        }}
                        keyboardType="default"
                        onChangeText={value => {
                          this.setState({
                            peopleValue: value,
                          });
                        }}
                      />
                    </View>
                    <View style={{marginBottom: hp('3%')}}>
                      <TextInput
                        placeholder="Contact Details"
                        value={contactValue}
                        style={{
                          padding: 14,
                          justifyContent: 'space-between',
                          elevation: 3,
                          shadowOpacity: 2.0,
                          shadowColor: 'rgba(0, 0, 0, 0.05)',
                          shadowOffset: {
                            width: 2,
                            height: 2,
                          },
                          shadowRadius: 10,
                          borderRadius: 5,
                          backgroundColor: '#fff',
                        }}
                        keyboardType="default"
                        onChangeText={value => {
                          this.setState({
                            contactValue: value,
                          });
                        }}
                      />
                    </View>
                    <View style={{marginBottom: hp('3%')}}>
                      <TextInput
                        placeholder="Notes-External"
                        value={externalNotesValue}
                        style={{
                          padding: 14,
                          justifyContent: 'space-between',
                          elevation: 3,
                          shadowOpacity: 2.0,
                          shadowColor: 'rgba(0, 0, 0, 0.05)',
                          shadowOffset: {
                            width: 2,
                            height: 2,
                          },
                          shadowRadius: 10,
                          borderRadius: 5,
                          backgroundColor: '#fff',
                        }}
                        keyboardType="default"
                        onChangeText={value => {
                          this.setState({
                            externalNotesValue: value,
                          });
                        }}
                      />
                    </View>
                    <View style={{marginBottom: hp('3%')}}>
                      <TextInput
                        placeholder="Notes-Internal"
                        value={internalNotesValue}
                        style={{
                          padding: 14,
                          justifyContent: 'space-between',
                          elevation: 3,
                          shadowOpacity: 2.0,
                          shadowColor: 'rgba(0, 0, 0, 0.05)',
                          shadowOffset: {
                            width: 2,
                            height: 2,
                          },
                          shadowRadius: 10,
                          borderRadius: 5,
                          backgroundColor: '#fff',
                        }}
                        keyboardType="default"
                        onChangeText={value => {
                          this.setState({
                            internalNotesValue: value,
                          });
                        }}
                      />
                    </View>
                    <View style={{marginBottom: hp('3%')}}>
                      <ModalPicker
                        dataListLoader={dataListLoader}
                        placeHolderLabel={placeHolderTextDept}
                        placeHolderLabelColor="grey"
                        dataSource={userArr}
                        selectedLabel={selectedTextUser}
                        onSelectFun={item => this.selectUserNameFun(item)}
                      />
                    </View>
                    <View
                      style={{
                        backgroundColor: '#FFFFFF',
                        flexDirection: 'row',
                        borderWidth: 0.5,
                        borderColor: '#F0F0F0',
                        height: 60,
                        alignItems: 'center',
                        borderRadius: 6,
                        justifyContent: 'space-between',
                        marginBottom: hp('3%'),
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#161C27',
                            fontSize: 14,
                            marginLeft: wp('2%'),
                            fontFamily: 'Inter-Regular',
                          }}>
                          Confirmed ?
                        </Text>
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          marginRight: 15,
                        }}>
                        <CheckBox
                          value={isConfirmedVaue}
                          onValueChange={() =>
                            this.setState({isConfirmedVaue: !isConfirmedVaue})
                          }
                          style={{
                            margin: 5,
                            height: 20,
                            width: 20,
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        backgroundColor: '#FFFFFF',
                        flexDirection: 'row',
                        borderWidth: 0.5,
                        borderColor: '#F0F0F0',
                        height: 60,
                        alignItems: 'center',
                        borderRadius: 6,
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#161C27',
                            fontSize: 14,
                            marginLeft: wp('2%'),
                            fontFamily: 'Inter-Regular',
                          }}>
                          Paid ?
                        </Text>
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          marginRight: 15,
                        }}>
                        <CheckBox
                          value={isPaidValue}
                          onValueChange={() =>
                            this.setState({isPaidValue: !isPaidValue})
                          }
                          style={{
                            margin: 5,
                            height: 20,
                            width: 20,
                          }}
                        />
                      </View>
                    </View>

                    <DateTimePickerModal
                      // is24Hour={true}
                      isVisible={isDatePickerVisible}
                      mode={'date'}
                      onConfirm={this.handleConfirm}
                      onCancel={this.hideDatePicker}
                      // maximumDate={minTime}
                      // minimumDate={new Date()}
                    />
                  </View>
                )}
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    flexDirection: 'row',
                    borderWidth: 0.5,
                    borderColor: '#F0F0F0',
                    height: 60,
                    alignItems: 'center',
                    borderRadius: 6,
                    justifyContent: 'space-between',
                    marginTop: hp('3%'),
                    paddingHorizontal: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#492813',
                        fontSize: 14,
                        fontFamily: 'Inter-Regular',
                      }}>
                      Department
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#492813',
                        fontSize: 14,
                        fontFamily: 'Inter-Regular',
                      }}>
                      Price
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#492813',
                        fontSize: 14,
                        fontFamily: 'Inter-Regular',
                      }}>
                      VAT%
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#492813',
                        fontSize: 14,
                        fontFamily: 'Inter-Regular',
                      }}>
                      Total HTVA
                    </Text>
                  </View>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity
                    onPress={() => alert('add line')}
                    style={{
                      height: hp('6%'),
                      width: wp('80%'),
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: hp('3%'),
                      borderRadius: 100,
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
                        Add Line
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{marginTop: hp('3%'), flexDirection: 'row'}}>
                  {kitchenItems.map((item, index) => {
                    return (
                      <View style={styles.itemContainer} key={index}>
                        <TouchableOpacity
                          onPress={() => this.onPressFun(item)}
                          style={{
                            backgroundColor: '#fff',
                            flex: 1,
                            borderRadius: 8,
                            padding: 10,
                            marginRight: wp('5%'),
                            elevation: 3,
                            shadowOpacity: 1.0,
                            shadowOffset: {
                              width: 1,
                              height: 1,
                            },
                            shadowRadius: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.05)',
                          }}>
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              source={item.icon}
                              style={{
                                height: 50,
                                width: 50,
                                resizeMode: 'contain',
                              }}
                            />
                          </View>
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontSize: 13,
                                textAlign: 'center',
                                fontFamily: 'Inter-Regular',
                              }}
                              numberOfLines={1}>
                              {item.name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
                <TouchableOpacity
                  onPress={() => this.showKitchenIns()}
                  style={{
                    padding: 13,
                    marginBottom: hp('3%'),
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    elevation: 3,
                    shadowOpacity: 2.0,
                    shadowColor: 'rgba(0, 0, 0, 0.05)',
                    shadowOffset: {
                      width: 2,
                      height: 2,
                    },
                    shadowRadius: 10,
                    borderRadius: 5,
                    marginTop: hp('3%'),
                  }}>
                  {kitchenInstructions ? (
                    <Image
                      source={img.plusIcon}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        tintColor: '#492813',
                      }}
                    />
                  ) : (
                    <Image
                      source={img.dashIcon}
                      style={{
                        width: 15,
                        height: 15,
                        resizeMode: 'contain',
                        tintColor: '#492813',
                      }}
                    />
                  )}
                  <Text
                    style={{
                      marginLeft: 10,
                      fontFamily: 'Inter-Regular',
                      color: '#492813',
                    }}>
                    Kitchen instructions
                  </Text>
                </TouchableOpacity>
                {kitchenInstructions ? null : (
                  <View style={{}}>
                    <View
                      style={{
                        backgroundColor: '#FFFFFF',
                        flexDirection: 'row',
                        borderWidth: 0.5,
                        borderColor: '#F0F0F0',
                        height: 60,
                        alignItems: 'center',
                        borderRadius: 6,
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#492813',
                            fontSize: 14,
                            marginLeft: wp('2%'),
                            fontFamily: 'Inter-Regular',
                          }}>
                          Menu Items
                        </Text>
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#492813',
                            fontSize: 14,
                            fontFamily: 'Inter-Regular',
                          }}>
                          Quantity
                        </Text>
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          marginRight: 15,
                          flexDirection: 'row',
                        }}>
                        <View>
                          <Text
                            style={{
                              color: '#492813',
                              fontSize: 14,
                              fontFamily: 'Inter-Regular',
                            }}>
                            Ex till ?
                          </Text>
                          <Text
                            style={{
                              color: '#492813',
                              fontSize: 14,
                              fontFamily: 'Inter-Regular',
                            }}>
                            Select All
                          </Text>
                        </View>

                        <View>
                          <CheckBox
                            // value={section.inUse}
                            // onValueChange={() =>
                            //   this.setState({htvaIsSelected: !htvaIsSelected})
                            // }
                            style={{
                              margin: 8,
                              height: 20,
                              width: 20,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={{marginVertical: hp('3%')}}>
                      <TextInput
                        placeholder="Kitchen notes"
                        value={kitchenNotesValue}
                        style={{
                          padding: 14,
                          justifyContent: 'space-between',
                          elevation: 3,
                          shadowOpacity: 2.0,
                          shadowColor: 'rgba(0, 0, 0, 0.05)',
                          shadowOffset: {
                            width: 2,
                            height: 2,
                          },
                          shadowRadius: 10,
                          borderRadius: 5,
                          backgroundColor: '#fff',
                        }}
                        keyboardType="number-pad"
                        onChangeText={value => {
                          this.setState({
                            kitchenNotesValue: value,
                          });
                        }}
                      />
                    </View>
                  </View>
                )}
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: hp('2%'),
                    }}>
                    <TouchableOpacity
                      onPress={() => this.updateFun()}
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
                        {translate('Update')}
                      </Text>
                    </TouchableOpacity>
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
              </View>
            </ScrollView>
          </View>
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

export default connect(mapStateToProps, {UserTokenAction})(EditEvent);
