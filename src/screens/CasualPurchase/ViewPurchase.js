import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../constants/images';
import SubHeader from '../../components/SubHeader';
import Header from '../../components/Header';
import moment from 'moment';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {getMyProfileApi, getCasualPurchasesApi} from '../../connectivity/api';
import {translate} from '../../utils/translations';
import styles from './style';

class ViewPurchase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      casualPurchases: [],
      casualListLoader: false,
      recipeLoader: true,
      buttonsSubHeader: [],
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
          recipeLoader: false,
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

  getCasualPurchasesData() {
    this.setState(
      {
        casualListLoader: true,
      },
      () =>
        getCasualPurchasesApi()
          .then(res => {
            this.setState({casualPurchases: res.data, casualListLoader: false});
          })
          .catch(err => {
            this.setState({casualListLoader: false});
            console.warn('errR', err);
          }),
    );
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getCasualPurchasesData();
    });
    this.getProfileDataFun();
  }

  myProfileFun = () => {
    this.props.navigation.navigate('MyProfile');
  };

  navigateToEditFun(order) {
    this.props.navigation.navigate('EditPurchase', {
      orderData: order,
    });
  }

  render() {
    const {casualPurchases, casualListLoader, buttonsSubHeader, recipeLoader} =
      this.state;
    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfileFun}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {/* {recipeLoader ? (
          <ActivityIndicator size="small" color="#94C036" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )} */}
        <ScrollView
          ref={ref => {
            this.scrollListReftop = ref;
          }}>
          <View>
            <View style={styles.subContainer}>
              <View style={styles.firstContainer}>
                <View style={styles.flex}>
                  <Text style={styles.adminTextStyle}>
                    {translate('Casual purchase')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={styles.goBackContainer}>
                  <Text style={styles.goBackTextStyle}>
                    {' '}
                    {translate('Go Back')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{marginTop: '4%'}}>
            <View style={styles.listHeading}>
              <View style={styles.listSubHeading}>
                <Text style={styles.listTextStyling}>{translate('Date')}</Text>
                <Pressable>
                  <Image
                    style={styles.listImageStyling}
                    source={img.doubleArrowIconNew}
                  />
                </Pressable>
              </View>
              <View style={styles.listSubHeading}>
                <Text style={styles.listTextStyling}>
                  {translate('Supplier')}
                </Text>
                <Pressable>
                  <Image
                    style={styles.listImageStyling}
                    source={img.doubleArrowIconNew}
                  />
                </Pressable>
              </View>
              <View style={styles.listSubHeading}>
                <Text style={styles.listTextStyling}>
                  $ {translate('Total')} HTVA
                </Text>
                <Pressable>
                  <Image
                    style={styles.listImageStyling}
                    source={img.doubleArrowIconNew}
                  />
                </Pressable>
              </View>
            </View>
            {casualListLoader ? (
              <ActivityIndicator color="grey" size="large" />
            ) : (
              casualPurchases.map((item, index) => {
                const date = moment(item.orderDate).format('MM/DD/YYYY');
                const price = Math.round(item.htva);
                return (
                  <View
                    style={{
                      ...styles.listDataHeadingContainer,
                      backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F7F8F5',
                    }}>
                    <TouchableOpacity
                      style={styles.listDataHeadingSubContainer}
                      onPress={() => this.navigateToEditFun(item)}>
                      <View style={styles.listDataContainer}>
                        <Text style={styles.listDataTextStyling}>{date}</Text>
                      </View>
                      <View style={styles.listDataContainer}>
                        <Text style={styles.listDataTextStyling}>
                          {item.supplierName}
                        </Text>
                      </View>
                      <View style={styles.listDataContainer}>
                        <Text style={styles.listDataTextStyling}>
                          $ {price}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
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

export default connect(mapStateToProps, {UserTokenAction})(ViewPurchase);
