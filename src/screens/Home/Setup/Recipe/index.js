import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../../../constants/images';
import SubHeader from '../../../../components/SubHeader';
import Header from '../../../../components/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {UserTokenAction} from '../../../../redux/actions/UserTokenAction';
import {getMyProfileApi, getRecipeNamesApi} from '../../../../connectivity/api';
import RNPicker from 'rn-modal-picker';
import styles from './style';
import {translate} from '../../../../utils/translations';
import CheckBox from '@react-native-community/checkbox';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      recipeLoader: false,
      recipeId: '',
      buttonsSubHeader: [],
      recipeArr: [],
      placeHolderText: 'Select Recipe',
    };
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@appToken');
      if (value !== null) {
        this.setState(
          {
            recipeLoader: true,
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
    this.getRecipeData();
  }

  getRecipeData = () => {
    getRecipeNamesApi()
      .then(res => {
        const finalArr = [];
        res.data.map(item => {
          finalArr.push({
            name: item.name,
            id: item.id,
          });
        });
        this.setState({
          recipeArr: [...finalArr],
        });
      })
      .catch(err => {
        console.warn('ERr', err);
      });
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  selectRecipeFun = item => {
    this.setState(
      {
        recipeId: item.id,
        selectedText: item.name,
      },
      () =>
        this.props.navigation.navigate('ViewRecipeScreen', {
          id: item.id,
        }),
    );
  };

  render() {
    const {recipeLoader, buttonsSubHeader, recipeArr, placeHolderText} =
      this.state;

    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {recipeLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} index={1} />
        )}
        <ScrollView
          style={{marginBottom: hp('2%')}}
          showsVerticalScrollIndicator={false}>
          <View style={{...styles.subContainer, marginBottom: hp('2%')}}>
            <View style={styles.firstContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.adminTextStyle}>
                  {translate('Recipes')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{marginHorizontal: wp('5%')}}>
            <View>
              <View>
                <RNPicker
                  dataSource={recipeArr}
                  dummyDataSource={recipeArr}
                  defaultValue={false}
                  pickerTitle={'Select Recipe'}
                  showSearchBar={true}
                  disablePicker={false}
                  changeAnimation={'none'}
                  searchBarPlaceHolder={'Search.....'}
                  showPickerTitle={true}
                  searchBarContainerStyle={styles.searchBarContainerStyle}
                  pickerStyle={styles.pickerStyle}
                  itemSeparatorStyle={styles.itemSeparatorStyle}
                  pickerItemTextStyle={styles.listTextViewStyle}
                  selectedLabel={this.state.selectedText}
                  placeHolderLabel={placeHolderText}
                  selectLabelTextStyle={styles.selectLabelTextStyle}
                  placeHolderTextStyle={styles.placeHolderTextStyle}
                  dropDownImageStyle={styles.dropDownImageStyle}
                  dropDownImage={img.arrowDownIcon}
                  selectedValue={(index, item) => this.selectRecipeFun(item)}
                />
              </View>

              {/* <DropDownPicker
                placeholder="Select Recipe"
                items={recipeArr}
                zIndex={3000}
                containerStyle={{
                  height: 50,
                  marginBottom: hp('3%'),
                  borderColor: 'red',
                }}
                style={{
                  backgroundColor: '#fff',
                }}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{backgroundColor: '#fff'}}
                onChangeItem={item => this.selectRecipeFun(item)}
              /> */}
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('EventsSecAdminScreen')
                }
                style={{
                  height: hp('6%'),
                  width: wp('80%'),
                  backgroundColor: '#94C036',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('1.5%'),
                  borderRadius: 100,
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={img.addIcon}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: '#fff',
                      resizeMode: 'contain',
                    }}
                  />
                  <Text
                    style={{
                      color: 'white',
                      marginLeft: 10,
                      fontFamily: 'Inter-SemiBold',
                    }}>
                    Add New
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{...styles.subContainer, marginTop: hp('6%')}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: wp('5%'),
                marginBottom: hp('2%'),
              }}>
              <CheckBox
                value={false}
                // onValueChange={() =>
                //   this.setState({htvaIsSelected: !htvaIsSelected})
                // }
                style={{
                  margin: 5,
                  height: 20,
                  width: 20,
                }}
              />
              <View style={{flex: 1, marginLeft: wp('2%')}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Inter-Regular',
                    color: '#161C27',
                  }}>
                  {translate('MEP')}
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
              <CheckBox
                value={false}
                // onValueChange={() =>
                //   this.setState({htvaIsSelected: !htvaIsSelected})
                // }
                style={{
                  margin: 5,
                  height: 20,
                  width: 20,
                }}
              />
              <View style={{flex: 1, marginLeft: wp('2%')}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Inter-Regular',
                    color: '#161C27',
                  }}>
                  Recipe-in-a-recipe
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
              <CheckBox
                value={false}
                // onValueChange={() =>
                //   this.setState({htvaIsSelected: !htvaIsSelected})
                // }
                style={{
                  margin: 5,
                  height: 20,
                  width: 20,
                }}
              />
              <View style={{flex: 1, marginLeft: wp('2%')}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Inter-Regular',
                    color: '#161C27',
                  }}>
                  Counted
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
              <CheckBox
                value={true}
                // onValueChange={() =>
                //   this.setState({htvaIsSelected: !htvaIsSelected})
                // }
                style={{
                  margin: 5,
                  height: 20,
                  width: 20,
                }}
              />
              <View style={{flex: 1, marginLeft: wp('2%')}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Inter-Regular',
                    color: '#161C27',
                  }}>
                  {translate('In use')}
                </Text>
              </View>
            </View>
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
