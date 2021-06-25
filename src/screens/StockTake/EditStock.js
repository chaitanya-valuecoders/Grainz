import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  TextInput,
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
import {getMyProfileApi, addStockTakeApi} from '../../connectivity/api';
import RNPickerSelect from 'react-native-picker-select';
import styles from './style';

import {translate} from '../../utils/translations';

class EditStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      recipeLoader: false,
      buttonsSubHeader: [],
      finalName: '',
      sectionName: '',
      modalLoader: true,
      unitData: [],
      editableStatus: false,
      inventoryId: '',
      pageDate: '',
      pageData: '',
      departmentData: '',
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
          recipeLoader: false,
          buttonsSubHeader: [
            {name: translate('ADMIN')},
            {name: translate('Setup')},
            {name: translate('INBOX')},
          ],
        });
      })
      .catch(err => {
        this.setState({
          recipeLoader: false,
        });
        console.warn('ERr', err);
      });
  };

  componentDidMount() {
    this.getData();
    const {item, pageDate, inventoryId, departmentData} =
      this.props.route && this.props.route.params;
    console.log('pageDate', pageDate);
    console.log('inventoryId', inventoryId);

    let finalUnitData = item.units.map((item, index) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    if (item.updateStockTakeItems === null) {
      this.setState({
        sectionName: 'Test',
        finalName: item.name,
        modalData: [],
        modalLoader: false,
        unitData: [...finalUnitData],
        pageDate,
        inventoryId,
        departmentData,
      });
    } else {
      let finalModalData =
        item.updateStockTakeItems &&
        item.updateStockTakeItems.map((item, index) => {
          return {
            action: 'Update',
            id: null,
            inventoryId: item.inventoryId,
            isDefault: item.isDefault,
            quantity: String(item.quantity),
            recipeId: null,
            stockTakeDate: item.stockTakeDate,
            unit: item.unit,
            unitId: item.unitId,
            createdBy: item.createdBy,
            converter: item.converter,
            stockTakeInventoryId: item.stockTakeInventoryId,
          };
        });
      this.setState({
        sectionName: 'Test',
        finalName: item.name,
        modalData: [...finalModalData],
        modalLoader: false,
        unitData: [...finalUnitData],
        pageDate,
        inventoryId,
        pageData: item,
        departmentData,
      });
    }
  }

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = () => {
    this.props.navigation.goBack();
  };

  actionFun = (data, index) => {
    console.log('data', data);

    Alert.alert('Grainz', 'Choose your option?', [
      {
        text: 'Edit',
        onPress: () =>
          this.setState({
            editableStatus: true,
          }),
      },
      {
        text: 'Delete',
        onPress: () => this.deleteQuantityFun(data, index),
      },
    ]);
  };

  deleteQuantityFun = (item, index) => {
    Alert.alert('Are you sure?', "You won't be able to revert this!", [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => this.deleteFun(item, index),
      },
    ]);
  };

  deleteFun = (item, index) => {
    console.log('ITEM', item);

    const {pageDate} = this.state;

    let payload = [
      {
        action: 'Delete',
        convertor: item.converter,
        id: null,
        inventoryId: item.inventoryId,
        isDefault: item.isDefault,
        quantity: item.quantity,
        recipeId: null,
        stockTakeDate: item.stockTakeDate,
        stockTakeInventoryId: item.stockTakeInventoryId,
        stockTakeRecipeId: null,
        unit: item.unit,
        unitId: item.unitId,
      },
    ];

    console.log('PAYLOAD', payload);

    if (item.action === 'Update') {
      addStockTakeApi(payload)
        .then(res => {
          this.setState({
            isModalVisible: false,
          });
          Alert.alert('Grainz', 'Stock trade deleted successfully', [
            {
              text: 'Okay',
              onPress: () => this.removeFromList(index),
            },
          ]);
        })
        .catch(error => {
          console.warn('DELETEerror', error.response);
        });
    } else {
      this.removeFromList(index);
    }
  };

  removeFromList = index => {
    let temp = this.state.modalData;
    temp.splice(index, 1);
    this.setState({modalData: temp});
  };

  editOfferItemsFun = (index, type, value) => {
    const {modalData, unitData} = this.state;
    console.log('unitDa', unitData);

    let newArr = modalData.map((item, i) =>
      index === i
        ? {
            ...item,
            [type]: value,
            ['unit']: 'ml',
            ['createdBy']: 'Nick Balfour',
            ['convertor']: 1,
          }
        : item,
    );
    this.setState({
      modalData: [...newArr],
    });
  };

  addDataInArrFun = () => {
    let objSec = {};
    let newlist = [];
    const {modalData, pageDate, inventoryId} = this.state;
    objSec = {
      action: 'New',
      convertor: 1,
      id: null,
      inventoryId: inventoryId,
      isDefault: true,
      quantity: '',
      recipeId: null,
      stockTakeDate: pageDate,
      unit: '',
      unitId: '',
      createdBy: '',
      converter: '',
    };
    newlist.push(objSec);
    this.setState({
      modalData: [...modalData, ...newlist],
      editableStatus: true,
    });
  };

  saveFun = () => {
    const {modalData} = this.state;

    console.log('modalData', modalData);

    let payload = modalData;

    console.log('PAYLOAD', payload);

    addStockTakeApi(payload)
      .then(res => {
        Alert.alert('Grainz', 'Stock trade added successfully', [
          {
            text: 'Okay',
            onPress: () =>
              this.setState({
                editableStatus: false,
              }),
          },
        ]);
      })
      .catch(error => {
        console.warn('Adderror', error.response);
      });
  };

  render() {
    const {
      buttonsSubHeader,
      recipeLoader,
      modalData,
      finalName,
      modalLoader,
      sectionName,
      unitData,
      editableStatus,
      pageData,
      pageDate,
      departmentData,
    } = this.state;

    console.log('modalData', modalData);

    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {recipeLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} index={0} />
        )}
        <ScrollView
          style={{marginBottom: hp('2%')}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            <View style={styles.firstContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.adminTextStyle}> {finalName}</Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => this.addDataInArrFun()}
            style={{
              height: hp('6%'),
              width: wp('80%'),
              backgroundColor: '#94C036',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: hp('2%'),
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
                Add Line
              </Text>
            </View>
          </TouchableOpacity>

          {recipeLoader ? (
            <ActivityIndicator size="small" color="#94C036" />
          ) : (
            <View style={{}}>
              <ScrollView>
                {modalLoader ? (
                  <ActivityIndicator size="large" color="grey" />
                ) : (
                  <View
                    style={{
                      padding: hp('2%'),
                    }}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      <View>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}>
                          <View>
                            <View
                              style={{
                                paddingVertical: 15,
                                paddingHorizontal: 5,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                backgroundColor: '#EFFBCF',
                              }}>
                              <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}>
                                <Text style={{textAlign: 'center'}}>
                                  Quantity
                                </Text>
                              </View>
                              <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}>
                                <Text>Unit</Text>
                              </View>
                              <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}>
                                <Text>Inventory</Text>
                              </View>
                              <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}>
                                <Text>Name</Text>
                              </View>
                              <View
                                style={{
                                  width: wp('30%'),
                                  alignItems: 'center',
                                }}>
                                <Text>Action</Text>
                              </View>
                            </View>
                            <View>
                              {modalData && modalData.length > 0 ? (
                                modalData.map((item, index) => {
                                  return (
                                    <View
                                      style={{
                                        paddingVertical: 15,
                                        paddingHorizontal: 5,
                                        flexDirection: 'row',
                                        backgroundColor:
                                          index % 2 === 0
                                            ? '#FFFFFF'
                                            : '#F7F8F5',
                                      }}>
                                      <View
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                        }}>
                                        <TextInput
                                          editable={editableStatus}
                                          style={{
                                            paddingVertical: 10,
                                            borderColor: '#00000033',
                                            borderWidth: 1,
                                            width: wp('20%'),
                                            paddingLeft: 10,
                                            backgroundColor: editableStatus
                                              ? '#fff'
                                              : '#E9ECEF',
                                          }}
                                          multiline={true}
                                          numberOfLines={1}
                                          onChangeText={value => {
                                            this.editOfferItemsFun(
                                              index,
                                              'quantity',
                                              value,
                                            );
                                          }}
                                          value={item.quantity}
                                        />
                                      </View>
                                      <View
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                        }}>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            width: wp('25%'),
                                            backgroundColor: '#fff',
                                            justifyContent: 'space-between',
                                            borderWidth: 1,
                                            paddingVertical: 8,
                                            borderColor: '#00000033',
                                            backgroundColor: editableStatus
                                              ? '#fff'
                                              : '#E9ECEF',
                                          }}>
                                          <View
                                            style={{
                                              width: wp('20%'),
                                              alignSelf: 'center',
                                              justifyContent: 'center',
                                            }}>
                                            <RNPickerSelect
                                              placeholder={{
                                                label: 'Unit*',
                                                value: null,
                                                color: 'black',
                                              }}
                                              placeholderTextColor="red"
                                              disabled={!editableStatus}
                                              onValueChange={value => {
                                                this.editOfferItemsFun(
                                                  index,
                                                  'unitId',
                                                  value,
                                                );
                                              }}
                                              style={{
                                                inputIOS: {
                                                  fontSize: 14,
                                                  paddingHorizontal: '3%',
                                                  color: '#161C27',
                                                  width: '100%',
                                                  alignSelf: 'center',
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
                                              items={unitData}
                                              value={item.unitId}
                                              useNativeAndroidPickerStyle={
                                                false
                                              }
                                            />
                                          </View>
                                          <View style={{marginRight: wp('5%')}}>
                                            <Image
                                              source={img.arrowDownIcon}
                                              resizeMode="contain"
                                              style={{
                                                height: 10,
                                                width: 10,
                                                resizeMode: 'contain',
                                                marginTop:
                                                  Platform.OS === 'ios'
                                                    ? 3
                                                    : 15,
                                              }}
                                            />
                                          </View>
                                        </View>
                                      </View>
                                      <View
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                          paddingVertical: 10,
                                        }}>
                                        <Text>
                                          {item.quantity * item.converter} ml
                                        </Text>
                                      </View>
                                      <View
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                          paddingVertical: 10,
                                        }}>
                                        <Text>{item.createdBy}</Text>
                                      </View>
                                      <TouchableOpacity
                                        onPress={() =>
                                          this.actionFun(item, index)
                                        }
                                        style={{
                                          width: wp('30%'),
                                          alignItems: 'center',
                                          paddingVertical: 10,
                                        }}>
                                        <Image
                                          source={img.threeDotsIcon}
                                          style={{
                                            height: 15,
                                            width: 15,
                                            resizeMode: 'contain',
                                          }}
                                        />
                                      </TouchableOpacity>
                                    </View>
                                  );
                                })
                              ) : (
                                <View style={{marginTop: hp('3%')}}>
                                  <Text style={{color: 'red', fontSize: 20}}>
                                    No data available
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </ScrollView>
                      </View>
                    </ScrollView>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
          {editableStatus ? (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: hp('2%'),
                }}>
                <TouchableOpacity
                  onPress={() => this.saveFun()}
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
                  onPress={() => this.props.navigation.goBack()}
                  style={{
                    width: wp('30%'),
                    height: hp('5%'),
                    alignSelf: 'flex-end',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: wp('2%'),
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: '#482813',
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
          ) : null}
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

export default connect(mapStateToProps, {UserTokenAction})(EditStock);