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
  getNewStockTakeApi,
  updateStockTakeApi,
  addStockTakeApi,
  getPreviousStockDatesApi,
} from '../../connectivity/api';
import {translate} from '../../utils/translations';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';

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
      token: '',
      firstName: '',
      previousDates: [],
      departmentId: null,
      isDatePickerVisible: false,
      finalDate: null,
      listloader: false,
      newStock: null,
      items: [],
      itemsStatus: false,
      isModalVisible: false,
      childrenList: null,
      showCategoryItems: false,
      collapse: 'Uncollapse All',
      pickedItem: {},
      units: [],
      showUnits: false,
      lines: [
        {
          action: 'New',
          convertor: 1,
          id: null,
          inventoryId: '',
          isDefault: true,
          quantity: '',
          recipeId: null,
          stockTakeDate: '2021-05-17T06:30:00.000Z',
          unit: 'ml',
          unitId: '',
        },
      ],
      inventory: '',
      newModalIsVisible: false,
      unitModalText: false,
      isModalVisibleLoader: false,
      unitText: 'Select Quantity',
      linesIndex: 0,
      editableStatus: true,
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

  componentDidMount() {
    this.getProfileDataFun();
    const departmentId =
      this.props.route.params && this.props.route.params.departmentData.id;
    console.log('ID', departmentId);
    this.setState(
      {
        departmentId,
      },
      () => this.getPreviousStockDatesFun(),
    );
  }

  getPreviousStockDatesFun = () => {
    const {departmentId} = this.state;
    getPreviousStockDatesApi(departmentId)
      .then(res => {
        this.setState({
          previousDates: res.data,
        });
      })
      .catch(err => {
        console.warn('ERr', err);
      });
  };

  myProfileFun = () => {
    this.props.navigation.navigate('MyProfile');
  };

  showDatePickerFun = () => {
    this.setState({
      isDatePickerVisible: true,
    });
  };

  handleConfirm = date => {
    let newdate = moment(date).format('MM/DD/YYYY');
    this.setState(
      {
        finalDate: newdate,
      },
      () => this.showNewStockTake(),
    );
    this.hideDatePicker();
  };
  hideDatePicker = () => {
    this.setState({
      isDatePickerVisible: false,
    });
  };

  showNewStockTake() {
    this.setState(
      {
        listloader: true,
      },
      () => this.getStockDataFun(),
    );
  }

  getStockDataFun = () => {
    const {departmentId, finalDate} = this.state;
    getNewStockTakeApi(departmentId, finalDate)
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

        let finalArray = Object.keys(groupedCategory).map((item, index) => {
          return {
            name: item,
            id: item,
            children: groupedCategory[item],
          };
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
        this.setState({
          items: newItems,
          childrenList: childrenList,
          listloader: false,
          itemsStatus: true,
        });
      })
      .catch(err => {
        console.warn('Err', err.response);
      });
  };

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
    const {collapse} = this.state;

    if (collapse === 'Collapse All') {
      this.setState(
        {
          listloader: true,
        },
        () =>
          setTimeout(() => {
            this.collapseListFun();
          }, 100),
      );
    } else {
      this.setState(
        {
          listloader: true,
        },
        () =>
          setTimeout(() => {
            this.unCollapseListFun();
          }, 200),
      );
    }
  }

  unCollapseListFun = () => {
    const {collapse, items, childrenList} = this.state;
    let newItems = [];
    items.map(item => {
      newItems.push({
        name: item.name,
        id: item.id,
        position: item.position,
        children: childrenList[item.position],
        showChildren: true,
      });
    });
    this.setState({
      items: newItems,
      collapse: 'Collapse All',
      listloader: false,
    });
  };

  collapseListFun = () => {
    const {collapse, items, childrenList} = this.state;
    let newItems = [];
    items.map(item => {
      newItems.push({
        name: item.name,
        id: item.id,
        position: item.position,
        children: [],
        showChildren: false,
      });
      this.setState({
        items: newItems,
        collapse: 'Uncollapse All',
        listloader: false,
      });
    });
  };

  openModalFun(item) {
    this.setState(
      {
        pickedItem: item,
        inventory: item.quantity && JSON.stringify(item.quantity),
        lines: item.updateStockTakeItems
          ? item.updateStockTakeItems
          : this.state.lines,
        editableStatus: item.updateStockTakeItems ? false : true,
      },
      () => this.openQuantityModalFun(),
    );
  }

  openQuantityModalFun = () => {
    this.setState({
      isModalVisible: true,
    });
  };

  openNewModalFun() {
    this.setState({newModalIsVisible: true});
  }

  closeNewModalFun() {
    this.setState({newModalIsVisible: false});
  }

  closeModalFun() {
    this.setState({
      isModalVisible: false,
      inventory: '',
    });
  }

  addLine() {
    // const {lines} = this.state;
    // let list = lines;
    // list.push({quantity: '', name: '', unit: '', inventory: '', index: 0});
    // this.setState({lines: list});

    const {inventory, lines} = this.state;

    // let err = lines.map((item) => {
    //   return item.quantity
    // })

    let obj = {
      action: 'New',
      convertor: 1,
      id: null,
      inventoryId: '',
      isDefault: true,
      quantity: inventory,
      recipeId: null,
      stockTakeDate: '2021-05-17T06:30:00.000Z',
      unit: '',
      unitId: '',
    };
    let arrayData = [];

    arrayData.push(obj);

    // const finalTotal = parseInt(orderTotal) + parseInt(price);

    this.setState({
      inventory: '',
      lines: [...lines, ...arrayData],
    });
  }

  setQuantity(text, item) {
    const {lines} = this.state;
    let newLine = {
      quantity: text,
      name: '',
      unit: '',
      inventory: text,
      index: 0,
    };
    this.setState({lines: newLine});
  }

  // showUnits() {
  //   const {showUnits, pickedItem} = this.state;
  //   let data = [];
  //   if (showUnits == false) {
  //     pickedItem.units.map(item => {
  //       data.push({label: item.name, value: item.name});
  //     });
  //   } else {
  //     null;
  //   }
  //   this.setState({units: data, showUnits: !showUnits});
  // }

  sortItemsByDate(index) {
    alert('date');
    // const {childrenList} = this.state;
    // let list = childrenList[index];
    // console.warn(list);
  }

  sortItemsAlpha(index) {
    alert('alfa');

    // let list = items[index].children;
    // let sortedList = null;
    // let newItems = [];

    // items.map(item => {
    //   if (item.sortedAlpha == true) {
    //     sortedList = list.reverse();
    //     if (item.position === index) {
    //       newItems.push({
    //         name: item.name,
    //         id: item.id,
    //         position: item.position,
    //         children: sortedList,
    //         showChildren: item.showChildren,
    //         sortedAlpha: false,
    //         sortedByDate: false,
    //       });
    //     } else {
    //       newItems.push(item);
    //     }
    //   } else {
    //     sortedList = list.sort();
    //     if (item.position === index) {
    //       newItems.push({
    //         name: item.name,
    //         id: item.id,
    //         position: item.position,
    //         children: sortedList,
    //         showChildren: item.showChildren,
    //         sortedAlpha: true,
    //         sortedByDate: false,
    //       });
    //     } else {
    //       newItems.push(item);
    //     }
    //   }
    // });
  }

  saveFun(data) {
    const {lines} = this.state;

    // let payload = [
    //   {
    //     action: 'New',
    //     convertor: 1,
    //     id: null,
    //     inventoryId: '7f4fb055-56ad-4949-9171-476c988d5c52',
    //     isDefault: true,
    //     quantity: 50,
    //     recipeId: null,
    //     stockTakeDate: '2021-05-17T06:30:00.000Z',
    //     unit: 'ltrs',
    //     unitId: 'd3452799-9d0f-4686-a0e1-cb5124e1f8e2',
    //   },
    // ];

    let payload = lines;

    console.warn('payload', payload);

    addStockTakeApi(payload)
      .then(res => {
        console.log('RES', res);
        this.setState({
          isModalVisible: false,
        });
        Alert.alert('Grainz', 'Stock trade added successfully', [
          {
            text: 'Okay',
            onPress: () => this.showNewStockTake(),
          },
        ]);

        // () => this.closeModalFun();
        // () => this.showNewStockTake(departmentId, finalDate);
      })
      .catch(error => console.warn('fek', error));
  }

  startFun = () => {
    alert('start');
  };

  endFun = () => {
    alert('End');
  };

  deleteQuantityFun = item => {
    Alert.alert('Are you sure?', "You won't be able to revert this!", [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => this.deleteFun(item),
      },
    ]);
  };

  deleteFun = item => {
    // alert('DELETE');

    let payload = [
      {
        action: 'Delete',
        convertor: 1,
        id: null,
        inventoryId: item.inventoryId,
        isDefault: true,
        quantity: 25,
        recipeId: null,
        stockTakeDate: item.stockTakeDate,
        stockTakeInventoryId: item.stockTakeInventoryId,
        stockTakeRecipeId: null,
        unit: item.unit,
        unitId: item.unitId,
      },
    ];

    console.log('PAYLOAD', payload);

    this.setState(
      {
        isModalVisibleLoader: true,
      },
      () =>
        addStockTakeApi(payload)
          .then(res => {
            this.setState({
              isModalVisibleLoader: false,
              isModalVisible: false,
              lines: [
                {
                  action: 'New',
                  convertor: 1,
                  id: null,
                  inventoryId: '',
                  isDefault: true,
                  quantity: '',
                  recipeId: null,
                  stockTakeDate: '2021-05-17T06:30:00.000Z',
                  unit: 'ml',
                  unitId: '',
                },
              ],
            });
            Alert.alert('Grainz', 'Stock trade deleted successfully', [
              {
                text: 'Okay',
                onPress: () => this.showNewStockTake(),
              },
            ]);
          })
          .catch(error => {
            this.setState({
              isModalVisibleLoader: false,
            });
            console.warn('DELETEerror', error.response);
          }),
    );
  };

  editQuantityFun = () => {
    alert('EDIT');
  };

  deleteLineQuantityFun = () => {
    alert('DELETE LINE');
  };

  editQuantityPriceFun = (index, type, value) => {
    console.log(index, type, value);

    const {lines} = this.state;

    let newArr = lines.map((item, i) =>
      index === i
        ? {
            ...item,
            [type]: parseInt(value),
          }
        : item,
    );
    this.setState({
      lines: [...newArr],
    });
    // console.log('yourOrderItems', yourOrderItems);
  };

  showSupplierList(index) {
    const {editableStatus} = this.state;
    if (editableStatus) {
      this.setState({
        unitModalText: !this.state.unitModalText,
        linesIndex: index,
      });
    }
  }

  selectSupplier(index, id, invId, unitName, item, date, uni) {
    console.log(index, id, invId, unitName, item);
    const {lines, linesIndex, pickedItem} = this.state;
    console.log(pickedItem);

    this.setState({
      unitText: unitName,
      unitModalText: false,
    });

    const unit = pickedItem.unit;
    const unitId = item.id;
    const inventoryId = item.inventoryId;
    const stockTakeDate = pickedItem.stockTakeLastUpdate;

    let newArr = lines.map((item, i) =>
      linesIndex === i
        ? {
            ...item,
            [invId]: inventoryId,
            [id]: unitId,
            // [date]: stockTakeDate,
            [uni]: unit,
          }
        : item,
    );
    this.setState({
      lines: [...newArr],
    });
    // this.setState({supplier: param, supplierId: id, supplieReference: ref});
  }

  render() {
    const {
      firstName,
      isDatePickerVisible,
      items,
      finalDate,
      showChildren,
      isModalVisible,
      collapse,
      pickedItem,
      units,
      lines,
      inventory,
      newModalIsVisible,
      htvaIsSelected,
      listloader,
      itemsStatus,
      unitModalText,
      isModalVisibleLoader,
      unitText,
      linesIndex,
      editableStatus,
    } = this.state;

    console.log('Lines', lines);

    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfileFun}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {/* <SubHeader /> */}
        <ScrollView style={{marginBottom: hp('5%')}}>
          <View>
            <View style={{alignItems: 'space-between', marginRight: wp('5%')}}>
              <TouchableOpacity
                onPress={() => this.openNewModalFun()}
                style={{
                  height: hp('5%'),
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
            <Modal isVisible={newModalIsVisible} backdropOpacity={0.35}>
              <View
                style={{
                  width: wp('80%'),
                  height: hp('60%'),
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
                      {translate('Stock take quantity')}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity onPress={() => this.closeNewModalFun()}>
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
                    <View style={{}}>
                      <View style={{marginBottom: 10}}>
                        <Text>
                          {translate(
                            'Stock take must be done at the start of the day or at the end of the day',
                          )}
                        </Text>
                      </View>

                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text>HTVA?</Text>
                        <CheckBox
                          value={htvaIsSelected}
                          onValueChange={() =>
                            this.setState({htvaIsSelected: !htvaIsSelected})
                          }
                          style={{
                            margin: 5,
                            height: 20,
                            width: 20,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          marginTop: hp('5%'),
                        }}>
                        <TouchableOpacity
                          onPress={() => this.startFun()}
                          style={{
                            height: hp('5%'),
                            alignSelf: 'flex-end',
                            backgroundColor: '#94C036',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: wp('2%'),
                          }}>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 15,
                              fontWeight: 'bold',
                            }}>
                            {translate('Start')}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => this.endFun()}
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
                            {translate('End')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </Modal>
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
                isVisible={isDatePickerVisible}
                mode={'date'}
                onConfirm={this.handleConfirm}
                onCancel={this.hideDatePicker}
                // maximumDate={tomorrow}
                minimumDate={new Date()}
              />
            </View>
            {listloader ? (
              <ActivityIndicator color="grey" size="large" />
            ) : (
              <View style={{}}>
                {itemsStatus ? (
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <TouchableOpacity
                      onPress={() => this.collapseAllFun()}
                      style={{
                        backgroundColor: '#E2E6EA',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: wp('90%'),
                        paddingVertical: hp('2%'),
                      }}>
                      <Text>{collapse}</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                {items.length > 0 ? (
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
                                paddingVertical: hp('1.8%'),
                                alignItems: 'center',
                                flexDirection: 'row',
                              }}>
                              {item.showChildren ? (
                                <View style={{flex: 1}}>
                                  <Image
                                    style={{
                                      height: 22,
                                      width: 22,
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
                                      resizeMode: 'contain',
                                    }}
                                    source={img.arrowRightIcon}
                                  />
                                </View>
                              )}
                              <View style={{flex: 7}}>
                                <Text style={{marginLeft: 2, color: '#646464'}}>
                                  {item.name}
                                </Text>
                              </View>
                              <View style={{flexDirection: 'row', flex: 2}}>
                                <Text
                                  style={{marginRight: 4, color: '#646464'}}>
                                  A - Z
                                </Text>
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
                                <Text
                                  style={{marginRight: 4, color: '#646464'}}>
                                  Date
                                </Text>
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
                              {/* <ScrollView> */}
                              <ScrollView
                                contentContainerStyle={{width: wp('200%')}}
                                horizontal
                                showsHorizontalScrollIndicator={false}>
                                <View style={{}}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      borderBottomColor: '#EAEAF0',
                                      borderBottomWidth: 2,
                                      padding: 8,
                                    }}>
                                    <View
                                      style={{
                                        padding: 2,
                                        marginLeft: 4,
                                        width: wp('60%'),
                                      }}>
                                      <Text style={{fontWeight: 'bold'}}>
                                        Name
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        padding: 2,
                                        marginLeft: 4,
                                        width: wp('40%'),
                                      }}>
                                      <Text style={{fontWeight: 'bold'}}>
                                        System says
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        padding: 2,
                                        marginLeft: wp('5%'),
                                        width: wp('40%'),
                                      }}>
                                      <Text style={{fontWeight: 'bold'}}>
                                        Stock Take
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        padding: 2,
                                        marginLeft: 4,
                                        width: wp('40%'),
                                      }}>
                                      <Text style={{fontWeight: 'bold'}}>
                                        Correction
                                      </Text>
                                    </View>
                                  </View>

                                  {item.children.map(ele => {
                                    return (
                                      <View
                                        style={{
                                          borderBottomColor: '#EAEAF0',
                                          borderBottomWidth: 2,
                                          padding: 8,
                                          flexDirection: 'row',
                                          alignItems: 'flex-start',
                                          // flex: 20,
                                          // justifyContent: 'center'
                                        }}>
                                        <View
                                          style={{
                                            margin: 5,
                                            paddingHorizontal: wp('3%'),
                                            width: wp('60%'),
                                            // width: wp('35%'),
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
                                            margin: 5,
                                            // width: wp('25%'),
                                            // paddingLeft: 50,
                                            flexDirection: 'row',
                                            paddingHorizontal: wp('3%'),
                                            width: wp('40%'),
                                          }}>
                                          <Text>{ele.systemSays} </Text>
                                          <Text>{ele.unit}</Text>
                                          {/* {ele.systemSays ? (
                                              <Text>{ele.units[0].name}</Text>
                                            ) : null} */}
                                        </View>
                                        <View
                                          style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            // margin: 5,
                                            // width: wp('20%'),
                                            // flex: 2,
                                            // paddingLeft: 50,
                                            paddingHorizontal: wp('3%'),
                                            flexDirection: 'row',
                                          }}>
                                          <TouchableOpacity
                                            onPress={() =>
                                              this.openModalFun(ele)
                                            }
                                            style={{
                                              backgroundColor: '#FFFF00',
                                              height: hp('4%'),
                                              width: wp('20%'),
                                              alignItems: 'center',
                                              // width: wp('15%'),
                                              justifyContent: 'center',
                                              // alignItems: 'center',
                                              margin: 5,
                                            }}>
                                            <Text>{ele.quantity}</Text>
                                          </TouchableOpacity>
                                          <View
                                            style={{
                                              margin: 5,
                                              width: wp('10%'),
                                              paddingLeft: 2,
                                              paddingHorizontal: wp('3%'),
                                            }}>
                                            <Text>{ele.unit}</Text>
                                          </View>
                                        </View>

                                        <View
                                          style={{
                                            margin: 6,
                                            // width: '20%',
                                            // paddingLeft: 50,
                                            width: wp('40%'),
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                          }}>
                                          <Text>{ele.correction}</Text>
                                          <Text style={{marginLeft: 5}}>
                                            {ele.unit}
                                          </Text>
                                        </View>
                                      </View>
                                    );
                                  })}
                                </View>
                              </ScrollView>
                              {/* </ScrollView> */}
                            </View>
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: hp('5%'),
                    }}>
                    {itemsStatus ? (
                      <Text style={{fontSize: 16, color: 'red'}}>
                        Sorry no record available for stock take!
                      </Text>
                    ) : null}
                  </View>
                )}
              </View>
            )}
          </View>
          <View>
            <Modal isVisible={isModalVisible} backdropOpacity={0.35}>
              <View
                style={{
                  width: wp('95%'),
                  backgroundColor: '#fff',
                  alignSelf: 'center',
                  height: hp('60%'),
                }}>
                <View
                  style={{
                    backgroundColor: '#412916',
                    height: hp('8%'),
                    flexDirection: 'row',
                    alignItems: 'center',
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
                    <TouchableOpacity onPress={() => this.closeModalFun()}>
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
                  <View>
                    <ScrollView
                      horizontal
                      contentContainerStyle={{width: wp('200%')}}>
                      {isModalVisibleLoader ? (
                        <ActivityIndicator color="grey" size="large" />
                      ) : (
                        <View style={{}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              borderBottomColor: '#C9CCD7',
                              borderBottomWidth: 2,
                              paddingVertical: hp('3%'),
                              marginLeft: wp('5%'),
                            }}>
                            <View
                              style={{
                                width: wp('35%'),
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                }}>
                                Quantity
                              </Text>
                            </View>
                            <View
                              style={{
                                width: wp('30%'),
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                }}>
                                Unit
                              </Text>
                            </View>
                            <View
                              style={{
                                width: wp('30%'),
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                }}>
                                Inventory
                              </Text>
                            </View>
                            <View
                              style={{
                                width: wp('30%'),
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                }}>
                                Name
                              </Text>
                            </View>
                            <View
                              style={{
                                width: wp('30%'),
                                alignItems: 'center',
                                marginLeft: wp('20%'),
                              }}>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                }}>
                                Action
                              </Text>
                            </View>
                          </View>

                          {lines.map((item, index) => {
                            return (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  borderBottomColor: '#C9CCD7',
                                  borderBottomWidth: 1,
                                  marginLeft: wp('5%'),
                                }}>
                                <View
                                  style={{
                                    width: wp('35%'),
                                    alignItems: 'center',
                                    marginVertical: '2%',
                                  }}>
                                  {editableStatus ? (
                                    <TextInput
                                      editable={editableStatus}
                                      style={{
                                        paddingVertical: 10,
                                        borderColor: 'red',
                                        borderWidth: 1,
                                        width: wp('20%'),
                                        paddingLeft: 10,
                                      }}
                                      multiline={true}
                                      numberOfLines={1}
                                      onChangeText={value => {
                                        this.editQuantityPriceFun(
                                          index,
                                          'quantity',
                                          value,
                                        );
                                      }}
                                      // onChangeText={text =>
                                      //   this.setState({inventory: text})
                                      // }
                                      value={item.quantity}
                                    />
                                  ) : (
                                    <Text
                                      style={{
                                        paddingVertical: 10,
                                        borderColor: 'red',
                                        borderWidth: 1,
                                        width: wp('20%'),
                                        paddingLeft: 10,
                                      }}>
                                      {item.quantity}
                                    </Text>
                                  )}
                                </View>
                                <View
                                  style={{
                                    width: wp('30%'),
                                    alignItems: 'center',
                                  }}>
                                  <TouchableOpacity
                                    onPress={() => this.showSupplierList(index)}
                                    style={{
                                      borderWidth: 1,
                                      padding: 5,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                    }}>
                                    <Text>{unitText}</Text>
                                    <Image
                                      source={img.arrowDownIcon}
                                      style={{
                                        width: 20,
                                        height: 20,
                                        resizeMode: 'contain',
                                      }}
                                    />
                                  </TouchableOpacity>
                                </View>

                                {/* <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}>
                                <TouchableOpacity
                                  style={{flexDirection: 'row'}}>
                                  <Text>{item.unit}</Text> */}
                                {/* <Image
                                source={img.arrowDownIcon}
                                style={{
                                  height: 22,
                                  width: 22,
                                  tintColor: 'grey',
                                  resizeMode: 'contain',
                                }}
                              /> */}
                                {/* </TouchableOpacity> */}
                                {/* {units.map(ele => {
                              return (
                                <View>
                                  <Text>{ele.label}</Text>
                                </View>
                              );
                            })} */}
                                {/* </View> */}
                                <View
                                  style={{
                                    width: wp('30%'),
                                    alignItems: 'center',
                                  }}>
                                  <Text>{item.quantity} Unit</Text>
                                </View>
                                <View
                                  style={{
                                    width: wp('30%'),
                                    alignItems: 'center',
                                  }}>
                                  <Text style={{textAlign: 'center'}}>
                                    Nick balfour
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      width: wp('30%'),
                                      alignItems: 'center',
                                    }}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.editQuantityFun(pickedItem)
                                      }
                                      style={{
                                        paddingVertical: 5,
                                        width: wp('20%'),
                                        backgroundColor: '#94C01F',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 6,
                                        borderRadius: 2,
                                        flexDirection: 'row',
                                      }}>
                                      <Image
                                        source={img.editIcon}
                                        style={{
                                          tintColor: 'white',
                                          height: 16,
                                          width: 16,
                                          resizeMode: 'contain',
                                          marginRight: 5,
                                        }}
                                      />
                                      <Text style={{color: 'white'}}>Edit</Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View
                                    style={{
                                      width: wp('30%'),
                                      alignItems: 'center',
                                    }}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.deleteQuantityFun(item)
                                      }
                                      style={{
                                        paddingVertical: 5,
                                        width: wp('20%'),
                                        backgroundColor: 'red',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 6,
                                        borderRadius: 2,
                                        flexDirection: 'row',
                                      }}>
                                      <Image
                                        source={img.cancelIcon}
                                        style={{
                                          tintColor: 'white',
                                          height: 16,
                                          width: 16,
                                          resizeMode: 'contain',
                                          marginRight: 5,
                                        }}
                                      />
                                      <Text style={{color: 'white'}}>
                                        Delete
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      )}
                    </ScrollView>
                    {unitModalText ? (
                      <View
                        style={{
                          width: wp('85%'),
                          alignItems: 'center',
                          borderWidth: 0.5,
                          marginTop: hp('2%'),
                        }}>
                        {pickedItem &&
                          pickedItem.units.map((item, index) => {
                            return (
                              <View
                                style={{
                                  marginVertical: 5,
                                  borderBottomWidth: 1,
                                }}>
                                <Pressable
                                  onPress={() =>
                                    this.selectSupplier(
                                      index,
                                      'unitId',
                                      'inventoryId',
                                      item.name,
                                      item,
                                      'stockTakeDate',
                                      'unit',
                                    )
                                  }>
                                  <Text>{item.name}</Text>
                                  {/* <Text>{unitText}</Text> */}
                                </Pressable>
                              </View>
                            );
                          })}
                      </View>
                    ) : null}
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomColor: '#C9CCD7',
                        borderBottomWidth: 1,
                        padding: '2%',
                        height: hp('8%'),
                      }}>
                      <TouchableOpacity
                        onPress={() => this.addLine()}
                        style={{
                          paddingVertical: 5,
                          width: wp('90%'),
                          backgroundColor: '#94C01F',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 2,
                        }}>
                        <Text style={{color: 'white'}}>Add new line</Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2%',
                        height: hp('8%'),
                      }}>
                      <View style={{margin: '2%'}}>
                        <TouchableOpacity
                          onPress={() => this.saveFun(pickedItem)}
                          style={{
                            paddingVertical: 5,
                            width: wp('41%'),
                            backgroundColor: '#94C01F',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 6,
                            borderRadius: 2,
                            flexDirection: 'row',
                          }}>
                          <Image
                            source={img.checkIcon}
                            style={{
                              tintColor: 'white',
                              height: 16,
                              width: 16,
                              resizeMode: 'contain',
                              marginRight: 5,
                            }}
                          />
                          <Text style={{color: 'white'}}>Save</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{margin: '2%'}}>
                        <TouchableOpacity
                          onPress={() => this.closeModalFun()}
                          style={{
                            paddingVertical: 5,
                            width: wp('41%'),
                            backgroundColor: '#E6940B',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 6,
                            borderRadius: 2,
                            flexDirection: 'row',
                          }}>
                          <Image
                            source={img.cancelIcon}
                            style={{
                              tintColor: 'white',
                              height: 16,
                              width: 16,
                              resizeMode: 'contain',
                              marginRight: 5,
                            }}
                          />
                          <Text style={{color: 'white'}}>Close</Text>
                        </TouchableOpacity>
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
