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
  getManualLogList,
  deleteManualLog,
  getManualLogsById,
  updateManualLogApi,
  getManualLogTypes,
  getManualLogItemList,
  addManualLogApi,
} from '../../connectivity/api';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import DropDownPicker from 'react-native-dropdown-picker';
import {translate} from '../../utils/translations';
import styles from './style';
import {ARRAY} from '../../constants/dummy';

var minTime = new Date();
minTime.setHours(0);
minTime.setMinutes(0);
minTime.setMilliseconds(0);

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      itemsTypesArr: [],
      productionDate: '',
      detailsLoader: false,
      quantity: '',
      notes: '',
      recipeID: '',
      selectedItems: [],
      items: [],
      departmentName: '',
      itemTypes: '',
      loading: false,
      selectedItemObjects: '',
      viewStatus: false,
      buttonsSubHeader: [],
      collapseStatus: true,
    };
  }

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  setModalVisibleAdd = visible => {
    this.setState({
      modalVisibleAdd: visible,
      quantity: '',
      productionDate: '',
      selectedItems: [],
      notes: '',
      itemTypes: '',
      items: [],
    });
  };

  setModalVisibleRecipeDetails = (visible, data) => {
    this.setState(
      {
        modalVisibleRecipeDetails: visible,
        detailsLoader: true,
      },
      () =>
        getManualLogsById(data.id)
          .then(res => {
            this.setState({
              modalVisibleRecipeDetails: visible,
              sectionData: res.data,
              detailsLoader: false,
              quantity: JSON.stringify(res.data && res.data.quantity),
              notes: res.data && res.data.notes,
              viewStatus: false,
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
      quantity: '',
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
    getManualLogList()
      .then(res => {
        function extract() {
          var groups = {};

          res.data.forEach(function (val) {
            var date = val.loggedDate.split('T')[0];
            if (date in groups) {
              groups[date].push(val);
            } else {
              groups[date] = new Array(val);
            }
          });

          return groups;
        }

        let final = extract();

        let finalArray = Object.keys(final).map((item, index) => {
          return {
            title: item,
            content: final[item],
          };
        });

        const result = finalArray.reduce((temp, value) => {
          if (temp.length < 5) temp.push(value);
          return temp;
        }, []);

        this.setState({
          SECTIONS: [...result],
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
  }

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  addNewFun = item => {
    this.setModalVisibleAdd(true);
    this.setState({
      preparedDate: '',
      finalDate: '',
      itemsTypesArr: [],
    });
  };

  onPressCollapseFun = () => {
    this.setState({
      activeSections: [],
      collapseStatus: true,
    });
  };

  onPressUnCollapseFun = () => {
    this.setState({
      activeSections: ARRAY,
      collapseStatus: false,
    });
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
            fontSize: 15,
            marginLeft: wp('2%'),
            fontFamily: 'Inter-Regular',
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{backgroundColor: '#fff'}}>
          {section.content.map((item, index) => {
            let finaUnitVal =
              item &&
              item.units.map((subItem, subIndex) => {
                if (subItem.isDefault === true) {
                  return subItem.name;
                }
              });
            const filteredUnit = finaUnitVal.filter(elm => elm);
            return (
              <View style={{paddingHorizontal: 10}} key={index}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Switch
                    style={{}}
                    trackColor={{
                      false: '#767577',
                      true: '#94C036',
                    }}
                    value={!item.reviewed}
                    onValueChange={() => this.updateReviewedStatusFun(item)}
                    thumbColor="#fff"
                  />
                  <View style={{marginLeft: wp('2%'), width: wp('20%')}}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setModalVisibleRecipeDetails(true, item)
                      }>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{alignItems: 'center', width: wp('20%')}}>
                    <Text
                      style={{
                        fontSize: 14,
                      }}>
                      {item.itemTypeName}
                    </Text>
                  </View>
                  <View style={{alignItems: 'center', width: wp('20%')}}>
                    <Text
                      style={{
                        fontSize: 14,
                      }}>
                      {item.quantity} {filteredUnit[0]}
                    </Text>
                  </View>
                  <View style={{alignItems: 'center', width: wp('20%')}}>
                    <Text
                      style={{
                        fontSize: 14,
                      }}>
                      {item.typeName}
                    </Text>
                  </View>
                  <View style={{alignItems: 'center', width: wp('20%')}}>
                    <Text
                      style={{
                        fontSize: 14,
                      }}>
                      {item.userFullName}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      width: wp('20%'),
                      marginLeft: wp('2%'),
                    }}>
                    <TouchableOpacity
                      onPress={() => this.deleteMepFun(item)}
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
                        style={{
                          fontSize: 14,
                          color: '#fff',
                          textAlign: 'center',
                        }}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      marginLeft: wp('20%'),
                      fontWeight: 'bold',
                      fontSize: 16,
                      color: 'grey',
                    }}>
                    {item.notes}
                  </Text>
                </View>
              </View>
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

  updateRecipeDetailsFun = () => {
    const {sectionData, quantity, notes, itemTypes, selectedItemObjects} =
      this.state;
    let payload = {
      id: sectionData.id,
      itemId: sectionData.itemId,
      name: selectedItemObjects[0].name,
      loggedDate: sectionData.loggedDate,
      quantity: parseInt(quantity),
      itemTypeId: sectionData.itemTypeId,
      typeId: itemTypes.value,
      departmentId: selectedItemObjects[0].departmentId,
      unitId: sectionData.unitId,
      departmentName: selectedItemObjects[0].departmentName,
      category: selectedItemObjects[0].category,
      itemTypeName: sectionData.itemTypeName,
      typeName: itemTypes.label,
      reviewed: sectionData.reviewed,
      unit: sectionData.unit,
      userId: sectionData.userId,
      userFullName: sectionData.userFullName,
      units: [
        {
          id: sectionData.units[0].id,
          inventoryId: sectionData.units[0].inventoryId,
          name: sectionData.units[0].name,
          isDefault: true,
          isVariable: false,
          quantity: null,
          converter: 1,
          notes: null,
          action: null,
        },
      ],
      notes: notes,
      inUse: sectionData.inUse,
      countInInventory: sectionData.countInInventory,
    };
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

  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems});
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

  getRecipesTypesData = () => {
    getManualLogTypes()
      .then(res => {
        const {data} = res;
        let newData = [];
        data.map(item => {
          const obj = {};
          obj.label = item.name;
          obj.value = item.id;
          newData = [...newData, obj];
        });
        this.setState({
          itemsTypesArr: newData,
        });
      })
      .catch(err => {
        console.warn('Err', err);
      });
  };

  getItemListData = () => {
    const {departmentName} = this.state;
    getManualLogItemList()
      .then(res => {
        const {data} = res;
        let firstArr = data.filter(item => {
          return item.departmentName === departmentName;
        });

        function groupByKey(array, key) {
          return array.reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, {
              [obj[key]]: (hash[obj[key]] || []).concat(obj),
            });
          }, {});
        }

        let groupedCategory = groupByKey(firstArr, 'category');

        let finalArray = Object.keys(groupedCategory).map((item, index) => {
          return {
            name: item,
            id: item,
            children: groupedCategory[item],
          };
        });

        this.setState({
          items: [...finalArray],
          loading: false,
        });
      })
      .catch(err => {
        console.warn('Err', err.response);
      });
  };

  handleConfirm = date => {
    let newdate = moment(date).format('L');
    this.setState({
      finalDate: newdate,
      productionDate: date,
    });

    this.hideDatePicker();
  };

  showDatePickerFun = () => {
    this.setState({
      isDatePickerVisible: true,
    });
  };

  addManualLogFun = () => {
    const {
      productionDate,
      departmentName,
      selectedItemObjects,
      notes,
      quantity,
      itemTypes,
    } = this.state;

    if (productionDate === '' || quantity == '' || departmentName === '') {
      alert('Please select correct options');
    } else {
      let payload = {
        category: selectedItemObjects[0].category,
        countInInventory: false,
        departmentId: selectedItemObjects[0].departmentId,
        departmentName: selectedItemObjects[0].departmentName,
        id: selectedItemObjects[0].id,
        inUse: true,
        itemId: selectedItemObjects[0].itemId,
        itemTypeId: selectedItemObjects[0].itemTypeId,
        itemTypeName: selectedItemObjects[0].itemTypeName,
        loggedDate: productionDate,
        name: selectedItemObjects[0].name,
        notes: notes,
        quantity: parseInt(quantity),
        reviewed: false,
        subCategory: null,
        typeId: itemTypes.value,
        typeName: itemTypes.label,
        unit: '',
        unitId: selectedItemObjects[0].units[0].id,
        units: selectedItemObjects[0].units,
        userFullName: null,
        userId: '8e194fe1-5cac-439e-a036-c2009bfb455a',
      };
      addManualLogApi(payload)
        .then(res => {
          this.setState(
            {
              modalVisibleAdd: false,
              items: [],
            },
            () => this.getManualLogsData(),
          );
        })
        .catch(err => {
          console.warn('ERR', err.response);
        });
    }
  };

  selectDepartementNameFun = item => {
    this.setState(
      {
        departmentName: item.value,
        loading: true,
        viewStatus: true,
      },
      () => this.getManualData(),
    );
  };

  getManualData = () => {
    this.getRecipesTypesData();
    this.getItemListData();
  };

  onSelectedItemObjectsChange = selectedItemObjects => {
    this.setState({selectedItemObjects});
  };

  render() {
    const {
      modalVisibleAdd,
      recipeLoader,
      SECTIONS,
      activeSections,
      firstName,
      modalVisibleRecipeDetails,
      sectionData,
      isDatePickerVisible,
      finalDate,
      itemsTypesArr,
      detailsLoader,
      quantity,
      notes,
      items,
      viewStatus,
      buttonsSubHeader,
      collapseStatus,
    } = this.state;
    const finalDateData = moment(sectionData.loggedDate).format(
      'dddd, MMM DD YYYY',
    );
    return (
      <View style={styles.container}>
        <Header
          logout={firstName}
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {/* {recipeLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )} */}
        <ScrollView
          style={{marginBottom: hp('2%')}}
          showsVerticalScrollIndicator={false}>
          <View>
            <View style={styles.subContainer}>
              <View style={styles.firstContainer}>
                <View style={{flex: 1}}>
                  <Text style={styles.adminTextStyle}>
                    {translate('Manual Log small')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={styles.goBackContainer}>
                  <Text style={styles.goBackTextStyle}>
                    {translate('Go Back')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{}}>
              <View>
                {/* // Add Manual Modal */}
                <Modal isVisible={modalVisibleAdd} backdropOpacity={0.35}>
                  <View
                    style={{
                      width: wp('80%'),
                      height: hp('70%'),
                      backgroundColor: '#F0F4FF',
                      alignSelf: 'center',
                      borderRadius: 6,
                    }}>
                    <View
                      style={{
                        backgroundColor: '#7EA52D',
                        height: hp('6%'),
                        flexDirection: 'row',
                        borderTopLeftRadius: 6,
                        borderTopRightRadius: 6,
                      }}>
                      <View
                        style={{
                          flex: 3,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#fff',
                            fontFamily: 'Inter-Regular',
                          }}>
                          {translate('Manual Log small')} -{' '}
                          {translate('Add new item')}
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
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View style={{padding: hp('3%')}}>
                        <View style={{}}>
                          <TouchableOpacity
                            onPress={() => this.showDatePickerFun()}
                            style={{
                              padding: 12,
                              marginBottom: hp('3%'),
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              borderRadius: 6,
                              backgroundColor: '#fff',
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

                          <View>
                            <DropDownPicker
                              items={[
                                {
                                  label: 'Bar',
                                  value: 'Bar',
                                },
                                {
                                  label: 'Restaurant',
                                  value: 'Restaurant',
                                },
                                {
                                  label: 'Retail',
                                  value: 'Retail',
                                },
                                {
                                  label: 'Other',
                                  value: 'Other',
                                },
                              ]}
                              zIndex={1000000}
                              containerStyle={{
                                height: 50,
                                marginBottom: hp('3%'),
                              }}
                              style={{
                                backgroundColor: '#fff',
                                borderColor: '#fff',
                              }}
                              itemStyle={{
                                justifyContent: 'flex-start',
                              }}
                              dropDownStyle={{backgroundColor: '#fff'}}
                              onChangeItem={item =>
                                this.selectDepartementNameFun(item)
                              }
                            />
                            <SectionedMultiSelect
                              styles={{
                                container: {
                                  paddingTop: hp('2%'),
                                  marginTop: hp('7%'),
                                },
                                selectToggle: {
                                  paddingVertical: 10,
                                  paddingHorizontal: 10,
                                  backgroundColor: '#fff',
                                  borderRadius: 6,
                                },
                              }}
                              loadingComponent={
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <ActivityIndicator
                                    size="large"
                                    color="#94C036"
                                  />
                                </View>
                              }
                              loading={this.state.loading}
                              // hideSearch={true}
                              single={true}
                              items={items}
                              IconRenderer={Icon}
                              uniqueKey="id"
                              subKey="children"
                              selectText="Select"
                              showDropDowns={true}
                              readOnlyHeadings={true}
                              onSelectedItemObjectsChange={
                                this.onSelectedItemObjectsChange
                              }
                              onSelectedItemsChange={this.onSelectedItemsChange}
                              selectedItems={this.state.selectedItems}
                            />
                            <DropDownPicker
                              items={itemsTypesArr}
                              containerStyle={{
                                height: 50,
                                marginTop: hp('3%'),
                              }}
                              style={{
                                backgroundColor: '#fff',
                                borderColor: '#fff',
                              }}
                              itemStyle={{
                                justifyContent: 'flex-start',
                              }}
                              dropDownStyle={{backgroundColor: '#fff'}}
                              onChangeItem={item =>
                                this.setState({
                                  itemTypes: item,
                                })
                              }
                            />

                            <View
                              style={{
                                marginTop: hp('3%'),
                              }}>
                              <TextInput
                                placeholder="quantity"
                                value={quantity}
                                style={{
                                  padding: 12,
                                  justifyContent: 'space-between',
                                  borderRadius: 6,
                                  backgroundColor: '#fff',
                                }}
                                keyboardType="number-pad"
                                onChangeText={value => {
                                  this.setState({
                                    quantity: value,
                                  });
                                }}
                              />
                            </View>

                            <View
                              style={{
                                padding: 15,
                                marginTop: hp('3%'),
                                backgroundColor: '#fff',
                                borderRadius: 6,
                              }}>
                              <TextInput
                                placeholder={translate('Note')}
                                onChangeText={value =>
                                  this.setState({
                                    notes: value,
                                  })
                                }
                                value={notes}
                              />
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: hp('5%'),
                              }}>
                              <TouchableOpacity
                                onPress={() => this.addManualLogFun()}
                                style={{
                                  width: wp('30%'),
                                  height: hp('5%'),
                                  alignSelf: 'flex-end',
                                  backgroundColor: '#94C036',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: 100,
                                }}>
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                  }}>
                                  {translate('Save')}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => this.setModalVisibleAdd(false)}
                                style={{
                                  width: wp('30%'),
                                  height: hp('5%'),
                                  alignSelf: 'flex-end',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginLeft: wp('2%'),
                                  borderRadius: 100,
                                  borderColor: '#482813',
                                  borderWidth: 1,
                                }}>
                                <Text
                                  style={{
                                    color: '#482813',
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                  }}>
                                  {translate('Cancel')}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>

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
                      </View>
                    </ScrollView>
                  </View>
                </Modal>

                <Modal
                  isVisible={modalVisibleRecipeDetails}
                  backdropOpacity={0.35}>
                  <View
                    style={{
                      width: wp('80%'),
                      height: hp('70%'),
                      backgroundColor: '#F0F4FF',
                      alignSelf: 'center',
                      borderRadius: 6,
                    }}>
                    <View
                      style={{
                        backgroundColor: '#7EA52D',
                        height: hp('6%'),
                        flexDirection: 'row',
                        borderTopLeftRadius: 6,
                        borderTopRightRadius: 6,
                      }}>
                      <View
                        style={{
                          flex: 3,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#fff',
                            fontFamily: 'Inter-Regular',
                          }}>
                          Manual log - {sectionData.name}
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
                      <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{padding: hp('3%')}}>
                          <View style={{}}>
                            <TouchableOpacity
                              onPress={() => this.showDatePickerFun()}
                              style={{
                                padding: 12,
                                marginBottom: hp('3%'),
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                borderRadius: 6,
                                backgroundColor: '#fff',
                              }}>
                              <TextInput
                                placeholder="dd-mm-yy"
                                value={finalDateData}
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

                            <TextInput
                              placeholder="quantity"
                              value={quantity}
                              style={{
                                padding: 12,
                                marginBottom: hp('3%'),
                                justifyContent: 'space-between',
                                borderRadius: 6,
                                backgroundColor: '#fff',
                              }}
                              keyboardType="number-pad"
                              onChangeText={value => {
                                this.setState({
                                  quantity: value,
                                });
                              }}
                            />

                            <View>
                              <DropDownPicker
                                items={[
                                  {
                                    label: 'Bar',
                                    value: 'Bar',
                                  },
                                  {
                                    label: 'Restaurant',
                                    value: 'Restaurant',
                                  },
                                  {
                                    label: 'Retail',
                                    value: 'Retail',
                                  },
                                  {
                                    label: 'Other',
                                    value: 'Other',
                                  },
                                ]}
                                zIndex={1000000}
                                containerStyle={{
                                  height: 50,
                                  marginBottom: hp('3%'),
                                }}
                                style={{
                                  backgroundColor: '#fff',
                                  borderColor: '#fff',
                                }}
                                itemStyle={{
                                  justifyContent: 'flex-start',
                                }}
                                dropDownStyle={{backgroundColor: '#fff'}}
                                onChangeItem={item =>
                                  this.selectDepartementNameFun(item)
                                }
                              />

                              {viewStatus ? (
                                <SectionedMultiSelect
                                  styles={{
                                    container: {
                                      paddingTop: hp('2%'),
                                      marginTop: hp('7%'),
                                    },
                                    selectToggle: {
                                      paddingVertical: 10,
                                      paddingHorizontal: 10,
                                      backgroundColor: '#fff',
                                      borderRadius: 6,
                                    },
                                  }}
                                  loadingComponent={
                                    <View
                                      style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <ActivityIndicator
                                        size="large"
                                        color="#94C036"
                                      />
                                    </View>
                                  }
                                  loading={this.state.loading}
                                  // hideSearch={true}
                                  single={true}
                                  items={items}
                                  IconRenderer={Icon}
                                  uniqueKey="id"
                                  subKey="children"
                                  selectText="Select"
                                  showDropDowns={true}
                                  readOnlyHeadings={true}
                                  onSelectedItemObjectsChange={
                                    this.onSelectedItemObjectsChange
                                  }
                                  onSelectedItemsChange={
                                    this.onSelectedItemsChange
                                  }
                                  selectedItems={this.state.selectedItems}
                                />
                              ) : (
                                <View>
                                  <Text
                                    style={{
                                      padding: 12,
                                      marginBottom: hp('3%'),
                                      justifyContent: 'space-between',
                                      backgroundColor: '#fff',
                                    }}>
                                    {sectionData.name}
                                  </Text>
                                </View>
                              )}
                              {viewStatus ? (
                                <DropDownPicker
                                  items={itemsTypesArr}
                                  containerStyle={{
                                    height: 50,
                                    marginTop: hp('3%'),
                                  }}
                                  defaultValue={this.state.itemTypes}
                                  style={{
                                    backgroundColor: '#fff',
                                    borderColor: '#fff',
                                  }}
                                  itemStyle={{
                                    justifyContent: 'flex-start',
                                  }}
                                  dropDownStyle={{backgroundColor: '#fff'}}
                                  onChangeItem={item =>
                                    this.setState({
                                      itemTypes: item,
                                    })
                                  }
                                />
                              ) : (
                                <View>
                                  <Text
                                    style={{
                                      padding: 12,
                                      marginBottom: hp('3%'),
                                      justifyContent: 'space-between',
                                      backgroundColor: '#fff',
                                    }}>
                                    {sectionData.typeName}
                                  </Text>
                                </View>
                              )}
                              <View
                                style={{
                                  padding: 15,
                                  backgroundColor: '#fff',
                                  borderRadius: 6,
                                  marginTop: viewStatus ? hp('3%') : null,
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
                              <View
                                style={{
                                  alignItems: 'center',
                                  marginTop: hp('4%'),
                                }}>
                                <TouchableOpacity
                                  onPress={() => this.deleteMepFun(sectionData)}
                                  style={{
                                    backgroundColor: 'red',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: wp('30%'),
                                    height: hp('5%'),
                                    justifyContent: 'center',
                                    borderRadius: 100,
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
                                    style={{
                                      fontSize: 14,
                                      color: '#fff',
                                      textAlign: 'center',
                                    }}>
                                    {translate('Delete')}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginTop: hp('4%'),
                                }}>
                                <TouchableOpacity
                                  onPress={() => this.updateRecipeDetailsFun()}
                                  style={{
                                    width: wp('30%'),
                                    height: hp('5%'),
                                    alignSelf: 'flex-end',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 100,
                                    borderColor: '#482813',
                                    backgroundColor: '#97C03D',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#fff',
                                      fontSize: 15,
                                      fontFamily: 'Inter-Regular',
                                    }}>
                                    {translate('Save')}
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
                                    alignSelf: 'flex-end',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: wp('2%'),
                                    borderColor: '#482813',
                                    borderWidth: 1,
                                    borderRadius: 100,
                                  }}>
                                  <Text
                                    style={{
                                      color: '#482813',
                                      fontSize: 15,
                                      fontWeight: 'bold',
                                    }}>
                                    {translate('Close')}
                                  </Text>
                                </TouchableOpacity>
                              </View>
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
                    )}
                  </View>
                </Modal>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => this.addNewFun()}
            style={{
              height: hp('6%'),
              width: wp('80%'),
              backgroundColor: '#94C036',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: hp('2%'),
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
                {translate('Add new')}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.subContainer}>
            <View style={styles.firstContainer}>
              {collapseStatus ? (
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={() => this.onPressUnCollapseFun()}>
                  <Text style={styles.adminTextStyle}>
                    {translate('Uncollapse All')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={() => this.onPressCollapseFun()}>
                  <Text style={styles.adminTextStyle}>
                    {translate('Collapse All')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {recipeLoader ? (
            <ActivityIndicator color="#94C036" size="large" />
          ) : (
            <View style={{marginHorizontal: wp('5%')}}>
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

export default connect(mapStateToProps, {UserTokenAction})(index);
