// import React, {Component, useState} from 'react';
// import {NativeModules} from 'react-native';
// import RNPickerSelect from 'react-native-picker-select';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   Alert,
//   Pressable,
//   Modal,
//   StyleSheet,
//   TextInput,
//   CheckBox
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {UserTokenAction} from '../../redux/actions/UserTokenAction';
// import {connect} from 'react-redux';
// import MepScreen from '../Mep';
// import SubHeader from '../../components/SubHeader';
// import Header2 from '../../components/Header2';
// import DatePicker from 'react-native-datepicker';
// import HomeScreen from '../Home';
// import img from '../../constants/images';
// import {set} from 'react-native-reanimated';
// import styles from './style';
// import {
//   Table,
//   TableWrapper,
//   Row,
//   Rows,
//   Col,
//   Cols,
//   Cell,
// } from 'react-native-table-component';

// class index extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       newPurchase: false,
//       tableHead: ['Date', 'Supplier', '$Total HTVA'],
//       tableData: [
//         ['29/11/21', 'delhaize', '$ 50.00'],
//         ['29/11/21', 'delhaize', '$ 50.00'],
//         ['29/11/21', 'delhaize', '$ 50.00'],
//         ['29/11/21', 'delhaize', '$ 50.00'],
//         ['29/11/21', 'delhaize', '$ 50.00'],
//         ['29/11/21', 'delhaize', '$ 50.00'],
//         ['29/11/21', 'delhaize', '$ 50.00'],
//         ['29/11/21', 'delhaize', '$ 50.00'],
//         ['29/11/21', 'delhaize', '$ 50.00'],
//         ['29/11/21', 'delhaize', '$ 50.00'],
//         ['29/11/21', 'delhaize', '$ 50.00'],
//         ['29/11/21', 'delhaize', '$ 50.00'],
//         ['29/11/21', 'delhaize', '$ 50.00'],
//         ['29/11/21', 'delhaize', '$ 50.00'],
//       ],
//       newSupplier: [],
//       date: '2021-04-01',
//     };
//   }

//   cancelSupplier() {
//     this.setState({newSupplier: []});
//     this.showNewWindow();
//   }

//   addPrice(value) {
//     this.state.newSupplier[2] = value;
//   }

//   addSupplier(value) {
//     this.state.newSupplier[1] = value;
//   }

//   addToList() {
//     this.state.newSupplier[0] = this.state.date;
//     this.setState({newSupplier: []});
//     var copied = this.state.tableData;
//     copied.splice(0, 0, this.state.newSupplier);
//     this.setState({tableData: copied});
//     this.showNewWindow();
//   }

//   showNewWindow = () => {
//     this.setState({newPurchase: !this.state.newPurchase});
//   };

//   render() {
//     const state = this.state;

//     return (
//       <View style={{flex: 1}}>
//         {/* <View style={{flex:1}}><Header2/></View> */}
//         <View style={{flex: 1}}>
//           <SubHeader />
//         </View>
//         <View style={{flex: 8}}>
//           <View
//             style={{
//               flex: 3,
//               backgroundColor: '#412916',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}>
//             <View style={{flex: 1}}>
//               <Text
//                 style={{
//                   color: 'white',
//                   paddingTop: 15,
//                   fontSize: 20,
//                   fontWeight: 'bold',
//                 }}>
//                 CASUAL PURCHASE
//               </Text>
//             </View>

//             {state.newPurchase ? (
//               <View style={{flex: 1}}>
//                 <TouchableOpacity
//                   onPress={this.showNewWindow}
//                   style={{
//                     height: 40,
//                     width: 300,
//                     backgroundColor: '#ffb33a',
//                     borderRadius: 10,
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                   }}>
//                   <Text style={{color: 'white', fontSize: 17}}>Back</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <View style={{flex: 1}}>
//                 <TouchableOpacity
//                   onPress={this.showNewWindow}
//                   style={{
//                     height: 40,
//                     width: 300,
//                     backgroundColor: '#94C036',
//                     borderRadius: 10,
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                   }}>
//                   <Text style={{color: 'white', fontSize: 17}}>New</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//           {state.newPurchase ? (
//             <View style={{flex: 18, backgroundColor: ''}}>
//               <View style={{flex: 5, backgroundColor: ''}}>
//                 <View
//                   style={{
//                     flex: 5,
//                     flexDirection:'row',
//                     margin: 10,
//                     backgroundColor: '',
//                   }}>
//                   <View
//                     style={{
//                       flex: 1,
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                     }}>
//                     <Text>Date</Text>
//                   </View>
//                   <View style={{flex: 1}}>
//                     <DatePicker
//                       style={{width: 200}}
//                       date={this.state.date}
//                       mode="date"
//                       placeholder="select date"
//                       format="YYYY-MM-DD"
//                       minDate="2016-05-01"
//                       maxDate="2016-06-01"
//                       confirmBtnText="Confirm"
//                       cancelBtnText="Cancel"
//                       customStyles={{
//                         dateIcon: {
//                           position: 'absolute',
//                           left: 0,
//                           top: 4,
//                           marginLeft: 0,
//                         },
//                         dateInput: {
//                           marginLeft: 36,
//                         },
//                       }}
//                       onDateChange={date => {
//                         this.setState({date: date});
//                       }}
//                     />
//                   </View>
//                 </View>

//                 <View style={{flex: 1}}>
//                   <View style={{flex: 1, flexDirection: 'row'}}>
//                     <View>
//                       <Text>Supplier</Text>
//                     </View>
//                     <View>
//                       <RNPickerSelect
//                         placeholder={{label: '  Select Supplier', value: null}}
//                         onValueChange={value => this.addSupplier(value)}
//                         items={[
//                           {label: 'A&G', value: 'A&G'},
//                           {label: 'l', value: 'l'},
//                           {label: 'ss', value: 'ss'},
//                           {label: 'butane', value: 'butane&bsoir'},
//                         ]}
//                       />
//                     </View>
//                   </View>
//                 </View>

//                 <View style={{flex: 1}}>
//                   <View style={{flexDirection: 'row'}}>
//                     <Text>$</Text>
//                     <TextInput
//                       value={0}
//                       onChangeText={value => this.addPrice(value)}
//                       placeholder="Price"
//                       style={{
//                         borderBottomWidth: 1,
//                         borderBottomColor: 'grey',
//                         paddingVertical: 5,
//                       }}
//                     />
//                   </View>
//                 </View>
//                 <View style={{flex: 1}}>
//                   <View>
//                     <TouchableOpacity
//                       onPress={this.cancelSupplier.bind(this)}
//                       style={{
//                         height: 40,
//                         width: 300,
//                         backgroundColor: '#ffb33a',
//                         borderRadius: 10,
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                       }}>
//                       <Text style={{color: 'white', fontSize: 17}}>Cancel</Text>
//                     </TouchableOpacity>
//                   </View>
//                   <View>
//                     <TouchableOpacity
//                       onPress={this.addToList.bind(this)}
//                       style={{
//                         height: 40,
//                         width: 300,
//                         backgroundColor: '#94C036',
//                         borderRadius: 10,
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                       }}>
//                       <Text style={{color: 'white', fontSize: 17}}>Save</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           ) : (
//             <View style={{flex: 18}}>
//               <View>
//                 <Table>
//                   <Row
//                     style={{borderBottomWidth: 2, borderBottomColor: '#EAEAF0'}}
//                     data={state.tableHead}
//                   />
//                   <Rows data={state.tableData} />
//                 </Table>
//               </View>
//             </View>
//           )}
//           <View style={{flex:3}}></View>
//         </View>
//       </View>
//     );
//   }
// }

// export default index;

import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Switch,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../constants/images';
import SubHeader from '../../components/SubHeader';
import Header from '../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {getMyProfileApi} from '../../connectivity/api';

var minTime = new Date();
minTime.setHours(0);
minTime.setMinutes(0);
minTime.setMilliseconds(0);

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [{name: 'Back'}],
      token: '',
      modalVisible: false,
      firstName: '',
    };
  }

  getProfileDataFun = async () => {
    try {
      const value = await AsyncStorage.getItem('@appToken');
      if (value !== null) {
        this.setState(
          {
            token: value,
          },
          () => this.getProfileData(),
        );
      }
    } catch (e) {
      console.warn('ErrHome', e);
    }
  };

  getProfileData = () => {
    getMyProfileApi()
      .then(res => {
        this.setState({
          firstName: res.data.firstName,
        });
      })
      .catch(err => {
        console.warn('ERr', err);
      });
  };

  componentDidMount() {
    this.getProfileDataFun();
  }

  myProfileFun = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    if (item.name === 'Back') {
      this.props.navigation.goBack();
    }
  };

  render() {
    const {firstName, buttons} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          logout={firstName}
          logoutFun={this.myProfileFun}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        <SubHeader />
        <ScrollView style={{marginBottom: hp('5%')}}>
          <View
            style={{
              backgroundColor: '#412916',
              alignItems: 'center',
              paddingVertical: hp('3%'),
            }}>
            <Text style={{fontSize: 22, color: 'white'}}>CASUAL PURCHASE</Text>
            {buttons.map((item, index) => {
              return (
                <View style={{}} key={index}>
                  <TouchableOpacity
                    onPress={() => this.onPressFun(item)}
                    style={{
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text> Work in progress</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    UserTokenReducer: state.UserTokenReducer,
    GetMyProfileReducer: state.GetMyProfileReducer,
  };
};

export default connect(mapStateToProps, {UserTokenAction})(index);
