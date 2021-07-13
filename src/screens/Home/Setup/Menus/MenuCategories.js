import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';

import img from '../../../../constants/images';
import SubHeader from '../../../../components/SubHeader';
import Header from '../../../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../../../redux/actions/UserTokenAction';
import {
  getMenuCategoriesApi,
  addMenuItemCategoryApi,
  addMenuItemSubCategoryApi,
  deleteSubCatApi,
  deleteCatApi,
  getMyProfileApi,
} from '../../../../connectivity/api';
import Accordion from 'react-native-collapsible/Accordion';
import Modal from 'react-native-modal';
import {translate} from '../../../../utils/translations';
import styles from './style';

export default class EditMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonsSubHeader: [],
      firstName: '',
      categories: [],
      categoryName: '',
      addCatModal: false,
      addSubCatModal: false,
      subCategoryName: '',
      catLoader: false,
    };
  }

  getProfileData = () => {
    this.setState({recipeLoader: true});
    getMyProfileApi()
      .then(res => {
        this.setState({
          recipeLoader: false,
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

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  componentDidMount() {
    this.getProfileData();
    this.getMenuCategories();
  }

  getMenuCategories() {
    this.setState({catLoader: true});
    getMenuCategoriesApi()
      .then(res => {
        this.setState({categories: res.data, catLoader: false});
      })
      .catch(err => console.warn('err', err));
  }

  // showCats() {
  //   this.getMenuCategories();
  //   this.setState({showCategories: true, chosenMenu: false, firstPage: false});
  // }

  addCategory(cat) {
    addMenuItemCategoryApi({name: cat})
      .then(res => {
        this.setState({addCatModal: false, categoryName: ''});
        this.getMenuCategories();
      })
      .catch(err => console.warn('errh', err));
  }

  addSubCategory(cat) {
    addMenuItemSubCategoryApi({categoryId: this.state.catId, name: cat})
      .then(res => {
        this.setState({addSubCatModal: false, subCategoryName: ''});
        this.getMenuCategories();
      })
      .catch(err => console.warn('err', err));
  }

  deleteSubCat(id) {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this sub category ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            deleteSubCatApi(id)
              .then(res => this.getMenuCategories())
              .catch(err => console.warn(err));
          },
        },
      ],
    );
  }
  deleteCat(id) {
    Alert.alert('Delete', 'Are you sure you want to delete this category ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          deleteCatApi(id)
            .then(res => this.getMenuCategories())
            .catch(err => console.warn(err));
        },
      },
    ]);
  }

  render() {
    const {
      buttonsSubHeader,
      categories,
      categoryName,
      addCatModal,
      addSubCatModal,
      subCategoryName,
      catLoader,
    } = this.state;
    return (
      <View style={{backgroundColor: '#F0F4FF'}}>
        <Header />
        <SubHeader {...this.props} buttons={buttonsSubHeader} index={1} />
        <ScrollView
          style={{marginBottom: hp('2%')}}
          showsVerticalScrollIndicator={false}>
          <View style={{...styles.subContainer, marginBottom: hp('2%')}}>
            <View>
              <View style={{flexDirection: 'row', margin: 10}}>
                <View style={{flex: 2}}>
                  <Text style={styles.adminTextStyle}>
                    {translate('Categories List')}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('MenusScreen')
                    }
                    style={styles.goBackContainer}>
                    <Text style={styles.goBackTextStyle}>Go Back</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => this.setState({addCatModal: true})}
                  style={{
                    height: hp('4%'),
                    width: wp('80%'),
                    backgroundColor: '#94C036',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: hp('1.5%'),
                    borderRadius: 100,
                    alignSelf: 'center',
                    flexDirection: 'row',
                  }}>
                  <View>
                    <Image
                      source={img.addIcon}
                      style={{
                        height: 16,
                        width: 16,
                        resizeMode: 'contain',
                        tintColor: 'white',
                      }}
                    />
                  </View>
                  <View>
                    <Text style={{color: 'white'}}>Add Category</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {catLoader ? (
                <ActivityIndicator
                  size="large"
                  color="#94C036"
                  style={{marginTop: 25}}
                />
              ) : (
                <View style={{marginTop: 15}}>
                  {categories.map(item => {
                    return (
                      <View style={{marginBottom: '5%'}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 10,
                            padding: 1,
                            marginLeft: 25,
                          }}>
                          <View style={{flex: 8}}>
                            <Text style={{fontWeight: 'bold'}}>
                              {item.name}
                            </Text>
                          </View>
                          <View style={{flex: 1}}>
                            <TouchableOpacity
                              onPress={() =>
                                this.setState({
                                  addSubCatModal: true,
                                  catId: item.id,
                                })
                              }
                              style={{
                                backgroundColor: '#94C01F',
                                width: wp('5%'),
                                borderRadius: 50,
                                alignItems: 'center',
                                padding: '2%',
                                marginLeft: 10,
                              }}>
                              <Image
                                source={img.addIcon}
                                style={{
                                  height: 16,
                                  width: 16,
                                  resizeMode: 'contain',
                                  tintColor: 'white',
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={{flex: 1}}>
                            <TouchableOpacity
                              onPress={() => this.deleteCat(item.id)}
                              style={{
                                // backgroundColor: '#FF8C89',
                                width: wp('5%'),
                                alignItems: 'center',
                              }}>
                              <Image
                                source={img.deleteIconNew}
                                style={{
                                  height: 12,
                                  width: 12,
                                  resizeMode: 'contain',
                                  tintColor: '#FF034D',
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        {item.subCategories.map(ele => {
                          return (
                            <View
                              style={{
                                flexDirection: 'row',
                                marginLeft: 30,
                                flex: 10,
                              }}>
                              <View style={{flex: 7, flexDirection: 'row'}}>
                                <View
                                  style={{
                                    borderRadius: 50,
                                    backgroundColor: 'black',
                                    height: 5,
                                    width: 5,
                                    marginTop: 6,
                                    margin: '2%',
                                  }}></View>
                                <View style={{}}>
                                  <Text>{ele.name} </Text>
                                </View>
                              </View>
                              <View style={{flex: 1, marginLeft: 59}}>
                                <TouchableOpacity
                                  onPress={() => this.deleteSubCat(ele.id)}
                                  style={{
                                    // backgroundColor: '#FF8C89',
                                    width: wp('5%'),
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    padding: '2%',
                                  }}>
                                  <Image
                                    source={img.deleteIconNew}
                                    style={{
                                      height: 12,
                                      width: 12,
                                      resizeMode: 'contain',
                                      tintColor: '#FF034D',
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            <Modal isVisible={addCatModal} backdropOpacity={0.35}>
              <View
                style={{
                  width: wp('70%'),
                  height: hp('25%'),
                  backgroundColor: '#F0F4FF',
                  alignSelf: 'center',
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    backgroundColor: '#94BC37',
                    height: hp('5%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{flexDirection: 'row', flex: 7}}>
                    <View style={{flex: 6}}>
                      <Text style={{color: 'white', margin: '3%'}}>
                        Add Category
                      </Text>
                    </View>
                    <View style={{flex: 1, margin: '3%'}}>
                      <TouchableOpacity
                        onPress={() => this.setState({addCatModal: false})}>
                        <Image
                          source={img.cancelIcon}
                          style={{
                            height: 16,
                            width: 16,
                            resizeMode: 'contain',
                            tintColor: 'white',
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{flex: 3, flexDirection: 'row', margin: '5%'}}>
                  <View style={{flex: 2, marginLeft: 5}}>
                    <TextInput
                      style={{
                        padding: 8,
                        borderRadius: 5,
                        backgroundColor: 'white',
                      }}
                      value={categoryName}
                      placeholder="Category Name"
                      placeholderTextColor="black"
                      onChangeText={value =>
                        this.setState({categoryName: value})
                      }
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    margin: '5%',
                    marginBottom: 20,
                  }}>
                  <View style={{margin: '2%'}}>
                    <TouchableOpacity
                      onPress={() => this.setState({addCatModal: false})}
                      style={{
                        height: hp('4%'),
                        width: wp('25%'),
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: hp('1.5%'),
                        borderRadius: 100,
                        alignSelf: 'center',
                        flexDirection: 'row',
                      }}>
                      <View>
                        <Text style={{}}>Cancel </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{margin: '2%'}}>
                    <TouchableOpacity
                      onPress={() => this.addCategory(categoryName)}
                      style={{
                        height: hp('4%'),
                        width: wp('25%'),
                        backgroundColor: '#94C036',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: hp('1.5%'),
                        borderRadius: 100,
                        alignSelf: 'center',
                        flexDirection: 'row',
                      }}>
                      <View>
                        <Image
                          source={img.addIcon}
                          style={{
                            height: 16,
                            width: 16,
                            resizeMode: 'contain',
                            tintColor: 'white',
                          }}
                        />
                      </View>
                      <View>
                        <Text style={{color: 'white'}}>Add </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <Modal isVisible={addSubCatModal} backdropOpacity={0.35}>
              <View
                style={{
                  width: wp('70%'),
                  height: hp('25%'),
                  backgroundColor: '#F0F4FF',
                  alignSelf: 'center',
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    backgroundColor: '#94BC37',
                    height: hp('5%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{flexDirection: 'row', flex: 7}}>
                    <View style={{flex: 6}}>
                      <Text style={{color: 'white', margin: '3%'}}>
                        Add Sub Category
                      </Text>
                    </View>
                    <View style={{flex: 1, margin: '3%'}}>
                      <TouchableOpacity
                        onPress={() => this.setState({addSubCatModal: false})}>
                        <Image
                          source={img.cancelIcon}
                          style={{
                            height: 16,
                            width: 16,
                            resizeMode: 'contain',
                            tintColor: 'white',
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{flex: 3, flexDirection: 'row', margin: '5%'}}>
                  <View style={{flex: 2, marginLeft: 5}}>
                    <TextInput
                      style={{
                        padding: 8,
                        borderRadius: 5,
                        backgroundColor: 'white',
                      }}
                      value={subCategoryName}
                      placeholder="Sub Category Name"
                      placeholderTextColor="black"
                      onChangeText={value =>
                        this.setState({subCategoryName: value})
                      }
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    margin: '5%',
                    marginBottom: 20,
                  }}>
                  <View style={{margin: '2%'}}>
                    <TouchableOpacity
                      onPress={() => this.setState({addSubCatModal: false})}
                      style={{
                        height: hp('4%'),
                        width: wp('25%'),
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: hp('1.5%'),
                        borderRadius: 100,
                        alignSelf: 'center',
                        flexDirection: 'row',
                      }}>
                      <View>
                        <Text style={{}}>Cancel </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{margin: '2%'}}>
                    <TouchableOpacity
                      onPress={() => this.addSubCategory(subCategoryName)}
                      style={{
                        height: hp('4%'),
                        width: wp('25%'),
                        backgroundColor: '#94C036',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: hp('1.5%'),
                        borderRadius: 100,
                        alignSelf: 'center',
                        flexDirection: 'row',
                      }}>
                      <View>
                        <Image
                          source={img.addIcon}
                          style={{
                            height: 16,
                            width: 16,
                            resizeMode: 'contain',
                            tintColor: 'white',
                          }}
                        />
                      </View>
                      <View>
                        <Text style={{color: 'white'}}>Add </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </View>
    );
  }
}
