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
import {getMyProfileApi, getCustomerDataApi} from '../../../connectivity/api';
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
      customerData: '',
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
        this.setState({
          customerData: res.data,
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

  render() {
    const {
      recipeLoader,
      pageLoading,
      firstName,
      buttons,
      buttonsSubHeader,
      customerData,
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
                      placeholder="Account name"
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
                    <Text>Business name: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TextInput
                      placeholder="Business name"
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
                    <Text>URL: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TextInput
                      placeholder="URL"
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        width: wp('50%'),
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
                      placeholder="Street address"
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
                    <Text>Town: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TextInput
                      placeholder="Town"
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
                    <Text>Postal code: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TextInput
                      placeholder="Postal code"
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
                  <View style={{marginLeft: wp('3%')}}>
                    <Text>true</Text>
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
                  <View style={{marginLeft: wp('3%')}}>
                    <Text>true</Text>
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
                  <View style={{marginLeft: wp('3%')}}>
                    <Text>true</Text>
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
