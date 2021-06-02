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
  getCustomerDataApi,
  updateCustomerDataApi,
} from '../../../connectivity/api';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';

import {translate} from '../../../utils/translations';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {name: translate('Price Plan'), id: 0},
        {name: translate('Locations'), id: 1},
        {name: translate('Users'), id: 2},
        {name: translate('Back'), id: 3},
      ],
      token: '',
      modalVisible: false,
      firstName: '',
      recipeLoader: false,
      pageLoading: false,
      selectedItemObjects: '',
      buttonsSubHeader: [],
      accountName: '',
      businessName: '',
      url: '',
      mainAddress: '',
      contractSigned: '',
      isActive: '',
      tcsAccepted: '',
      updateLoader: false,
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

  getCustomerData = () => {
    getCustomerDataApi()
      .then(res => {
        const {
          fullName,
          name,
          url,
          contractSigned,
          isActive,
          tcsAccepted,
          mainAddress,
        } = res.data;
        console.log('ress', res.data);
        this.setState({
          accountName: fullName,
          businessName: name,
          url: url,
          streetAddress: mainAddress.addressLine1,
          town: mainAddress.city,
          postalCode: mainAddress.postcode,
          contractSigned: contractSigned,
          isActive: isActive,
          tcsAccepted: tcsAccepted,
        });
      })
      .catch(err => {
        console.warn('err', err);
      });
  };

  componentDidMount() {
    this.getData();
    this.getCustomerData();
  }

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    if (item.id === 0) {
      alert('Price Plan');
    } else if (item.id === 1) {
      alert('Locations');
    } else if (item.id === 2) {
      alert('Users');
    } else {
      this.props.navigation.goBack();
    }
  };

  updateFun = () => {
    this.setState(
      {
        updateLoader: true,
      },
      () => this.updateFunSec(),
    );
  };

  updateFunSec = () => {
    const {
      contractSigned,
      accountName,
      businessName,
      url,
      streetAddress,
      town,
      postalCode,
      isActive,
      tcsAccepted,
    } = this.state;
    let payload = {
      contractSigned: contractSigned,
      customerManagementTargetList: [
        {
          departmentId: '9c54b6b6-2c0d-4ddd-bdd3-6fc8d1d43738',
          grainzCorrection: 0,
          grossMargin: 0,
          id: '17c330c5-0428-4532-9555-5aa8a8d275c4',
          inventoryCost: 100,
          other: 0,
          priceGuide: 100,
          rdBudget: 0,
          staffAllowane: 0,
          wasteAllowance: 0,
        },
        {
          departmentId: 'dfd71ff7-7b25-407b-aa2f-0186ccebaa03',
          grainzCorrection: 0,
          grossMargin: 21,
          id: 'd7865e7d-eb83-40d8-9faf-8bee02a81dc1',
          inventoryCost: 79,
          other: 0,
          priceGuide: 79,
          rdBudget: 0,
          staffAllowane: 0,
          wasteAllowance: 0,
        },
        {
          departmentId: '22110ab6-4e63-4afc-8173-e56486024316',
          grainzCorrection: 0,
          grossMargin: 12,
          id: '1422d62b-8e63-4f5a-873b-c8cb09f39c80',
          inventoryCost: 88,
          other: 0,
          priceGuide: 88,
          rdBudget: 0,
          staffAllowane: 0,
          wasteAllowance: 0,
        },
        {
          departmentId: '9df266dc-bf87-454e-b678-21c14647a23d',
          grainzCorrection: 0,
          grossMargin: 0,
          id: '0e46d0c2-32c0-40e3-9535-0e7403f0cd49',
          inventoryCost: 100,
          other: 0,
          priceGuide: 89,
          rdBudget: 0,
          staffAllowane: 11,
          wasteAllowance: 0,
        },
      ],
      fullName: accountName,
      // id: '9f4dab1c-c443-4be6-b198-d8591469588d',
      id: '00000000-0000-0000-0000-000000000000',
      isActive: isActive,
      mainAddress: {
        addressLine1: streetAddress,
        city: town,
        countryId: '7a30e839-5dd5-4e3e-b718-5734b162e596',
        id: 'ac0bd2ce-a5f9-4039-bd36-95ef677c42d8',
        postcode: postalCode,
      },
      name: businessName,
      notes: 'Tetsing. notess',
      tcsAccepted: tcsAccepted,
      url: url,
    };
    console.log('PAYLOAD', payload);
    updateCustomerDataApi(payload)
      .then(res => {
        Alert.alert('Grainz', 'Details updated successfully', [
          {
            text: 'OK',
            onPress: () =>
              this.setState({
                updateLoader: false,
              }),
          },
        ]);
      })
      .catch(err => {
        this.setState({
          updateLoader: false,
        });
        console.warn('updateCustomerDataApi', err.response);
      });
  };

  render() {
    const {
      recipeLoader,
      pageLoading,
      firstName,
      buttons,
      buttonsSubHeader,
      accountName,
      businessName,
      url,
      streetAddress,
      town,
      postalCode,
      contractSigned,
      isActive,
      tcsAccepted,
      updateLoader,
    } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {recipeLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
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
              {translate('Account Set Up').toLocaleUpperCase()}
            </Text>
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

          {pageLoading ? (
            <ActivityIndicator color="#94C036" size="large" />
          ) : (
            <View style={{marginTop: hp('3%'), marginHorizontal: wp('5%')}}>
              <View>
                <View>
                  <Text style={{fontSize: 20, color: '#656565'}}>
                    ACCOUNT -
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Account name: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TextInput
                      value={accountName}
                      placeholder="Account name"
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        width: wp('50%'),
                      }}
                      onChangeText={value =>
                        this.setState({
                          accountName: value,
                        })
                      }
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Business name: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TextInput
                      value={businessName}
                      placeholder="Business name"
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        width: wp('50%'),
                      }}
                      onChangeText={value =>
                        this.setState({
                          businessName: value,
                        })
                      }
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>URL: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TextInput
                      value={url}
                      placeholder="URL"
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        width: wp('50%'),
                      }}
                      onChangeText={value =>
                        this.setState({
                          url: value,
                        })
                      }
                    />
                  </View>
                </View>
              </View>
              <View>
                <View style={{marginTop: hp('3%')}}>
                  <Text style={{fontSize: 20, color: '#656565'}}>
                    INVOICE ADDRESS -
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Street address: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TextInput
                      value={streetAddress}
                      placeholder="Street address"
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        width: wp('50%'),
                      }}
                      onChangeText={value =>
                        this.setState({
                          streetAddress: value,
                        })
                      }
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Town: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TextInput
                      value={town}
                      placeholder="Town"
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        width: wp('50%'),
                      }}
                      onChangeText={value =>
                        this.setState({
                          town: value,
                        })
                      }
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Postal code: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TextInput
                      value={postalCode}
                      placeholder="Postal code"
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        width: wp('50%'),
                      }}
                      onChangeText={value =>
                        this.setState({
                          postalCode: value,
                        })
                      }
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Country: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TextInput
                      placeholder="Country"
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        width: wp('50%'),
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>T&Cs accepted?: </Text>
                  </View>
                  <View style={{}}>
                    <CheckBox
                      value={tcsAccepted}
                      onValueChange={() =>
                        this.setState({tcsAccepted: !tcsAccepted})
                      }
                      style={{
                        backgroundColor: '#E9ECEF',
                        margin: 5,
                        height: 20,
                        width: 20,
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Contract signed?: </Text>
                  </View>
                  <View style={{}}>
                    <CheckBox
                      value={contractSigned}
                      onValueChange={() =>
                        this.setState({contractSigned: !contractSigned})
                      }
                      style={{
                        backgroundColor: '#E9ECEF',
                        margin: 5,
                        height: 20,
                        width: 20,
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Active?: </Text>
                  </View>
                  <View style={{}}>
                    <CheckBox
                      value={isActive}
                      onValueChange={() => this.setState({isActive: !isActive})}
                      style={{
                        backgroundColor: '#E9ECEF',
                        margin: 5,
                        height: 20,
                        width: 20,
                      }}
                    />
                  </View>
                </View>
              </View>
              <View>
                <View style={{marginTop: hp('3%')}}>
                  <Text style={{fontSize: 20, color: '#656565'}}>
                    INVOICE ADDRESS -
                  </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                    <View style={{flexDirection: 'row', marginTop: hp('3%')}}>
                      <View style={{width: wp('40%')}}></View>
                      <View style={{width: wp('40%')}}>
                        <Text>Bar</Text>
                      </View>
                      <View style={{width: wp('40%')}}>
                        <Text>Kitchen</Text>
                      </View>
                      <View style={{width: wp('40%')}}>
                        <Text>Retail</Text>
                      </View>
                      <View style={{width: wp('40%')}}>
                        <Text>Other</Text>
                      </View>
                    </View>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: hp('3%'),
                        }}>
                        <View
                          style={{
                            width: wp('40%'),
                          }}>
                          <Text>Cost of goods sold: </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: hp('3%'),
                        }}>
                        <View
                          style={{
                            width: wp('40%'),
                          }}>
                          <Text>Waste: </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: hp('3%'),
                        }}>
                        <View
                          style={{
                            width: wp('40%'),
                          }}>
                          <Text>Staff: </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: hp('3%'),
                        }}>
                        <View
                          style={{
                            width: wp('40%'),
                          }}>
                          <Text>R&D: </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: hp('3%'),
                        }}>
                        <View
                          style={{
                            width: wp('40%'),
                          }}>
                          <Text>Other: </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: hp('3%'),
                        }}>
                        <View
                          style={{
                            width: wp('40%'),
                          }}>
                          <Text>Grainz correction: </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: hp('3%'),
                        }}>
                        <View
                          style={{
                            width: wp('40%'),
                          }}>
                          <Text style={{fontWeight: 'bold'}}>
                            Total inventory cost:{' '}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: hp('3%'),
                        }}>
                        <View
                          style={{
                            width: wp('40%'),
                          }}>
                          <Text style={{fontWeight: 'bold'}}>
                            Total gross margin:{' '}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: wp('15%'),
            }}>
            <View style={{}}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{
                  height: hp('6%'),
                  width: wp('30%'),
                  backgroundColor: '#E7943B',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <View style={{}}>
                  <Text style={{color: 'white', marginLeft: 5}}>Cancel</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{}}>
              {updateLoader ? (
                <View
                  style={{
                    height: hp('6%'),
                    width: wp('30%'),
                    backgroundColor: '#94C036',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                  <View style={{}}>
                    <ActivityIndicator color="#fff" size="small" />
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => this.updateFun()}
                  style={{
                    height: hp('6%'),
                    width: wp('30%'),
                    backgroundColor: '#94C036',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                  <View style={{}}>
                    <Text style={{color: 'white', marginLeft: 5}}>Update</Text>
                  </View>
                </TouchableOpacity>
              )}
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

export default connect(mapStateToProps, {UserTokenAction})(Account);
