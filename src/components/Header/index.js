import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
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
            borderBottomWidth: 0.5,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={img.drawerIcon}
              style={{
                height: 25,
                width: 25,
                resizeMode: 'contain',
                tintColor: 'grey',
              }}
            />
          </View>
          <View style={{flex: 3}}>
            <Text style={{fontSize: 30, color: 'grey'}}>
              {' '}
              {this.props.headerTitle}{' '}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default index;
