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
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {getMyProfileApi} from '../../connectivity/api';
import styles from './style';

import {translate, setI18nConfig} from '../../utils/translations';

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
          buttons: [
            {
              name: translate('Stock Take'),
              icon: img.stokeTakeIcon,
              screen: 'StockTakeScreen',
            },
            {
              name: translate('Mise-en-Place'),
              icon: img.miscIcon,
              screen: 'MepScreen',
            },

            // {
            //   name: translate('Recipes'),
            //   icon: img.searchIcon,
            //   screen: 'RecipeScreen',
            // },
            // {
            //   name: translate('Menu-Items'),
            //   icon: img.searchIcon,
            //   screen: 'MenuItemsScreen',
            // },
            {
              name: translate('Manual Log small'),
              icon: img.ManualIcon,
              screen: 'ManualLogScreen',
            },
            // {
            //   name: translate('Deliveries'),
            //   icon: img.addIcon,
            //   screen: 'DeliveriesScreen',
            // },
            {
              name: translate('Casual purchase'),
              icon: img.CasualIcon,
              screen: 'CasualPurchaseScreen',
            },
            {
              name: translate('Ordering'),
              icon: img.orderingIcon,
              screen: 'OrderingAdminScreen',
            },
            // {name: translate('Events'), icon: img.addIcon, screen: 'EventsScreen'},
          ],
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
    this.setLanguage();
  }

  setLanguage = async () => {
    setI18nConfig();
    const lang = await AsyncStorage.getItem('Language');
    if (lang !== null && lang !== undefined) {
      setI18nConfig();
    } else {
      await AsyncStorage.setItem('Language', 'en');
      setI18nConfig();
    }
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = item => {
    this.props.navigation.navigate(item.screen);
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
          <ActivityIndicator size="large" color="grey" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )}
        <View style={styles.subContainer}>
          <FlatList
            data={buttons}
            renderItem={({item}) => (
              <View style={styles.itemContainer}>
                <TouchableOpacity
                  onPress={() => this.onPressFun(item)}
                  style={styles.tileContainer}>
                  <View style={styles.tileImageContainer}>
                    <Image source={item.icon} style={styles.tileImageStyling} />
                  </View>
                  <View style={styles.tileTextContainer}>
                    <Text style={styles.tileTextStyling} numberOfLines={1}>
                      {' '}
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
