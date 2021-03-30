import React, {Component} from 'react';
import DatePicker from 'react-native-datepicker';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {connect} from 'react-redux';
import SubHeader from '../../components/SubHeader';
import img from '../../constants/images';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {date: '2021-03-26'};
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
          <DatePicker
            style={{width: 200}}
            date={this.state.date}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            minDate="2016-05-01"
            maxDate="2016-06-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
            }}
            onDateChange={date => {
              this.setState({date: date});
            }}
          />
        </View>
        </View>
      </View>
    );
  }
}

export default index;
