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
import {getMyProfileApi, inventoryLevelsApi} from '../../../connectivity/api';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';

import {translate} from '../../../utils/translations';

class Inventory extends Component {
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
      finalName: '',
      SECTIONS_SEC: [],
      modalVisibleSetup: false,
      modalData: [],
      modalLoader: false,
      sectionName: '',
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
    inventoryLevelsApi()
      .then(res => {
        // console.log('RES', res);

        function groupByKey(array, key) {
          return array.reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, {
              [obj[key]]: (hash[obj[key]] || []).concat(obj),
            });
          }, {});
        }

        function extract() {
          var groups = {};

          res.data.forEach(function (val) {
            var depat = val.departmentName;
            if (depat in groups) {
              groups[depat].push(val);
            } else {
              groups[depat] = new Array(val);
            }
          });

          return groups;
        }

        let final = extract();
        // console.log('FINAL', final);

        let finalArray = Object.keys(final).map((item, index) => {
          let groupedCategory = groupByKey(final[item], 'categoryName');
          // console.log('groupedCategory', groupedCategory);

          let catArray = Object.keys(groupedCategory).map((subItem, index) => {
            return {
              title: subItem,
              content: groupedCategory[subItem],
              status: false,
            };
          });

          // console.log('catArray', catArray);

          return {
            title: item,
            content: catArray,
          };
        });
        // console.log('finalArray', finalArray);

        const result = finalArray.reverse();

        this.setState({
          SECTIONS: [...result],
          recipeLoader: false,
          SECTIONS_SEC: [...result],
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

  onPressFun = () => {
    this.props.navigation.goBack();
  };

  _renderHeader = (section, index, isActive) => {
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
          {section.title}
        </Text>
      </View>
    );
  };

  openListFun = (index, section, sta, item) => {
    console.log('item', item.title);
    this.setState(
      {
        finalName: item.title,
        modalVisibleSetup: true,
        modalLoader: true,
        sectionName: section.title,
      },
      () => this.createDataFun(index, section, sta, item),
    );
  };

  createDataFun = (index, section, sta, subItem) => {
    console.log('section', section);
    console.log('inde', index);
    console.log('status', sta);
    const {SECTIONS, showSubList, finalName} = this.state;
    console.log('finalName', finalName);
    console.log('SECTIONS', SECTIONS);

    const status = true;
    // const status = !showSubList;
    console.log('status', status);

    let newArr = section.content.map((item, i) =>
      finalName === item.title
        ? {
            ...item,
            [sta]: status,
          }
        : {
            ...item,
            [sta]: false,
          },
    );
    console.log('new', newArr);

    // const finalArrSections = [];

    // SECTIONS.map((item, index) => {
    //   finalArrSections.push({
    //     title: item.title,
    //     content: newArr,
    //   });
    // });

    // console.log('finalArrSections', finalArrSections);

    setTimeout(() => {
      this.setState({
        showSubList: status,
        modalData: newArr,
        modalLoader: false,
      });
    }, 300);
  };

  _renderContent = section => {
    console.log('sec', section);
    return (
      <View>
        {section.content.map((item, index) => {
          return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    this.openListFun(index, section, 'status', item)
                  }
                  style={{
                    borderWidth: 1,
                    paddingVertical: 15,
                    paddingHorizontal: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Image
                    source={img.arrowRightIcon}
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                    }}
                  />
                  <View
                    style={{
                      width: wp('30%'),
                      alignItems: 'center',
                    }}>
                    <Text style={{textAlign: 'center'}}>{item.title}</Text>
                  </View>
                  <View
                    style={{
                      width: wp('30%'),
                      alignItems: 'center',
                    }}>
                    <Text>Current inventory</Text>
                  </View>
                  <View
                    style={{
                      width: wp('30%'),
                      alignItems: 'center',
                    }}>
                    <Text>On Order</Text>
                  </View>
                  <View
                    style={{
                      width: wp('30%'),
                      alignItems: 'center',
                    }}>
                    <Text>Events(+7d)</Text>
                  </View>
                  <View
                    style={{
                      width: wp('30%'),
                      alignItems: 'center',
                    }}>
                    <Text>Target</Text>
                  </View>
                  <View
                    style={{
                      width: wp('30%'),
                      alignItems: 'center',
                    }}>
                    <Text>Delta</Text>
                  </View>
                  <View
                    style={{
                      width: wp('30%'),
                      alignItems: 'center',
                    }}>
                    <Text>Order Now</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          );
        })}
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState(
      {
        activeSections,
      },
      () => this.updateSubFun(),
    );
  };

  updateSubFun = () => {
    this.setState({
      modalData: [],
    });
  };

  setAdminModalVisible = visible => {
    this.setState(
      {
        modalVisibleSetup: visible,
      },
      () => this.updateSubFun(),
    );
  };

  render() {
    const {
      recipeLoader,
      SECTIONS,
      activeSections,
      firstName,
      buttonsSubHeader,
      modalVisibleSetup,
      modalData,
      modalLoader,
      finalName,
      sectionName,
    } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {recipeLoader ? (
          <ActivityIndicator color="#94C036" size="small" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )}
        <ScrollView
          style={{marginBottom: hp('10%')}}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: '#412916',
              alignItems: 'center',
              paddingVertical: hp('3%'),
            }}>
            <Text style={{fontSize: 22, color: 'white'}}>
              {translate('Inventory Levels')}
            </Text>
            <View style={{}}>
              <TouchableOpacity
                onPress={() => this.onPressFun()}
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
          {recipeLoader ? (
            <ActivityIndicator color="#94C036" size="large" />
          ) : (
            <View style={{marginTop: hp('3%'), marginHorizontal: wp('5%')}}>
              <Accordion
                // expandMultiple
                underlayColor="#fff"
                sections={SECTIONS}
                activeSections={activeSections}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
                onChange={this._updateSections}
              />
            </View>
          )}
          <Modal isVisible={modalVisibleSetup} backdropOpacity={0.35}>
            <View
              style={{
                width: wp('80%'),
                height: hp('80%'),
                backgroundColor: '#fff',
                alignSelf: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#412916',
                  height: hp('7%'),
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flex: 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: '#fff'}}>
                    {sectionName}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => this.setAdminModalVisible(false)}>
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
              <ScrollView>
                {modalLoader ? (
                  <ActivityIndicator size="large" color="grey" />
                ) : (
                  <View
                    style={{
                      padding: hp('3%'),
                    }}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      <View>
                        <View
                          style={{
                            paddingVertical: 15,
                            paddingHorizontal: 5,
                            marginTop: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderWidth: 1,
                          }}>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text style={{textAlign: 'center'}}>
                              {finalName}
                            </Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>Current inventory</Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>On Order</Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>Events(+7d)</Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>Target</Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>Delta</Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>Order Now</Text>
                          </View>
                        </View>
                        <View>
                          {modalData && modalData.length > 0
                            ? modalData.map((item, index) => {
                                if (item.status === true) {
                                  return item.content.map(
                                    (subItem, subIndex) => {
                                      console.log('sub-->', subItem);
                                      return (
                                        <View
                                          style={{
                                            paddingVertical: 10,
                                            paddingHorizontal: 5,
                                            flexDirection: 'row',
                                          }}>
                                          <View
                                            style={{
                                              width: wp('30%'),
                                              alignItems: 'center',
                                            }}>
                                            <Text style={{textAlign: 'center'}}>
                                              {subItem.name}
                                            </Text>
                                          </View>
                                          <View
                                            style={{
                                              width: wp('30%'),
                                              alignItems: 'center',
                                            }}>
                                            <Text>
                                              {subItem.currentInventory}
                                            </Text>
                                          </View>
                                          <View
                                            style={{
                                              width: wp('30%'),
                                              alignItems: 'center',
                                            }}>
                                            <Text>{subItem.onOrder}</Text>
                                          </View>
                                          <View
                                            style={{
                                              width: wp('30%'),
                                              alignItems: 'center',
                                            }}>
                                            <Text>{subItem.eventsOnOrder}</Text>
                                          </View>
                                          <View
                                            style={{
                                              width: wp('30%'),
                                              alignItems: 'center',
                                            }}>
                                            <Text>{subItem.reorderLevel}</Text>
                                          </View>
                                          <View
                                            style={{
                                              width: wp('30%'),
                                              alignItems: 'center',
                                            }}>
                                            <Text>{subItem.reorderLevel}</Text>
                                          </View>
                                          <TouchableOpacity
                                            onPress={() => alert('ORDER NOW')}
                                            style={{
                                              width: wp('30%'),
                                              alignItems: 'center',
                                            }}>
                                            <Text>ORDER NOW</Text>
                                          </TouchableOpacity>
                                        </View>
                                      );
                                    },
                                  );
                                }
                              })
                            : null}
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                )}
              </ScrollView>
            </View>
          </Modal>
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

export default connect(mapStateToProps, {UserTokenAction})(Inventory);
