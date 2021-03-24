import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  AppRegistry,
} from 'react-native';
import styles from './style';
import Header from '../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
    };
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

  signInFun = () => {
    if (this.verification()) {
      const {email, password} = this.state;
      var formData = new FormData();
      let payload = {
        username: email,
        password: password,
        grant_type: 'password',
        scope: 'openid email phone profile offline_access roles',
      };
      formData.append('requestBody', payload);
      console.warn('PAYLOAD', payload);
      this.props.navigation.navigate('HomeScreen');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Header headerTitle="Grainz" />
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          enableOnAndroid
          contentContainerStyle={{flex: 1}}>
          <View style={{flex: 1}}>
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
                LOG IN
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
                  placeholder="User name/email"
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
                  onChangeText={value =>
                    this.setState({
                      password: value,
                      passwordError: '',
                    })
                  }
                  placeholder="Password"
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
                <TouchableOpacity
                  onPress={() => this.signInFun()}
                  style={{
                    height: hp('8%'),
                    backgroundColor: '#94C036',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: hp('8%'),
                  }}>
                  <Text style={{fontSize: 20, color: '#fff'}}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('AboutUsScreen')}>
                <Text style={{fontSize: 25, color: 'grey', fontWeight: 'bold'}}>
                  About Us
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default index;
