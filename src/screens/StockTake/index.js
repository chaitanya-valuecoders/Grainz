import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
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
import {getMyProfileApi, getDepartmentsApi} from '../../connectivity/api';
import {translate} from '../../utils/translations';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';

var minTime = new Date();
minTime.setHours(0);
minTime.setMinutes(0);
minTime.setMilliseconds(0);
const tomorrow = new Date(minTime);
tomorrow.setDate(tomorrow.getDate() + 1);

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [],
      token: '',
      firstName: '',
      pageLoader: false,
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

  getDepartmentsFun() {
    this.setState(
      {
        pageLoader: true,
      },
      () =>
        getDepartmentsApi()
          .then(res => {
            this.setState({buttons: res.data, pageLoader: false});
          })
          .catch(error => {
            this.setState({pageLoader: false});
            console.warn('err', error);
          }),
    );
  }

  componentDidMount() {
    this.getProfileDataFun();
    this.getDepartmentsFun();
  }

  myProfileFun = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = data => {
    this.props.navigation.navigate('StockScreen', {
      departmentData: data,
    });
  };

  render() {
    const {firstName, buttons, pageLoader} = this.state;

    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfileFun}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {/* <SubHeader /> */}
        <ScrollView style={{marginBottom: hp('5%')}}>
          {pageLoader ? (
            <ActivityIndicator color="grey" size="large" />
          ) : (
            <View
              style={{
                alignItems: 'center',
                paddingVertical: hp('3%'),
                borderTopWidth: 0.2,
                borderTopColor: '#E9E9E9',
              }}>
              <Text style={{color: '#656565', fontSize: 18}}>
                {translate('Select which department you wish to stock take')}
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
                        marginTop: 18,
                        borderRadius: 5,
                      }}>
                      <View style={{}}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            color: 'white',
                            marginLeft: 5,
                          }}>
                          {item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
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
