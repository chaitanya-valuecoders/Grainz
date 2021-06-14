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
import {
  getMyProfileApi,
  getSupplierListAdminApi,
  getCurrentLocUsersAdminApi,
  clonePreviousApi,
  inventoryListAdminApi,
  supplierAdminApi,
  unMapProductApi,
} from '../../../../connectivity/api';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {translate} from '../../../../utils/translations';

class OrderingSec extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {name: translate('Clone previous'), id: 0},
        {name: translate('Back'), id: 1},
        {name: translate('Save'), id: 2},
        {name: translate('Send'), id: 3},
      ],
      token: '',
      modalVisible: false,
      firstName: '',
      recipeLoader: false,
      pageLoading: false,
      selectedItemObjects: '',
      buttonsSubHeader: [],
      supplierValue: '',
      finalOrderDate: '',
      isDatePickerVisibleOrderDate: false,
      finalDeliveryDate: '',
      placedByValue: '',
      supplierList: [],
      usersList: [],
      clonePreviouseModalStatus: false,
      cloneLoader: false,
      cloneOrderData: [],
      inventoryModalStatus: false,
      supplierModalStatus: false,
      supplierData: [],
      activeSectionsInventory: [],
      SECTIONS_INVENTORY: [],
      modalLoaderInventory: false,
      finalName: [],
      sectionName: [],
      modalVisibleInventory: false,
      FINAL_ACC: [],
      searchItemInventory: '',
      SECTIONS_INVENTORY_BACKUP: [],
      sentValue: 'No',
    };
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@appToken');
      if (value !== null) {
        this.setState(
          {
            token: value,
            recipeLoader: true,
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

  componentDidMount() {
    this.getData();
    this.getSupplierListData();
    this.getUsersListData();
  }

  getUsersListData = () => {
    getCurrentLocUsersAdminApi()
      .then(res => {
        const {data} = res;
        let finalUsersList = data.map((item, index) => {
          return {
            label: item.firstName,
            value: item.id,
          };
        });
        this.setState({
          usersList: finalUsersList,
          recipeLoader: false,
        });
      })
      .catch(err => {
        console.log('ERR', err);
      });
  };

  getSupplierListData = () => {
    getSupplierListAdminApi()
      .then(res => {
        const {data} = res;
        let finalSupplierList = data.map((item, index) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.setState({
          supplierList: finalSupplierList,
          recipeLoader: false,
        });
      })
      .catch(err => {
        console.log('ERR', err);
      });
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    if (item.id === 0) {
      this.setState(
        {
          clonePreviouseModalStatus: true,
          cloneLoader: true,
        },
        () => this.hitCloneApi(),
      );
    } else if (item.id === 1) {
      this.props.navigation.goBack();
    } else if (item.id === 2) {
      alert('Save');
    } else {
      alert('Send');
    }
  };

  hitCloneApi = () => {
    const {supplierValue} = this.state;
    clonePreviousApi(supplierValue)
      .then(res => {
        this.setState({
          cloneLoader: false,
          cloneOrderData: res.data,
        });
      })
      .catch(err => {
        this.setState({
          cloneLoader: false,
        });
        console.warn('errClone', err);
      });
  };

  handleConfirmOrderDate = date => {
    console.log('date', date);
    let newdate = moment(date).format('MM/DD/YYYY');
    this.setState({
      finalOrderDate: newdate,
    });
    this.hideDatePickerOrderDate();
  };

  hideDatePickerOrderDate = () => {
    this.setState({
      isDatePickerVisibleOrderDate: false,
    });
  };

  handleConfirmDeliveryDate = date => {
    console.log('date', date);
    let newdate = moment(date).format('MM/DD/YYYY');
    this.setState({
      finalDeliveryDate: newdate,
    });
    this.hideDatePickerDeliveryDate();
  };

  hideDatePickerDeliveryDate = () => {
    this.setState({
      isDatePickerVisibleDeliveryDate: false,
    });
  };

  showDatePickerOrderDate = () => {
    this.setState({
      isDatePickerVisibleOrderDate: true,
    });
  };

  showDatePickerDeliveryDate = () => {
    this.setState({
      isDatePickerVisibleDeliveryDate: true,
    });
  };

  setModalVisibleFalse = visible => {
    this.setState({
      clonePreviouseModalStatus: visible,
      inventoryModalStatus: visible,
      supplierModalStatus: visible,
      modalVisibleInventory: visible,
      // cloneOrderData: [],
      // supplierData: [],
    });
  };

  inventoryListFun = () => {
    this.setState(
      {
        inventoryModalStatus: true,
        cloneLoader: true,
      },
      () => this.hitInventoryApi(),
    );
  };

  hitInventoryApi = () => {
    const {supplierValue} = this.state;
    inventoryListAdminApi(supplierValue)
      .then(res => {
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

        let finalInventory = extract();
        // console.log('finalInventory', finalInventory);

        let finalArray = Object.keys(finalInventory).map((item, index) => {
          let groupedCategory = groupByKey(
            finalInventory[item],
            'categoryName',
          );
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
          SECTIONS_INVENTORY: [...result],
          cloneLoader: false,
          SECTIONS_INVENTORY_BACKUP: [...result],
        });
        // this.setState({
        //   cloneLoader: false,
        // });
      })
      .catch(err => {
        this.setState({
          cloneLoader: false,
        });
        console.warn('errClone', err);
      });
  };

  supplierFun = () => {
    this.setState(
      {
        supplierModalStatus: true,
        cloneLoader: true,
      },
      () => this.hitSupplierApi(),
    );
  };

  hitSupplierApi = () => {
    const {supplierValue} = this.state;
    supplierAdminApi(supplierValue)
      .then(res => {
        console.warn('res', res);
        this.setState({
          cloneLoader: false,
          supplierData: res.data,
        });
      })
      .catch(err => {
        this.setState({
          cloneLoader: false,
        });
        console.warn('errClone', err);
      });
  };

  _updateSections = activeSectionsInventory => {
    this.setState({
      activeSectionsInventory,
    });
  };

  _renderHeaderInventory = (section, index, isActive) => {
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
          source={isActive ? img.upArrowIcon : img.arrowRightIcon}
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
    // console.log('item', item.title);
    this.setState(
      {
        inventoryModalStatus: false,
      },
      () =>
        setTimeout(() => {
          this.createDataFun(index, section, sta, item);
        }, 500),
    );
  };

  createDataFun = (index, section, sta, item) => {
    this.setState(
      {
        finalName: item.title,
        modalVisibleInventory: true,
        modalLoaderInventory: true,
        sectionName: section.title,
      },
      () => this.createDataFunSec(index, section, sta, item),
    );
  };

  createDataFunSec = (index, section, sta, subItem) => {
    // console.log('section', section);
    // console.log('inde', index);
    // console.log('status', sta);
    const {SECTIONS, showSubList, finalName} = this.state;
    // console.log('finalName', finalName);
    // console.log('SECTIONS', SECTIONS);

    const status = true;
    // const status = !showSubList;
    // console.log('status', status);

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

    function groupByKey(array, key) {
      return array.reduce((hash, obj) => {
        if (obj[key] === undefined) return hash;
        return Object.assign(hash, {
          [obj[key]]: (hash[obj[key]] || []).concat(obj),
        });
      }, {});
    }

    let finalArray = newArr.map((item, index) => {
      if (item.status === true) {
        return {
          final: item.content,
        };
      }
    });

    console.log('finalArray', finalArray);

    let dataFinal = finalArray.filter(function (element) {
      return element !== undefined;
    });

    console.log('dataFinal', dataFinal);

    let groupedCategory = groupByKey(dataFinal[0].final, 'inventoryName');
    console.log('groupedCategory', groupedCategory);

    let catArray = Object.keys(groupedCategory).map((subItem, index) => {
      return {
        title: subItem,
        content: groupedCategory[subItem],
      };
    });

    console.log('catArray', catArray);

    // console.log('groupedCategory', groupedCategory);

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
        FINAL_ACC: [...catArray],
        showSubList: status,
        modalLoaderInventory: false,
      });
    }, 300);
  };

  _renderContentInventory = section => {
    // console.log('sec', section);
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
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      alignItems: 'center',
                    }}>
                    <Text style={{textAlign: 'center'}}>{item.title}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          );
        })}
      </View>
    );
  };

  navigateTo = item => {
    this.setState(
      {
        modalVisibleInventory: false,
      },
      () =>
        this.props.navigation.navigate('OrderingThreeAdminScreen', {
          data: item,
        }),
    );
  };

  _renderContentFinal = section => {
    // console.log('sec', section);
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: hp('2%'),
            borderBottomWidth: 1,
            paddingBottom: 10,
          }}>
          <View
            style={{
              width: wp('30%'),
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: 'bold'}}>In stock?</Text>
          </View>
          <View
            style={{
              width: wp('30%'),
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: 'bold'}}>code</Text>
          </View>
          <View
            style={{
              width: wp('30%'),
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: 'bold'}}>Name</Text>
          </View>
          <View
            style={{
              width: wp('30%'),
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: 'bold'}}>Quantity</Text>
          </View>
          <View
            style={{
              width: wp('30%'),
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: 'bold'}}>Price</Text>
          </View>
          <View
            style={{
              width: wp('30%'),
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: 'bold'}}>Preferred</Text>
          </View>
        </View>
        {section.content.map((item, index) => {
          return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{marginVertical: 10, flexDirection: 'row'}}>
                <View
                  style={{
                    width: wp('30%'),
                    alignItems: 'center',
                  }}>
                  <View style={{}}>
                    <CheckBox
                      editable={false}
                      value={item.isInStock}
                      style={{
                        backgroundColor: '#E9ECEF',
                        height: 20,
                        width: 20,
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    width: wp('30%'),
                    alignItems: 'center',
                  }}>
                  <Text>{item.productCode}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.navigateTo(item)}
                  style={{
                    width: wp('30%'),
                    alignItems: 'center',
                  }}>
                  <Text>{item.productName}</Text>
                </TouchableOpacity>
                <View
                  style={{
                    width: wp('30%'),
                    alignItems: 'center',
                  }}>
                  <Text>
                    {item.grainzVolume} {item.unit}
                  </Text>
                </View>
                <View
                  style={{
                    width: wp('30%'),
                    alignItems: 'center',
                  }}>
                  <Text>
                    {item.price}/{item.unit}
                  </Text>
                </View>
                <View
                  style={{
                    width: wp('30%'),
                    alignItems: 'center',
                  }}>
                  <View style={{}}>
                    <CheckBox
                      editable={false}
                      value={item.isPreferred}
                      style={{
                        backgroundColor: '#E9ECEF',
                        height: 20,
                        width: 20,
                      }}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => this.navigateTo(item)}
                  style={{
                    width: wp('30%'),
                    alignItems: 'center',
                  }}>
                  <Text>Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.unMapFunAlert(item)}
                  style={{
                    width: wp('30%'),
                    alignItems: 'center',
                  }}>
                  <Text style={{textDecorationLine: 'underline'}}>Unmap</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          );
        })}
      </View>
    );
  };

  unMapFunAlert = item => {
    Alert.alert('Grainz', 'Would you like to unmap this product?', [
      {text: 'No', onPress: () => console.warn('NO'), style: 'cancel'},
      {text: 'Yes', onPress: () => this.unMapFun(item)},
    ]);
  };

  unMapFun = item => {
    const {inventoryId, productId} = item;
    let payload = {
      inventoryId: inventoryId,
      productId: productId,
    };
    console.log('payload', payload);
    unMapProductApi(payload)
      .then(res => {
        console.log('res', res);
        Alert.alert('Grainz', 'Product unmapped successfully', [
          {text: 'Oky', onPress: () => this.getInventoryDataAgain()},
        ]);
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  getInventoryDataAgain = () => {
    this.setState(
      {
        modalVisibleInventory: false,
      },
      () =>
        setTimeout(() => {
          this.inventoryListFun();
        }, 500),
    );
  };

  searchFun = txt => {
    this.setState(
      {
        searchItemInventory: txt,
      },
      () => this.filterData(txt),
    );
  };

  filterData = text => {
    //passing the inserted text in textinput
    const newData = this.state.SECTIONS_INVENTORY_BACKUP.filter(function (
      item,
    ) {
      //applying filter for the inserted text in search bar
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    console.log('newData', newData);

    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      SECTIONS_INVENTORY: newData,
      searchItem: text,
    });
  };

  render() {
    const {
      recipeLoader,
      pageLoading,
      firstName,
      buttons,
      buttonsSubHeader,
      supplierValue,
      finalOrderDate,
      isDatePickerVisibleOrderDate,
      isDatePickerVisibleDeliveryDate,
      finalDeliveryDate,
      placedByValue,
      supplierList,
      usersList,
      clonePreviouseModalStatus,
      cloneLoader,
      cloneOrderData,
      inventoryModalStatus,
      supplierModalStatus,
      supplierData,
      activeSectionsInventory,
      SECTIONS_INVENTORY,
      modalVisibleInventory,
      finalName,
      sectionName,
      modalLoaderInventory,
      FINAL_ACC,
      searchItemInventory,
      sentValue,
    } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {recipeLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )}
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
              {translate('New Order').toLocaleUpperCase()}
            </Text>
            {buttons.map((item, index) => {
              return (
                <View style={{}} key={index}>
                  <TouchableOpacity
                    disabled={
                      item.id === 1
                        ? false
                        : supplierValue === null
                        ? true
                        : false
                    }
                    onPress={() => this.onPressFun(item)}
                    style={{
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor:
                        item.id === 1
                          ? '#94C036'
                          : supplierValue === null
                          ? '#778C26'
                          : '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
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

          {pageLoading ? (
            <ActivityIndicator color="#94C036" size="large" />
          ) : (
            <View style={{marginTop: hp('3%'), marginHorizontal: wp('5%')}}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Supplier: </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: wp('50%'),
                      backgroundColor: '#fff',
                      marginLeft: 10,
                      paddingVertical: 11,
                      borderWidth: 1,
                    }}>
                    <View
                      style={{
                        width: wp('42%'),
                        alignSelf: 'center',
                        justifyContent: 'center',
                      }}>
                      <RNPickerSelect
                        placeholder={{
                          label: 'Select supplier*',
                          value: null,
                          color: 'grey',
                        }}
                        onValueChange={value => {
                          this.setState({
                            supplierValue: value,
                          });
                        }}
                        style={{
                          inputIOS: {
                            fontSize: 14,
                            paddingHorizontal: '3%',
                            color: 'grey',
                            width: '100%',
                            alignSelf: 'center',
                          },
                          inputAndroid: {
                            fontSize: 14,
                            paddingHorizontal: '3%',
                            color: 'grey',
                            width: '100%',
                            alignSelf: 'center',
                          },
                          iconContainer: {
                            top: '40%',
                          },
                        }}
                        items={supplierList}
                        value={supplierValue}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>
                    <View style={{}}>
                      <Image
                        source={img.arrowDownIcon}
                        resizeMode="contain"
                        style={{height: 20, width: 20}}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Order Date: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TouchableOpacity
                      onPress={() => this.showDatePickerOrderDate()}
                      style={{
                        width: wp('50%'),
                        borderWidth: 1,
                        padding: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TextInput
                        placeholder="dd-mm-yy"
                        value={finalOrderDate}
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
                      isVisible={isDatePickerVisibleOrderDate}
                      mode={'date'}
                      onConfirm={this.handleConfirmOrderDate}
                      onCancel={this.hideDatePickerOrderDate}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Delivery date: </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TouchableOpacity
                      onPress={() => this.showDatePickerDeliveryDate()}
                      style={{
                        width: wp('50%'),
                        borderWidth: 1,
                        padding: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TextInput
                        placeholder="dd-mm-yy"
                        value={finalDeliveryDate}
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
                      isVisible={isDatePickerVisibleDeliveryDate}
                      mode={'date'}
                      onConfirm={this.handleConfirmDeliveryDate}
                      onCancel={this.hideDatePickerDeliveryDate}
                    />
                  </View>
                </View>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Placed by: </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: wp('50%'),
                      backgroundColor: '#fff',
                      marginLeft: 10,
                      paddingVertical: 11,
                      borderWidth: 1,
                    }}>
                    <View
                      style={{
                        width: wp('42%'),
                        alignSelf: 'center',
                        justifyContent: 'center',
                      }}>
                      <RNPickerSelect
                        placeholder={{
                          label: 'Select placed by*',
                          value: null,
                          color: 'grey',
                        }}
                        onValueChange={value => {
                          this.setState({
                            placedByValue: value,
                          });
                        }}
                        style={{
                          inputIOS: {
                            fontSize: 14,
                            paddingHorizontal: '3%',
                            color: 'grey',
                            width: '100%',
                            alignSelf: 'center',
                          },
                          inputAndroid: {
                            fontSize: 14,
                            paddingHorizontal: '3%',
                            color: 'grey',
                            width: '100%',
                            alignSelf: 'center',
                          },
                          iconContainer: {
                            top: '40%',
                          },
                        }}
                        items={usersList}
                        value={placedByValue}
                        useNativeAndroidPickerStyle={false}
                      />
                    </View>
                    <View style={{}}>
                      <Image
                        source={img.arrowDownIcon}
                        resizeMode="contain"
                        style={{height: 20, width: 20}}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp('3%'),
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                    }}>
                    <Text>Sent? </Text>
                  </View>
                  <View style={{marginLeft: wp('3%')}}>
                    <TextInput
                      editable={false}
                      value={sentValue}
                      placeholder="Sent"
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        width: wp('50%'),
                      }}
                    />
                  </View>
                </View>
              </View>
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                    <View style={{flexDirection: 'row', marginTop: hp('3%')}}>
                      <View style={{width: wp('40%')}}>
                        <Text>Inventory item</Text>
                      </View>
                      <View style={{width: wp('40%')}}>
                        <Text>Quantity</Text>
                      </View>
                      <View style={{width: wp('40%')}}>
                        <Text>$HTVA</Text>
                      </View>
                    </View>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: hp('3%'),
                        }}>
                        <View style={{width: wp('40%')}}>
                          <Text>Total HTVA: </Text>
                        </View>
                        {/* <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              borderWidth: 1,
                              padding: 10,
                              width: wp('20%'),
                            }}
                          />
                          <Text style={{marginLeft: 5}}>%</Text>
                        </View> */}
                      </View>
                    </View>
                  </View>
                </ScrollView>
                <View style={{alignSelf: 'center', marginVertical: hp('3%')}}>
                  <Text>Order from :</Text>
                </View>
                <View style={{alignSelf: 'center'}}>
                  <TouchableOpacity
                    onPress={() => this.inventoryListFun()}
                    disabled={supplierValue === null ? true : false}
                    style={{
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor:
                        supplierValue === null ? '#778C26' : '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>
                        Inventory List
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{alignSelf: 'center'}}>
                  <TouchableOpacity
                    onPress={() => this.supplierFun()}
                    disabled={supplierValue === null ? true : false}
                    style={{
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor:
                        supplierValue === null ? '#778C26' : '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>
                        Supplier catalog
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{alignSelf: 'center'}}>
                  <TouchableOpacity
                    onPress={() => alert('Save draft')}
                    disabled={supplierValue === null ? true : false}
                    style={{
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor:
                        supplierValue === null ? '#778C26' : '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>
                        Save draft
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{alignSelf: 'center'}}>
                  <TouchableOpacity
                    onPress={() => alert('Send')}
                    disabled={supplierValue === null ? true : false}
                    style={{
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor:
                        supplierValue === null ? '#778C26' : '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>Send</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{alignSelf: 'center'}}>
                  <TouchableOpacity
                    onPress={() => alert('View')}
                    disabled={supplierValue === null ? true : false}
                    style={{
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor:
                        supplierValue === null ? '#778C26' : '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>View</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          <Modal isVisible={clonePreviouseModalStatus} backdropOpacity={0.35}>
            <View
              style={{
                width: wp('80%'),
                height: hp('85%'),
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
                    {translate('Previous order item')}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => this.setModalVisibleFalse(false)}>
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
                {cloneLoader ? (
                  <ActivityIndicator color="grey" size="large" />
                ) : (
                  <View>
                    {cloneOrderData.length > 0 ? (
                      <View>
                        {cloneOrderData.map(item => {
                          return (
                            <View style={{marginLeft: wp('5%')}}>
                              <Text
                                style={{
                                  marginVertical: hp('2%'),
                                  color: '#646464',
                                }}>
                                {moment(item.orderDate).format('LL')}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    ) : (
                      <View
                        style={{
                          marginTop: hp('5%'),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 20, color: 'red'}}>
                          No data available
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>
              <View style={{alignSelf: 'center'}}>
                <TouchableOpacity
                  onPress={() => this.setModalVisibleFalse(false)}
                  style={{
                    height: hp('6%'),
                    width: wp('70%'),
                    backgroundColor: '#E7943B',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}>
                  <View style={{}}>
                    <Text style={{color: 'white', marginLeft: 5}}>Close</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal isVisible={inventoryModalStatus} backdropOpacity={0.35}>
            <View
              style={{
                width: wp('80%'),
                height: hp('85%'),
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
                    {translate('Inventory item')}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => this.setModalVisibleFalse(false)}>
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

              <View
                style={{
                  marginTop: 20,
                  marginLeft: wp('5%'),
                }}>
                <View style={{}}>
                  <Text style={{color: 'grey'}}>{translate('Search')} : </Text>
                </View>
              </View>
              <TextInput
                placeholder="Search"
                value={searchItemInventory}
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

              <ScrollView showsVerticalScrollIndicator={false}>
                {cloneLoader ? (
                  <ActivityIndicator color="grey" size="large" />
                ) : (
                  <View>
                    {SECTIONS_INVENTORY.length > 0 ? (
                      <View
                        style={{
                          marginTop: hp('3%'),
                          marginHorizontal: wp('5%'),
                        }}>
                        <Accordion
                          underlayColor="#fff"
                          sections={SECTIONS_INVENTORY}
                          activeSections={activeSectionsInventory}
                          renderHeader={this._renderHeaderInventory}
                          renderContent={this._renderContentInventory}
                          onChange={this._updateSections}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          marginTop: hp('5%'),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 20, color: 'red'}}>
                          No data available
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>
              <View style={{alignSelf: 'center'}}>
                <TouchableOpacity
                  onPress={() => this.setModalVisibleFalse(false)}
                  style={{
                    height: hp('6%'),
                    width: wp('70%'),
                    backgroundColor: '#E7943B',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}>
                  <View style={{}}>
                    <Text style={{color: 'white', marginLeft: 5}}>Close</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal isVisible={supplierModalStatus} backdropOpacity={0.35}>
            <View
              style={{
                width: wp('80%'),
                height: hp('85%'),
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
                    {translate('Supplier catalog')}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => this.setModalVisibleFalse(false)}>
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
                {cloneLoader ? (
                  <ActivityIndicator color="grey" size="large" />
                ) : (
                  <View>
                    {supplierData.length > 0 ? (
                      <View>
                        {supplierData.map(item => {
                          return (
                            <View style={{marginLeft: wp('5%')}}>
                              <Text
                                style={{
                                  marginVertical: hp('2%'),
                                  color: '#646464',
                                }}>
                                SUPPLIER
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    ) : (
                      <View
                        style={{
                          marginTop: hp('5%'),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 20, color: 'red'}}>
                          No data available
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>
              <View style={{alignSelf: 'center'}}>
                <TouchableOpacity
                  onPress={() => this.setModalVisibleFalse(false)}
                  style={{
                    height: hp('6%'),
                    width: wp('70%'),
                    backgroundColor: '#E7943B',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}>
                  <View style={{}}>
                    <Text style={{color: 'white', marginLeft: 5}}>Close</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal isVisible={modalVisibleInventory} backdropOpacity={0.35}>
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
                    onPress={() => this.setModalVisibleFalse(false)}>
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
                {modalLoaderInventory ? (
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
                        </View>
                        <View>
                          {FINAL_ACC && FINAL_ACC.length > 0 ? (
                            <View
                              style={{
                                marginTop: hp('3%'),
                                marginHorizontal: wp('5%'),
                              }}>
                              <Accordion
                                underlayColor="#fff"
                                sections={FINAL_ACC}
                                activeSections={activeSectionsInventory}
                                renderHeader={this._renderHeaderInventory}
                                renderContent={this._renderContentFinal}
                                onChange={this._updateSections}
                              />
                            </View>
                          ) : null}
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

export default connect(mapStateToProps, {UserTokenAction})(OrderingSec);
