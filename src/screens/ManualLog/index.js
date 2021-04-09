import React, {Component, useState} from 'react';
import {NativeModules, SafeAreaView} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import RNPickerSelect from 'react-native-picker-select';
import ToggleSwitch from 'toggle-switch-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {getManualLogList, deleteManualLog} from '../../connectivity/api';
import moment from 'moment';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
  Modal,
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

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: true,
      isLoading: true,
      SECTIONS: [],
      sectionData: {},
      textQuantity: '',
      note: '',
      show: false,
      activeSections: [],
      newItemModal: false,
      newItem: '',
      itemtype: '',
    };
  }

  componentDidMount() {
    this.getManualLogListData();
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
            <Text style={{marginLeft: 15, fontWeight: 'bold'}}>
              {section.name}
            </Text>
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

  openNewItemModal(param) {
    this.setState({newItemModal: param});
  }

  selectItem(value) {
    this.setState({newitem: 'new item'});
  }

  selectType(value) {
    this.setState({itemType: 'type'});
  }

  render() {
    const {newItemModal, SECTIONS, activeSections} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
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
                backDropOpacity={1}
                visible={newItemModal}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                  this.openNewItemModal(!newItemModal);
                }}>
                <View
                  style={{
                    marinTop: 20,
                    flex: 1,

                    justifyContent: 'center',
                  }}>
                  <View style={{flex: 1, opacity: 0}}></View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      flex: 2,
                      backgroundColor: '#412916',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View style={{flex: 7, marginLeft: 10}}>
                      <Text style={{color: 'white'}}>
                        Manual log- Add new item
                      </Text>
                    </View>
                    <View style={{flex: 1}}>
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
                  <View style={{flex: 20}}>
                    <View style={{flex: 2, margin: 10}}>
                      <DatePicker />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        margin: 10,
                        borderWidth: 1,
                        borderColor: '#A2A2A2',
                        padding: 10,
                        justifyContent: 'center',
                      }}>
                      <RNPickerSelect
                        onValueChange={value => this.selectItem(value)}
                        placeholder={{label: 'Select', value: null}}
                        items={[
                          {label: 'Bar', value: 'Bar'},
                          {label: 'Restaurant', value: 'Restaurant'},
                          {label: 'Other', value: 'Other'},
                          {label: 'Retail', value: 'Retail'},
                        ]}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        margin: 10,
                        borderWidth: 1,
                        borderColor: '#A2A2A2',
                        padding: 10,
                        justifyContent: 'center',
                      }}>
                      <TextInput
                        onChangeText={textQuantity =>
                          this.setState({textQuantity})
                        }
                        value={this.state.textQuantity}
                        placeholder="quantity"
                      />
                    </View>
                    <Text style={{margin: 10}}>Note :</Text>
                    <View
                      style={{
                        flex: 4,
                        margin: 10,
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
                        flex: 1,
                        margin: 10,
                        borderWidth: 1,
                        borderColor: '#A2A2A2',
                        padding: 10,
                      }}>
                      {/* <RNPickerSelect
                        onValueChange={value => this.selectType(value)}
                        placeholder={{label: 'Select type', value: null}}
                        items={this.state.dataSource}
                      /> */}
                    </View>

                    <View
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        borderColor: '#A2A2A2',
                        marginTop: 15,
                        flexDirection: 'row',
                        flex: 12,
                      }}>
                      <View style={{flex: 2, alignItems: 'center'}}>
                        <TouchableOpacity
                          onPress={() => this.openNewItemModal(!newItemModal)}
                          style={{
                            flexDirection: 'row',
                            height: '15%',
                            width: '65%',
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

                      <View style={{flex: 2}}>
                        <TouchableOpacity
                          onPress={() => this.openNewItemModal(!newItemModal)}
                          style={{
                            flexDirection: 'row',
                            height: '15%',
                            width: '65%',
                            backgroundColor: '#E6940B',
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
              <View style={{ marginBottom: 10, marginLeft: 10, marginRight: 10}}>
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
