import React, {Component, useState} from 'react';
import {NativeModules, SafeAreaView} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import RNPickerSelect from 'react-native-picker-select';
import ToggleSwitch from 'toggle-switch-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {MultipleSelectPicker} from 'react-native-multi-select-picker';
import Modal from 'react-native-modal';
import CheckBox from '@react-native-community/checkbox';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  getManualLogList,
  deleteManualLog,
  getManualLogsById,
  getManualLogTypes,
} from '../../connectivity/api';
import moment from 'moment';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {connect} from 'react-redux';
import MepScreen from '../Mep';
import SubHeader from '../../components/SubHeader';
import Header from '../../components/Header';
import HomeScreen from '../Home';
import img from '../../constants/images';
import {set} from 'react-native-reanimated';
import DatePicker from '../../components/DatePicker';

const axios = require('axios');
var minTime = new Date();
minTime.setHours(0);
minTime.setMinutes(0);
minTime.setMilliseconds(0);

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: null,
      setSelection: null,
      isShownPicker: false,
      applyStatus: false,
      selectectedItems: [],
      toggle: true,
      typeList: [],
      isLoading: true,
      SECTIONS: [],
      sectionData: {},
      textQuantity: '',
      note: '',
      show: false,
      activeSections: [],
      newItemModal: true,
      newItem: '',
      itemtype: '',
      detailsLoader: false,
      modalLogDetails: null,
      isDatePickerVisible: false,
      finalDate: '',
      itemType: null,
      newManualLog: {},
    };
  }

  hideDatePicker = () => {
    this.setState({
      isDatePickerVisible: false,
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

  showDatePicker = () => {
    this.setState({
      isDatePickerVisible: true,
    });
  };

  componentDidMount() {
    this.getManualLogListData();
    this.getManualLogTypesData();
  }

  collapseAll() {
    this.setState({activeSections: []});
  }

  getManualLogListData() {
    getManualLogList()
      .then(res => this.setState({SECTIONS: res.data, isLoading: false}))
      .catch(err => {
        console.warn('ERr', err.response);
      });
  }
  getManualLogTypesData() {
    getManualLogTypes()
      .then(res => this.setState({typeList: res.data}))
      .catch(err => {
        console.warn('ERr', err.response);
      });
  }

  _renderSectionTitle = section => {
    return <View style={{backgroundColor: '#EAEAF0'}}></View>;
  };

  _renderHeader = section => {
    const finalData = moment(section.loggedDate).format('dddd, MMM DD YYYY');
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#EAEAF0',
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: '#D1D1D6',
          height: 60,
          marginTop: hp('2%'),
        }}>
        <Image
          style={{
            height: 20,
            width: 20,
            resizeMode: 'contain',
          }}
          source={section.icon2}
        />
        <Text
          style={{
            color: '#98989B',
            fontSize: 15,
            fontWeight: 'bold',
            marginLeft: wp('2%'),
          }}>
          {finalData}
        </Text>
      </View>
    );
  };

  toggleButton() {
    this.setState({toggle: !this.state.toggle});
  }
  setModalVisibleLogDetails = (visible, data) => {
    this.setState(
      {
        modalLogDetails: visible,
        detailsLoader: true,
      },
      () =>
        getManualLogsById(data.id)
          .then(res => {
            this.setState({
              modalLogDetails: visible,
              logSectionData: res.data,
              detailsLoader: false,
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

  deleteLog(param) {
    let payload = {
      id: param.id,
      itemId: param.itemId,
      name: param.name,
      loggedDate: param.loggedDate,
      quantity: param.quantity,
      itemTypeId: param.itemTypeId,
      typeId: param.typeId,
      departmentId: param.departmentId,
      unitId: param.unitId,
      departmentName: param.departmentName,
      category: param.category,
      itemTypeName: param.itemTypeName,
      typeName: param.typeName,
      reviewed: param.reviewed,
      unit: param.unit,
      userId: param.userId,
      userFullName: param.userFullName,
      units: [
        {
          id: param.id,
          inventoryId: param.inventoryId,
          name: param.name,
          isDefault: param.isDefault,
          isVariable: param.isVariable,
          quantity: param.quantity,
          converter: param.converter,
          notes: param.notes,
          action: param.action,
        },
      ],
      notes: param.notes,
      inUse: param.inUse,
      countInInventory: param.countInInventory,
    };
    deleteManualLog(payload)
      .then(response => {
        this.setState({isLoading: true});
        this.getManualLogListData();
      })
      .catch(error => {
        console.warn(error);
      });
  }

  _renderContent = section => {
    return (
      <View style={{flex: 8}}>
        <View style={{flex: 4, flexDirection: 'row'}}></View>
        <View style={{flex: 1}}>
          <ScrollView horizontal={true}>
            <ToggleSwitch
              isOn={this.state.toggle}
              onColor="#94C01F"
              offColor="#CCCCCC"
              size="small"
              onToggle={isOn => this.toggleButton()}
            />
            <TouchableOpacity onPress={() => this.openNewItemModal(true)}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {section.name}
              </Text>
            </TouchableOpacity>
            {section.notes ? (
              <Text style={{marginLeft: 15, color: '#8C8C8C'}}>
                {section.notes}
              </Text>
            ) : null}
            <Text style={{marginLeft: 15, fontWeight: 'bold'}}>
              {section.itemTypeName}
            </Text>
            <Text style={{marginLeft: 15, fontWeight: 'bold'}}>
              {section.quantity} Units
            </Text>
            <Text style={{marginLeft: 15, fontWeight: 'bold'}}>
              {section.typeName}
            </Text>

            <Text style={{marginLeft: 15, fontWeight: 'bold'}}>
              {section.userFullName}
            </Text>
            <TouchableOpacity
              onPress={section => this.deleteLog(section)}
              style={{
                width: '12%',
                marginLeft: 15,
              }}>
              <Image
                style={{
                  height: 23,
                  width: 23,
                  tintColor: 'red',
                  resizeMode: 'contain',
                }}
                source={img.deleteIcon}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({activeSections});
  };

  openLogTypeDropdown(param) {
    this.setState({
      isShownPicker: param,
    });
  }

  openNewItemModal(param) {
    this.setState({newItemModal: param});
  }

  selectItem(value) {
    this.setState({newitem: 'new item'});
  }

  selectType(value) {
    this.setState({itemType: 'type'});
  }

  selectItemType(type, hide) {
    setTimeout(() => {
      this.setState({isShownPicker: hide, itemType: type});
    }, 500);
  }

  render() {
    const {
      isSelected,
      setSelection,
      newItemModal,
      isShownPicker,
      applyStatus,
      selectedItems,
      typeList,
      SECTIONS,
      textQuantity,
      activeSections,
      finalDate,
      isDatePickerVisible,
      itemType,
    } = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <ScrollView style={{marginBottom: hp('5%')}}>
          <View
            style={{
              flex: 2,
              borderBottomColor: '#ada9a9',
              borderBottomWidth: 1,
            }}>
            <Header />
          </View>
          <View style={{flex: 3}}>
            <SubHeader />
          </View>
          <View
            className="header"
            style={{height: hp('20%'), backgroundColor: '#412916'}}>
            <View style={{flex: 2, alignItems: 'center'}}>
              <Text style={{margin: 5, color: 'white', fontSize: 20}}>
                MANUAL LOG
              </Text>
            </View>
            <View style={{flex: 4, alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => this.openNewItemModal(!newItemModal)}
                style={{
                  height: '70%',
                  width: '90%',
                  backgroundColor: '#94C036',
                  marginTop: '1%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: 'white', fontSize: 17}}>New</Text>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                backDropOpacity={0.35}
                visible={newItemModal}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                  this.openNewItemModal(!newItemModal);
                }}>
                <View
                  style={{
                    flex: 16,

                    marinTop: 20,
                    backgroundColor: '#ffff',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      marginTop: 20,
                      backgroundColor: '#412916',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View style={{marginLeft: 10}}>
                      <Text style={{color: 'white'}}>
                        Manual log- Add new item
                      </Text>
                    </View>
                    <View style={{}}>
                      <Pressable
                        style={{borderRadius: 20, padding: 10, elevation: 2}}
                        onPress={() => this.openNewItemModal(!newItemModal)}>
                        <Image
                          style={{
                            height: 18,
                            width: 18,
                            tintColor: 'white',
                            resizeMode: 'contain',
                          }}
                          source={img.cancelIcon}
                        />
                      </Pressable>
                    </View>
                  </View>

                  <View style={{flex: 1, margin: 10}}>
                    <View style={{}}>
                      <TouchableOpacity
                        onPress={() => this.showDatePicker()}
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
                    </View>
                    <View>
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
                  <View style={{flex: 1, margin: 10}}>
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        marginBottom: hp('4%'),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
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
                  </View>

                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        height: 40,
                        margin: 10,
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
                  </View>
                  <View
                    style={{
                      flex: 10,
                      margin: 10,
                      marginBottom: '90%',
                      justifyContent: 'center',
                    }}>
                    <View style={{flex: 2}}>
                      <TouchableOpacity
                        onPress={() => {
                          this.openLogTypeDropdown(!isShownPicker);
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
                      {isShownPicker ? (
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
                                      !isShownPicker,
                                    )
                                  }
                                  style={{margin: 5, height: 20, width: 20}}
                                />
                                <Text style={{margin: 5}}>{item.name}</Text>
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

                      <View
                        style={{
                          flex: 8,
                          backgroundColor: '',
                          flexDirection: 'row',
                          alignItems: 'stretch',
                        }}>
                        <View style={{flex: 4}}>
                          <TouchableOpacity
                            onPress={() => this.openNewItemModal(!newItemModal)}
                            style={{
                              flexDirection: 'row',
                              height: 40,
                              width: 160,
                              backgroundColor: '#94C01F',
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginTop: '1%',
                            }}>
                            <View>
                              <View
                                style={{
                                  flex: 1,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                }}>
                                <Image
                                  style={{
                                    height: 20,
                                    width: 20,
                                    tintColor: 'white',
                                    resizeMode: 'contain',
                                    marginLeft: 5,
                                  }}
                                  source={img.checkIcon}
                                />
                                <Text
                                  style={{
                                    marginLeft: 5,
                                    color: 'white',
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                  }}>
                                  Save
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={{flex: 4}}>
                          <TouchableOpacity
                            onPress={() => this.openNewItemModal(!newItemModal)}
                            style={{
                              flexDirection: 'row',
                              height: 40,
                              width: 160,
                              backgroundColor: '#E6940B',
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginTop: '1%',
                            }}>
                            <View>
                              <View
                                style={{
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                }}>
                                <Image
                                  style={{
                                    height: 20,
                                    width: 20,
                                    tintColor: 'white',
                                    resizeMode: 'contain',
                                    marginLeft: 5,
                                  }}
                                  source={img.cancelIcon}
                                />
                                <Text
                                  style={{
                                    marginLeft: 5,
                                    color: 'white',
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                  }}>
                                  Close
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
            <View style={{flex: 4, alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  height: '70%',
                  width: '90%',
                  backgroundColor: '#94C036',
                  marginTop: '1%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => this.props.navigation.navigate('HomeScreen')}>
                <Text style={{color: 'white'}}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 6}}>
            <View style={{flex: 4, alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => this.collapseAll()}
                style={{
                  height: '70%',
                  width: '90%',
                  backgroundColor: '#94C036',
                  marginTop: '3%%',
                  marginBottom: '7%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: 'white', fontSize: 17}}>Collapse all</Text>
              </TouchableOpacity>
            </View>

            {this.state.isLoading ? (
              <ActivityIndicator color="#94C036" />
            ) : (
              <View style={{marginBottom: 10, marginLeft: 10, marginRight: 10}}>
                <Accordion
                  underlayColor="#fff"
                  expandMultiple
                  sections={SECTIONS}
                  activeSections={activeSections}
                  renderSectionTitle={this._renderSectionTitle}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                  onChange={this._updateSections}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default index;
