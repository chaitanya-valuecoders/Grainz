import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './style';
import img from '../../constants/images';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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
        style={{
          height: hp('12%'),
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: 'grey',
          alignItems: 'center',
        }}>
        {this.state.buttons.map((item,key) => {
          return (
            <View key={key} 
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  height: '50%',
                  width: '70%',
                  backgroundColor: '#94C036',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
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
