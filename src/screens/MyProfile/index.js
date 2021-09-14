import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../constants/images';
import SubHeader from '../../components/SubHeader';
import Header from '../../components/Header';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {
  getMyProfileApi,
  getUserLocationApi,
  setCurrentLocation,
} from '../../connectivity/api';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {translate} from '../../utils/translations';
import styles from './style';
import RNPickerSelect from 'react-native-picker-select';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      jobTitle: '',
      pageLoader: true,
      buttonsSubHeader: [],
      locationArr: [],
      finalLocation: '',
    };
  }

  getProfileData = () => {
    getMyProfileApi()
      .then(res => {
        const {firstName, lastName, email, jobTitle, phoneNumber} = res.data;
        this.setState({
          firstName,
          lastName,
          email,
          jobTitle,
          phoneNumber,
          pageLoader: false,
          buttonsSubHeader: [
            {name: translate('ADMIN')},
            {name: translate('Setup')},
            {name: translate('INBOX')},
          ],
        });
      })
      .catch(err => {
        this.setState({
          pageLoader: false,
        });
        console.warn('ERr', err);
      });
  };

  componentDidMount() {
    this.getProfileData();
    this.getUserLocationFun();
  }

  getUserLocationFun = () => {
    getUserLocationApi()
      .then(res => {
        console.log('res', res);
        let finalUsersList = res.data.map((item, index) => {
          return {
            label: item.name,
            value: item.id,
          };
        });

        let defaultUser = res.data.map((item, index) => {
          if (item.isCurrent === true) {
            return item.id;
          }
        });
        let finalData = defaultUser.filter(function (element) {
          return element !== undefined;
        });
        this.setState({
          locationArr: finalUsersList,
          finalLocation: finalData[0],
        });
      })
      .catch(err => {
        console.warn('ERr', err);
      });
  };

  setCurrentLocFun = id => {
    setCurrentLocation(id)
      .then(res => {
        console.log('resSET', res);
      })
      .catch(err => {
        console.warn('ERr', err);
      });
  };

  removeToken = async () => {
    await AsyncStorage.removeItem('@appToken');
    this.props.UserTokenAction(null);
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  setLocationFun = value => {
    if (value) {
      this.setState(
        {
          finalLocation: value,
        },
        () =>
          setTimeout(() => {
            this.setCurrentLocFun(value);
          }, 300),
      );
    }
  };

  render() {
    const {
      pageLoader,
      jobTitle,
      email,
      phoneNumber,
      firstName,
      lastName,
      buttonsSubHeader,
      locationArr,
      finalLocation,
    } = this.state;
    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {/* {pageLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )} */}
        <ScrollView style={styles.subContainer}>
          {pageLoader ? (
            <ActivityIndicator color="#94C036" size="large" />
          ) : (
            <View>
              <View style={styles.dataContainer}>
                <View style={styles.dataFirstContainer}>
                  <Text style={styles.textStyling}>
                    {translate('First name')}
                  </Text>
                </View>
                <View style={styles.dataSecondContainer}>
                  <TextInput
                    value={firstName}
                    placeholder={translate('First name')}
                    style={styles.textInputStyling}
                    editable={false}
                  />
                </View>
              </View>
              <View style={styles.dataContainer}>
                <View style={styles.dataFirstContainer}>
                  <Text style={styles.textStyling}>
                    {translate('Last name')}
                  </Text>
                </View>
                <View style={styles.dataSecondContainer}>
                  <TextInput
                    value={lastName}
                    placeholder={translate('Last name')}
                    style={styles.textInputStyling}
                    editable={false}
                  />
                </View>
              </View>
              <View style={styles.dataContainer}>
                <View style={styles.dataFirstContainer}>
                  <Text style={styles.textStyling}>{translate('job')}</Text>
                </View>
                <View style={styles.dataSecondContainer}>
                  <TextInput
                    value={jobTitle}
                    placeholder={translate('job')}
                    style={styles.textInputStyling}
                    editable={false}
                  />
                </View>
              </View>
              <View style={styles.dataContainer}>
                <View style={styles.dataFirstContainer}>
                  <Text style={styles.textStyling}>
                    {translate('Mobile phone')}
                  </Text>
                </View>
                <View style={styles.dataSecondContainer}>
                  <TextInput
                    value={phoneNumber}
                    placeholder={translate('Mobile phone')}
                    style={styles.textInputStyling}
                    editable={false}
                  />
                </View>
              </View>
              <View style={styles.dataContainer}>
                <View style={styles.dataFirstContainer}>
                  <Text style={styles.textStyling}>{translate('Email')}</Text>
                </View>
                <View style={styles.dataSecondContainer}>
                  <TextInput
                    value={email}
                    placeholder={translate('Email')}
                    style={styles.textInputStyling}
                    editable={false}
                  />
                </View>
              </View>
              <View style={styles.dataContainer}>
                <View style={styles.dataFirstContainer}>
                  <Text style={styles.textStyling}>
                    {translate('Location')}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    justifyContent: 'space-between',
                    borderWidth: 0.5,
                    borderColor: 'grey',
                    flex: 3,
                    height: hp('6%'),
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                      flex: 3,
                    }}>
                    <RNPickerSelect
                      placeholder={{
                        label: 'Please select location*',
                        value: null,
                        color: 'black',
                      }}
                      placeholderTextColor="red"
                      onValueChange={value => {
                        this.setLocationFun(value);
                      }}
                      style={{
                        inputIOS: {
                          fontSize: 14,
                          paddingHorizontal: '3%',
                          color: '#161C27',
                          width: '100%',
                          alignSelf: 'center',
                        },
                        inputAndroid: {
                          fontSize: 14,
                          paddingHorizontal: '3%',
                          color: '#161C27',
                          width: '100%',
                          alignSelf: 'center',
                          paddingVertical: 6,
                        },
                        iconContainer: {
                          top: '40%',
                        },
                      }}
                      items={locationArr}
                      value={finalLocation}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>
                  <View style={{marginRight: wp('5%')}}>
                    <Image
                      source={img.arrowDownIcon}
                      resizeMode="contain"
                      style={{
                        height: 15,
                        width: 15,
                        resizeMode: 'contain',
                        marginTop: Platform.OS === 'ios' ? 13 : 13,
                      }}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.dataContainer}>
                <View style={styles.dataSecondContainer}></View>
                <TouchableOpacity
                  onPress={() => this.removeToken()}
                  style={{
                    ...styles.dataFirstContainer,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.textStyling}>{translate('Logout')}</Text>
                  <Image
                    source={img.logOutIcon}
                    style={styles.logOutIconStyling}
                  />
                </TouchableOpacity>
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

export default connect(mapStateToProps, {UserTokenAction})(index);
