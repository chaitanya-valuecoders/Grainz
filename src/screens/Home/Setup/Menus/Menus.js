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
import {
  getMyProfileApi,
  lookupDepartmentsApi,
  getMenuListApi,
  getMenuDetailsApi,
} from '../../../../connectivity/api';

import {translate} from '../../../../utils/translations';
import styles from './style';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';

class Menus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonsSubHeader: [],
      firstName: '',
      inUse: false,
      menuList: [],
      menu: '',
      menuName: '',
      departmentsLoader: false,
      showAll: false,
      showAllInUse: false,
      menuDepartment: {label: 'Select Department', value: ''},
      recipeLoader: false,
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
    this.props.navigation.addListener('focus', () => {
      this.getMenuList();
      this.setState({menu: {label: 'ooo', value: ''}, menuName: ''});
    });
  }

  getMenuList() {
    this.setState({menuLoader: true});
    getMenuListApi()
      .then(res => {
        let finalMenusList = res.data.map((item, index) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.setState({
          menuList: finalMenusList,
          menuLoader: false,
        });
      })
      .catch(err => console.warn('err', err));
  }

  selectMenu(item) {
    const {menuDepartment} = this.state;
    this.setState({menu: {label: 'Select Menu', value: ''}});
    this.props.navigation.navigate('EditMenuScreen', {item, menuDepartment});
  }

  render() {
    const {
      buttonsSubHeader,
      departmentsLoader,
      menuList,
      menu,
      showAll,
      // showAllInUse,
      recipeLoader,
      depLoader,
      menuLoader,
    } = this.state;
    return (
      <View style={{backgroundColor: '#F0F4FF'}}>
        <Header />
        {recipeLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} index={0} />
        )}
        <ScrollView
          style={{marginBottom: hp('2%')}}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              ...styles.subContainer,
              marginBottom: hp('2%'),
              backgroundColor: '#F0F4FF',
            }}>
            <View>
              {departmentsLoader ? (
                <ActivityIndicator size="small" color="#94C036" />
              ) : null}

              <View>
                <View style={{flexDirection: 'row', margin: 10}}>
                  <View style={{flex: 2}}>
                    <Text style={styles.adminTextStyle}>
                      {translate('Menus')}
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.goBack()}
                      style={styles.goBackContainer}>
                      <Text style={styles.goBackTextStyle}>Go Back</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('NewMenuScreen');
                      }}
                      style={{
                        height: hp('4%'),
                        width: wp('80%'),
                        backgroundColor: '#94C036',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: hp('1.5%'),
                        borderRadius: 100,
                        alignSelf: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={img.addIcon}
                          style={{
                            width: 20,
                            height: 20,
                            tintColor: '#fff',
                            resizeMode: 'contain',
                          }}
                        />
                        <Text
                          style={{
                            color: 'white',
                            marginLeft: 10,
                            fontFamily: 'Inter-SemiBold',
                          }}>
                          New Menu
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      alignItems: 'center',
                      marginTop: '5%',
                      height: hp('90%'),
                    }}>
                    {menuLoader ? (
                      <ActivityIndicator size="small" color="#94C036" />
                    ) : (
                      <DropDownPicker
                        placeholder="Select menu"
                        items={menuList}
                        value={menu.label}
                        zIndex={10000}
                        containerStyle={{
                          height: 50,
                          width: wp('80%'),
                          marginBottom: hp('3%'),
                        }}
                        style={{
                          backgroundColor: '#fff',
                          borderColor: 'grey',
                        }}
                        itemStyle={{
                          justifyContent: 'flex-start',
                        }}
                        dropDownStyle={{backgroundColor: '#fff'}}
                        onChangeItem={value => this.selectMenu(value)}
                      />
                    )}
                    <View style={{width: wp('50%'), marginRight: 120}}>
                      <View style={{flexDirection: 'row', margin: '5%'}}>
                        <CheckBox
                          onChange={() => this.setState({showAll: !showAll})}
                          value={!showAll}
                          style={{
                            backgroundColor: '#E9ECEF',
                            height: 20,
                            width: 20,
                          }}
                        />
                        <Text style={{marginLeft: '15%'}}>Show all</Text>
                      </View>
                      <View style={{flexDirection: 'row', margin: '5%'}}>
                        <CheckBox
                          onChange={() => this.setState({showAll: !showAll})}
                          value={showAll}
                          style={{
                            backgroundColor: '#E9ECEF',
                            height: 20,
                            width: 20,
                          }}
                        />
                        <Text style={{marginLeft: '15%'}}>Show "in use"</Text>
                      </View>
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate(
                              'MenuCategoriesScreen',
                            );
                          }}
                          style={{
                            height: 150,
                            width: 150,
                            backgroundColor: '#fff',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: hp('3%'),
                            borderRadius: 15,
                            alignSelf: 'center',
                            marginRight: 25,
                          }}>
                          <View style={{marginBottom: 20}}>
                            <View style={{flexDirection: 'row'}}>
                              <View
                                style={{
                                  height: 20,
                                  width: 20,
                                  borderWidth: 3,
                                  borderColor: '#8691F8',
                                  borderRadius: 5,
                                  margin: '2%',
                                  marginRight: 4,
                                }}></View>
                              <View
                                style={{
                                  height: 20,
                                  width: 20,
                                  borderWidth: 3,
                                  borderColor: '#8691F8',
                                  borderRadius: 5,
                                  margin: '2%',
                                  marginLeft: 4,
                                }}></View>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                              <View
                                style={{
                                  height: 20,
                                  width: 20,
                                  borderWidth: 3,
                                  borderColor: '#8691F8',
                                  borderRadius: 5,
                                  margin: '2%',
                                  marginRight: 4,
                                }}></View>
                              <View
                                style={{
                                  height: 20,
                                  width: 20,
                                  borderWidth: 3,
                                  borderColor: '#8691F8',
                                  borderRadius: 5,
                                  margin: '2%',
                                  marginLeft: 4,
                                }}></View>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Image source={img.c} />
                            <Text style={{fontWeight: 'bold'}}>Categories</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
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

export default Menus;
