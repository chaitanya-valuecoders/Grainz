import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../../../constants/images';
import SubHeader from '../../../../components/SubHeader';
import Header from '../../../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../../../redux/actions/UserTokenAction';
import {
  getMyProfileApi,
  lookupDepartmentsApi,
  addMenuApi,
} from '../../../../connectivity/api';
import {translate} from '../../../../utils/translations';
import styles from './style';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';
import {set} from 'react-native-reanimated';
import moment from 'moment';

export default class NewMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonsSubHeader: [],
      firstName: '',
      inUse: false,
      menuList: [],
      menu: '',
      details: {},
      menuSelected: false,
      menuDepartment: {label: 'Select Department', value: ''},
    };
  }
  getProfileData = () => {
    this.setState({recipeLoader: true});
    getMyProfileApi()
      .then(res => {
        this.setState({
          recipeLoader: false,
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

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  componentDidMount() {
    this.getProfileData();
    this.getDepartments();
  }

  getDepartments = () => {
    lookupDepartmentsApi()
      .then(res => {
        let finalDepsList = res.data.map((item, index) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.setState({
          departmentList: finalDepsList,
          departmentsLoader: false,
        });
      })
      .catch(err => {
        console.log('ERR MEP', err);
        // this.setState({
        //   recipeLoader: false,
        // });
      });
  };

  addMenuFun() {
    const {menuName, menuDepartment, inUse} = this.state;

    let payload = {
      action: 'New',
      departmentId: menuDepartment.value,
      inUse: inUse,
      menuCategoryLinks: [],
      menuItemCategoryLinks: [],
      name: menuName,
      reference: menuName,
    };

    addMenuApi(payload)
      .then(res => {
        console.warn('added', res);
      })
      .catch(err => console.warn('err', err));
  }
  render() {
    const {
      buttonsSubHeader,
      departmentList,
      inUse,
      menu,
      details,
      menuDepartment,
    } = this.state;
    return (
      <View style={{backgroundColor: '#F0F4FF'}}>
        <Header />
        <SubHeader {...this.props} buttons={buttonsSubHeader} index={1} />
        <ScrollView
          style={{marginBottom: hp('2%')}}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              ...styles.subContainer,
              marginBottom: hp('2%'),
              // backgroundColor: '#F0F4FF',
            }}>
            <View>
              <View style={{margin: 10}}>
                <View style={{flexDirection: 'row', paddingBottom: 20}}>
                  <View style={{flex: 2}}>
                    <View>
                      <Text style={styles.adminTextStyle}>
                        {translate('New Menu Details')}
                      </Text>
                    </View>
                  </View>

                  <View style={{flex: 1}}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('MenusScreen')
                      }
                      style={styles.goBackContainer}>
                      <Text style={styles.goBackTextStyle}>Go Back</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={{
                    width: wp('90%'),
                    height: hp('10%'),
                    marginLeft: 5,
                  }}>
                  <TextInput
                    style={{
                      padding: 20,
                      borderRadius: 5,
                      backgroundColor: 'white',
                    }}
                    value={menu.label}
                    placeholder="Menu name"
                    placeholderTextColor="black"
                    onChangeText={value =>
                      this.setState({
                        menuName: value,
                        menu: {label: value, value: ''},
                      })
                    }
                  />
                </View>

                <View
                  style={{
                    width: wp('90%'),
                    height: hp('10%'),
                    marginLeft: 5,
                  }}>
                  <DropDownPicker
                    items={departmentList}
                    value={menuDepartment.label}
                    placeholder={menuDepartment.label}
                    zIndex={100}
                    containerStyle={{
                      height: 50,
                      width: wp('90%'),
                      marginBottom: hp('3%'),
                    }}
                    style={{
                      backgroundColor: '#fff',
                      borderColor: 'white',
                    }}
                    itemStyle={{
                      justifyContent: 'flex-start',
                    }}
                    dropDownStyle={{backgroundColor: '#fff'}}
                    onChangeItem={value =>
                      this.setState({menuDepartment: value})
                    }
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: '15%',
                    }}></View>
                </View>
                <View style={{margin: '4%'}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 3}}>
                      <Text style={{}}>Date created</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={{}}>
                        {moment(details.createdDate).format('DD/MM/YYYY')}{' '}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 25,
                    }}>
                    <View style={{flex: 9}}>
                      <Text style={{fontWeight: 'bold'}}>In use ?</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <CheckBox
                        // editable={false}
                        value={inUse}
                        style={{
                          backgroundColor: '#E9ECEF',
                          height: 20,
                          width: 20,
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    margin: '5%',
                    marginBottom: 20,
                    marginLeft: '22%',
                  }}>
                  <View style={{margin: '2%'}}>
                    <TouchableOpacity
                      onPress={() =>
                       this.props.navigation.navigate('MenusScreen')
                      }
                      style={{
                        height: hp('5%'),
                        width: wp('29%'),
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: hp('1.5%'),
                        borderRadius: 100,
                        alignSelf: 'center',
                        flexDirection: 'row',
                      }}>
                      <View>
                        <Text style={{}}>Cancel </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{margin: '2%'}}>
                    <TouchableOpacity
                      onPress={() => {
                        this.addMenuFun();
                        this.props.navigation.navigate('MenusScreen');
                      }}
                      style={{
                        height: hp('5%'),
                        width: wp('29%'),
                        backgroundColor: '#94C036',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: hp('1.5%'),
                        borderRadius: 100,
                        alignSelf: 'center',
                        flexDirection: 'row',
                      }}>
                      <View>
                        <Image
                          source={img.addIcon}
                          style={{
                            height: 16,
                            width: 16,
                            resizeMode: 'contain',
                            tintColor: 'white',
                          }}
                        />
                      </View>
                      <View>
                        <Text style={{color: 'white'}}>Save </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
