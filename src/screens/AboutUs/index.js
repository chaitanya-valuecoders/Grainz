import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('LoginScreen')}>
          <Text> AboutUs </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default index;
