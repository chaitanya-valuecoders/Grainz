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
import MepScreen from '../Mep';
import Header from '../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {getMyProfileApi} from '../../connectivity/api';

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

  render() {
    const {
      pageLoader,
      jobTitle,
      email,
      phoneNumber,
      firstName,
      lastName,
    } = this.state;
    return (
      <View style={{flex: 1}}>
        <Header
          logout="Log Out"
          logoutFun={this.removeToken}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        <SubHeader />
        <ScrollView style={{marginTop: hp('2%'), marginBottom: hp('2%')}}>
          {pageLoader ? (
            <ActivityIndicator color="#94C036" size="large" />
          ) : (
            <View>
              <View
                style={{
                  height: hp('10%'),
                  marginHorizontal: wp('5%'),
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Text>First Name</Text>
                </View>
                <View style={{flex: 3, justifyContent: 'center'}}>
                  <TextInput
                    value={firstName}
                    placeholder="Enter First Name"
                    style={{
                      borderWidth: 1,
                      paddingVertical: '5%',
                      borderColor: 'grey',
                      paddingLeft: wp('2%'),
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  height: hp('10%'),
                  marginHorizontal: wp('5%'),
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Text>Last Name</Text>
                </View>
                <View style={{flex: 3, justifyContent: 'center'}}>
                  <TextInput
                    value={lastName}
                    placeholder="Enter Last Name"
                    style={{
                      borderWidth: 1,
                      paddingVertical: '5%',
                      borderColor: 'grey',
                      paddingLeft: wp('2%'),
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  height: hp('10%'),
                  marginHorizontal: wp('5%'),
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Text>Job Title</Text>
                </View>
                <View style={{flex: 3, justifyContent: 'center'}}>
                  <TextInput
                    value={jobTitle}
                    placeholder="Enter Job Title"
                    style={{
                      borderWidth: 1,
                      paddingVertical: '5%',
                      borderColor: 'grey',
                      paddingLeft: wp('2%'),
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  height: hp('10%'),
                  marginHorizontal: wp('5%'),
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Text>Phone Number</Text>
                </View>
                <View style={{flex: 3, justifyContent: 'center'}}>
                  <TextInput
                    value={phoneNumber}
                    placeholder="Enter Phone Number"
                    style={{
                      borderWidth: 1,
                      paddingVertical: '5%',
                      borderColor: 'grey',
                      paddingLeft: wp('2%'),
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  height: hp('10%'),
                  marginHorizontal: wp('5%'),
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Text>Email</Text>
                </View>
                <View style={{flex: 3, justifyContent: 'center'}}>
                  <TextInput
                    value={email}
                    placeholder="Enter email"
                    style={{
                      borderWidth: 1,
                      paddingVertical: '5%',
                      borderColor: 'grey',
                      paddingLeft: wp('2%'),
                    }}
                  />
                </View>
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
