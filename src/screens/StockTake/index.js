import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
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
const tomorrow = new Date(minTime);
tomorrow.setDate(tomorrow.getDate() + 1);

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {name: translate('Bar'), id: 0},
        {name: translate('Restaurant'), id: 2},
        {name: translate('Retail'), id: 3},
        {name: translate('Other'), id: 1},
        {name: translate('Back'), id: 4},
      ],
      token: '',
      firstName: '',
      firstPage: true,
      stockPage: false,
      departments: [],
      isDatePickerVisible: false,
      finalDate: null,
      departmentId: null,
      newStock: null,
      items: [],
      showItemCategories: false,
      isModalVisible: false,
      childrenList: null,
      showCategoryItems: false,
      collapse: 'Collapse All',
      pickedItem: {name: ''},
      alphaLoader: false,
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
          // items: [...finalArray],
          showItemCategories: true,
        });

        let childrenList = [];
        let list = [...finalArray];
        let newItems = [];
        let pos = 0;
        list.map(item => {
          // console.warn('lll', item);
          childrenList.push(item.children);
          newItems.push({
            name: item.name,
            id: item.id,
            position: pos,
            children: [],
            showChildren: false,
            sortedAlpha: false,
            sortedByDate: false,
          });
          pos = pos + 1;
        });
        this.setState({items: newItems, childrenList: childrenList});
      })
      .catch(err => {
        console.warn('Err', err.response);
      });
  }

  showCategoryItemsFun(index) {
    const {items, childrenList} = this.state;
    let newItems = [];

    if (items[index].showChildren === false) {
      this.state.items.map(item => {
        if (item.position === index) {
          newItems.push({
            name: item.name,
            id: item.id,
            position: item.position,
            children: childrenList[index],
            showChildren: true,
          });
        } else {
          newItems.push(item);
        }
        this.setState({items: newItems});
      });
    } else {
      this.state.items.map(item => {
        if (item.position === index) {
          newItems.push({
            name: item.name,
            id: item.id,
            position: item.position,
            children: [],
            showChildren: false,
          });
        } else {
          newItems.push(item);
        }
        this.setState({items: newItems});
      });
    }
  }

  collapseAllFun() {
    const {collapse, items, childrenList} = this.state;
    let newItems = [];

    if (collapse === 'Collapse All') {
      items.map(item => {
        newItems.push({
          name: item.name,
          id: item.id,
          position: item.position,
          children: [],
          showChildren: false,
        });

        this.setState({items: newItems});
      });
      this.setState({collapse: 'Uncollapse All'});
    } else {
      items.map(item => {
        newItems.push({
          name: item.name,
          id: item.id,
          position: item.position,
          children: childrenList[item.position],
          showChildren: true,
        });
      });
      this.setState({items: newItems});
      this.setState({collapse: 'Collapse All'});
    }
  }

  openModalFun(item) {
    this.setState({
      pickedItem: item,
      isModalVisible: true,
    });
  }

  sortItemsByDate(index) {
    const {childrenList} = this.state;
    let list = childrenList[index];
    console.warn(list);
  }

  sortItemsAlpha(index) {
    const {items, alphaLoader} = this.state;

    let list = items[index].children;
    let sortedList = null;
    let newItems = [];

    items.map(item => {
      if (item.sortedAlpha == true) {
      
        sortedList = list.reverse();
        if (item.position === index) {
          newItems.push({
            name: item.name,
            id: item.id,
            position: item.position,
            children: sortedList,
            showChildren: item.showChildren,
            sortedAlpha: false,
            sortedByDate: false,
          });
        } else {
          newItems.push(item);
        }
      } else {
        this.setState({alphaLoader: true});
        console.warn('loder',alphaLoader)
        sortedList = list.sort();
        if (item.position === index) {
          newItems.push({
            name: item.name,
            id: item.id,
            position: item.position,
            children: sortedList,
            showChildren: item.showChildren,
            sortedAlpha: true,
            sortedByDate: false,
          });
        } else {
          newItems.push(item);
        }
      }
    });
    this.setState({items: newItems, alphaLoader: false});
  }

  onPressFun = item => {
    if (item.id === 0) {
      // alert('Bar Clicked');
      let id = this.state.departments[item.id];
      this.setState({firstPage: false, stockPage: true, departmentId: id.id});
    } else if (item.id === 1) {
      let id = this.state.departments[item.id];
      this.setState({firstPage: false, stockPage: true, departmentId: id.id});
    } else if (item.id === 2) {
      let id = this.state.departments[item.id];
      this.setState({firstPage: false, stockPage: true, departmentId: id.id});
    } else if (item.id === 3) {
      let id = this.state.departments[item.id];
      this.setState({firstPage: false, stockPage: true, departmentId: id.id});
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
      stockPage,
      items,
      showItemCategories,
      finalDate,
      showChildren,
      isModalVisible,
      collapse,
      pickedItem,
      alphaLoader,
    } = this.state;

    console.warn('loader', alphaLoader);

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
          ) : null}
          {stockPage ? (
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
                  maximumDate={tomorrow}
                  minimumDate={new Date()}
                />
              </View>
              {showItemCategories ? (
                <View style={{flex: 8}}>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <TouchableOpacity
                      onPress={() => this.collapseAllFun()}
                      style={{
                        backgroundColor: '#E2E6EA',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: wp('95%'),
                        height: hp('4%'),
                      }}>
                      <Text>{collapse}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{marginTop: hp('2%')}}>
                    {items.map(item => {
                      return (
                        <View style={{marginLeft: 5}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              flex: 10,
                              backgroundColor: '#E7E7E7',
                              borderWidth: 1,
                              borderColor: '#CFCFCF',
                              margin: 7,
                            }}>
                            <Pressable
                              onPress={() =>
                                this.showCategoryItemsFun(item.position)
                              }
                              style={{
                                margin: 5,
                                backgroundColor: '#E7E7E7',
                                width: wp('90%'),
                                height: hp('4%'),
                                // borderWidth: 1,
                                // borderColor: '#CFCFCF',
                                // justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                              }}>
                              {item.showChildren ? (
                                <View style={{flex: 1}}>
                                  <Image
                                    style={{
                                      height: 22,
                                      width: 22,
                                      tintColor: 'grey',
                                      resizeMode: 'contain',
                                    }}
                                    source={img.arrowDownIcon}
                                  />
                                </View>
                              ) : (
                                <View style={{flex: 1}}>
                                  <Image
                                    style={{
                                      height: 22,
                                      width: 22,
                                      tintColor: 'grey',
                                      resizeMode: 'contain',
                                    }}
                                    source={img.arrowRightIcon}
                                  />
                                </View>
                              )}
                              <View style={{flex: 7}}>
                                <Text style={{marginLeft: 2}}>{item.name}</Text>
                              </View>
                              <View style={{flexDirection: 'row', flex: 2}}>
                                <Text style={{marginRight: 4}}>A - Z</Text>
                                <Pressable
                                  onPress={() =>
                                    this.sortItemsAlpha(item.position)
                                  }>
                                  <Image
                                    style={{
                                      height: 18,
                                      width: 18,
                                      tintColor: 'grey',
                                      resizeMode: 'contain',
                                    }}
                                    source={img.doubleArrowIcon}
                                  />
                                </Pressable>
                              </View>
                              <View style={{flexDirection: 'row', flex: 2}}>
                                <Text style={{marginRight: 4}}>Date</Text>
                                <Pressable
                                  onPress={() =>
                                    this.sortItemsByDate(item.position)
                                  }>
                                  <Image
                                    style={{
                                      height: 18,
                                      width: 18,
                                      tintColor: 'grey',
                                      resizeMode: 'contain',
                                    }}
                                    source={img.doubleArrowIcon}
                                  />
                                </Pressable>
                              </View>
                            </Pressable>
                          </View>
                          {item.showChildren ? (
                            <View>
                              <ScrollView>
                                <ScrollView
                                  horizontal
                                  showsHorizontalScrollIndicator={true}>
                                  <View style={{}}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        borderBottomColor: '#EAEAF0',
                                        borderBottomWidth: 2,
                                        padding: 8,
                                        flex: 11,
                                      }}>
                                      <View
                                        style={{
                                          padding: 2,
                                          marginLeft: 4,
                                          flex: 6,
                                        }}>
                                        <Text style={{fontWeight: 'bold'}}>
                                          Name
                                        </Text>
                                      </View>
                                      <View
                                        style={{
                                          padding: 2,
                                          marginLeft: 4,
                                          flex: 3,
                                        }}>
                                        <Text style={{fontWeight: 'bold'}}>
                                          System says
                                        </Text>
                                      </View>
                                      <View
                                        style={{
                                          padding: 2,
                                          marginLeft: 4,
                                          flex: 3,
                                        }}>
                                        <Text style={{fontWeight: 'bold'}}>
                                          Stock Take
                                        </Text>
                                      </View>
                                      <View
                                        style={{
                                          padding: 2,
                                          marginLeft: 4,
                                          flex: 1,
                                        }}>
                                        <Text style={{fontWeight: 'bold'}}>
                                          Correction
                                        </Text>
                                      </View>
                                    </View>

                                    {alphaLoader ? (
                                      <ActivityIndicator
                                        size="large"
                                        color="grey"
                                      />
                                    ) : (
                                      item.children.map(ele => {
                                        return (
                                          <View
                                            style={{
                                              borderBottomColor: '#EAEAF0',
                                              borderBottomWidth: 2,
                                              padding: 8,
                                              flexDirection: 'row',
                                              alignItems: 'flex-start',
                                              flex: 20,
                                              // justifyContent: 'center'
                                            }}>
                                            <View
                                              style={{
                                                margin: 5,
                                                flex: 8,
                                                // paddingLeft: 10,
                                              }}>
                                              <Text
                                                style={{
                                                  fontSize: 15,
                                                  fontWeight: 'bold',
                                                }}>
                                                {ele.name}
                                              </Text>
                                              <Text style={{fontSize: 12}}>
                                                {moment(
                                                  ele.stockTakeLastUpdate,
                                                ).format('DD/MM/YYYY')}
                                              </Text>
                                            </View>
                                            <View
                                              style={{
                                                // margin: 5,
                                                flex: 3,
                                                // paddingLeft: 50,
                                                flexDirection: 'row',
                                              }}>
                                              <Text>{ele.systemSays} </Text>
                                              {ele.systemSays ? (
                                                <Text>{ele.units[0].name}</Text>
                                              ) : null}
                                            </View>
                                            <View
                                              style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                margin: 5,
                                                flex: 2,
                                                // paddingLeft: 50,
                                              }}>
                                              <TouchableOpacity
                                                onPress={() =>
                                                  this.openModalFun(ele)
                                                }
                                                style={{
                                                  backgroundColor: '#FFFF00',
                                                  height: hp('4%'),
                                                  width: wp('13%'),
                                                  justifyContent: 'center',
                                                  // alignItems: 'center',
                                                  margin: 5,
                                                }}></TouchableOpacity>
                                            </View>
                                            <View
                                              style={{
                                                margin: 5,
                                                flex: 3,
                                                paddingLeft: 20,
                                              }}>
                                              <Text>{ele.units[0].name}</Text>
                                            </View>
                                            <View
                                              style={{
                                                // margin: 5,
                                                flex: 3,
                                                // paddingLeft: 50,
                                              }}>
                                              <Text></Text>
                                            </View>
                                          </View>
                                        );
                                      })
                                    )}
                                  </View>
                                </ScrollView>
                              </ScrollView>
                            </View>
                          ) : null}
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
                <ScrollView>
                  <View
                    style={{
                      backgroundColor: '#412916',
                      height: hp('5%'),
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 9,
                    }}>
                    <View style={{flex: 8}}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: 'white',
                          paddingLeft: wp('2%'),
                        }}>
                        {pickedItem.name}
                      </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            isModalVisible: false,
                          })
                        }>
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
                  </View>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        borderBottomColor: '#C9CCD7',
                        borderBottomWidth: 2,
                        padding: 8,
                        margin: '4%',
                        marginLeft: wp('5%'),
                      }}>
                      <View>
                        <Text
                          style={{fontWeight: 'bold', paddingRight: wp('5%')}}>
                          Quantity
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{fontWeight: 'bold', paddingRight: wp('5%')}}>
                          Unit
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{fontWeight: 'bold', paddingRight: wp('5%')}}>
                          Inventory
                        </Text>
                      </View>
                      <View>
                        <Text style={{fontWeight: 'bold', paddingRight: '0%'}}>
                          Name
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
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
