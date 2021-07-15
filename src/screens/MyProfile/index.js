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
import {getMyProfileApi} from '../../connectivity/api';
import {translate} from '../../utils/translations';
import styles from './style';

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
  }

  removeToken = async () => {
    await AsyncStorage.removeItem('@appToken');
    this.props.UserTokenAction(null);
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
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
    } = this.state;
    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {pageLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )}
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
                  />
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
