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
import {UserTokenAction} from '../../../../redux/actions/UserTokenAction';
import {
  getMyProfileApi,
  lookupDepartmentsApi,
  getMenuCategoriesApi,
  getMenuListApi,
  getMenuDetailsApi,
  deleteMenuApi,
  deleteMenuItemLinkApi,
  updateMenuItemPriceApi,
  updateMenuItemCategoryApi,
  getMenuItemsSetupApi,
  addMenuItemToCategoryApi,
  addMenuApi,
  updateMenuApi,
} from '../../../../connectivity/api';
import Accordion from 'react-native-collapsible/Accordion';
import Modal from 'react-native-modal';
import {translate} from '../../../../utils/translations';
import styles from './style';
import DropDownPicker from 'react-native-dropdown-picker';
import RNPickerSelect from 'react-native-picker-select';
import CheckBox from '@react-native-community/checkbox';
import {set} from 'react-native-reanimated';
import moment from 'moment';
import {t} from 'i18n-js';
import {isForOfStatement} from '@babel/types';

var detailsList = [];

export default class EditMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
   
      buttonsSubHeader: [],
      firstName: '',
      departmentList: [],
      departmentsLoader: false,
      detailsLoader: false,
      departments: null,
      department: null,
      categories: [],
      inUse: false,
      menuList: [],
      menu: '',
      showCategories: false,
      details: {},
      showAllInUse: false,
      showAll: true,
      categoryName: '',
      addCatModal: false,
      addSubCatModal: false,
      catId: '',
      subCategoryName: '',
      menuSelected: false,
      menuDepartment: {label: 'Select Department', value: ''},
      manageCats: false,
      dotModalVisible: false,
      DeleteMenuItemModal: false,
      EditMenuItemModal: false,
      pendingMenuItem: {},
      pendingItemPrice: '',
      pendingItemVat: '',
      categorySelected: '',
      showItemCategories: false,
      addMenuItemModal: false,
      showMenuItems: false,
      menuItemsList: [],
      height: '29%',
      itemsAdded: [],

    };
  }
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

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  componentDidMount() {
    this.getProfileData();
    this.setState({
      menu: this.props.route.params.item,
      menuDepartment: this.props.route.params.menuDepartment,
    });
    this.getMenuDetails(this.props.route.params.item.value);
  }

  getDepartments = () => {
    this.setState({departmentsLoader: true});
    lookupDepartmentsApi()
      .then(res => {
        let finalDepsList = res.data.map((item, index) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        this.setState({
          departmentList: finalDepsList,
          departmentsLoader: false,
        });
      })
      .catch(err => {
        console.log('ERR MEP', err);
        // this.setState({
        //   recipeLoader: false,
        // });
      });
  };

 
  getMenuDetails(id) {
    this.setState({detailsLoader: true});
    const {departmentList, details} = this.state;
    getMenuDetailsApi(id)
      .then(res => {
        this.setState({details: res.data});
        let newArr = [];
        let pos = 0;
        res.data.menuCategoryLinks.map(item => {
          if (item.menuItemCategoryLinks.length >= 0) {
            newArr.push({
              categoryName: item.categoryName,
              menuItemCategoryLinks: item.menuItemCategoryLinks,
              departmentId: item.departmentId,
              id: item.id,
              showMenuItems: true,
              index: pos,
            });
            pos = pos + 1;
          }
        });
        detailsList = newArr;
        this.setState({detailsLoader: false});
        lookupDepartmentsApi()
          .then(ser => {
            ser.data.map(ele => {
              if (ele.id === res.data.departmentId) {
                this.setState({
                  menuDepartment: {label: ele.name, value: ele.id},
                });
              }
            });
          })
          .catch(err => console.warn(err));
      })

      .catch(err => console.warn('err', err));
  }

  deleteMenuFun(id) {
    Alert.alert('Delete', 'Are you sure you want to delete this menu ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          deleteMenuApi(id)
            .then(res => {
              this.props.navigation.navigate('MenusScreen');
            })
            .catch(err => console.warn('deleted', err));
        },
      },
    ]);
  }

  deleteMenuItemFun(id) {
    deleteMenuItemLinkApi(id)
      .then(res => {
        this.setState({dotModalVisible: false, DeleteMenuItemModal: false});
        this.getMenuDetails(this.state.menu.value);
      })
      .catch(err => console.warn('err', err));
  }

  showMenuItemsFun(item) {
    let newArr = [];
    detailsList.map(ele => {
      if (ele.index === item.index) {
        newArr.push({
          categoryName: item.categoryName,
          menuItemCategoryLinks: item.menuItemCategoryLinks,
          departmentId: item.departmentId,
          id: item.id,
          showMenuItems: true,
          index: item.index,
        });
      } else {
        newArr.push(ele);
      }
    });
  }

  updateMenuitem() {
    const {
      pendingItemVat,
      pendingItemPrice,
      pendingMenuItem,
      categorySelected,
    } = this.state;

    let payload = {
      id: pendingMenuItem.id,
      price: pendingItemPrice,
      vat: pendingItemVat,
    };

    updateMenuItemPriceApi(payload)
      .then(res => console.warn('updated', res))
      .catch(err => console.warn(err));

    updateMenuItemCategoryApi({
      id: pendingMenuItem.id,
      menuMenuItemCategoryLinkId: categorySelected.uniqueId,
    })
      .then(res => {
        this.setState({EditMenuItemModal: false, dotModalVisible: false});
      })
      .catch(err => console.warn('err', err));
  }

  addItemToList(item) {
    const {itemsAdded, categorySelected} = this.state;
    let newArr = [];
    newArr.push(item);
    let arr = newArr.concat(itemsAdded);
    this.setState({itemsAdded: arr});
  }

  getMenuItemsList() {
    getMenuItemsSetupApi()
      .then(res => this.setState({menuItemsList: res.data}))
      .catch(err => console.warn('erer', err));
  }

  addItemToCategory() {
    const {details, categorySelected, itemsAdded} = this.state;
    let pos = 1;
    itemsAdded.map(item => {
      let payload = {
        id: details.id,
        menuItemId: item.id,
        menuMenuItemCategoryLinkId: categorySelected.uniqueId,
        menuPosition: pos,
        name: item.name,
        price: null,
        productKey: null,
        reference: item.reference,
      };

      addMenuItemToCategoryApi(payload)
        .then(res => console.warn(res))
        .catch(err => console.warn(err));
    });
    pos = pos + 1;
  }

  getMenuCategories() {
    getMenuCategoriesApi()
      .then(res => {
        this.setState({categories: res.data});
      })
      .catch(err => console.warn('err', err));
  }

  addMenuFun() {
    const {menuName, menuDepartment, inUse} = this.state;

    let payload = {
      action: 'New',
      departmentId: menuDepartment.value,
      inUse: inUse,
      menuCategoryLinks: [],
      menuItemCategoryLinks: [],
      name: menuName,
      reference: menuName,
    };

    addMenuApi(payload)
      .then(res => {
        this.setState({
          newMenu: false,
          chosenMenu: true,
          menu: {label: menuName, value: ''},
        }),
          console.warn('added', res);
      })
      .catch(err => console.warn('err', err));
  }
  updateMenuFun() {
    const {menuName, menuDepartment, inUse, menu} = this.state;

    let payload = {
      departmentId: menuDepartment.value,
      inUse: inUse,
      menuCategoryLinks: [],
      id: menu.value,
      name: menu.label,
      reference: menu.label,
    };

    updateMenuApi(payload)
      .then(res => {
        this.setState({
          chosenMenu: false,
          firstPage: true,
          menu: {label: menuName, value: ''},
        }),
          this.props.navigation.navigate('MenusScreen');
        console.warn('updated', res);
      })
      .catch(err => console.warn('err', err));
  }

  render() {
    const {
      buttonsSubHeader,
      departmentList,
      inUse,
      menu,
      categories,
      addSubCatModal,
      subCategoryName,
      details,
      menuDepartment,
      manageCats,
      dotModalVisible,
      DeleteMenuItemModal,
      pendingMenuItem,
      pendingItemPrice,
      pendingItemVat,
      EditMenuItemModal,
      categorySelected,
      showItemCategories,
      addMenuItemModal,
      showMenuItems,
      menuItemsList,
      height,
      detailsLoader,
      departmentsLoader
    } = this.state;
    return (
      <View style={{backgroundColor: '#F0F4FF'}}>
        <Header />
        <SubHeader {...this.props} buttons={buttonsSubHeader} index={1} />
        <ScrollView
          style={{marginBottom: hp('2%')}}
          showsVerticalScrollIndicator={false}>
          <View style={{...styles.subContainer, marginBottom: hp('2%')}}>
            <View style={{margin: 10}}>
              <View style={{flexDirection: 'row', paddingBottom: 20}}>
                <View style={{flex: 2}}>
                  <View>
                    <Text style={styles.adminTextStyle}>
                      {translate('Menu Details')}
                    </Text>
                  </View>
                </View>

                <View style={{flex: 1}}>
                  <TouchableOpacity
                    onPress={
                      () => this.props.navigation.navigate('MenusScreen', {})
                      //   this.setState({
                      //     chosenMenu: false,
                      //     firstPage: true,
                      //     menu: {label: '', value: ''},
                      //     menuDepartment: {
                      //       label: 'Select Department',
                      //       value: '',
                      //     },
                      //   })
                    }
                    style={styles.goBackContainer}>
                    <Text style={styles.goBackTextStyle}>Go Back</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flexDirection: 'row', paddingBottom: 20}}>
                <View style={{flex: 4}}>
                  <Text style={{fontSize: 16}}>
                    {translate('Menu Details Edit')}
                  </Text>
                </View>
                <View style={{flex: 1, marginRight: 5}}>
                  <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => this.deleteMenuFun(menu.value)}>
                    <Image
                      source={img.deleteIconNew}
                      style={{
                        resizeMode: 'contain',
                        height: 12,
                        width: 12,
                        tintColor: '#FF034D',
                        marginTop: 2,
                        marginRight: 5,
                      }}
                    />
                    <Text style={{color: '#FF034D'}}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  width: wp('90%'),
                  height: hp('10%'),
                  marginLeft: 5,
                }}>
                <TextInput
                  style={{
                    padding: 20,
                    borderRadius: 5,
                    backgroundColor: 'white',
                  }}
                  value={menu.label}
                  placeholder="Menu name"
                  placeholderTextColor="black"
                  onChangeText={value =>
                    this.setState({menu: {label: value, value: menu.value}})
                  }
                />
              </View>

              <View
                style={{
                  width: wp('90%'),
                  height: hp('10%'),
                  marginLeft: 5,
                }}>
                {departmentsLoader ? (
                  <ActivityIndicator size="small" color="#94C036" />
                ) : (
                  <DropDownPicker
                    items={departmentList}
                    value={menuDepartment.label}
                    placeholder={menuDepartment.label}
                    zIndex={100}
                    containerStyle={{
                      height: 50,
                      width: wp('90%'),
                      marginBottom: hp('3%'),
                    }}
                    style={{
                      backgroundColor: '#fff',
                      borderColor: 'white',
                    }}
                    itemStyle={{
                      justifyContent: 'flex-start',
                    }}
                    dropDownStyle={{backgroundColor: '#fff'}}
                    onChangeItem={value =>
                      this.setState({menuDepartment: value})
                    }
                  />
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: '15%',
                  }}></View>
              </View>
              <View style={{margin: '4%'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex: 3}}>
                    <Text style={{}}>Date created</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{}}>
                      {moment(details.createdDate).format('DD/MM/YYYY')}{' '}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 25,
                  }}>
                  <View style={{flex: 9}}>
                    <Text style={{fontWeight: 'bold'}}>In use ?</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <CheckBox
                      // editable={false}
                      value={inUse}
                      style={{
                        backgroundColor: '#E9ECEF',
                        height: 20,
                        width: 20,
                      }}
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  margin: '5%',
                  marginBottom: 20,
                  marginLeft: '22%',
                }}>
                <View style={{margin: '2%'}}>
                  <TouchableOpacity
                    onPress={
                      () => this.props.navigation.navigate('MenusScreen')
                      //   this.setState({
                      //     chosenMenu: false,
                      //     firstPage: true,
                      //     menu: {label: '', value: ''},
                      //     menuDepartment: {
                      //       label: 'Select Department',
                      //       value: '',
                      //     },
                      //   })
                    }
                    style={{
                      height: hp('5%'),
                      width: wp('29%'),
                      borderWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: hp('1.5%'),
                      borderRadius: 100,
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View>
                      <Text style={{}}>Cancel </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{margin: '2%'}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.updateMenuFun();
                    }}
                    style={{
                      height: hp('5%'),
                      width: wp('29%'),
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: hp('1.5%'),
                      borderRadius: 100,
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View>
                      <Image
                        source={img.addIcon}
                        style={{
                          height: 16,
                          width: 16,
                          resizeMode: 'contain',
                          tintColor: 'white',
                        }}
                      />
                    </View>
                    <View>
                      <Text style={{color: 'white'}}>Save </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginLeft: '5%'}}>
                <View>
                  <TouchableOpacity
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
                    <Image
                      style={{
                        height: 55,
                        width: 55,
                        resizeMode: 'contain',
                        tintColor: '#FF034D',
                        marginBottom: '15%',
                      }}
                      source={img.menuAnalysisIcon}
                    />
                    <Text style={{fontWeight: 'bold'}}>Analysis</Text>
                  </TouchableOpacity>
                </View>

                <View style={{}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({manageCats: true});
                      this.getMenuCategories();
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
                    <View>
                      <Text style={{fontWeight: 'bold'}}>
                        Manage categories
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  flex: 5,
                  padding: 5,
                  marginTop: 20,
                  marginLeft: 10,
                  marginRight: 10,
                }}>
                <View>
                  <TouchableOpacity style={{}}>
                    <View style={{}}>
                      <Text style={{fontSize: 18}}>
                        {translate('Uncollapse All')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {detailsLoader ? (
                  <ActivityIndicator
                    size="large"
                    color="#94C036"
                    style={{marginTop: 15}}
                  />
                ) : (
                  <View>
                    {detailsList.map(item => {
                      return (
                        <View style={{marginTop: 10}}>
                          <View
                            style={{
                              padding: 15,
                              backgroundColor: 'white',
                              borderRadius: 10,
                              flexDirection: 'row',
                            }}>
                            <View style={{width: wp('8%')}}>
                              <TouchableOpacity
                                onPress={() => this.showMenuItemsFun(item)}>
                                <Image
                                  source={img.upArrowIcon}
                                  style={{
                                    resizeMode: 'contain',
                                    height: 16,
                                    width: 16,
                                    tintColor: '#94C036',
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                            <Text style={{width: wp('25%')}}>
                              {item.categoryName}
                            </Text>
                            <View style={{width: wp('5%')}}>
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState({
                                    addMenuItemModal: true,
                                    categorySelected: {
                                      name: item.categoryName,
                                      uniqueId:
                                        item.menuItemCategoryLinks[0]
                                          .menuMenuItemCategoryLinkId,
                                      id: item.id,
                                    },
                                  });
                                  this.getMenuItemsList();
                                  console.warn('ppp', item);
                                }}>
                                <View
                                  style={{
                                    height: 17,
                                    width: 17,
                                    backgroundColor: '#94C036',
                                    borderRadius: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <Image
                                    source={img.addIcon}
                                    style={{
                                      resizeMode: 'contain',
                                      height: 16,
                                      width: 16,
                                      tintColor: '#fff',
                                    }}
                                  />
                                </View>
                              </TouchableOpacity>
                            </View>
                            <Text style={{marginLeft: 8, width: wp('17%')}}>
                              Ordering
                            </Text>
                            <Image
                              source={img.doubleArrowIcon}
                              style={{
                                resizeMode: 'contain',
                                tintColor: '#94C036',
                                marginLeft: 8,
                                height: 16,
                                width: 16,
                              }}
                            />
                          </View>
                          {item.showMenuItems ? (
                            <View>
                              {item.menuItemCategoryLinks.map(ele => {
                                return (
                                  <View
                                    style={{
                                      padding: 16,
                                      borderWidth: 1,
                                      borderColor: '#737478',
                                      borderRadius: 10,
                                      marginTop: 10,
                                      flexDirection: 'row',
                                    }}>
                                    <View style={{flexDirection: 'row'}}>
                                      <View style={{width: wp('60%')}}>
                                        <Text style={{color: '#737478'}}>
                                          {ele.name}
                                        </Text>
                                      </View>

                                      <View
                                        style={{
                                          borderBottomWidth: 1,
                                          borderColor: '#94C036',
                                          width: 30,
                                          marginLeft: 20,
                                          width: wp('8%'),
                                          height: 17,
                                          alignItems: 'center',
                                        }}>
                                        <TouchableOpacity>
                                          <Text
                                            style={{
                                              color: '#94C036',
                                            }}>
                                            Map
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                      <View
                                        style={{
                                          width: wp('8%'),
                                          marginLeft: 10,
                                        }}>
                                        <TouchableOpacity
                                          onPress={() => {
                                            if (ele.price == null) {
                                              this.setState({
                                                pendingItemPrice: '',
                                              });
                                            } else {
                                              this.setState({
                                                pendingItemPrice: ele.price,
                                              });
                                            }
                                            if (ele.vat == null) {
                                              this.setState({
                                                pendingItemVat: '',
                                              });
                                            } else {
                                              this.setState({
                                                pendingItemVat: ele.vat,
                                              });
                                            }
                                            console.warn(ele, 'KKKKK', item);
                                            this.setState({
                                              pendingMenuItem: ele,
                                              categorySelected: {
                                                name: item.categoryName,
                                                uniqueId:
                                                  ele.menuMenuItemCategoryLinkId,
                                                id: item.id,
                                              },

                                              dotModalVisible: true,
                                            });
                                            console.warn(ele);
                                          }}>
                                          <Image
                                            source={img.threeDotsIcon}
                                            style={{
                                              resizeMode: 'contain',
                                              height: 16,
                                              width: 16,
                                              tintColor: '#737478',
                                            }}
                                          />
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  </View>
                                );
                              })}
                            </View>
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
              <View style={{height: 100}}></View>
            </View>
          </View>
        </ScrollView>

        <Modal isVisible={manageCats} backdropOpacity={0.35}>
          {addSubCatModal ? (
            <View
              style={{
                width: wp('70%'),
                height: hp('25%'),
                backgroundColor: '#F0F4FF',
                alignSelf: 'center',
                borderRadius: 10,
              }}>
              <View
                style={{
                  backgroundColor: '#94BC37',
                  height: hp('5%'),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row', flex: 7}}>
                  <View style={{flex: 6}}>
                    <Text style={{color: 'white', margin: '3%'}}>
                      Add Sub Category
                    </Text>
                  </View>
                  <View style={{flex: 1, margin: '3%'}}>
                    <TouchableOpacity
                      onPress={() => this.setState({addSubCatModal: false})}>
                      <Image
                        source={img.cancelIcon}
                        style={{
                          height: 16,
                          width: 16,
                          resizeMode: 'contain',
                          tintColor: 'white',
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{flex: 3, flexDirection: 'row', margin: '5%'}}>
                <View style={{flex: 2, marginLeft: 5}}>
                  <TextInput
                    style={{
                      padding: 8,
                      borderRadius: 5,
                      backgroundColor: 'white',
                    }}
                    value={subCategoryName}
                    placeholder="Sub Category Name"
                    placeholderTextColor="black"
                    onChangeText={value =>
                      this.setState({subCategoryName: value})
                    }
                  />
                </View>
              </View>
              <View
                style={{flexDirection: 'row', margin: '5%', marginBottom: 20}}>
                <View style={{margin: '2%'}}>
                  <TouchableOpacity
                    onPress={() => this.setState({addSubCatModal: false})}
                    style={{
                      height: hp('4%'),
                      width: wp('25%'),
                      borderWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: hp('1.5%'),
                      borderRadius: 100,
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View>
                      <Text style={{}}>Cancel </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{margin: '2%'}}>
                  <TouchableOpacity
                    onPress={() => this.addSubCategory(subCategoryName)}
                    style={{
                      height: hp('4%'),
                      width: wp('25%'),
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: hp('1.5%'),
                      borderRadius: 100,
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View>
                      <Image
                        source={img.addIcon}
                        style={{
                          height: 16,
                          width: 16,
                          resizeMode: 'contain',
                          tintColor: 'white',
                        }}
                      />
                    </View>
                    <View>
                      <Text style={{color: 'white'}}>Add </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={{height: hp('80%'), width: wp('90%'), marginTop: 10}}>
              <View
                style={{
                  height: hp('6%'),
                  backgroundColor: '#91B933',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{flex: 7, color: 'white', marginLeft: 10}}>
                  Manage Categories
                </Text>
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={() => this.setState({manageCats: false})}>
                  <Image
                    source={img.cancelIcon}
                    style={{
                      resizeMode: 'contain',
                      tintColor: 'white',
                      height: 16,
                      width: 16,
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View style={{height: hp('60%'), backgroundColor: '#EFF3FE'}}>
                <ScrollView style={{marginBottom: '9%'}}>
                  <View style={{marginTop: 15}}>
                    {categories.map(item => {
                      return (
                        <View style={{marginBottom: '5%'}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              flex: 10,
                              padding: 1,
                              marginLeft: 25,
                            }}>
                            <View style={{flex: 8}}>
                              <Text style={{fontWeight: 'bold'}}>
                                {item.name}
                              </Text>
                            </View>
                            <View style={{flex: 1}}>
                              <TouchableOpacity
                                onPress={() =>
                                  this.setState({
                                    addSubCatModal: true,
                                    catId: item.id,
                                  })
                                }
                                style={{
                                  backgroundColor: '#94C01F',
                                  width: wp('5%'),
                                  borderRadius: 50,
                                  alignItems: 'center',
                                  padding: '2%',
                                  marginLeft: 10,
                                }}>
                                <Image
                                  source={img.addIcon}
                                  style={{
                                    height: 16,
                                    width: 16,
                                    resizeMode: 'contain',
                                    tintColor: 'white',
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                            <View style={{flex: 1}}>
                              <TouchableOpacity
                                onPress={() => this.deleteCat(item.id)}
                                style={{
                                  // backgroundColor: '#FF8C89',
                                  width: wp('5%'),
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={img.deleteIconNew}
                                  style={{
                                    height: 12,
                                    width: 12,
                                    resizeMode: 'contain',
                                    tintColor: '#FF034D',
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                          {item.subCategories.map(ele => {
                            return (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginLeft: 30,
                                  flex: 10,
                                }}>
                                <View style={{flex: 7, flexDirection: 'row'}}>
                                  <View
                                    style={{
                                      borderRadius: 50,
                                      backgroundColor: 'black',
                                      height: 5,
                                      width: 5,
                                      marginTop: 6,
                                      margin: '2%',
                                    }}></View>
                                  <View style={{}}>
                                    <Text>{ele.name} </Text>
                                  </View>
                                </View>
                                <View style={{flex: 1, marginLeft: 59}}>
                                  <TouchableOpacity
                                    onPress={() => this.deleteSubCat(ele.id)}
                                    style={{
                                      // backgroundColor: '#FF8C89',
                                      width: wp('5%'),
                                      borderRadius: 5,
                                      alignItems: 'center',
                                      padding: '2%',
                                    }}>
                                    <Image
                                      source={img.deleteIconNew}
                                      style={{
                                        height: 12,
                                        width: 12,
                                        resizeMode: 'contain',
                                        tintColor: '#FF034D',
                                      }}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            </View>
          )}
        </Modal>
        <Modal isVisible={dotModalVisible}>
          {DeleteMenuItemModal ? (
            <View
              style={{
                height: hp('40%'),
                width: wp('80%'),
                marginLeft: 25,
                borderRadius: 10,
                backgroundColor: 'white',
              }}>
              <View style={{margin: '10%'}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    source={img.warningIcon}
                    style={{
                      height: 80,
                      width: 80,
                      resizeMode: 'contain',
                      tintColor: '#FF034D',
                    }}
                  />
                </View>
                <View
                  style={{
                    marginTop: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 21,
                      color: '#161B27',
                      justifyContent: 'center',
                    }}>
                    Are you sure you want to delete this item ?
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  margin: '5%',
                }}>
                <View style={{margin: '2%'}}>
                  <TouchableOpacity
                    onPress={() => this.setState({DeleteMenuItemModal: false})}
                    style={{
                      height: hp('5%'),
                      width: wp('35%'),
                      borderWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: hp('1.5%'),
                      borderRadius: 100,
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View>
                      <Text style={{}}>No </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{margin: '2%'}}>
                  <TouchableOpacity
                    onPress={() => this.deleteMenuItemFun(pendingMenuItem.id)}
                    style={{
                      height: hp('5%'),
                      width: wp('35%'),
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: hp('1.5%'),
                      borderRadius: 100,
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View>
                      <Text style={{color: 'white'}}>Yes </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View>
              {EditMenuItemModal ? (
                <View
                  style={{
                    width: wp('90%'),
                    height: hp('25%'),
                    backgroundColor: '#F0F4FF',
                    marginBottom: wp('65%'),
                    marginLeft: wp('1%'),
                    borderRadius: 10,
                  }}>
                  <View
                    style={{
                      backgroundColor: '#94BC37',
                      height: hp('5%'),
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{flexDirection: 'row', flex: 8}}>
                      <View style={{flex: 7}}>
                        <Text style={{color: 'white', margin: '3%'}}>
                          Edit menu item
                        </Text>
                      </View>
                      <View style={{flex: 1, margin: '3%'}}>
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({EditMenuItemModal: false})
                          }>
                          <Image
                            source={img.cancelIcon}
                            style={{
                              height: 16,
                              width: 16,
                              resizeMode: 'contain',
                              tintColor: 'white',
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      height: hp('60%'),
                      backgroundColor: '#f0f4ff',
                    }}>
                    <View style={{margin: '5%'}}>
                      <View style={{flexDirection: 'row', height: hp('6%')}}>
                        <View style={{width: wp('30%')}}>
                          <Text>Menu item : </Text>
                        </View>
                        <View style={{width: wp('50%')}}>
                          <Text style={{}}>{pendingMenuItem.name} </Text>
                        </View>
                      </View>
                      <View style={{flexDirection: 'row', height: hp('6%')}}>
                        <View style={{width: wp('30%')}}>
                          <Text>Till item : </Text>
                        </View>
                        <View style={{width: wp('50%')}}>
                          <Text style={{}}> </Text>
                        </View>
                      </View>
                      <View style={{flexDirection: 'row', height: hp('7%')}}>
                        <View style={{width: wp('30%')}}>
                          <Text>Till Price : </Text>
                        </View>
                        <View style={{width: wp('50%')}}>
                          <Text style={{}}>{pendingMenuItem.tillPrice} </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: hp('7%'),
                        }}>
                        <View style={{width: wp('30%'), marginTop: 20}}>
                          <Text>Grainz price : </Text>
                        </View>
                        <View style={{width: wp('6%')}}>
                          <Text style={{marginRight: 10, marginTop: 20}}>
                            $
                          </Text>
                        </View>
                        <View
                          style={{
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              padding: 20,
                              borderRadius: 5,
                              backgroundColor: 'white',
                              borderWidth: 1,
                              borderColor: 'grey',
                            }}
                            placeholder={pendingItemPrice.toString()}
                            placeholderTextColor="black"
                            value={pendingItemPrice}
                            onChangeText={value =>
                              this.setState({pendingItemPrice: value})
                            }
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: hp('7%'),
                          marginTop: 10,
                        }}>
                        <View style={{width: wp('30%'), marginTop: 20}}>
                          <Text>Vat : </Text>
                        </View>
                        <View style={{width: wp('6%')}}>
                          <Text style={{marginRight: 10, marginTop: 20}}>
                            %
                          </Text>
                        </View>
                        <View
                          style={{
                            width: wp('40%'),
                          }}>
                          <TextInput
                            style={{
                              padding: 20,
                              borderRadius: 5,
                              backgroundColor: 'white',
                              borderWidth: 1,
                              borderColor: 'grey',
                            }}
                            placeholder={pendingItemVat.toString()}
                            placeholderTextColor="black"
                            value={pendingItemVat}
                            onChangeText={value =>
                              this.setState({pendingItemVat: value})
                            }
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: hp('7%'),
                          marginTop: 25,
                        }}>
                        <View
                          style={{
                            width: wp('36%'),
                            marginTop: 10,
                          }}>
                          <Text>Category : </Text>
                        </View>

                        <View style={{width: wp('50%')}}>
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                showItemCategories: !showItemCategories,
                              })
                            }>
                            <View
                              style={{
                                borderWidth: 1,
                                width: wp('40%'),
                                height: hp('4%'),
                                flexDirection: 'row',

                                alignItems: 'center',
                                borderRadius: 5,
                              }}>
                              <View style={{width: wp('30%')}}>
                                <Text style={{marginLeft: 5}}>
                                  {categorySelected.name}
                                </Text>
                              </View>

                              <View style={{width: wp('5%')}}>
                                <Image
                                  source={img.arrowDownIcon}
                                  style={{
                                    resizeMode: 'contain',
                                    height: 16,
                                    width: 16,
                                    marginLeft: wp('4%'),
                                  }}
                                />
                              </View>
                            </View>
                          </TouchableOpacity>
                          <View style={{height: hp('5%')}}>
                            <ScrollView>
                              {showItemCategories ? (
                                <View>
                                  {detailsList.map(item => {
                                    return (
                                      <View>
                                        <TouchableOpacity
                                          onPress={() =>
                                            this.setState({
                                              categorySelected: {
                                                name: item.categoryName,
                                                uniqueId:
                                                  categorySelected.uniqueId,
                                              },
                                              showItemCategories: false,
                                            })
                                          }>
                                          <Text>{item.categoryName}</Text>
                                        </TouchableOpacity>
                                      </View>
                                    );
                                  })}
                                </View>
                              ) : null}
                            </ScrollView>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          margin: '5%',
                        }}>
                        <View style={{margin: '2%'}}>
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({EditMenuItemModal: false})
                            }
                            style={{
                              height: hp('5%'),
                              width: wp('35%'),
                              borderWidth: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginTop: hp('1.5%'),
                              borderRadius: 100,
                              alignSelf: 'center',
                              flexDirection: 'row',
                            }}>
                            <View>
                              <Text style={{}}>Cancel </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={{margin: '2%'}}>
                          <TouchableOpacity
                            onPress={() => this.updateMenuitem()}
                            style={{
                              height: hp('5%'),
                              width: wp('35%'),
                              backgroundColor: '#94C036',
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginTop: hp('1.5%'),
                              borderRadius: 100,
                              alignSelf: 'center',
                              flexDirection: 'row',
                            }}>
                            <View>
                              <Text style={{color: 'white'}}>Save </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <View>
                  <View
                    style={{
                      height: hp('12%'),

                      backgroundColor: 'white',
                      borderRadius: 10,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderColor: 'grey',
                      }}>
                      <View style={{margin: '5%', flex: 8}}>
                        <Text style={{color: '#737478'}}>Edit Menu Item</Text>
                      </View>
                      <View style={{margin: '5%', flex: 1}}>
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({EditMenuItemModal: true})
                          }>
                          <Image
                            source={img.editIconNew}
                            style={{
                              tintColor: '#737478',
                              resizeMode: 'contain',
                              height: 16,
                              width: 16,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <View style={{margin: '5%', flex: 8}}>
                        <Text style={{color: '#94C01F'}}>Delete Menu Item</Text>
                      </View>
                      <View style={{margin: '5%', flex: 1}}>
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({
                              DeleteMenuItemModal: true,
                            })
                          }>
                          <Image
                            source={img.deleteIcon}
                            style={{
                              tintColor: '#94C01F',
                              resizeMode: 'contain',
                              height: 16,
                              width: 16,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View>
                    <TouchableOpacity
                      onPress={() => this.setState({dotModalVisible: false})}>
                      <View
                        style={{
                          height: hp('5%'),
                          marginTop: 10,
                          borderRadius: 10,
                          backgroundColor: 'white',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text>Cancel</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </Modal>
        <Modal isVisible={addMenuItemModal}>
          <View
            style={{
              width: wp('90%'),
              height: hp(height),
              backgroundColor: '#F0F4FF',
              marginBottom: wp('5%'),
              marginLeft: wp('1%'),
              borderRadius: 10,
            }}>
            <View
              style={{
                backgroundColor: '#94BC37',
                height: hp('5%'),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{flexDirection: 'row', flex: 9}}>
                <View style={{flex: 8}}>
                  <Text style={{color: 'white', margin: '3%'}}>
                    Add Menu item - {categorySelected.name}
                  </Text>
                </View>
                <View style={{flex: 1, margin: '3%'}}>
                  <TouchableOpacity
                    onPress={() => this.setState({addMenuItemModal: false})}>
                    <Image
                      source={img.cancelIcon}
                      style={{
                        height: 16,
                        width: 16,
                        resizeMode: 'contain',
                        tintColor: 'white',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{height: hp('11%'), alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({showMenuItems: !showMenuItems, height: '50%'})
                }>
                <View
                  style={{
                    width: wp('80%'),
                    height: hp('7%'),
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    margin: '4%',
                    marginTop: 30,
                    alignItems: 'center',
                    borderRadius: 5,
                  }}>
                  <View style={{marginLeft: 10, width: wp('70%')}}>
                    <Text>Select Menu item</Text>
                  </View>
                  <View style={{width: wp('5%')}}>
                    <Image
                      source={img.arrowDownIcon}
                      style={{resizeMode: 'contain', height: 16, width: 16}}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* <View style={{height : hp('15%')}}>
              <View
                style={{
                  marginLeft: '5%',
                  marginRight: '15%',
                  height: hp('20%'),
                }}> */}
            <ScrollView>
              {showMenuItems ? (
                <View
                  style={{
                    marginLeft: '5%',
                    marginRight: '15%',
                    height: hp('40%'),
                  }}>
                  {menuItemsList.map(item => {
                    return (
                      <View style={{margin: '2%', flexDirection: 'row'}}>
                        <CheckBox
                          // editable={false}
                          onChange={() => this.addItemToList(item)}
                          style={{
                            backgroundColor: '#E9ECEF',
                            height: 20,
                            width: 20,
                          }}
                        />
                        <Text style={{marginLeft: 15}}>{item.name}</Text>
                      </View>
                    );
                  })}
                </View>
              ) : null}
            </ScrollView>
            {/* </View>
            </View> */}
            <View
              style={{
                flexDirection: 'row',
                margin: '5%',
              }}>
              <View style={{margin: '2%'}}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({addMenuItemModal: false, itemsAdded: []})
                  }
                  style={{
                    height: hp('5%'),
                    width: wp('35%'),
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: hp('1.5%'),
                    borderRadius: 100,
                    alignSelf: 'center',
                    flexDirection: 'row',
                  }}>
                  <View>
                    <Text style={{}}>Cancel </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{margin: '2%'}}>
                <TouchableOpacity
                  onPress={() => this.addItemToCategory()}
                  style={{
                    height: hp('5%'),
                    width: wp('35%'),
                    backgroundColor: '#94C036',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: hp('1.5%'),
                    borderRadius: 100,
                    alignSelf: 'center',
                    flexDirection: 'row',
                  }}>
                  <View>
                    <Text style={{color: 'white'}}>Apply </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
