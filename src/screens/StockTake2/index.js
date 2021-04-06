import React, {Component} from 'react';
import DatePicker from '../../components/DatePicker';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {connect} from 'react-redux';
import SubHeader from '../../components/SubHeader';
import img from '../../constants/images';

class index extends Component {
  constructor(props) {
    super(props);
  
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 2}}>
          <SubHeader />
        </View>

        <View style={{flex:18}}>
        <View style={{flex: 1}}>
            
          <TouchableOpacity
            style={{
              marginRight: '10%',
              alignSelf: 'flex-end',
              height: '100%',
              width: '20%',
              backgroundColor: '#94C036',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '1%',
              borderRadius: 10,
            }}>
            <Text style={{color: 'white'}}>New</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 15}}>
          <Text style={{fontSize: 25, color: 'grey'}}>Stock take</Text>
          <DatePicker/>
            
        </View>
        </View>
      </View>
    );
  }
}

export default index;
