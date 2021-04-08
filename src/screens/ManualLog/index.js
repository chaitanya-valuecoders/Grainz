import React, {Component, useState} from 'react';
import {NativeModules, SafeAreaView} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import RNPickerSelect from 'react-native-picker-select';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {getManualLogList} from '../../connectivity/api';
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
      isLoading: true,
      dataSource: [],
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

  getManualLogListData() {
    getManualLogList()
      .then(res => this.setState({dataSource: res.data, isLoading: false}))
      .catch(err => {
        console.warn('ERr', err.response);
      });
  }

  showLog() {
    this.setState({show: true});
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

  render() {
    const {newItemModal} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
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
        <View className="header" style={{flex: 8, backgroundColor: '#412916'}}>
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
                borderRadius: 10,
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
                    <RNPickerSelect
                      onValueChange={value => this.selectType(value)}
                      placeholder={{label: 'Select type', value: null}}
                      items={this.state.dataSource}
                    />
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
                          borderRadius: 10,
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
                          borderRadius: 10,
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
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.props.navigation.navigate('HomeScreen')}>
              <Text style={{color: 'white'}}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 6}}>
          <View style={{flex: 8, alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                height: '60%',
                width: '90%',
                backgroundColor: '#94C036',
                marginTop: '3%%',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontSize: 17}}>Collapse all</Text>
            </TouchableOpacity>
          </View>

        </View>
        {/* <View style={{flex: 10}}>
          <View style={{flex: 3}}>
            {this.state.isLoading ? (
              <View>
                <ActivityIndicator />
              </View>
            ) : (
              <View>
                {this.state.dataSource.map((item, key) => {
                  return (
                    <View key={key}>
                      <Text>{item.name}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View> */}
        {/* </View>
         */}
         <View style={{flex : 10}}>
           <View>
             <TouchableOpacity></TouchableOpacity>
           </View>

         </View>
      </SafeAreaView>
    );
  }
}

export default index;
