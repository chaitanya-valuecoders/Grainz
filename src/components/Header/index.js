import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, Switch} from 'react-native';
import styles from './style';
import img from '../../constants/images';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}>
          <TouchableOpacity
            onPress={this.props.logoFun}
            style={{
              flex: 2,
              marginLeft: 20,
            }}>
            <Image
              source={img.appLogo}
              style={{
                height: 100,
                width: 150,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={this.props.logoutFun}
              style={{
                width: 40,
                height: 40,
                borderRadius: 60 / 2,
                backgroundColor: 'red',
                borderColor: 'black',
              }}>
              {/* <Text style={{fontSize: 20, color: 'grey', textAlign: 'center'}}>
                {' '}
                {this.props.logout}{' '}
              </Text> */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default index;
