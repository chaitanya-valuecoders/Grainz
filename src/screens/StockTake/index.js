import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
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
import {getMyProfileApi, getDepartmentsApi} from '../../connectivity/api';
import styles from './style';

import {translate} from '../../utils/translations';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: [],
      token: '',
      buttonsSubHeader: [],
      loader: true,
    };
  }

  getData = async () => {
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
          loader: false,
          buttonsSubHeader: [
            {name: translate('ADMIN')},
            {name: translate('Setup')},
            {name: translate('INBOX')},
          ],
        });
      })
      .catch(err => {
        console.warn('ERr', err.response);
        this.setState({
          loader: false,
        });
        Alert.alert('Grainz', 'Session Timeout', [
          {text: 'OK', onPress: () => this.removeToken()},
        ]);
      });
  };

  removeToken = async () => {
    await AsyncStorage.removeItem('@appToken');
    this.props.UserTokenAction(null);
  };

  componentDidMount() {
    this.getData();
    this.getDepartmentsFun();
  }

  getDepartmentsFun() {
    this.setState(
      {
        pageLoader: true,
      },
      () =>
        getDepartmentsApi()
          .then(res => {
            this.setState({buttons: res.data, pageLoader: false});
          })
          .catch(error => {
            this.setState({pageLoader: false});
            console.warn('err', error);
          }),
    );
  }

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = data => {
    this.props.navigation.navigate('StockScreen', {
      departmentData: data,
    });
  };

  render() {
    const {buttons, buttonsSubHeader, loader} = this.state;

    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {loader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )}
        <View style={styles.subContainer}>
          <View style={styles.firstContainer}>
            <View style={styles.flex}>
              <Text style={styles.adminTextStyle}>
                {translate('Stock Take')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.goBackContainer}>
              <Text style={styles.goBackTextStyle}>Go Back</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headingContainer}>
            <View>
              <Text style={styles.headingTextStyling}>
                {translate('Select which department you wish to stock take')}
              </Text>
            </View>
          </View>
          <FlatList
            data={buttons}
            renderItem={({item}) => (
              <View style={styles.itemContainer}>
                <TouchableOpacity
                  onPress={() => this.onPressFun(item)}
                  style={styles.tileContainer}>
                  <View style={styles.tileImageContainer}>
                    <Image
                      source={
                        item.name === 'Bar'
                          ? img.barIcon
                          : item.name === 'Other'
                          ? img.otherIcon
                          : item.name === 'Restaurant'
                          ? img.restaurantIcon
                          : item.name === 'Retail'
                          ? img.retailIcon
                          : null
                      }
                      style={styles.tileImageStyling}
                    />
                  </View>
                  <View style={styles.tileTextContainer}>
                    <Text style={styles.tileTextStyling} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.id}
            numColumns={3}
          />
        </View>
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
