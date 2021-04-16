import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Switch,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../constants/images';
import SubHeader from '../../components/SubHeader';
import Header from '../../components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {
  getMyProfileApi,
  getManualLogList,
  deleteManualLog,
  getMepRecipesApi,
  newMepListApi,
  getMepRecipeByIdsApi,
  getManualLogTypes,
  updateManualLogApi,
  addManualLogApi,
  getManualLogItemList,
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
      buttons: [{name: 'Add new', icon: img.addIcon}, {name: 'Back'}],
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
      advanceDetailsLoader: false,
      sectionAdvanceData: {},
      recipeID: '',
      textQuantity: '',
      itemType: '',
      typeList: [],
      showTypePicker: false,
      isSelected: null,
      itemList: [],
      defaultValue: 'hello',
      showDepartmentCategories: false,
      itemDepartments: [
        {name: 'Bar', itemsBar: []},
        {name: 'Other', itemsOther: []},
        {name: 'Restaurant', itemsRestaurant: []},
        {name: 'Retail', itemsRetail: []},
      ],
      itemCategories: [],
      newManualLog: {},
    };
  }

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  setModalVisibleAdd = visible => {
    this.setState({modalVisibleAdd: visible});
  };

  setModalVisibleRecipeDetails = (visible, data) => {
    this.setState(
      {
        modalVisibleRecipeDetails: visible,
        detailsLoader: true,
      },
      () =>
        getMepRecipeByIdsApi(data.id)
          .then(res => {
            this.setState({
              modalVisibleRecipeDetails: visible,
              sectionData: res.data,
              detailsLoader: false,
              quantity: JSON.stringify(res.data && res.data.quantity),
              notes: res.data && res.data.notes,
            });
          })
          .catch(err => {
            this.setState({
              detailsLoader: false,
            });
            console.warn('ERR', err);
          }),
    );
  };
  setModalVisibleRecipeDetailsClose = visible => {
    this.setState({
      modalVisibleRecipeDetails: visible,
    });
  };

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

  getManualLogTypesData() {
    getManualLogTypes()
      .then(res => this.setState({typeList: res.data}))
      .catch(err => {
        console.warn('ERr', err.response);
      });
  }

  getManualLogItemListData() {
    getManualLogItemList()
      .then(res => {
        const result = res.data.reduce((temp, value) => {
          if (temp.length < 5) temp.push(value);
          return temp;
        }, []);
        this.setState({itemList: result});
        this.filterData(result);
      })
      .catch(err => {
        console.warn('ERr', err.response);
      });
  }

  filterData(list) {
    const restArray = list.filter(item => item.departmentName === 'Restaurant');
    restArray.sort();
    const barArray = list.filter(item => item.departmentName === 'Bar');
    barArray.sort();
    const otherArray = list.filter(item => item.departmentName === 'Other');
    otherArray.sort();
    const retailArray = list.filter(item => item.departmentName === 'Retail');
    retailArray.sort();
    // list.map(item => {
    //   this.state.itemDepartments.map(department => {
    //     if (item.departmentName === 'Restaurant') {
    //       department.itemsRestaurant.push(item)

    //     }
    //   });
    // });
  }

  addNewManualLog() {
    let payload = {
      loggedDate: '2021-04-16T07:03:57.659Z',
      name: 'Bread & olive oil',
      quantity: 2,
      typeName: 'Other',
      category: 'Menu Spring & Summer 2020',
      countInInventory: false,
      departmentId: null,
      departmentName: 'Restaurant',
      id: '1d9d255a-9a3c-462e-98c2-32b000c3700d',
      inUse: true,
      itemId: 'a019eae2-353d-4194-95b5-b184f4714bdc',
      itemTypeId: 'bb038c77-47fe-4a80-8a21-b01058730eb5',
      itemTypeName: 'MenuItem',
      loggedDate: '2021-04-16T07:03:57.659Z',
      name: 'Bread & olive oil',
      notes: 'test',
      quantity: 2,
      reviewed: false,
      typeId: 'c05d2c50-1a47-47dd-abf4-3f8a7e31689f',
      typeName: 'Other',
      unit: '',
      unitId: '0a17a8b7-74b5-49a1-bddb-ac6d48de8e1d',
      units: [
        {
          id: '0a17a8b7-74b5-49a1-bddb-ac6d48de8e1d',
          inventoryId: '00000000-0000-0000-0000-000000000000',
        },
      ],

      userFullName: null,
      userId: '8e194fe1-5cac-439e-a036-c2009bfb455a',
    };

    addManualLogApi(payload)
      .then(this.getManualLogsData())

      .catch(err => {
        console.warn('AddFailed', err.response);
      });
  }

  createFirstData = () => {
    getManualLogList()
      .then(res => {
        const result = res.data.reduce((temp, value) => {
          if (temp.length < 5) temp.push(value);
          return temp;
        }, []);
        this.setState({
          SECTIONS: result,
          recipeLoader: false,
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
    this.getManualLogTypesData();
    this.getManualLogItemListData();
  }

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    if (item.name === 'Add new') {
      this.setModalVisibleAdd(true);
      this.setState({
        selectectedItems: [],
        preparedDate: '',
        finalDate: '',
        items: [],
        isShownPicker: false,
        applyStatus: false,
      });
    } else if (item.name === 'Back') {
      this.props.navigation.goBack();
    }
  };

  onPressCollapseFun = () => {
    this.setState({
      activeSections: [],
    });
  };

  _renderHeader = (section, index, isActive) => {
    var todayFinal = moment(new Date()).format('dddd, MMM DD YYYY');

    const finalData = moment(section.loggedDate).format('dddd, MMM DD YYYY');

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

  updateReviewedStatusFun = section => {
    let payload = {
      id: section.id,
      itemId: section.itemId,
      name: section.name,
      loggedDate: section.loggedDate,
      quantity: section.quantity,
      itemTypeId: section.itemTypeId,
      typeId: section.typeId,
      departmentId: section.departmentId,
      unitId: section.unitId,
      departmentName: section.departmentName,
      category: section.category,
      itemTypeName: section.itemTypeName,
      typeName: section.typeName,
      reviewed: !section.reviewed,
      unit: section.unit,
      userId: section.userId,
      userFullName: section.userFullName,
      units: [
        {
          id: section.units[0].id,
          inventoryId: section.units[0].inventoryId,
          name: section.units[0].name,
          isDefault: true,
          isVariable: false,
          quantity: null,
          converter: 1,
          notes: null,
          action: null,
        },
      ],
      notes: section.notes,
      inUse: section.inUse,
      countInInventory: section.countInInventory,
    };
    console.log('PAYLOAD', payload);
    updateManualLogApi(payload)
      .then(res => {
        this.setState(
          {
            modalVisibleRecipeDetails: false,
          },
          () => this.getManualLogsData(),
        );
      })
      .catch(err => {
        console.warn('ERRUPDATE', err.response);
      });
  };

  _renderContent = section => {
    return (
      <View style={{marginTop: hp('2%')}}>
        <ScrollView
          horizontal
          style={{marginRight: wp('10%')}}
          showsHorizontalScrollIndicator={false}>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Switch
                style={{}}
                trackColor={{
                  false: '#767577',
                  true: '#94C036',
                }}
                value={!section.reviewed}
                onValueChange={() => this.updateReviewedStatusFun(section)}
                thumbColor="#fff"
              />
              <View style={{marginLeft: wp('2%')}}>
                <TouchableOpacity
                  onPress={() =>
                    this.setModalVisibleRecipeDetails(true, section)
                  }>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}>
                    {section.name}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{alignItems: 'center', marginLeft: wp('4%')}}>
                <Text
                  style={{
                    fontSize: 14,
                  }}>
                  {section.itemTypeName}
                </Text>
              </View>
              <View style={{alignItems: 'center', marginLeft: wp('4%')}}>
                <Text
                  style={{
                    fontSize: 14,
                  }}>
                  {section.quantity}{' '}
                  {section.units.length > 0 && section.units[0].name}
                </Text>
              </View>
              <View style={{alignItems: 'center', marginLeft: wp('4%')}}>
                <Text
                  style={{
                    fontSize: 14,
                  }}>
                  {section.typeName}
                </Text>
              </View>
              <View style={{alignItems: 'center', marginLeft: wp('4%')}}>
                <Text
                  style={{
                    fontSize: 14,
                  }}>
                  {section.userFullName}
                </Text>
              </View>
              <View style={{alignItems: 'center', marginLeft: wp('4%')}}>
                <TouchableOpacity
                  onPress={() => this.deleteMepFun(section)}
                  style={{
                    backgroundColor: 'red',
                    padding: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={img.cancelIcon}
                    style={{
                      height: 15,
                      width: 15,
                      tintColor: 'white',
                      resizeMode: 'contain',
                    }}
                  />
                  <Text
                    style={{fontSize: 14, color: '#fff', textAlign: 'center'}}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({
      activeSections,
    });
  };

  updateRecipeDetailsFun = () => {
    const {sectionData, quantity, notes} = this.state;
    let payload = [
      {
        id: sectionData.id,
        recipeVersionId: sectionData.recipeVersionId,
        userId: sectionData.userId,
        preparedById: 'string',
        madeBy: 'string',
        requestedBy: 'string',
        preparedBy: 'string',
        isPrepared: sectionData.isPrepared,
        isRecycled: sectionData.isRecycled,
        isTracked: sectionData.isTracked,
        name: sectionData.name,
        unit: sectionData.unit,
        productionDate: sectionData.productionDate,
        preparedDate: sectionData.preparedDate,
        recipeId: sectionData.recipeId,
        quantity: quantity,
        notes: notes,
      },
    ];
    updateManualLogApi(payload)
      .then(res => {
        this.setState(
          {
            modalVisibleRecipeDetails: false,

            sectionData: '',
          },
          () => this.getManualLogsData(),
        );
      })
      .catch(err => {
        console.warn('ERRDeleteMep', err.response);
      });
  };

  toggleSwitchNotif = data => {
    this.setState(
      {
        modalVisibleRecipeDetails: false,
      },
      () => this.updateReviewedStatusFun(data),
    );
  };

  deleteMepFunSec = section => {
    let payload = {
      id: section.id,
      itemId: section.itemId,
      name: section.name,
      loggedDate: section.loggedDate,
      quantity: section.quantity,
      itemTypeId: section.itemTypeId,
      typeId: section.typeId,
      departmentId: section.departmentId,
      unitId: section.unitId,
      departmentName: section.departmentName,
      category: section.category,
      itemTypeName: section.itemTypeName,
      typeName: section.typeName,
      reviewed: section.reviewed,
      unit: section.unit,
      userId: section.userId,
      userFullName: section.userFullName,
      units: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          inventoryId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: 'string',
          isDefault: true,
          isVariable: true,
          quantity: 0,
          converter: 0,
          notes: 'string',
          action: 'string',
        },
      ],
      notes: section.notes,
      inUse: section.inUse,
      countInInventory: section.countInInventory,
    };
    deleteManualLog(payload)
      .then(res => {
        this.setState(
          {
            modalVisibleRecipeDetails: false,
          },
          () => this.getManualLogsData(),
        );
      })
      .catch(err => {
        console.warn('ERRDeleteMep', err.response);
      });
  };

  deleteMepFun = data => {
    Alert.alert('Are you sure?', "You won't be able to revert this!", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => this.deleteMepFunSec(data)},
    ]);
  };

  hideDatePicker = () => {
    this.setState({
      isDatePickerVisible: false,
    });
  };

  getRecipesData = () => {
    const {finalDate} = this.state;
    getMepRecipesApi(finalDate)
      .then(res => {
        const {data} = res;
        let newData = [];
        data.map(item => {
          const obj = {};
          obj.label = item.name;
          obj.value = item.id;
          obj.quantity = item.batchQuantity;
          newData = [...newData, obj];
        });
        this.setState({
          items: newData,
        });
      })
      .catch(err => {
        console.warn('Err', err);
      });
  };

  handleConfirm = date => {
    let newdate = moment(date).format('L');
    this.setState(
      {
        finalDate: newdate,
        productionDate: date,
      },
      () => this.getRecipesData(),
    );

    this.hideDatePicker();
  };

  showDatePickerFun = () => {
    this.setState({
      isDatePickerVisible: true,
    });
  };

  addMepListFun = () => {
    const {selectectedItems, productionDate} = this.state;

    if (productionDate === '' || selectectedItems.length === 0) {
      alert('Please select date and recipe');
    } else {
      newMepListApi(selectectedItems)
        .then(res => {
          this.setState(
            {
              modalVisibleAdd: false,
              selectectedItems: [],
            },
            () => this.getManualLogsData(),
          );
        })
        .catch(err => {
          console.warn('ERRDeleteMep', err.response);
        });
    }
  };

  openRecipeDropDown = () => {
    const {applyStatus, finalDate} = this.state;
    if (finalDate) {
      if (applyStatus) {
        this.setState({
          isShownPicker: false,
        });
      } else {
        this.setState({
          isShownPicker: true,
        });
      }
    } else {
      alert('Please select date first.');
    }
  };

  openLogTypeDropdown(param) {
    this.setState({
      showTypePicker: param,
    });
  }

  openDepartmentDropdown(param) {
    this.setState({showDepartmentCategories: param});
  }

  selectItemType(type, hide) {
    setTimeout(() => {
      this.setState({showTypePicker: hide, itemType: type});
    }, 500);
  }

  showAdvanceView = () => {
    const {recipeID} = this.state;
    this.setState(
      {
        modalAdvanceRecipeDetails: false,
      },
      () =>
        this.props.navigation.navigate('MepAdvanceScreen', {
          recipeID: recipeID,
        }),
    );
  };

  render() {
    const {
      textQuantity,
      modalVisible,
      modalVisibleAdd,
      recipeLoader,
      SECTIONS,
      activeSections,
      firstName,
      buttons,
      modalVisibleRecipeDetails,
      sectionData,
      isDatePickerVisible,
      finalDate,
      isShownPicker,
      selectectedItems,
      items,
      applyStatus,
      detailsLoader,
      quantity,
      notes,
      advanceDetailsLoader,
      sectionAdvanceData,
      itemType,
      typeList,
      showTypePicker,
      isSelected,
      itemList,
      defaultValue,
      showDepartmentCategories,
      itemDepartments,
    } = this.state;
    const finalDateData = moment(sectionData.productionDate).format(
      'dddd, MMM DD YYYY',
    );
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        <SubHeader />
        <ScrollView style={{marginBottom: hp('5%')}}>
          <View
            style={{
              backgroundColor: '#412916',
              alignItems: 'center',
              paddingVertical: hp('3%'),
            }}>
            <Text style={{fontSize: 22, color: 'white'}}>MANUAL LOG</Text>
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
                  <View>
                    {/* // Add Recipe Modal */}
                    <Modal isVisible={modalVisibleAdd} backdropOpacity={0.35}>
                      <View
                        style={{
                          width: wp('80%'),
                          height: isShownPicker ? hp('90%') : hp('60%'),
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
                              Manual Log - Add new item
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() => this.setModalVisibleAdd(false)}>
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
                          <View style={{padding: hp('3%')}}>
                            <View>
                              <TouchableOpacity
                                onPress={() => this.showDatePickerFun()}
                                style={{
                                  borderWidth: 1,
                                  padding: 10,
                                  marginBottom: hp('4%'),
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
                              <TouchableOpacity
                                onPress={() => {
                                  this.openRecipeDropDown();
                                }}
                                style={{
                                  borderWidth: 1,
                                  padding: 10,
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                {/* {selectectedItems.length > 0 ? (
                                  <View>
                                    {applyStatus ? (
                                      <View>
                                        {selectectedItems.map(item => {
                                          return (
                                            <View style={{marginTop: hp('1%')}}>
                                              <Text>{item.name}</Text>
                                            </View>
                                          );
                                        })}
                                      </View>
                                    ) : selectectedItems.length > 0 ? (
                                      <View>
                                        {selectectedItems.map(item => {
                                          return (
                                            <View style={{marginTop: hp('1%')}}>
                                              <Text>{item.label}</Text>
                                            </View>
                                          );
                                        })}
                                      </View>
                                    ) : null} */}

                                <Text>Select</Text>

                                <Image
                                  source={img.arrowDownIcon}
                                  style={{
                                    width: 15,
                                    height: 15,
                                    resizeMode: 'contain',
                                  }}
                                />
                              </TouchableOpacity>
                              {isShownPicker ? (
                                <View>
                                  {itemDepartments.map(item => {
                                    return (
                                      <View>
                                        <Pressable
                                          onPress={() =>
                                            this.openDepartmentDropdown(
                                              !showDepartmentCategories,
                                            )
                                          }
                                          style={{flexDirection: 'row'}}>
                                          <Image
                                            style={{
                                              height: 18,
                                              width: 18,
                                              resizeMode: 'contain',
                                              marginLeft: wp('2%'),
                                            }}
                                            source={
                                              this.state.isActive
                                                ? img.arrowDownIcon
                                                : img.arrowRightIcon
                                            }
                                          />

                                          <Text>{item.name}</Text>
                                        </Pressable>
                                        {showDepartmentCategories ? (
                                          <View>
                                            {item.items.map(element => {
                                              return (
                                                <View>
                                                  <Text>
                                                    {element.category}
                                                  </Text>
                                                </View>
                                              );
                                            })}
                                          </View>
                                        ) : null}
                                      </View>
                                    );
                                  })}
                                </View>
                              ) : null}

                              <View
                                style={{
                                  height: 40,
                                  marginTop: 5,
                                  borderWidth: 1,
                                  borderColor: '#A2A2A2',
                                  padding: 10,
                                }}>
                                <TextInput
                                  onChangeText={textQuantity =>
                                    this.setState({textQuantity})
                                  }
                                  value={textQuantity}
                                  placeholder="quantity"
                                />
                              </View>

                              <View style={{flex: 2, marginTop: 5}}>
                                <TouchableOpacity
                                  onPress={() => {
                                    this.openLogTypeDropdown(!showTypePicker);
                                  }}
                                  style={{
                                    borderWidth: 1,
                                    padding: 10,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                  }}>
                                  {itemType ? (
                                    <Text>{itemType}</Text>
                                  ) : (
                                    <Text>Select Type</Text>
                                  )}

                                  <Image
                                    source={img.arrowDownIcon}
                                    style={{
                                      width: 15,
                                      height: 15,
                                      resizeMode: 'contain',
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View style={{flex: 8}}>
                                {showTypePicker ? (
                                  <View
                                    style={{
                                      margin: 5,
                                      borderWidth: 1,
                                      borderColor: 'black',
                                      padding: 5,
                                    }}>
                                    {typeList.map(item => {
                                      return (
                                        <View
                                          style={{
                                            marginTop: hp('1%'),
                                            marginBottom: 10,
                                            flexDirection: 'row',
                                          }}>
                                          <CheckBox
                                            value={isSelected}
                                            onValueChange={() =>
                                              this.selectItemType(
                                                item.name,
                                                !showTypePicker,
                                              )
                                            }
                                            style={{
                                              margin: 5,
                                              height: 20,
                                              width: 20,
                                            }}
                                          />
                                          <Text style={{margin: 5}}>
                                            {item.name}
                                          </Text>
                                        </View>
                                      );
                                    })}
                                  </View>
                                ) : null}
                                <View style={{}}>
                                  <Text style={{margin: 5}}>Note :</Text>
                                </View>

                                <View
                                  style={{
                                    flex: 3,

                                    borderWidth: 1,
                                    borderColor: '#A2A2A2',
                                    padding: 10,
                                  }}>
                                  <TextInput
                                    multiline={true}
                                    numberOfLines={4}
                                    onChangeText={note => this.setState({note})}
                                    value={this.state.note}
                                    placeholder="Notes"
                                  />
                                </View>
                              </View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'flex-end',
                                  marginTop: hp('5%'),
                                }}>
                                <TouchableOpacity
                                  onPress={() => this.addMepListFun()}
                                  style={{
                                    width: wp('15%'),
                                    height: hp('5%'),
                                    alignSelf: 'flex-end',
                                    backgroundColor: '#94C036',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#fff',
                                      fontSize: 15,
                                      fontWeight: 'bold',
                                    }}>
                                    Save
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => this.setModalVisibleAdd(false)}
                                  style={{
                                    width: wp('15%'),
                                    height: hp('5%'),
                                    alignSelf: 'flex-end',
                                    backgroundColor: '#E7943B',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: wp('2%'),
                                  }}>
                                  <Text
                                    style={{
                                      color: '#fff',
                                      fontSize: 15,
                                      fontWeight: 'bold',
                                    }}>
                                    Close
                                  </Text>
                                </TouchableOpacity>
                              </View>
                              <DateTimePickerModal
                                // is24Hour={true}
                                isVisible={isDatePickerVisible}
                                mode={'date'}
                                onConfirm={this.handleConfirm}
                                onCancel={this.hideDatePicker}
                                minimumDate={minTime}

                                // maximumDate={maxTime}
                                // minimumDate={new Date()}
                              />
                            </View>
                          </View>
                        </ScrollView>
                      </View>
                    </Modal>
                    {/* // Recipe Details Modal */}
                    <Modal
                      isVisible={modalVisibleRecipeDetails}
                      backdropOpacity={0.35}>
                      <View
                        style={{
                          width: wp('85%'),
                          height: hp('90%'),
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
                              MISE-EN-PLACE DETAILS
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <TouchableOpacity
                              onPress={() =>
                                this.setModalVisibleRecipeDetailsClose(false)
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
                        {detailsLoader ? (
                          <ActivityIndicator color="#94C036" size="large" />
                        ) : (
                          <ScrollView>
                            <View style={{padding: hp('5%')}}>
                              <View style={{}}>
                                <View style={{}}>
                                  <Text
                                    style={{
                                      color: '#7F7F7F',
                                      fontSize: 16,
                                      fontWeight: 'bold',
                                      marginBottom: 5,
                                    }}>
                                    {sectionData.name}
                                  </Text>
                                  <View
                                    style={{
                                      marginTop: hp('1%'),
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginVertical: hp('2%'),
                                    }}>
                                    <Switch
                                      style={{width: '20%'}}
                                      trackColor={{
                                        false: '#767577',
                                        true: '#94C036',
                                      }}
                                      value={!sectionData.isPrepared}
                                      onValueChange={() =>
                                        this.toggleSwitchNotif(sectionData)
                                      }
                                      thumbColor="#fff"
                                    />
                                    <Text
                                      style={{
                                        color: '#7F7F7F',
                                        marginLeft: wp('4%'),
                                        fontWeight: '900',
                                      }}>
                                      {!sectionData.isPrepared
                                        ? 'Make me'
                                        : 'Done'}
                                    </Text>
                                  </View>
                                </View>

                                <TouchableOpacity
                                  style={{
                                    height: hp('5%'),
                                    width: wp('62%'),
                                    backgroundColor: 'red',
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                  }}
                                  onPress={() => this.deleteMepFun()}>
                                  <Image
                                    source={img.cancelIcon}
                                    style={{
                                      height: 22,
                                      width: 22,
                                      tintColor: 'white',
                                      resizeMode: 'contain',
                                    }}
                                  />
                                  <Text
                                    style={{
                                      color: '#fff',
                                      fontSize: 16,
                                      fontWeight: 'bold',
                                      marginLeft: 10,
                                    }}>
                                    Delete
                                  </Text>
                                </TouchableOpacity>
                                <View
                                  style={{
                                    marginTop: hp('3%'),
                                  }}>
                                  <Text>Requested By</Text>
                                </View>
                                <View
                                  style={{
                                    borderWidth: 1,
                                    padding: 10,
                                    marginTop: hp('2%'),
                                    borderColor: '#C9CCD7',
                                    backgroundColor: '#EEEEEE',
                                  }}>
                                  <TextInput
                                    value={sectionData.requestedBy}
                                    editable={false}
                                  />
                                </View>
                                <View
                                  style={{
                                    borderWidth: 1,
                                    padding: 10,
                                    marginTop: hp('2%'),
                                    borderColor: '#C9CCD7',
                                    backgroundColor: '#EEEEEE',
                                  }}>
                                  <TextInput
                                    editable={false}
                                    value={finalDateData}
                                  />
                                </View>
                                <View
                                  style={{
                                    marginTop: hp('3%'),
                                  }}>
                                  <Text>Made By</Text>
                                </View>
                                <View
                                  style={{
                                    borderWidth: 1,
                                    padding: 10,
                                    marginTop: hp('2%'),
                                    borderColor: '#C9CCD7',
                                    backgroundColor: '#EEEEEE',
                                  }}>
                                  <TextInput
                                    value={sectionData.madeBy}
                                    editable={false}
                                  />
                                </View>
                                <View
                                  style={{
                                    borderWidth: 1,
                                    padding: 10,
                                    marginTop: hp('2%'),
                                    borderColor: '#C9CCD7',
                                    backgroundColor: '#EEEEEE',
                                  }}>
                                  <TextInput
                                    value={sectionData.madeBy}
                                    editable={false}
                                  />
                                </View>
                                <View
                                  style={{
                                    marginTop: hp('3%'),
                                  }}>
                                  <Text>Quantity</Text>
                                </View>
                                <View
                                  style={{
                                    borderWidth: 1,
                                    padding: 10,
                                    marginTop: hp('2%'),
                                    borderColor: '#C9CCD7',
                                  }}>
                                  <TextInput
                                    placeholder="Quantity"
                                    onChangeText={val =>
                                      this.setState({
                                        quantity: val,
                                      })
                                    }
                                    value={quantity}
                                  />
                                </View>
                                <View
                                  style={{
                                    borderWidth: 1,
                                    padding: 10,
                                    marginTop: hp('2%'),
                                    borderColor: '#C9CCD7',
                                    backgroundColor: '#EEEEEE',
                                  }}>
                                  <TextInput
                                    value={sectionData.unit}
                                    editable={false}
                                  />
                                </View>
                                <View
                                  style={{
                                    marginTop: hp('3%'),
                                  }}>
                                  <Text>Note</Text>
                                </View>
                                <View
                                  onPress={() => this.showDatePickerFun()}
                                  style={{
                                    borderWidth: 1,
                                    padding: 10,
                                    marginTop: hp('2%'),
                                    height: hp('20%'),
                                    borderColor: '#C9CCD7',
                                  }}>
                                  <TextInput
                                    placeholder="Note"
                                    onChangeText={value =>
                                      this.setState({
                                        notes: value,
                                      })
                                    }
                                    value={notes}
                                  />
                                </View>
                              </View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginTop: hp('3%'),
                                }}>
                                <TouchableOpacity
                                  onPress={() => this.updateRecipeDetailsFun()}
                                  style={{
                                    width: wp('30%'),
                                    height: hp('5%'),
                                    backgroundColor: '#94C036',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#fff',
                                      fontSize: 15,
                                      fontWeight: 'bold',
                                    }}>
                                    Save
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.setModalVisibleRecipeDetailsClose(
                                      false,
                                    )
                                  }
                                  style={{
                                    width: wp('30%'),
                                    height: hp('5%'),
                                    backgroundColor: '#E7943B',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#fff',
                                      fontSize: 15,
                                      fontWeight: 'bold',
                                    }}>
                                    Close
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </ScrollView>
                        )}
                      </View>
                    </Modal>
                  </View>
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            onPress={() => this.onPressCollapseFun()}
            style={{
              flexDirection: 'row',
              height: hp('6%'),
              width: wp('70%'),
              backgroundColor: '#94C036',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
              alignSelf: 'center',
            }}>
            <View style={{}}>
              <Text style={{color: 'white', marginLeft: 5}}>Collapse All</Text>
            </View>
          </TouchableOpacity>
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
          <View>
            <TouchableOpacity onPress={() => this.addNewManualLog()}>
              <Text>HI</Text>
            </TouchableOpacity>
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
