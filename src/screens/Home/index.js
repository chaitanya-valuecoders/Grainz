import React, {Component} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import styles from './style';
import img from '../../constants/images';
import Header from '../../components/Header'
import SubHeader from '../../components/SubHeader'

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {name: 'Stock take', icon: img.addIcon},
        {name: 'MISE-EN-PLACE', icon: img.addIcon},
        {name: 'Recipes', icon: img.searchIcon},
        {name: 'Menu items', icon: img.searchIcon},
        {name: 'Manual log', icon: img.addIcon},
        {name: 'Deliveries', icon: img.addIcon},
        {name: 'Casual purchase', icon: img.addIcon},
        {name: 'Stock take', icon: img.addIcon},
        {name: 'Events', icon: img.addIcon},
      ],
    };
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header/>
       <SubHeader/>
        {this.state.buttons.map(item => {
          return (
            <View style={{flex: 1, alignItems: 'center'}}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  height: '40%',
                  width: '50%',
                  backgroundColor: '#94C036',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '1%',
                  borderRadius: 10,
                  flexDirection: 'row',
                  marginTop : 30
                }}>
                <View style={{flex:1, alignItems:'center'}}>
                  <Image
                    source={item.icon}
                    style={{
                      height: 25,
                      width: 25,
                      resizeMode: 'contain',
                      tintColor: 'white',
                    }}
                  />
                </View>
                <View style={{flex: 3}}>
                  <Text style={{color: 'white'}}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </SafeAreaView>
    );
  }
}

export default index;
