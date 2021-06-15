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
import {getMyProfileApi, eventsAdminApi} from '../../../../connectivity/api';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import styles from './style';

import {translate} from '../../../../utils/translations';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      modalVisible: false,
      firstName: '',
      activeSections: [],
      SECTIONS: [],
      recipeLoader: false,
      sectionData: {},
      isMakeMeStatus: true,
      productionDate: '',
      recipeID: '',
      selectedItems: [],
      items: [],
      departmentName: '',
      itemTypes: '',
      loading: false,
      selectedItemObjects: '',
      buttonsSubHeader: [],
      SECTIONS_BACKUP: [],
      searchItem: '',
    };
  }

  getData = async () => {
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

  getManualLogsData = () => {
    this.setState(
      {
        recipeLoader: true,
      },
      () => this.createFirstData(),
    );
  };

  createFirstData = () => {
    eventsAdminApi()
      .then(res => {
        console.log('RES', res);
        function extract() {
          var groups = {};

          res.data.forEach(function (val) {
            var date = val.eventDate.split('T')[0];
            if (date in groups) {
              groups[date].push(val);
            } else {
              groups[date] = new Array(val);
            }
          });

          return groups;
        }

        let final = extract();
        console.log('FINAL', final);

        let finalArray = Object.keys(final).map((item, index) => {
          return {
            title: item,
            content: final[item],
          };
        });

        console.log('finalArray', finalArray);

        const result = finalArray.reverse();

        this.setState({
          SECTIONS: [...result],
          recipeLoader: false,
          SECTIONS_BACKUP: [...result],
        });
      })
      .catch(err => {
        console.log('ERR MEP', err);

        this.setState({
          recipeLoader: false,
        });
      });
  };

  componentDidMount() {
    this.getData();
    this.getManualLogsData();
  }

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    if (item.id === 0) {
      this.props.navigation.navigate('EventsSecAdminScreen');
    } else if (item.id === 1) {
      this.props.navigation.goBack();
    }
  };

  _renderHeader = (section, index, isActive) => {
    var todayFinal = moment(new Date()).format('dddd, MMM DD YYYY');

    const finalData = moment(section.title).format('dddd, MMM DD YYYY');

    return (
      <View
        style={{
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderTopColor: '#F0F0F0',
          borderLeftColor: '#F0F0F0',
          borderRightWidth: 1,
          borderRightColor: '#F0F0F0',
          height: 60,
          marginTop: hp('2%'),
          alignItems: 'center',
          borderRadius: 6,
        }}>
        <Image
          style={{
            height: 18,
            width: 18,
            resizeMode: 'contain',
            marginLeft: wp('2%'),
          }}
          source={isActive ? img.upArrowIcon : img.arrowRightIcon}
        />
        <Text
          style={{
            color: '#492813',
            fontSize: 14,
            marginLeft: wp('2%'),
            fontFamily: 'Inter-Regular',
          }}>
          {todayFinal === finalData ? 'Today' : finalData}
        </Text>
      </View>
    );
  };

  _renderContent = section => {
    return (
      // <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{backgroundColor: '#fff'}}>
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: 15,
            marginHorizontal: wp('3%'),
          }}>
          <View style={{width: wp('30%')}}>
            <Text
              style={{
                fontSize: 14,
                color: '#161C27',
                fontFamily: 'Inter-SemiBold',
              }}>
              Time
            </Text>
          </View>
          <View style={{width: wp('30')}}>
            <Text
              style={{
                fontSize: 14,
                color: '#161C27',
                fontFamily: 'Inter-SemiBold',
              }}>
              Name
            </Text>
          </View>
          <View style={{width: wp('30%')}}>
            <Text
              style={{
                fontSize: 14,
                color: '#161C27',
                fontFamily: 'Inter-SemiBold',
              }}>
              No. of people
            </Text>
          </View>
        </View>
        {section.content.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('EventsSecAdminScreen')
              }
              style={{
                flexDirection: 'row',
                borderTopWidth: 1,
                paddingVertical: 10,
                marginHorizontal: wp('3%'),
                borderTopColor: '#0000001A',
              }}>
              <View style={{width: wp('30%')}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#161C27',
                    fontFamily: 'Inter-Regular',
                  }}>
                  {item.eventTime}
                </Text>
              </View>
              <View style={{width: wp('40%')}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#161C27',
                    fontFamily: 'Inter-Regular',
                  }}
                  numberOfLines={1}>
                  {item.clientName}
                </Text>
              </View>
              <View style={{width: wp('30%')}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#161C27',
                    fontFamily: 'Inter-Regular',
                  }}>
                  {item.pax}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      // </ScrollView>
    );
  };

  _updateSections = activeSections => {
    this.setState({
      activeSections,
    });
  };

  searchFun = txt => {
    this.setState(
      {
        searchItem: txt,
      },
      () => this.filterData(txt),
    );
  };

  filterData = text => {
    //passing the inserted text in textinput
    const newData = this.state.SECTIONS_BACKUP.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      SECTIONS: newData,
      searchItem: text,
    });
  };
  render() {
    const {
      recipeLoader,
      SECTIONS,
      activeSections,
      firstName,
      buttonsSubHeader,
      searchItem,
    } = this.state;

    return (
      <View style={styles.container}>
        <Header
          logout={firstName}
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {recipeLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} index={0} />
        )}
        <ScrollView
          style={{marginBottom: hp('5%')}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            <View style={styles.firstContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.adminTextStyle}>{translate('Events')}</Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#E2E8F0',
              height: hp('6%'),
              width: wp('90%'),
              borderRadius: 100,
              backgroundColor: '#fff',
              alignSelf: 'center',
              justifyContent: 'space-between',
            }}>
            <TextInput
              placeholder="Search"
              value={searchItem}
              style={{
                padding: 15,
                width: wp('75%'),
              }}
              onChangeText={value => this.searchFun(value)}
            />
            <Image
              style={{
                height: 18,
                width: 18,
                resizeMode: 'contain',
                marginRight: wp('5%'),
              }}
              source={img.searchIcon}
            />
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('EventsSecAdminScreen')
              }
              style={{
                height: hp('6%'),
                width: wp('80%'),
                backgroundColor: '#94C036',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: hp('3%'),
                borderRadius: 100,
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
                  Add New
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {recipeLoader ? (
            <ActivityIndicator color="#94C036" size="large" />
          ) : (
            <View style={{marginTop: hp('3%'), marginHorizontal: wp('5%')}}>
              <Accordion
                expandMultiple
                underlayColor="#fff"
                sections={SECTIONS}
                activeSections={activeSections}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
                onChange={this._updateSections}
              />
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

export default connect(mapStateToProps, {UserTokenAction})(Events);
