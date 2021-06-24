import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
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
import {
  getMyProfileApi,
  getAdvanceRecipeByIdsApi,
} from '../../connectivity/api';

import styles from './style';

import {translate} from '../../utils/translations';

class ViewRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      recipeLoader: false,
      buttonsSubHeader: [],
      finalName: '',
      sectionName: '',
      pageData: '',
      modalLoader: true,
      batchQuantity: '',
      recipeInstructions: '',
    };
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@appToken');
      if (value !== null) {
        this.setState(
          {
            token: value,
            recipeLoader: true,
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
          recipeLoader: false,
          buttonsSubHeader: [
            {name: translate('ADMIN')},
            {name: translate('Setup')},
            {name: translate('INBOX')},
          ],
        });
      })
      .catch(err => {
        this.setState({
          recipeLoader: false,
        });
        console.warn('ERr', err);
      });
  };

  componentDidMount() {
    this.getData();
    const {data} = this.props.route && this.props.route.params;

    this.setState(
      {
        finalName: data.name,
        pageData: data,
      },
      () => this.getAdvanceRecipeData(data.recipeId),
    );
  }

  getAdvanceRecipeData = catId => {
    getAdvanceRecipeByIdsApi(catId)
      .then(res => {
        console.log('res', res);
        this.setState({
          modalData: res.data && res.data.recipeVersions[0].ingredients,
          modalLoader: false,
          batchQuantity: res.data && res.data.recipeVersions[0].batchQuantity,
          recipeInstructions:
            res.data && res.data.recipeVersions[0].instructions,
        });
      })
      .catch(err => {
        console.warn('err', err);
      });
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = () => {
    this.props.navigation.goBack();
  };

  render() {
    const {
      buttonsSubHeader,
      recipeLoader,
      modalData,
      finalName,
      modalLoader,
      sectionName,
      batchQuantity,
      recipeInstructions,
    } = this.state;

    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {recipeLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} index={0} />
        )}
        <ScrollView
          style={{marginBottom: hp('2%')}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            <View style={styles.firstContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.adminTextStyle}>
                  {translate('Recipe details')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.subContainer}>
            <View style={styles.firstContainer}>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Inter-Regular',
                    color: '#523622',
                  }}>
                  {translate('Recipe name')}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontFamily: 'Inter-SemiBold',
                    color: '#151B26',
                    fontSize: 16,
                  }}>
                  {finalName}
                </Text>
              </View>
            </View>
          </View>
          <View style={{}}>
            <View style={styles.firstContainer}>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Inter-Regular',
                    color: '#523622',
                  }}>
                  {translate('Version name')}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontFamily: 'Inter-SemiBold',
                    color: '#151B26',
                    fontSize: 16,
                  }}>
                  {finalName}
                </Text>
              </View>
            </View>
          </View>

          <View style={{}}>
            <ScrollView>
              {modalLoader ? (
                <ActivityIndicator size="large" color="#94C036" />
              ) : (
                <View
                  style={{
                    padding: hp('2%'),
                  }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        <View>
                          <View
                            style={{
                              paddingVertical: 15,
                              paddingHorizontal: 5,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              backgroundColor: '#EFFBCF',
                            }}>
                            <View
                              style={{
                                width: wp('30%'),
                                alignItems: 'center',
                              }}>
                              <Text style={{textAlign: 'center'}}>
                                Ingredient
                              </Text>
                            </View>
                            <View
                              style={{
                                width: wp('30%'),
                                alignItems: 'center',
                              }}>
                              <Text>Quantity</Text>
                            </View>
                            <View
                              style={{
                                width: wp('30%'),
                                alignItems: 'center',
                              }}>
                              <Text>Custom</Text>
                            </View>
                            <View
                              style={{
                                width: wp('15%'),
                                alignItems: 'center',
                              }}></View>
                          </View>
                          <View>
                            {modalData && modalData.length > 0 ? (
                              modalData.map((item, index) => {
                                console.log('item', item);
                                return (
                                  <View
                                    style={{
                                      paddingVertical: 10,
                                      paddingHorizontal: 5,
                                      flexDirection: 'row',
                                      backgroundColor:
                                        index % 2 === 0 ? '#FFFFFF' : '#F7F8F5',
                                    }}>
                                    <View
                                      style={{
                                        width: wp('30%'),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}>
                                      <Text style={{textAlign: 'center'}}>
                                        {item.name}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        width: wp('30%'),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}>
                                      <Text>{item.quantity} g</Text>
                                    </View>
                                    <View
                                      style={{
                                        width: wp('30%'),
                                        alignItems: 'center',
                                      }}>
                                      <TextInput
                                        placeholder="0.0"
                                        style={{borderWidth: 0.8, padding: 8}}
                                      />
                                    </View>
                                    <TouchableOpacity
                                      onPress={() => alert('ORDER NOW')}
                                      style={{
                                        width: wp('15%'),
                                        alignItems: 'center',
                                        backgroundColor: '#94C036',
                                        padding: 8,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                      }}>
                                      <Image
                                        source={img.beakerIcon}
                                        style={{
                                          height: 18,
                                          width: 18,
                                          resizeMode: 'contain',
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                );
                              })
                            ) : (
                              <View style={{marginTop: hp('3%')}}>
                                <Text style={{color: 'red', fontSize: 20}}>
                                  No data available
                                </Text>
                              </View>
                            )}
                          </View>
                          <View
                            style={{
                              paddingVertical: 15,
                              paddingHorizontal: 5,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              backgroundColor: '#EFFBCF',
                            }}>
                            <View
                              style={{
                                width: wp('30%'),
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontFamily: 'Inter-SemiBold',
                                }}>
                                Total
                              </Text>
                            </View>
                            <View
                              style={{
                                width: wp('30%'),
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontFamily: 'Inter-SemiBold',
                                }}>
                                {batchQuantity} g
                              </Text>
                            </View>
                            <View
                              style={{
                                width: wp('30%'),
                                alignItems: 'center',
                              }}>
                              <TextInput
                                placeholder="custom"
                                style={{borderWidth: 0.8, padding: 8}}
                              />
                            </View>
                            <View
                              style={{
                                width: wp('15%'),
                                alignItems: 'center',
                              }}></View>
                          </View>
                        </View>
                      </ScrollView>
                    </View>
                  </ScrollView>
                </View>
              )}
              <View
                style={{
                  backgroundColor: '#fff',
                  marginHorizontal: 18,
                  borderRadius: 6,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: wp('5%'),
                    marginVertical: hp('2%'),
                    borderBottomWidth: 1,
                    paddingBottom: 5,
                    borderBottomColor: '#0000001A',
                  }}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Regular',
                        color: '#151B26',
                      }}>
                      {translate('Instructions')}:
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: wp('5%'),
                    marginBottom: hp('2%'),
                  }}>
                  <Text
                    style={{
                      color: '#94C01F',
                      fontFamily: 'Inter-Regular',
                    }}>
                    {recipeInstructions}
                  </Text>
                </View>
              </View>
              <View>
                <View
                  style={{
                    marginTop: hp('2%'),
                  }}>
                  <TouchableOpacity
                    onPress={() => alert('Advance view')}
                    style={{
                      height: hp('5%'),
                      alignSelf: 'center',
                      paddingHorizontal: 10,
                      backgroundColor: '#94C036',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 100,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      {translate('Advance view')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => alert('print')}
                    style={{
                      height: hp('5%'),
                      paddingHorizontal: 10,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: wp('2%'),
                      borderRadius: 100,
                      backgroundColor: '#CECBD0',
                      marginTop: hp('2%'),
                    }}>
                    <Text
                      style={{
                        color: '#482813',
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      {translate('Print fiche technique')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
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

export default connect(mapStateToProps, {UserTokenAction})(ViewRecipe);
