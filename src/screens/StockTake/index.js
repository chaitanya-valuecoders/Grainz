import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {connect} from 'react-redux';
import StockTake2Screen from '../StockTake2'
import SubHeader from '../../components/SubHeader';
import img from '../../constants/images';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {name: 'Bar'},
        {name: 'Other'},
        {name: 'Restaurant'},
        {name: 'Retail'},
      ],
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
          <View style={{flex : 2}}><SubHeader /></View>
        
        <View style={{flex:18}}>
          <Text style={{fontSize:20, color : 'grey'}}>Select which department you wish to stock take</Text>
          <View  style={{alignItems:'center'}}>
          {this.state.buttons.map(item => {
            return (
              
                <TouchableOpacity 
                onPress={()=> this.props.navigation.navigate('StockTake2Screen')}
                style={{
                    height: '15%',
                    width: '50%',
                    backgroundColor: '#94C036',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '1%',
                    borderRadius: 10,
                  }}>
                  <Text style={{justifyContent: 'center', color:'white'}}>{item.name}</Text>
                </TouchableOpacity>
              
            );
          })}
          </View>
        </View>
      </View>
    );
  }
}

export default index;
