import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
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
import {
  getMyProfileApi,
  getDepartmentsApi,
  getNewStockTakeApi,
} from '../../connectivity/api';
import {translate} from '../../utils/translations';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Modal from 'react-native-modal';

var minTime = new Date();
minTime.setHours(0);
minTime.setMinutes(0);
minTime.setMilliseconds(0);

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {name: translate('Bar'), id: 0},
        {name: translate('Restaurant'), id: 1},
        {name: translate('Retail'), id: 2},
        {name: translate('Other'), id: 3},
        {name: translate('Back'), id: 4},
      ],
      token: '',
      firstName: '',
      firstPage: true,
      barPage: false,
      departments: [],
      isDatePickerVisible: false,
      finalDate: null,
      departmentId: null,
      newStock: null,
      items: [],
      showItemCategories: false,
      categoryItems: [],
      isModalVisible: false,
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
    getDepartmentsApi()
      .then(res => {
        this.setState({departments: res.data});
      })
      .catch(error => {
        console.warn('err', error);
      });
  }

  componentDidMount() {
    this.getProfileDataFun();
    this.getDepartmentsFun();
  }

  myProfileFun = () => {
    this.props.navigation.navigate('MyProfile');
  };

  showDatePickerFun = () => {
    this.setState({
      isDatePickerVisible: true,
    });
  };

  handleConfirm = date => {
    let newdate = moment(date).format('DD/MM/YYYY');
    this.setState({
      finalDate: newdate,
    });

    this.hideDatePicker();
    this.showNewStockTake(this.state.departmentId, newdate);
  };

  hideDatePicker = () => {
    this.setState({
      isDatePickerVisible: false,
    });
  };

  showNewStockTake(id, date) {
    getNewStockTakeApi(id, date)
      .then(res => {
        this.setState({newStock: res.data});

        function groupByKey(array, key) {
          return array.reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, {
              [obj[key]]: (hash[obj[key]] || []).concat(obj),
            });
          }, {});
        }

        let groupedCategory = groupByKey(res.data, 'category');

        console.log(
          'Object.keys(groupedCategory)',
          Object.keys(groupedCategory),
        );

        let finalArray = Object.keys(groupedCategory).map((item, index) => {
          return {
            name: item,
            id: item,
            children: groupedCategory[item],
          };
        });

        this.setState({
          items: [...finalArray],
          showItemCategories: true,
        });

        // let arr = this.state.items;
        // let newArr = arr.map(item => ({...item, showChildren: false}));
        // this.setState({items: newArr});
        // console.warn('', this.state.items[1].showChildren);
      })
      .catch(err => {
        console.warn('Err', err.response);
      });
  }

  showCategoryItemsFun(children) {
    this.setState({categoryItems: children, isModalVisible: true});
  }

  onPressFun = item => {
    if (item.id === 0) {
      // alert('Bar Clicked');
      let id = this.state.departments[item.id];
      this.setState({firstPage: false, barPage: true, departmentId: id.id});
    } else if (item.id === 1) {
      alert('Restaurant Clicked');
    } else if (item.id === 2) {
      alert('Retail Clicked');
    } else if (item.id === 3) {
      alert('Other Clicked');
    } else {
      this.props.navigation.goBack();
    }
  };

  render() {
    const {
      firstName,
      buttons,
      isDatePickerVisible,
      firstPage,
      barPage,
      items,
      showItemCategories,
      finalDate,
      showChildren,
      categoryItems,
      isModalVisible,
    } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfileFun}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {/* <SubHeader /> */}
        <ScrollView style={{marginBottom: hp('5%')}}>
          {firstPage ? (
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
                        <Text style={{color: 'white', marginLeft: 5}}>
                          {item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ) : null}
          {barPage ? (
            <View>
              <View style={{alignItems: 'space-between', marginRight: 5}}>
                <TouchableOpacity
                  // onPress={() => this.onPressFun(item)}
                  style={{
                    height: hp('4%'),
                    width: wp('20%'),
                    backgroundColor: '#94C036',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 18,
                    borderRadius: 5,
                  }}>
                  <View style={{}}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        marginLeft: 5,
                      }}>
                      New
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <Text
                  style={{
                    margin: 10,
                    fontWeight: 'bold',
                    fontSize: 30,
                    color: '#656565',
                  }}>
                  Stock Take
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => this.showDatePickerFun()}
                  style={{
                    margin: 10,
                    width: wp('60%'),
                    borderWidth: 1,
                    padding: 12,
                    marginBottom: hp('3%'),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    placeholder="dd-mm-yy"
                    value={finalDate}
                    editable={false}
                  />
                  <Image
                    source={img.calenderIcon}
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
                <DateTimePickerModal
                  // is24Hour={true}
                  isVisible={isDatePickerVisible}
                  mode={'date'}
                  onConfirm={this.handleConfirm}
                  onCancel={this.hideDatePicker}
                  maximumDate={minTime}
                  // minimumDate={new Date()}
                />
              </View>
              {showItemCategories ? (
                <View style={{flex: 8}}>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#E2E6EA',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: wp('95%'),
                        height: hp('4%'),
                      }}>
                      <Text>Collapse All</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{marginTop: hp('2%')}}>
                    {items.map(item => {
                      return (
                        <View style={{marginLeft: 5}}>
                          <TouchableOpacity
                            onPress={() =>
                              this.showCategoryItemsFun(item.children)
                            }
                            style={{
                              margin: 5,
                              backgroundColor: '#E7E7E7',
                              width: wp('95%'),
                              height: hp('4%'),
                              borderWidth: 1,
                              borderColor: '#CFCFCF',
                              justifyContent: 'center',
                            }}>
                            <Text style={{marginLeft: 5}}>{item.name}</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}

          <View>
            <Modal isVisible={isModalVisible} backdropOpacity={0.35}>
              <View
                style={{
                  width: wp('80%'),
                  height: hp('80%'),
                  backgroundColor: '#fff',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'grey',
                    height: hp('7%'),
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() => this.setState({isModalVisible: false, categoryItems : []})}>
                    <Image
                      source={img.cancelIcon}
                      style={{
                        height: 22,
                        width: 22,
                        tintColor: 'white',
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                </View>
                {categoryItems.map(ele => {
                  return (
                    <View>
                      <Text>{ele.name}</Text>
                    </View>
                  );
                })}
              </View>
            </Modal>
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
