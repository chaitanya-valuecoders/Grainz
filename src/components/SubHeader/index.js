import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './style';
import img from '../../constants/images';

class SubHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [{name: 'ADMIN'}, {name: 'SETUP'}, {name: 'INBOX'}],
    };
  }
  render() {
    return (
      <View
        style={{ flex:1,
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: 'grey',
          alignItems: 'center',
          height: '10%',
        }}>
        {this.state.buttons.map(item => {
          return (
            <View style={{flex: 1}}>
              <TouchableOpacity
                style={{
                  height: '50%',
                  width: '70%',
                  backgroundColor: '#94C036',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '1%',
                  borderRadius: 10,
                  marginLeft: 23,
                }}>
                <Text style={{color: 'white'}}>{item.name}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  }
}

export default SubHeader;
