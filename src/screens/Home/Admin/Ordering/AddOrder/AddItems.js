import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../../../../constants/images';
import SubHeader from '../../../../../components/SubHeader';
import Header from '../../../../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../../../../redux/actions/UserTokenAction';
import {
  getMyProfileApi,
  getInventoryBySupplierIdApi,
  getSupplierCatalogApi,
} from '../../../../../connectivity/api';
import Accordion from 'react-native-collapsible/Accordion';
import styles from '../style';
import RNPickerSelect from 'react-native-picker-select';

import {translate} from '../../../../../utils/translations';

class AddItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      modalVisible: false,
      firstName: '',
      activeSections: [],
      SECTIONS: [],
      recipeLoader: true,
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
      SECTIONS_SEC_INVEN: [],
      modalVisibleSetup: false,
      modalData: [],
      modalLoader: false,
      sectionName: '',
      categoryLoader: false,
      supplierStatus: false,
      inventoryStatus: true,
      supplierId: '',
      screenType: '',
      basketId: '',
      SECTIONS_SEC_SUPP: [],
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
          recipeLoader: false,
        });
      })
      .catch(err => {
        console.warn('ERr', err);
      });
  };

  getManualLogsData = () => {
    this.setState(
      {
        modalLoader: true,
      },
      () => this.createFirstData(),
    );
  };

  getSupplierData = () => {
    this.setState(
      {
        modalLoader: true,
      },
      () => this.createSupplierData(),
    );
  };

  createSupplierData = () => {
    const {supplierId} = this.state;
    getSupplierCatalogApi(supplierId)
      .then(res => {
        console.log('res', res);
        let finalArray = res.data.map((item, index) => {
          return {
            title: item,
            content: item,
          };
        });

        const result = finalArray;

        this.setState({
          SECTIONS: [...result],
          modalLoader: false,
          SECTIONS_SEC_SUPP: [...result],
        });
      })
      .catch(err => {
        console.log('ERR MEP', err);

        this.setState({
          modalLoader: false,
        });
      });
  };

  createFirstData = () => {
    const {supplierId} = this.state;
    getInventoryBySupplierIdApi(supplierId)
      .then(res => {
        console.log('res', res);
        let finalArray = res.data.map((item, index) => {
          return {
            title: item.name,
            content: item.id,
            departmentName: item.departmentName,
          };
        });

        const result = finalArray;

        this.setState({
          SECTIONS: [...result],
          modalLoader: false,
          SECTIONS_SEC_INVEN: [...result],
        });
      })
      .catch(err => {
        console.log('ERR MEP', err);

        this.setState({
          modalLoader: false,
        });
      });
  };

  componentDidMount() {
    this.getData();
    this.props.navigation.addListener('focus', () => {
      const {supplierValue, screen, basketId, navigateType} =
        this.props.route && this.props.route.params;
      this.setState(
        {
          supplierId: supplierValue,
          activeSections: [],
          supplierStatus: false,
          inventoryStatus: true,
          screenType: screen,
          basketId,
          navigateType,
          departmentName: '',
        },
        () => this.getManualLogsData(),
      );
    });
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
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          borderWidth: 0.5,
          borderColor: '#F0F0F0',
          height: 60,
          marginTop: hp('2%'),
          alignItems: 'center',
          borderRadius: 6,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
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
            {section.title}
          </Text>
        </View>

        <View style={{flex: 1}}>
          <Text
            style={{
              color: '#492813',
              fontSize: 14,
              fontFamily: 'Inter-Regular',
            }}>
            {section.departmentName}
          </Text>
        </View>
      </View>
    );
  };

  _renderContent = section => {
    const {categoryLoader, catArray} = this.state;
    return <View></View>;
  };

  _updateSections = activeSections => {
    const {inventoryStatus} = this.state;
    if (inventoryStatus) {
      this.setState(
        {
          activeSections,
          categoryLoader: false,
        },
        () => this.updateSubFun(),
      );
    } else {
      this.setState(
        {
          activeSections,
        },
        () => this.updateSubFun(),
      );
    }
  };

  updateSubFun = () => {
    const {inventoryStatus} = this.state;
    if (inventoryStatus) {
      const {
        SECTIONS,
        activeSections,
        supplierId,
        screenType,
        basketId,
        navigateType,
      } = this.state;
      if (activeSections.length > 0) {
        const catId = SECTIONS[activeSections].content;
        const catName = SECTIONS[activeSections].title;
        this.props.navigation.navigate('InventoryListOrderScreen', {
          supplierId,
          catName,
          catId,
          screenType,
          basketId,
          navigateType,
        });
      } else {
        this.setState({
          activeSections: [],
          categoryLoader: false,
        });
      }
    } else {
      const {
        supplierId,
        SECTIONS,
        activeSections,
        screenType,
        basketId,
        navigateType,
      } = this.state;
      const catName = SECTIONS[activeSections].title;
      if (activeSections.length > 0) {
        this.props.navigation.navigate('SupplierlistOrderScreen', {
          supplierId,
          catName,
          screenType,
          basketId,
          navigateType,
        });
      } else {
        this.setState({
          activeSections: [],
          categoryLoader: false,
        });
      }
    }
  };

  setAdminModalVisible = visible => {
    this.setState({
      modalVisibleSetup: visible,
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
    const {inventoryStatus, SECTIONS_SEC_INVEN, SECTIONS_SEC_SUPP} = this.state;
    const finalValue = inventoryStatus ? SECTIONS_SEC_INVEN : SECTIONS_SEC_SUPP;

    //passing the inserted text in textinput
    const newData = finalValue.filter(function (item) {
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

  inventoryFun = () => {
    this.setState(
      {
        supplierStatus: false,
        inventoryStatus: true,
        activeSections: [],
      },
      () => this.getManualLogsData(),
    );
  };

  supplierFun = () => {
    this.setState(
      {
        supplierStatus: true,
        inventoryStatus: false,
        activeSections: [],
      },
      () => this.getSupplierData(),
    );
  };

  selectDepartementNameFun = value => {
    console.log('value', value);
    this.setState(
      {
        departmentName: value,
      },
      () => this.filterDepartmentData(value),
    );
  };

  filterDepartmentData = value => {
    this.filterDataDepartmentName(value);
  };

  filterDataDepartmentName = value => {
    console.log('value', value);

    //passing the inserted text in textinput
    const newData = this.state.SECTIONS_SEC_INVEN.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.departmentName
        ? item.departmentName.toUpperCase()
        : ''.toUpperCase();
      const textData = value !== null ? value.toUpperCase() : '';
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      SECTIONS: newData,
    });
  };

  render() {
    const {
      recipeLoader,
      SECTIONS,
      activeSections,
      buttonsSubHeader,
      supplierStatus,
      inventoryStatus,
      searchItem,
      modalLoader,
      screenType,
      basketId,
      departmentName,
    } = this.state;

    console.log('inventoryStatus', inventoryStatus);

    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {recipeLoader ? (
          <ActivityIndicator color="#94C036" size="small" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} index={0} />
        )}
        <ScrollView
          style={{marginBottom: hp('5%')}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            <View style={styles.firstContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.adminTextStyle}>Order/Product List</Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: wp('8%'),
                marginVertical: hp('2%'),
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => this.inventoryFun()}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  borderBottomColor: inventoryStatus ? '#82A72F' : '#D8DCE6',
                  borderBottomWidth: 3,
                  paddingBottom: 5,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: inventoryStatus
                      ? 'Inter-Regular'
                      : 'Inter-SemiBold',
                    color: inventoryStatus ? '#82A72F' : '#D8DCE6',
                  }}>
                  InventoryList
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.supplierFun()}
                style={{
                  flex: 1,
                  borderBottomColor: supplierStatus ? '#82A72F' : '#D8DCE6',
                  borderBottomWidth: 3,
                  paddingBottom: 5,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: supplierStatus
                      ? 'Inter-Regular'
                      : 'Inter-SemiBold',
                    color: supplierStatus ? '#82A72F' : '#D8DCE6',
                  }}>
                  Supplier catalog
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {inventoryStatus ? (
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 100,
                backgroundColor: '#fff',
                marginHorizontal: wp('5%'),
                marginVertical: hp('2%'),
              }}>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: wp('80%'),
                }}>
                <RNPickerSelect
                  placeholder={{
                    label: 'Select Department*',
                    value: null,
                    color: 'black',
                  }}
                  onValueChange={value => {
                    this.selectDepartementNameFun(value);
                  }}
                  style={{
                    inputIOS: {
                      fontSize: 14,
                      paddingHorizontal: '5%',
                      color: '#161C27',
                      width: '100%',
                      alignSelf: 'center',
                      paddingVertical: 15,
                    },
                    inputAndroid: {
                      fontSize: 14,
                      paddingHorizontal: '3%',
                      color: '#161C27',
                      width: '100%',
                      alignSelf: 'center',
                    },
                    iconContainer: {
                      top: '40%',
                    },
                  }}
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
                  value={departmentName}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
              <View style={{marginRight: wp('5%')}}>
                <Image
                  source={img.arrowDownIcon}
                  resizeMode="contain"
                  style={{
                    height: 18,
                    width: 18,
                    resizeMode: 'contain',
                    marginTop: Platform.OS === 'ios' ? 15 : 15,
                  }}
                />
              </View>
            </View>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#E2E8F0',
              height: hp('7%'),
              width: wp('90%'),
              borderRadius: 100,
              backgroundColor: '#fff',
              alignSelf: 'center',
              justifyContent: 'space-between',
              marginTop: hp('2%'),
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

          {modalLoader ? (
            <ActivityIndicator color="#94C036" size="large" />
          ) : (
            <View style={{marginTop: hp('2%'), marginHorizontal: wp('5%')}}>
              <Accordion
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

export default connect(mapStateToProps, {UserTokenAction})(AddItems);
