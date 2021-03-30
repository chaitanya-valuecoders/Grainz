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
import HomeScreen from '../Home';
import img from '../../constants/images';
import {set} from 'react-native-reanimated';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdowns: [
        {
          id: 0,
          name: 'Today',
          icon1: img.arrowRightIcon,
          icon2: img.arrowDownIcon,
          showLog: false,
          data: [
            {name: 'baguette', type: 'Inventory', units: 20},
            {name: 'baguette', type: 'Inventory', units: 20},
            {name: 'baguette', type: 'Inventory', units: 20},
          ],
        },
        {
          id: 1,
          name: 'Tuesday',
          icon1: img.arrowRightIcon,
          icon2: img.arrowDownIcon,
          showLog: false,
          data: [
            {name: 'baguette', type: 'Inventory', units: 20},
            {name: 'baguette', type: 'Inventory', units: 20},
            {name: 'baguette', type: 'Inventory', units: 20},
          ],
        },
        {
          id: 2,
          name: 'Wednesday',
          icon1: img.arrowRightIcon,
          icon2: img.arrowDownIcon,
          showLog: false,
          data: [
            {name: 'baguette', type: 'Inventory', units: 20},
            {name: 'baguette', type: 'Inventory', units: 20},
            {name: 'baguette', type: 'Inventory', units: 20},
          ],
        },
        {
          id: 3,
          name: 'Thursday',
          icon1: img.arrowRightIcon,
          icon2: img.arrowDownIcon,
          showLog: false,
          data: [
            {name: 'baguette', type: 'Inventory', units: 20},
            {name: 'baguette', type: 'Inventory', units: 20},
            {name: 'baguette', type: 'Inventory', units: 20},
          ],
        },
      ],
    };
  }

  showData(visible, id) {
    const copied = [...this.state.dropdowns];
    copied[id].showLog = visible;
    this.setState({dropdowns: copied});
  }

  render() {
    return (
      <View style={{flex: 1}}>
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
              <Text style={{color: 'white', fontSize: 17}}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 25}}>
          <View style={{flex: 2, alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                height: '50%',
                width: '90%',
                backgroundColor: '#94C036',
                marginTop: '5%%',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontSize: 17}}>Collapse all</Text>
            </TouchableOpacity>
          </View>

          {this.state.dropdowns.map(item => {
            return (
              <View style={{flex: 3, alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => this.showData(!item.showLog, item.id)}
                  style={{
                    height: '35%',
                    width: '90%',
                    backgroundColor: '#EAEAF0',
                    marginTop: '1%',
                    borderColor: '#D1D1D6',
                    borderWidth: 1,
                    flexDirection: 'row',
                  }}>
                  <View>
                    {item.showLog ? (
                      <View>
                        <Image
                          style={{
                            height: 20,
                            width: 20,
                            resizeMode: 'contain',
                          }}
                          source={item.icon2}
                        />
                        <Text>{item.data.name}</Text>
                      </View>
                    ) : (
                      <Image
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: 'contain',
                        }}
                        source={item.icon1}
                      />
                    )}
                  </View>
                  <View>
                    <Text style={{fontSize: 17}}>{item.name}</Text>
                  </View>
                  <View></View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

export default index;
