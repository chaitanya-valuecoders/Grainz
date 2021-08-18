import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import img from '../../constants/images';
import SubHeader from '../../components/SubHeader';
import Header from '../../components/Header';
import {UserTokenAction} from '../../redux/actions/UserTokenAction';
import {
  getMyProfileApi,
  getPreviousStockDatesDataApi,
} from '../../connectivity/api';
import styles from './style';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {translate} from '../../utils/translations';
import Accordion from 'react-native-collapsible/Accordion';

class HistoryData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      buttonsSubHeader: [],
      loader: true,
      departmentId: '',
      categoryId: '',
      pageDate: '',
      topValue: '',
      categoryLoader: true,
      topValueStatus: true,
      historyDate: '',
      activeSections: [],
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
      });
  };

  componentDidMount() {
    this.getData();
    const {departmentId, historyDate} =
      this.props.route && this.props.route.params;
    this.props.navigation.addListener('focus', () => {
      this.setState(
        {
          departmentId,
          historyDate,
          categoryLoader: true,
        },
        () => this.getStockDataFun(),
      );
    });
  }

  getStockDataFun = () => {
    const {historyDate} = this.state;
    console.log('Date', historyDate);
    getPreviousStockDatesDataApi(historyDate)
      .then(res => {
        function groupByKey(array, key) {
          return array.reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, {
              [obj[key]]: (hash[obj[key]] || []).concat(obj),
            });
          }, {});
        }

        let groupedCategory = groupByKey(res.data, 'category');

        let finalArray = Object.keys(groupedCategory).map((item, index) => {
          console.log('item', item);
          return {
            name: item,
            id: index,
            children: groupedCategory[item],
          };
        });

        console.log('final', finalArray);
        this.setState({
          categoryLoader: false,
          SECTIONS: finalArray,
        });
      })
      .catch(err => {
        console.log('ERR', err);
      });
  };

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  _renderHeader = (section, index, isActive) => {
    return (
      <View style={styles.renderHeaderContainer}>
        <Image
          style={styles.renderHeaderImageStyling}
          source={isActive ? img.upArrowIcon : img.arrowRightIcon}
        />
        <Text style={styles.renderHeaderTextStyling}>{section.name}</Text>
      </View>
    );
  };

  _renderContent = section => {
    console.log('sec', section);
    const {categoryLoader} = this.state;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.renderContentContainer}>
          <View style={styles.renderContentSubContainer}>
            <View style={styles.boxSize}>
              <Text style={styles.boxTextHeadingStyling}>Name</Text>
            </View>
            <View
              style={{
                width: wp('40'),
                justifyContent: 'center',
                paddingTop: 10,
                marginLeft: wp('2%'),
              }}>
              <Text style={styles.boxTextHeadingStyling}>System says</Text>
            </View>
            <View style={{...styles.boxSize, marginLeft: wp('2%')}}>
              <Text style={styles.boxTextHeadingStyling}>Stock Take</Text>
            </View>
            <View
              style={{
                width: wp('10%'),
                justifyContent: 'center',
                paddingTop: 10,
                marginLeft: wp('2%'),
              }}></View>
            <View style={{...styles.boxSize, marginLeft: wp('2%')}}>
              <Text style={styles.boxTextHeadingStyling}>Correction</Text>
            </View>
          </View>
          {categoryLoader ? (
            <ActivityIndicator size="large" color="#94C036" />
          ) : (
            <ScrollView nestedScrollEnabled>
              {section && section.children.length > 0 ? (
                section.children.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={styles.renderHeaderContentContainer}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <View style={styles.boxSizeSec}>
                          <Text style={styles.boxTextDataStyling}>
                            {item.name && item.name}
                          </Text>
                        </View>
                        <View
                          style={{...styles.boxSizeSec, marginLeft: wp('2%')}}>
                          <Text
                            style={styles.boxTextDataStyling}
                            numberOfLines={1}>
                            {item.systemSays && item.systemSays.toFixed(2)}{' '}
                            {item.unit}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => this.editUnitsFun(item)}
                          style={{
                            ...styles.boxSizeSec,
                            marginLeft: wp('2%'),
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: item.quantity
                              ? '#E9ECEF'
                              : '#FDF851',
                            paddingVertical: 10,
                          }}>
                          <Text style={styles.boxTextDataStyling}>
                            {item.quantity}
                          </Text>
                        </TouchableOpacity>
                        <View
                          style={{
                            width: wp('10%'),
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: wp('2%'),
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#161C27',
                              fontFamily: 'Inter-Regular',
                            }}>
                            {item.unit}
                          </Text>
                        </View>

                        <View
                          style={{...styles.boxSizeSec, marginLeft: wp('2%')}}>
                          <Text style={styles.boxTextDataStyling}>
                            {item.correction} {item.unit}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={styles.notAvailableContainer}>
                  <Text style={styles.notAvailableStyling}>
                    No data available
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    );
  };

  _updateSections = activeSections => {
    this.setState({
      activeSections,
    });
  };

  editUnitsFun = item => {
    const {pageDate, departmentId, categoryId} = this.state;
    this.props.navigation.navigate('EditStockScreen', {
      item,
      pageDate,
      inventoryId: item.inventoryId,
      departmentId,
      categoryId,
      screenType: 'History',
    });
  };

  render() {
    const {buttonsSubHeader, loader, categoryLoader, SECTIONS, activeSections} =
      this.state;
    console.log('SECTIONS', SECTIONS);

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

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{marginBottom: hp('2%')}}>
            {categoryLoader ? (
              <ActivityIndicator color="#94C036" size="large" />
            ) : (
              <View style={styles.margin}>
                <Accordion
                  underlayColor="#fff"
                  sections={SECTIONS}
                  activeSections={activeSections}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                  onChange={this._updateSections}
                />
              </View>
            )}
          </ScrollView>
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

export default connect(mapStateToProps, {UserTokenAction})(HistoryData);
