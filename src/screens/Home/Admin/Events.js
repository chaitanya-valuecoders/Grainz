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
import img from '../../../constants/images';
import SubHeader from '../../../components/SubHeader';
import Header from '../../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../../redux/actions/UserTokenAction';
import {getMyProfileApi, eventsAdminApi} from '../../../connectivity/api';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';

import {translate} from '../../../utils/translations';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {name: translate('Add new'), icon: img.addIcon, id: 0},
        {name: translate('Back'), id: 1},
      ],
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
          backgroundColor: '#EAEAF1',
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: '#D1D1D6',
          height: 60,
          marginTop: hp('2%'),
          alignItems: 'center',
        }}>
        <Image
          style={{
            height: 18,
            width: 18,
            resizeMode: 'contain',
            marginLeft: wp('2%'),
          }}
          source={isActive ? img.arrowDownIcon : img.arrowRightIcon}
        />
        <Text
          style={{
            color: '#98989B',
            fontSize: 15,
            fontWeight: 'bold',
            marginLeft: wp('2%'),
          }}>
          {todayFinal === finalData ? 'Today' : finalData}
        </Text>
      </View>
    );
  };

  _renderContent = section => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{marginTop: hp('2%')}}>
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: 10,
            }}>
            <View style={{width: wp('30%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>Time</Text>
            </View>
            <View style={{width: wp('40%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>Name</Text>
            </View>
            <View style={{width: wp('30%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>
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
                  borderTopWidth: 0.5,
                  paddingVertical: 10,
                }}>
                <View style={{width: wp('30%')}}>
                  <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    {item.eventTime}
                  </Text>
                </View>
                <View style={{width: wp('40%')}}>
                  <Text
                    style={{fontSize: 15, fontWeight: 'bold'}}
                    numberOfLines={1}>
                    {item.clientName}
                  </Text>
                </View>
                <View style={{width: wp('30%')}}>
                  <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    {item.pax}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
      buttons,
      buttonsSubHeader,
      searchItem,
    } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        <SubHeader {...this.props} buttons={buttonsSubHeader} />
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
              {translate('Events')}
            </Text>
            {buttons.map((item, index) => {
              return (
                <View style={{}} key={index}>
                  <TouchableOpacity
                    onPress={() => this.onPressFun(item)}
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
                      <Image
                        source={item.icon}
                        style={{
                          height: 22,
                          width: 22,
                          tintColor: 'white',
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
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
          <View
            style={{
              marginTop: 20,
              marginLeft: wp('15%'),
            }}>
            <View style={{}}>
              <Text style={{color: 'grey'}}>{translate('Search')} : </Text>
            </View>
          </View>
          <TextInput
            placeholder="Search"
            value={searchItem}
            style={{
              flexDirection: 'row',
              height: hp('5%'),
              width: wp('70%'),
              marginTop: 10,
              paddingLeft: 10,
              borderWidth: 1,
              alignSelf: 'center',
              borderColor: '#C9CCD7',
            }}
            onChangeText={value => this.searchFun(value)}
          />
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
