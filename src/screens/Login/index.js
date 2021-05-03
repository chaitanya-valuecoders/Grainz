import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
  Modal,
} from 'react-native';
import styles from './style';
import Header from '../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {loginApi} from '../../connectivity/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {translate, setI18nConfig} from '../../utils/translations';

var querystring = require('querystring');

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      buttonLoader: false,
      switchValue: false,
      loader: false,
    };
  }

  async componentDidMount() {
    setI18nConfig();

    const lang = await AsyncStorage.getItem('Language');
    if (lang !== null && lang !== undefined) {
      if (lang == 'en') {
        this.setState({
          switchValue: false,
          loader: false,
        });
      } else {
        this.setState({
          switchValue: true,
          loader: false,
        });
        setI18nConfig();
      }
    } else {
      await AsyncStorage.setItem('Language', 'en');
      this.setState({switchValue: false, loader: false});
      setI18nConfig();
    }
  }

  verification = () => {
    let emailError = '';
    let passwordError = '';
    let formIsValid = true;

    if (this.state.email === '') {
      emailError = 'Email can not be empty';
      formIsValid = false;
    }
    if (this.state.password === '') {
      passwordError = 'Passsword can not be empty';
      formIsValid = false;
    }

    this.setState({
      emailError: emailError,
      passwordError: passwordError,
    });

    if (formIsValid == true) {
      return true;
    } else {
      return false;
    }
  };

  storeData = async value => {
    try {
      await AsyncStorage.setItem('@appToken', value);
      this.props.UserTokenAction(value);
    } catch (e) {
      console.warn('e', e);
    }
  };

  signInFun = () => {
    if (this.verification()) {
      const {email, password} = this.state;
      const payload = {
        username: email.trim(),
        password: password.trim(),
        grant_type: 'password',
      };

      const finalData = querystring.stringify(payload);
      this.setState({
        buttonLoader: true,
      });

      loginApi(finalData)
        .then(res => {
          this.storeData(res.data.access_token);
          this.setState({
            buttonLoader: false,
          });
        })
        .catch(err => {
          console.warn('ERR', err.response);
          this.setState({
            buttonLoader: false,
          });
          Alert.alert(
            'Error',
            err.response && err.response.data && err.response.data.error,
            [{text: 'Okay', onPress: () => console.log('OK Pressed')}],
          );
        });
    }
  };

  toggleSwitch = value => {
    // console.warn('swictched value', value);
    this.setState({switchValue: value, loader: true}, () =>
      this.languageSelector(),
    );
  };

  languageSelector = async () => {
    let language = '';
    this.state.switchValue === true ? (language = 'fr') : (language = 'en');
    await AsyncStorage.setItem('Language', language);
    setI18nConfig();
    setTimeout(
      () =>
        this.setState({
          loader: false,
        }),
      2000,
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header headerTitle="Grainz" />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          enableOnAndroid>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.loader}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#00000090',
                  alignContent: 'center',
                  justifyContent: 'center',
                  width: wp('1000%'),
                  height: hp('100%'),
                }}>
                <ActivityIndicator size="large" color={'#ffffff'} />
              </View>
            </View>
          </Modal>

          <View
            style={{
              height: hp('80%'),
              justifyContent: 'center',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 40,
                  color: '#94C036',
                  fontWeight: 'bold',
                }}>
                {translate('Login')}{' '}
              </Text>
            </View>
            <View
              style={{
                flex: 2,
              }}>
              <View
                style={{
                  marginHorizontal: wp('10%'),
                }}>
                <TextInput
                  value={this.state.email}
                  onChangeText={value =>
                    this.setState({
                      email: value,
                      emailError: '',
                    })
                  }
                  placeholder={translate('username')}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: 'grey',
                    paddingVertical: 5,
                  }}
                />
                {this.state.emailError ? (
                  <View
                    style={{
                      height: hp('5%'),
                      justifyContent: 'center',
                    }}>
                    <Text style={{fontSize: 14, color: 'red'}}>
                      {this.state.emailError}
                    </Text>
                  </View>
                ) : null}
                <TextInput
                  value={this.state.password}
                  secureTextEntry={true}
                  onChangeText={value =>
                    this.setState({
                      password: value,
                      passwordError: '',
                    })
                  }
                  placeholder={translate('Password')}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: 'grey',
                    marginTop: hp('4%'),
                    paddingVertical: 5,
                  }}
                />
                {this.state.passwordError ? (
                  <View
                    style={{
                      height: hp('5%'),
                      justifyContent: 'center',
                    }}>
                    <Text style={{fontSize: 14, color: 'red'}}>
                      {this.state.passwordError}
                    </Text>
                  </View>
                ) : null}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <Text
                    style={{fontSize: wp('4%'), color: 'grey', padding: '2%'}}>
                    English
                  </Text>
                  <Switch
                    thumbColor={'orange'}
                    trackColor={{false: 'grey', true: 'grey'}}
                    ios_backgroundColor="white"
                    onValueChange={this.toggleSwitch}
                    value={this.state.switchValue}
                  />
                  <Text
                    style={{fontSize: wp('4%'), color: 'grey', padding: '2%'}}>
                    Français
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.signInFun()}
                  style={{
                    height: hp('8%'),
                    backgroundColor: '#94C036',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: hp('8%'),
                  }}>
                  {this.state.buttonLoader ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={{fontSize: 20, color: '#fff'}}>
                      {' '}
                      {translate('Sign in')}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: hp('10%'),
              }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('AboutUsScreen')}>
                <Text style={{fontSize: 25, color: 'grey', fontWeight: 'bold'}}>
                  {translate('About')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    LoginReducer: state.LoginReducer,
    SocialLoginReducer: state.SocialLoginReducer,
  };
};

export default connect(mapStateToProps, {UserTokenAction})(index);
