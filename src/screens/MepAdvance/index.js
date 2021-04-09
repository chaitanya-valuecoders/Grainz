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
  getPendingMepsApi,
  deleteMepApi,
  getMepsHistoryApi,
  getMepsOldHistoryApi,
  getMepRecipesApi,
  newMepListApi,
  getMepRecipeByIdsApi,
  updateMepListApi,
  getAdvanceRecipeByIdsApi,
} from '../../connectivity/api';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {MultipleSelectPicker} from 'react-native-multi-select-picker';

var minTime = new Date();
minTime.setHours(0);
minTime.setMinutes(0);
minTime.setMilliseconds(0);

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [{name: 'Edit'}, {name: 'Back'}],
      token: '',
      modalVisible: false,
      firstName: '',
      modalVisibleAdd: false,
      activeSections: [],
      SECTIONS: [],
      recipeLoader: false,
      modalVisibleRecipeDetails: false,
      sectionData: {},
      isMakeMeStatus: true,
      makeMeText: 'Make me',
      SECTIONS_HISTORY: [],
      activeSectionsHistory: [],
      recipeLoaderHistory: true,
      isDatePickerVisible: false,
      finalDate: '',
      selectectedItems: [],
      isShownPicker: false,
      items: [],
      productionDate: '',
      applyStatus: false,
      detailsLoader: false,
      quantity: '',
      notes: '',
      advanceDetailsLoader: true,
      sectionAdvanceData: {},
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

  componentDidMount() {
    this.getProfileDataFun();
  }

  myProfileFun = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    if (item.name === 'Edit') {
      //   this.setModalVisible(true);
      //   this.getHistoryMepData();
    } else if (item.name === 'Back') {
      this.props.navigation.goBack();
    }
  };

  render() {
    const {firstName, buttons} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfileFun}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        <SubHeader />
        <ScrollView style={{marginBottom: hp('5%')}}>
          <View
            style={{
              backgroundColor: '#412916',
              alignItems: 'center',
              height: hp('25%'),
            }}>
            <Text style={{fontSize: 22, color: 'white', marginTop: 8}}>
              RECIPE DETAILS
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
