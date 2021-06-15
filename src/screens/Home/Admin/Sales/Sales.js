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
  Alert,
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
import {
  getMyProfileApi,
  salesReportAdminApi,
} from '../../../../connectivity/api';
import Modal from 'react-native-modal';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styles from './style';

import {translate} from '../../../../utils/translations';

class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      firstName: '',
      recipeLoader: false,
      buttonsSubHeader: [],
      isDatePickerVisibleStart: false,
      finalDateStart: '',
      isDatePickerVisibleEnd: false,
      finalDateEnd: '',
      activeSections: [],
      modalData: [],
      SECTIONS: [],
      SECTIONS_SEC: [],
      finalName: '',
      modalVisibleSetup: false,
      modalLoader: false,
      sectionName: '',
      reportTitle: '',
      dataStatus: false,
      SECTIONS_INVOICES: [],
      activeSectionsInvoices: [],
      SECTIONS_DEPARTMENT: [],
      SECTIONS_VAT: [],
      activeSectionsDepartment: [],
      activeSectionsVat: [],
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
          firstName: res.data.firstName,
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
  }

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = () => {
    this.props.navigation.goBack();
  };

  showDatePickerFunStart = () => {
    this.setState({
      isDatePickerVisibleStart: true,
    });
  };

  showDatePickerFunEnd = () => {
    this.setState({
      isDatePickerVisibleEnd: true,
    });
  };

  handleConfirmStart = date => {
    console.log('date', date);
    let newdate = moment(date).format('MM/DD/YYYY');
    this.setState({
      finalDateStart: newdate,
    });
    this.hideDatePickerStart();
  };
  hideDatePickerStart = () => {
    this.setState({
      isDatePickerVisibleStart: false,
    });
  };

  handleConfirmEnd = date => {
    console.log('date', date);
    let newdate = moment(date).format('MM/DD/YYYY');
    this.setState({
      finalDateEnd: newdate,
    });
    this.hideDatePickerEnd();
  };
  hideDatePickerEnd = () => {
    this.setState({
      isDatePickerVisibleEnd: false,
    });
  };

  findReportFun = () => {
    this.setState(
      {
        buttonLoader: true,
      },
      () => this.getReportsData(),
    );
  };

  getReportsData = () => {
    const {finalDateEnd, finalDateStart} = this.state;
    if (finalDateEnd && finalDateStart) {
      salesReportAdminApi(finalDateStart, finalDateEnd)
        .then(res => {
          console.log('RES', res);

          const {sales, title, departments, saleInvoices, vats} = res.data;

          let finalSaleInvoices = saleInvoices.map((item, index) => {
            return {
              title: 'Manual Entry',
              content: item,
            };
          });

          let groupedInvoices = groupByKey(finalSaleInvoices, 'title');

          let invoicesArray = Object.keys(groupedInvoices).map(
            (item, index) => {
              return {
                title: item,
                content: groupedInvoices[item],
              };
            },
          );

          let finalDepartment = departments.map((item, index) => {
            return {
              title: 'Department',
              content: item,
            };
          });

          let groupedDepartment = groupByKey(finalDepartment, 'title');

          let departmentArray = Object.keys(groupedDepartment).map(
            (item, index) => {
              return {
                title: item,
                content: groupedDepartment[item],
              };
            },
          );

          let finalVat = vats.map((item, index) => {
            return {
              title: 'VAT%',
              content: item,
            };
          });

          let groupedVat = groupByKey(finalVat, 'title');

          let vatArray = Object.keys(groupedVat).map((item, index) => {
            return {
              title: item,
              content: groupedVat[item],
            };
          });

          // console.log('INVOICES', finalSaleInvoices);
          function groupByKey(array, key) {
            return array.reduce((hash, obj) => {
              if (obj[key] === undefined) return hash;
              return Object.assign(hash, {
                [obj[key]]: (hash[obj[key]] || []).concat(obj),
              });
            }, {});
          }

          function extract() {
            var groups = {};

            sales.forEach(function (val) {
              var depat = val.menuName;
              if (depat in groups) {
                groups[depat].push(val);
              } else {
                groups[depat] = new Array(val);
              }
            });

            return groups;
          }

          let final = extract();
          console.log('FINAL', final);

          let finalArray = Object.keys(final).map((item, index) => {
            let groupedCategory = groupByKey(final[item], 'menuItemCategory');
            // console.log('groupedCategory', groupedCategory);

            let catArray = Object.keys(groupedCategory).map(
              (subItem, index) => {
                return {
                  title: subItem,
                  content: groupedCategory[subItem],
                };
              },
            );

            // console.log('catArray', catArray);

            return {
              title: item,
              content: catArray,
            };
          });
          console.log('finalArray', finalArray);

          const result = finalArray;

          this.setState({
            SECTIONS: [...result],
            buttonLoader: false,
            SECTIONS_SEC: [...result],
            dataStatus: true,
            reportTitle: title,
            SECTIONS_INVOICES: [...invoicesArray],
            SECTIONS_DEPARTMENT: [...departmentArray],
            SECTIONS_VAT: [...vatArray],
          });
        })
        .catch(err => {
          console.log('ERR MEP', err);

          this.setState({
            buttonLoader: false,
          });
        });
    } else {
      Alert.alert('Grainz', 'Please select dates first', [
        {
          text: 'OK',
          onPress: () =>
            this.setState({
              buttonLoader: false,
              dataStatus: false,
            }),
        },
      ]);
    }
  };

  _renderHeader = (section, index, isActive) => {
    return (
      <View
        style={{
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          borderWidth: 0.5,
          borderColor: '#F0F0F0',
          height: 60,
          marginTop: hp('2%'),
          alignItems: 'center',
          borderRadius: 6,
        }}>
        <Image
          style={{
            height: 18,
            width: 18,
            resizeMode: 'contain',
            marginLeft: wp('2%'),
          }}
          source={isActive ? img.upArrowIcon : img.arrowRightIcon}
        />
        <Text
          style={{
            color: '#492813',
            fontSize: 14,
            marginLeft: wp('2%'),
            fontFamily: 'Inter-Regular',
          }}>
          {section.title}
        </Text>
      </View>
    );
  };

  _renderHeaderInvoices = (section, index, isActive) => {
    return (
      <View
        style={{
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          borderWidth: 0.5,
          borderColor: '#F0F0F0',
          height: 60,
          marginTop: hp('2%'),
          alignItems: 'center',
          borderRadius: 6,
        }}>
        <Image
          style={{
            height: 18,
            width: 18,
            resizeMode: 'contain',
            marginLeft: wp('2%'),
          }}
          source={isActive ? img.upArrowIcon : img.arrowRightIcon}
        />
        <Text
          style={{
            color: '#492813',
            fontSize: 15,
            marginLeft: wp('2%'),
            fontFamily: 'Inter-Regular',
          }}>
          {section.title}
        </Text>
      </View>
    );
  };

  _renderHeaderDepartment = (section, index, isActive) => {
    return (
      <View
        style={{
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          borderWidth: 0.5,
          borderColor: '#F0F0F0',
          height: 60,
          marginTop: hp('2%'),
          alignItems: 'center',
          borderRadius: 6,
        }}>
        <Image
          style={{
            height: 18,
            width: 18,
            resizeMode: 'contain',
            marginLeft: wp('2%'),
          }}
          source={isActive ? img.upArrowIcon : img.arrowRightIcon}
        />
        <Text
          style={{
            color: '#492813',
            fontSize: 15,
            marginLeft: wp('2%'),
            fontFamily: 'Inter-Regular',
          }}>
          {section.title}
        </Text>
      </View>
    );
  };

  _renderHeaderVat = (section, index, isActive) => {
    return (
      <View
        style={{
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          borderWidth: 0.5,
          borderColor: '#F0F0F0',
          height: 60,
          marginTop: hp('2%'),
          alignItems: 'center',
          borderRadius: 6,
        }}>
        <Image
          style={{
            height: 18,
            width: 18,
            resizeMode: 'contain',
            marginLeft: wp('2%'),
          }}
          source={isActive ? img.upArrowIcon : img.arrowRightIcon}
        />
        <Text
          style={{
            color: '#492813',
            fontSize: 15,
            marginLeft: wp('2%'),
            fontFamily: 'Inter-Regular',
          }}>
          {section.title}
        </Text>
      </View>
    );
  };

  openListFun = (index, section, item) => {
    this.props.navigation.navigate('SalesAdminSec', {
      index,
      section,
      item,
    });
  };

  // createDataFun = (index, section, sta, subItem) => {
  //   console.log('section', section);
  //   console.log('inde', index);
  //   console.log('status', sta);
  //   const {SECTIONS, showSubList, finalName} = this.state;
  //   console.log('finalName', finalName);
  //   console.log('SECTIONS', SECTIONS);

  //   const status = true;
  //   // const status = !showSubList;
  //   console.log('status', status);

  //   let newArr = section.content.map((item, i) =>
  //     finalName === item.title
  //       ? {
  //           ...item,
  //           [sta]: status,
  //         }
  //       : {
  //           ...item,
  //           [sta]: false,
  //         },
  //   );
  //   console.log('new', newArr);

  //   setTimeout(() => {
  //     this.setState({
  //       showSubList: status,
  //       modalData: newArr,
  //       modalLoader: false,
  //     });
  //   }, 300);
  // };

  _renderContent = section => {
    // console.log('sec', section);
    return (
      <View>
        {section.content.map((item, index) => {
          return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <TouchableOpacity
                  onPress={() => this.openListFun(index, section, item)}
                  style={{
                    borderWidth: 1,
                    paddingVertical: 15,
                    paddingHorizontal: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    borderRadius: 6,
                  }}>
                  <View
                    style={{
                      width: wp('30%'),
                      alignItems: 'center',
                    }}>
                    <Text style={{textAlign: 'center'}}>{item.title}</Text>
                  </View>
                  <View
                    style={{
                      width: wp('30%'),
                      alignItems: 'center',
                    }}>
                    <Text>Menu Items</Text>
                  </View>
                  <View
                    style={{
                      width: wp('30%'),
                      alignItems: 'center',
                    }}>
                    <Text>TVA % </Text>
                  </View>
                  <View
                    style={{
                      width: wp('30%'),
                      alignItems: 'center',
                    }}>
                    <Text>#Sold</Text>
                  </View>
                  <View
                    style={{
                      width: wp('30%'),
                      alignItems: 'center',
                    }}>
                    <Text>$TVAC</Text>
                  </View>
                  <View
                    style={{
                      width: wp('30%'),
                      alignItems: 'center',
                    }}>
                    <Text>$TVA</Text>
                  </View>
                  <View
                    style={{
                      width: wp('30%'),
                      alignItems: 'center',
                    }}>
                    <Text>$HTVA</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          );
        })}
      </View>
    );
  };

  _renderContentInvoices = section => {
    // console.log('sec--->', section);
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{marginTop: hp('2%')}}>
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: 10,
            }}>
            <View style={{width: wp('30%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                Manual Entry
              </Text>
            </View>
            <View style={{width: wp('30%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>TVA%</Text>
            </View>
            <View style={{width: wp('30%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>$TVAC</Text>
            </View>
            <View style={{width: wp('30%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>$TVA</Text>
            </View>
            <View style={{width: wp('30%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>$HTVA</Text>
            </View>
          </View>
          {section.content.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('EventsSecAdminScreen')
                }
                style={{
                  flexDirection: 'row',
                  borderTopWidth: 0.5,
                  paddingVertical: 10,
                }}>
                <View style={{width: wp('30%')}}>
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: 'center',
                    }}>
                    {item && item.content.name}
                  </Text>
                </View>
                <View style={{width: wp('30%')}}>
                  <Text style={{fontSize: 15}} numberOfLines={1}>
                    {item && item.content.vat}%
                  </Text>
                </View>
                <View style={{width: wp('30%')}}>
                  <Text style={{fontSize: 15}}>
                    ${item && item.content.amount}
                  </Text>
                </View>
                <View style={{width: wp('30%')}}>
                  <Text style={{fontSize: 15}}>
                    ${item && item.content.vatAmountFormatted}
                  </Text>
                </View>
                <View style={{width: wp('30%')}}>
                  <Text style={{fontSize: 15}}>
                    ${item && item.content.priceExcludingVATFormatted}
                  </Text>
                </View>
                {/* <TouchableOpacity style={{width: wp('30%')}}>
                  <Text style={{fontSize: 15, fontWeight: 'bold'}}>EDIT</Text>
                </TouchableOpacity> */}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  _renderContentVat = section => {
    // console.log('sec--->', section);
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{marginTop: hp('2%')}}>
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: 10,
            }}>
            <View style={{width: wp('30%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>VAT%</Text>
            </View>
            <View style={{width: wp('30%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>$TVAC</Text>
            </View>
            <View style={{width: wp('30%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>$TVA</Text>
            </View>
            <View style={{width: wp('30%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>$HTVA</Text>
            </View>
          </View>
          {section.content.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('EventsSecAdminScreen')
                }
                style={{
                  flexDirection: 'row',
                  borderTopWidth: 0.5,
                  paddingVertical: 10,
                }}>
                <View style={{width: wp('30%')}}>
                  <Text
                    style={{
                      fontSize: 15,

                      textAlign: 'center',
                    }}>
                    {item && item.content.vat}%
                  </Text>
                </View>
                <View style={{width: wp('30%')}}>
                  <Text style={{fontSize: 15}} numberOfLines={1}>
                    ${item && item.content.totalPriceFormatted}
                  </Text>
                </View>
                <View style={{width: wp('30%')}}>
                  <Text style={{fontSize: 15}}>
                    ${item && item.content.vatAmountFormatted}
                  </Text>
                </View>
                <View style={{width: wp('30%')}}>
                  <Text style={{fontSize: 15}}>
                    ${item && item.content.priceExcludingVATFormatted}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  _renderContentDepartment = section => {
    // console.log('sec--->', section);
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{marginTop: hp('2%')}}>
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: 10,
            }}>
            <View style={{width: wp('30%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>Department</Text>
            </View>
            <View style={{width: wp('30%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>$TVAC</Text>
            </View>
            <View style={{width: wp('30%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>$TVA</Text>
            </View>
            <View style={{width: wp('30%')}}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>$HTVA</Text>
            </View>
          </View>
          {section.content.map((item, index) => {
            console.log('item', item);
            return (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('EventsSecAdminScreen')
                }
                style={{
                  flexDirection: 'row',
                  borderTopWidth: 0.5,
                  paddingVertical: 10,
                }}>
                <View style={{width: wp('30%')}}>
                  <Text
                    style={{
                      fontSize: 15,

                      textAlign: 'center',
                    }}>
                    {item && item.content.department}
                  </Text>
                </View>
                <View style={{width: wp('30%')}}>
                  <Text style={{fontSize: 15}} numberOfLines={1}>
                    ${item && item.content.totalPriceFormatted}
                  </Text>
                </View>
                <View style={{width: wp('30%')}}>
                  <Text style={{fontSize: 15}}>
                    ${item && item.content.vatAmountFormatted}
                  </Text>
                </View>
                <View style={{width: wp('30%')}}>
                  <Text style={{fontSize: 15}}>
                    ${item && item.content.priceExcludingVATFormatted}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  _updateSections = activeSections => {
    this.setState(
      {
        activeSections,
      },
      () => this.updateSubFun(),
    );
  };

  _updateSectionsInvoices = activeSections => {
    this.setState({
      activeSectionsInvoices: activeSections,
    });
  };

  _updateSectionsDepartment = activeSections => {
    this.setState({
      activeSectionsDepartment: activeSections,
    });
  };

  _updateSectionsVat = activeSections => {
    this.setState({
      activeSectionsVat: activeSections,
    });
  };

  updateSubFun = () => {
    this.setState({
      modalData: [],
    });
  };

  setAdminModalVisible = visible => {
    this.setState(
      {
        modalVisibleSetup: visible,
      },
      () => this.updateSubFun(),
    );
  };

  addLineFun = () => {
    alert('add line');
  };

  render() {
    const {
      firstName,
      buttonsSubHeader,
      recipeLoader,
      isDatePickerVisibleStart,
      finalDateStart,
      isDatePickerVisibleEnd,
      finalDateEnd,
      buttonLoader,
      activeSections,
      modalData,
      SECTIONS,
      finalName,
      modalVisibleSetup,
      modalLoader,
      sectionName,
      reportTitle,
      dataStatus,
      SECTIONS_INVOICES,
      SECTIONS_DEPARTMENT,
      activeSectionsInvoices,
      activeSectionsDepartment,
      SECTIONS_VAT,
      activeSectionsVat,
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
          style={{marginBottom: hp('5%')}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            <View style={styles.firstContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.adminTextStyle}>{translate('Sales')}</Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              onPress={() => this.showDatePickerFunStart()}
              style={{
                width: wp('90%'),
                padding: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 5,
                backgroundColor: '#fff',
              }}>
              <TextInput
                placeholder="Select start date"
                value={finalDateStart}
                editable={false}
              />
              <Image
                source={img.calenderIcon}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisibleStart}
              mode={'date'}
              onConfirm={this.handleConfirmStart}
              onCancel={this.hideDatePickerStart}
              // maximumDate={tomorrow}
              // minimumDate={new Date()}
            />
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: hp('3%'),
            }}>
            <TouchableOpacity
              onPress={() => this.showDatePickerFunEnd()}
              style={{
                width: wp('90%'),
                padding: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 5,
                backgroundColor: '#fff',
              }}>
              <TextInput
                placeholder="Select end date"
                value={finalDateEnd}
                editable={false}
              />
              <Image
                source={img.calenderIcon}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisibleEnd}
              mode={'date'}
              onConfirm={this.handleConfirmEnd}
              onCancel={this.hideDatePickerEnd}
              // maximumDate={tomorrow}
              // minimumDate={new Date()}
            />
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => this.findReportFun()}
              style={{
                flexDirection: 'row',
                height: hp('6%'),
                width: wp('80%'),
                backgroundColor: '#94C036',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: hp('5%'),
                borderRadius: 100,
              }}>
              {buttonLoader ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={{}}>
                  <Text style={{color: 'white', fontFamily: 'Inter-SemiBold'}}>
                    Find Report
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: hp('4%'),
            }}>
            {dataStatus ? (
              <Text
                style={{
                  fontSize: 20,
                  color: '#492813',
                  fontFamily: 'Inter-Regular',
                }}>
                {reportTitle}
              </Text>
            ) : null}
          </View>
          <View style={{marginTop: hp('3%'), marginHorizontal: wp('5%')}}>
            <Accordion
              // expandMultiple
              underlayColor="#fff"
              sections={SECTIONS}
              activeSections={activeSections}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
              onChange={this._updateSections}
            />
          </View>

          <View style={{marginTop: hp('2%'), marginHorizontal: wp('5%')}}>
            <Accordion
              // expandMultiple
              underlayColor="#fff"
              sections={SECTIONS_INVOICES}
              activeSections={activeSectionsInvoices}
              renderHeader={this._renderHeaderInvoices}
              renderContent={this._renderContentInvoices}
              onChange={this._updateSectionsInvoices}
            />
          </View>
          {dataStatus ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => this.addLineFun()}
                style={{
                  height: hp('6%'),
                  width: wp('80%'),
                  backgroundColor: '#94C036',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp('5%'),
                  borderRadius: 100,
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
                    Add Line
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          <View
            style={{
              marginTop: hp('3%'),
            }}>
            {dataStatus ? (
              <Text
                style={{
                  fontSize: 18,
                  color: '#492813',
                  fontFamily: 'Inter-Regular',
                  alignSelf: 'center',
                }}>
                Totals
              </Text>
            ) : null}
          </View>
          <View style={{marginTop: hp('2%'), marginHorizontal: wp('5%')}}>
            <Accordion
              // expandMultiple
              underlayColor="#fff"
              sections={SECTIONS_DEPARTMENT}
              activeSections={activeSectionsDepartment}
              renderHeader={this._renderHeaderDepartment}
              renderContent={this._renderContentDepartment}
              onChange={this._updateSectionsDepartment}
            />
          </View>
          <View style={{marginTop: hp('2%'), marginHorizontal: wp('5%')}}>
            <Accordion
              // expandMultiple
              underlayColor="#fff"
              sections={SECTIONS_VAT}
              activeSections={activeSectionsVat}
              renderHeader={this._renderHeaderVat}
              renderContent={this._renderContentVat}
              onChange={this._updateSectionsVat}
            />
          </View>
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
                  height: hp('6%'),
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flex: 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{fontSize: 16, color: '#fff'}}>
                    {sectionName}
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
              <ScrollView>
                {modalLoader ? (
                  <ActivityIndicator size="large" color="grey" />
                ) : (
                  <View
                    style={{
                      padding: hp('3%'),
                    }}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      <View>
                        <View
                          style={{
                            paddingVertical: 15,
                            paddingHorizontal: 5,
                            marginTop: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderWidth: 1,
                          }}>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text style={{textAlign: 'center'}}>
                              {finalName}
                            </Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>Menu Items</Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>TVA % </Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>#Sold</Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>$TVAC</Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>$TVA</Text>
                          </View>
                          <View
                            style={{
                              width: wp('30%'),
                              alignItems: 'center',
                            }}>
                            <Text>$HTVA</Text>
                          </View>
                        </View>
                        <View>
                          {modalData && modalData.length > 0
                            ? modalData.map((item, index) => {
                                if (item.status === true) {
                                  return item.content.map(
                                    (subItem, subIndex) => {
                                      console.log('sub-->', subItem);
                                      return (
                                        <View
                                          style={{
                                            paddingVertical: 10,
                                            paddingHorizontal: 5,
                                            flexDirection: 'row',
                                          }}>
                                          <View
                                            style={{
                                              width: wp('30%'),
                                              alignItems: 'center',
                                            }}>
                                            <Text style={{textAlign: 'center'}}>
                                              {subItem.name}
                                            </Text>
                                          </View>
                                          <View
                                            style={{
                                              width: wp('30%'),
                                              alignItems: 'center',
                                            }}>
                                            <Text>{subItem.menuItemName}</Text>
                                          </View>
                                          <View
                                            style={{
                                              width: wp('30%'),
                                              alignItems: 'center',
                                            }}>
                                            <Text>
                                              {subItem.vatPercentage}%
                                            </Text>
                                          </View>
                                          <View
                                            style={{
                                              width: wp('30%'),
                                              alignItems: 'center',
                                            }}>
                                            <Text>{subItem.quantity}</Text>
                                          </View>
                                          <View
                                            style={{
                                              width: wp('30%'),
                                              alignItems: 'center',
                                            }}>
                                            <Text>
                                              {subItem.totalPriceFormatted}
                                            </Text>
                                          </View>
                                          <View
                                            style={{
                                              width: wp('30%'),
                                              alignItems: 'center',
                                            }}>
                                            <Text>
                                              {subItem.vatAmountFormatted}
                                            </Text>
                                          </View>
                                          <TouchableOpacity
                                            onPress={() => alert('ORDER NOW')}
                                            style={{
                                              width: wp('30%'),
                                              alignItems: 'center',
                                            }}>
                                            <Text>
                                              {
                                                subItem.priceExcludingVATFormatted
                                              }
                                            </Text>
                                          </TouchableOpacity>
                                        </View>
                                      );
                                    },
                                  );
                                }
                              })
                            : null}
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                )}
              </ScrollView>
            </View>
          </Modal>
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

export default connect(mapStateToProps, {UserTokenAction})(Sales);
