import React, {Component, useState} from 'react';
import {NativeModules} from 'react-native';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
  Modal,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {connect} from 'react-redux';
import MepScreen from '../Mep';
import SubHeader from '../../components/SubHeader';
import img from '../../constants/images';
import {set} from 'react-native-reanimated';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {name: 'History', icon: img.historyIcon},
        {name: 'Add new', icon: img.addIcon},
        {name: 'Back'},
      ],

      modalVisible: false,
    };
  }

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  render() {
    const {modalVisible} = this.state;
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 2}}>
          <SubHeader />
        </View>
        <View
          style={{
            backgroundColor: '#412916',
            flex: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 22, color: 'white', marginTop: 8}}>
            MISE-EN-PLACE
          </Text>
          {this.state.buttons.map(item => {
            return (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={() => this.setModalVisible(true)}
                  style={{
                    flexDirection: 'row',
                    height: '60%',
                    width: '50%',
                    backgroundColor: '#94C036',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '1%',
                    borderRadius: 10,
                  }}>
                  <View style={{flex: 1}}>
                    <Image
                      source={item.icon}
                      style={{
                        marginLeft: 8,
                        height: 20,
                        width: 20,
                        tintColor: 'white',
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                  <View style={{flex: 2}}>
                    <Text style={{color: 'white'}}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
                <View>
                  <Modal
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => {
                      Alert.alert('Modal has been closed.');
                      this.setModalVisible(!modalVisible);
                    }}>
                    <View style={{flex: 1}}>
                      <View
                        style={{backGroundColor: 'brown', flex: 1}}
                        className="header">
                        <Text>MISE-EN-PLACE HISTORY</Text>
                      </View>
                      <View style={{flex: 13}}>
                        <Text>history</Text>
                        <TouchableOpacity
                          onPress={() => this.setModalVisible(!modalVisible)}
                          style={{
                            flexDirection: 'row',
                            height: '5%',
                            width: '25%',
                            backgroundColor: '#F4A522',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '1%',
                            borderRadius: 10,
                          }}>
                          <Text>Close</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View></View>
                  </Modal>
                </View>
              </View>
            );
          })}
        </View>
        <View style={{flex: 13}}>
          <Text></Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 10,
    width: '50%',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#E6940B',
  },
});

export default index;
