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
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../../constants/images';
import SubHeader from '../../../components/SubHeader';
import Header from '../../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../../redux/actions/UserTokenAction';
import {
  getMyProfileApi,
  getSupplierDetailsApi,
  getSupplierListApi,
} from '../../../connectivity/api';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {translate} from '../../../utils/translations';

export default class Supplier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suppliers: [],
      filteredSuppliers: [],
      loader: true,
      buttonsSubHeader: [],
      firstName: '',
      profileLoader: true,
      detailsVisible: false,
      supplier: {},
      details: {},
      detailsLoader: true,
      isCatalogueVisible: false,
    };
  }

  componentDidMount() {
    this.getProfileData();
    this.getSuppliersFun();
  }

  getProfileData = () => {
    getMyProfileApi()
      .then(res => {
        this.setState({
          profileLoader: false,
          firstName: res.data.firstName,
          buttonsSubHeader: [
            {name: translate('ADMIN')},
            {name: translate('Setup')},
            {name: translate('INBOX')},
          ],
        });
      })
      .catch(err => {
        console.warn('ERr', err);
      });
  };
  getSuppliersFun() {
    getSupplierListApi()
      .then(res => {
        this.setState({
          loader: false,
          suppliers: res.data,
          filteredSuppliers: res.data,
        });
      })
      .catch(err => console.warn('err', err.response));
  }

  getSupplierDetails(id) {
    getSupplierDetailsApi(id)
      .then(res => {
        this.setState({details: res.data, detailsLoader: false});
      })
      .catch(err => console.warn('error', err.response));
  }

  searchSupplier = async value => {
    const {suppliers} = this.state;
    let arr = [];
    suppliers.map(item => {
      if (value === '') {
        arr.push(item);
      } else if (item.name.toLowerCase().includes(value.toLowerCase())) {
        arr.push(item);
      }
    });
    this.setState({
      filteredSuppliers: arr,
    });
  };

  showDetails(item) {
    this.getSupplierDetails(item.id);
    this.setState({detailsVisible: true, supplier: item});
  }

  render() {
    const {
      suppliers,
      profileLoader,
      loader,
      filteredSuppliers,
      buttonsSubHeader,
      detailsVisible,
      supplier,
      details,
      detailsLoader,
      isCatalogueVisible,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Header
          // logout={firstName}
          // logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {profileLoader ? (
          <ActivityIndicator size="large" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )}
        {detailsVisible ? (
          <View>
            <ScrollView
              style={{marginBottom: hp('5%')}}
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  backgroundColor: '#412916',
                  alignItems: 'center',
                  paddingVertical: hp('3%'),
                }}>
                <Text style={{fontSize: 22, color: 'white'}}>
                  {translate('Supplier Details')}
                </Text>
                <View style={{}}>
                  <TouchableOpacity
                    onPress={() => this.setState({detailsVisible: false})}
                    style={{
                      flexDirection: 'row',
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>Back</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                {detailsLoader ? (
                  <View>
                    <ActivityIndicator size="large" color="#94C036" />
                  </View>
                ) : (
                  <View>
                    <View style={styles.details}>
                      <Text style={styles.text}>Supplier : </Text>
                      <Text style={styles.text2}>{details.name}</Text>
                    </View>
                    <View style={styles.details}>
                      <Text style={styles.text}>Adress : </Text>
                      <Text style={styles.text2}>
                        {details.address.addressLine2}
                      </Text>
                      <View style={{marginLeft: '35%'}}>
                        <View>
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({isCatalogueVisible: true})
                            }
                            style={{
                              backgroundColor: '#94C036',
                              padding: '4%',
                              alignItems: 'center',
                            }}>
                            <Text style={{color: 'white', fontSize: 15}}>
                              View Catalogue
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View>
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate(
                                'OrderingAdminScreen',
                              )
                            }
                            style={{
                              backgroundColor: '#94C036',
                              padding: '4%',
                              alignItems: 'center',
                              marginTop: '5%',
                            }}>
                            <Text style={{color: 'white', fontSize: 15}}>
                              View Orders
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <Modal isVisible={isCatalogueVisible}>
                      <View
                        style={{
                          width: wp('80%'),
                          height: hp('45%'),
                          backgroundColor: '#fff',
                          alignSelf: 'center',
                        }}>
                        <View
                          style={{
                            backgroundColor: '#412916',
                            height: hp('7%'),
                            flexDirection: 'row',
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({isCatalogueVisible: false})
                            }>
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
                        <View style={{alignItems: 'center'}}>
                          <View style={{marginTop: '90%'}}>
                            <TouchableOpacity
                              style={{
                                padding: '3%',
                                backgroundColor: '#E7943B',
                                alignItems: 'center',
                                width: wp('70%'),
                              }}
                              onPress={() =>
                                this.setState({isCatalogueVisible: false})
                              }>
                              <Text style={{color: 'white'}}>Close</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Modal>

                    <View style={styles.details}>
                      <Text style={styles.text}>Website : </Text>
                      <Text style={styles.text2}>{details.website}</Text>
                    </View>
                    <View style={styles.details}>
                      <Text style={styles.text}>Contact Details :</Text>
                      <Text style={styles.text2}>
                        {details.email} {details.telephone}
                      </Text>
                    </View>
                    <View style={styles.details}>
                      <Text style={styles.text}>Status : </Text>
                      <Text style={styles.text2}>{details.status}</Text>
                    </View>
                    <View style={styles.details}>
                      <Text style={styles.text}>Discount :</Text>
                      <Text style={styles.text2}>{details.telephone}</Text>
                    </View>
                    <View style={styles.details}>
                      <Text style={styles.text}>Minimum order : </Text>
                      <Text style={styles.text2}>$ {details.minimumOrder}</Text>
                    </View>
                    <View style={styles.details}>
                      <Text style={styles.text}>Notes : </Text>
                      <Text style={styles.text2}>{details.notes}</Text>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        ) : (
          <View>
            <ScrollView
              style={{marginBottom: hp('5%')}}
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  backgroundColor: '#412916',
                  alignItems: 'center',
                  paddingVertical: hp('3%'),
                }}>
                <Text style={{fontSize: 22, color: 'white'}}>
                  {translate('Supplier List')}
                </Text>
                <View style={{}}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('HomeScreen')}
                    style={{
                      flexDirection: 'row',
                      height: hp('6%'),
                      width: wp('70%'),
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <View style={{}}>
                      <Text style={{color: 'white', marginLeft: 5}}>Back</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{marginLeft: '5%', marginTop: '5%'}}>
                <View style={{margin: '2%'}}>
                  <Text>Search : </Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: 'grey',
                    padding: '2%',
                    width: wp('80%'),
                    margin: '2%',
                  }}>
                  <TextInput
                    placeholder="Search"
                    onChangeText={value => this.searchSupplier(value)}
                  />
                </View>
              </View>
              <View style={{flexDirection: 'row', marginLeft: '10%'}}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: hp('6%'),
                    width: wp('25%'),
                  }}>
                  <Text style={{fontWeight: 'bold'}}>Supplier Name</Text>
                </View>
                <View
                  style={{
                    height: hp('6%'),
                    width: wp('15%'),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: '5%',
                  }}>
                  <Text style={{fontWeight: 'bold'}}>Action</Text>
                </View>
              </View>
              <View>
                {filteredSuppliers.map(item => {
                  return (
                    <View style={{flexDirection: 'row', margin: '2%'}}>
                      <View
                        style={{
                          justifyContent: 'center',
                          marginLeft: '8%',
                          height: hp('6%'),
                          width: wp('25%'),
                        }}>
                        <Text>{item.name}</Text>
                      </View>
                      <View style={{marginLeft: '5%'}}>
                        <TouchableOpacity
                          onPress={() => this.showDetails(item)}
                          style={{
                            flexDirection: 'row',
                            height: hp('6%'),
                            width: wp('15%'),
                            backgroundColor: '#94C036',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '5%',

                            borderRadius: 5,
                          }}>
                          <Text style={{color: '#fff'}}>View</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  details: {
    margin: '4%',
    flexDirection: 'row',
  },

  text: {
    fontWeight: 'bold',
  },
  text2: {
    marginLeft: '5%',
  },
});
