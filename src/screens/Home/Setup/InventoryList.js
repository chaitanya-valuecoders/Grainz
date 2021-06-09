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
  StyleSheet,
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
  inventoryLevelsApi,
  getInventoryCategoriesByDepartmentApi,
  getDepartmentsAdminApi,
} from '../../../connectivity/api';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {translate} from '../../../utils/translations';

export default class InventoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      profileLoader: true,
      list: [],
      buttonsSubHeader: [],
    };
  }

  getProfileData = () => {
    getMyProfileApi()
      .then(res => {
        this.setState({
          profileLoader: false,
          firstName: res.data.firstName,
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

  componentDidMount() {
    this.getProfileData();
  }

  render() {
    const {profileLoader, buttonsSubHeader} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          // logout={firstName}
          // logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {profileLoader ? (
          <ActivityIndicator size="large" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )}
        <View>
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
                {translate('Inventory List')}
              </Text>
              <View style={{}}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={{
                    flexDirection: 'row',
                    height: hp('6%'),
                    width: wp('70%'),
                    backgroundColor: '#94C036',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                  <View style={{}}>
                    <Text style={{color: 'white', marginLeft: 5}}>Back</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{marginLeft: '5%', marginTop: '5%'}}>
              <View style={{margin: '2%'}}>
                <Text>Search : </Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'grey',
                  padding: '2%',
                  width: wp('80%'),
                  margin: '2%',
                }}>
                <TextInput
                  placeholder="Search"
                  // onChangeText={value => this.searchSupplier(value)}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
