import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import styles from './style';
import img from '../../constants/images';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {translate} from '../../utils/translations';
import Modal from 'react-native-modal';

class SubHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisibleInbox: false,
      modalVisibleAdmin: false,
      modalVisibleSetup: false,
      adminArr: [
        {
          name: translate('Sales'),
          screen: 'SalesAdminScreen',
          id: 0,
        },
        {
          name: translate('Inventory Levels'),
          screen: 'InventoryAdminScreen',
          id: 1,
        },
        {
          name: translate('Ordering'),
          screen: 'OrderingAdminScreen',
          id: 2,
        },
        {
          name: translate('Events'),
          screen: 'EventsAdminScreen',
          id: 3,
        },
        {
          name: translate('Reports & Analysis'),
          screen: 'ReportsAdminScreen',
          id: 4,
        },
        {
          name: translate('Account Admin'),
          screen: 'AccountAdminScreen',
          id: 5,
        },
        {
          name: translate('Close'),
          id: 6,
        },
      ],
      setupArr: [
        {
          name: translate('Inventory List'),
          screen: 'SalesAdminScreen',
          id: 0,
        },
        {
          name: translate('Suppliers'),
          screen: 'InventoryAdminScreen',
          id: 1,
        },
        {
          name: translate('Recipes'),
          screen: 'OrderingAdminScreen',
          id: 2,
        },
        {
          name: translate('Menu item'),
          screen: 'EventsAdminScreen',
          id: 3,
        },
        {
          name: translate('Menus'),
          screen: 'ReportsAdminScreen',
          id: 4,
        },
        {
          name: translate('Close'),
          id: 5,
        },
      ],
    };
  }

  subHeaderFun = (item, index) => {
    if (index === 0) {
      this.setState({modalVisibleAdmin: true});
    } else if (index === 1) {
      this.setState({modalVisibleSetup: true});
    } else {
      this.setState({modalVisibleInbox: true});
    }
  };

  setAdminModalVisible = visible => {
    this.setState({
      modalVisibleAdmin: visible,
      modalVisibleInbox: visible,
      modalVisibleSetup: visible,
    });
  };

  adminModalFun = (item, index) => {
    if (item.id === 6) {
      this.setAdminModalVisible(false);
    } else if (item.id === 0) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('SalesAdminScreen');
      }, 300);
    } else if (item.id === 1) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('InventoryAdminScreen');
      }, 300);
    } else if (item.id === 2) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('OrderingAdminScreen');
      }, 300);
    } else if (item.id === 3) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('EventsAdminScreen');
      }, 300);
    } else if (item.id === 4) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('ReportsAdminScreen');
      }, 300);
    } else if (item.id === 5) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('AccountAdminScreen');
      }, 300);
    }
  };

  setupModalFun = (item, index) => {
    if (item.id === 5) {
      this.setAdminModalVisible(false);
    } else if (item.id === 0) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('SalesAdminScreen');
      }, 300);
    } else if (item.id === 1) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('InventoryAdminScreen');
      }, 300);
    } else if (item.id === 2) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('OrderingAdminScreen');
      }, 300);
    } else if (item.id === 3) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('EventsAdminScreen');
      }, 300);
    } else if (item.id === 4) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('ReportsAdminScreen');
      }, 300);
    } else if (item.id === 5) {
      this.setAdminModalVisible(false);
      setTimeout(() => {
        this.props.navigation.navigate('AccountAdminScreen');
      }, 300);
    }
  };

  render() {
    const {
      modalVisibleInbox,
      modalVisibleAdmin,
      modalVisibleSetup,
      adminArr,
      setupArr,
    } = this.state;
    return (
      <View
        style={{
          height: hp('12%'),
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: 'grey',
          alignItems: 'center',
        }}>
        {this.props.buttons.map((item, index) => {
          return (
            <View
              key={index}
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => this.subHeaderFun(item, index)}
                style={{
                  height: '50%',
                  width: '75%',
                  backgroundColor: '#94C036',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                }}>
                <Text style={{color: 'white'}}>{item.name}</Text>
              </TouchableOpacity>
              <View>
                {/* // Admin Modal */}
                <Modal isVisible={modalVisibleAdmin} backdropOpacity={0.35}>
                  <View
                    style={{
                      width: wp('80%'),
                      height: hp('80%'),
                      backgroundColor: '#fff',
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: '#412916',
                        height: hp('7%'),
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{
                          flex: 3,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 16, color: '#fff'}}>
                          {translate('ADMIN')}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={() => this.setAdminModalVisible(false)}>
                          <Image
                            source={img.cancelIcon}
                            style={{
                              height: 22,
                              width: 22,
                              tintColor: 'white',
                              resizeMode: 'contain',
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <ScrollView
                      style={{marginBottom: hp('2%')}}
                      showsVerticalScrollIndicator={false}>
                      <View
                        style={{
                          padding: hp('3%'),
                        }}>
                        {adminArr && adminArr.length > 0 ? (
                          <View style={{}}>
                            {adminArr.map((item, index) => {
                              return (
                                <TouchableOpacity
                                  onPress={() =>
                                    this.adminModalFun(item, index)
                                  }
                                  style={{
                                    height: hp('7%'),
                                    width: wp('70%'),
                                    backgroundColor: '#EEEEEE',
                                    alignSelf: 'center',
                                    marginTop: hp('1.8%'),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <Text style={{fontSize: 16}}>
                                    {item.name}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        ) : null}
                      </View>
                    </ScrollView>
                  </View>
                </Modal>
                {/* SetUp Modal */}
                <Modal isVisible={modalVisibleSetup} backdropOpacity={0.35}>
                  <View
                    style={{
                      width: wp('80%'),
                      height: hp('80%'),
                      backgroundColor: '#fff',
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: '#412916',
                        height: hp('7%'),
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{
                          flex: 3,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 16, color: '#fff'}}>
                          {translate('Setup')}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={() => this.setAdminModalVisible(false)}>
                          <Image
                            source={img.cancelIcon}
                            style={{
                              height: 22,
                              width: 22,
                              tintColor: 'white',
                              resizeMode: 'contain',
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <ScrollView
                      style={{marginBottom: hp('2%')}}
                      showsVerticalScrollIndicator={false}>
                      <View
                        style={{
                          padding: hp('3%'),
                        }}>
                        {setupArr && setupArr.length > 0 ? (
                          <View style={{}}>
                            {setupArr.map((item, index) => {
                              return (
                                <TouchableOpacity
                                  onPress={() =>
                                    this.setupModalFun(item, index)
                                  }
                                  style={{
                                    height: hp('7%'),
                                    width: wp('70%'),
                                    backgroundColor: '#EEEEEE',
                                    alignSelf: 'center',
                                    marginTop: hp('1.8%'),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <Text style={{fontSize: 16}}>
                                    {item.name}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        ) : null}
                      </View>
                    </ScrollView>
                  </View>
                </Modal>
                {/* INBOX MODAL  */}
                <Modal isVisible={modalVisibleInbox} backdropOpacity={0.35}>
                  <View
                    style={{
                      width: wp('80%'),
                      height: hp('80%'),
                      backgroundColor: '#fff',
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: '#412916',
                        height: hp('7%'),
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{
                          flex: 3,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontSize: 16, color: '#fff'}}>
                          {translate('INBOX')}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={() => this.setAdminModalVisible(false)}>
                          <Image
                            source={img.cancelIcon}
                            style={{
                              height: 22,
                              width: 22,
                              tintColor: 'white',
                              resizeMode: 'contain',
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <ScrollView style={{marginBottom: hp('2%')}}>
                      <View
                        style={{
                          padding: hp('3%'),
                        }}>
                        <View style={{}}>
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#EEEEEE',
                              alignSelf: 'center',
                              marginTop: hp('5%'),
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 20,
                            }}>
                            <Text style={{color: 'black', fontSize: 16}}>
                              This section is in development
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                </Modal>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}

export default SubHeader;
