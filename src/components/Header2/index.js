import React, {Component, useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import img from '../../constants/images';

const index = () => {
  const [selectedValue, setSelectedValue] = useState('java');
  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={{flex: 4}}>
        <Image
          style={{
            height: 40,
            width: 80,
            resizeMode: 'contain',
            marginLeft: 10,
          }}
          source={img.grainzLogo}
        />
      </View>
      <View style={styles.container}>
        <Picker
          selectedValue={selectedValue}
          style={{height: 30, width: '100%'}}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
        </Picker>
      </View>
      <View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Text>Nick</Text>
          {/* <Image
            style={{height: 20, width: 40, resizeMode: 'contain'}}
            source={img.profileIcon}
          /> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 7,
    paddingTop: 40,
    alignItems: 'center',
  },
});
export default index;
