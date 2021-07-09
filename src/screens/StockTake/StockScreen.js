import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
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
  lookupInventoryApi,
  getStockDataApi,
  getNewTopStockTakeApi,
  getNewStockTakeApi,
} from '../../connectivity/api';
import Accordion from 'react-native-collapsible/Accordion';
import styles from './style';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {translate} from '../../utils/translations';
import moment from 'moment';
import Modal from 'react-native-modal';
import CheckBox from '@react-native-community/checkbox';

class StockScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      activeSections: [],
      SECTIONS: [],
      subHeaderLoader: true,
      recipeLoader: false,
      buttonsSubHeader: [],
      categoryLoader: false,
      departmentData: '',
      finalDate: '',
      isDatePickerVisible: false,
      pageDate: '',
      newModalIsVisible: false,
      allSelected: true,
      topSelected: false,
      topCount: '',
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
          subHeaderLoader: false,
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

  getManualLogsData = () => {
    this.setState(
      {
        recipeLoader: true,
      },
      () => this.createFirstData(),
    );
  };

  createFirstData = () => {
    const {departmentData} = this.state;
    lookupInventoryApi(departmentData.id)
      .then(res => {
        console.log('res', res);
        let finalArray = res.data.map((item, index) => {
          return {
            title: item.name,
            content: item.id,
            departmentId: item.departmentId,
          };
        });
        const result = finalArray;
        this.setState({
          SECTIONS: [...result],
          recipeLoader: false,
        });
      })
      .catch(err => {
        console.log('ERR MEP', err);
        this.setState({
          recipeLoader: false,
        });
      });
  };

  componentDidMount() {
    const {departmentData} = this.props.route && this.props.route.params;
    this.getData();
    this.setState({
      departmentData,
    });
  }

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  onPressFun = () => {
    this.props.navigation.goBack();
  };

  _renderHeader = (section, index, isActive) => {
    return (
      <View style={styles.renderHeaderContainer}>
        <Image
          style={styles.renderHeaderImageStyling}
          source={isActive ? img.upArrowIcon : img.arrowRightIcon}
        />
        <Text style={styles.renderHeaderTextStyling}>{section.title}</Text>
      </View>
    );
  };

  editUnitsFun = item => {
    const {pageDate, departmentData} = this.state;
    this.setState(
      {
        activeSections: [],
        catArray: [],
        categoryLoader: false,
      },
      () =>
        this.props.navigation.navigate('EditStockScreen', {
          item,
          pageDate,
          inventoryId: item.inventoryId,
          departmentData,
        }),
    );
  };

  _renderContent = section => {
    const {categoryLoader, catArray} = this.state;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.renderContentContainer}>
          <View style={styles.renderContentSubContainer}>
            <View style={styles.boxSize}>
              <Text style={styles.boxTextHeadingStyling}>Name</Text>
            </View>
            <View style={{width: wp('40')}}>
              <Text style={styles.boxTextHeadingStyling}>System says</Text>
            </View>
            <View style={styles.boxSize}>
              <Text style={styles.boxTextHeadingStyling}>Stock Take</Text>
            </View>
            <View style={styles.boxSize}>
              <Text style={styles.boxTextHeadingStyling}>Correction</Text>
            </View>
          </View>
          {categoryLoader ? (
            <ActivityIndicator size="large" color="#94C036" />
          ) : (
            <ScrollView nestedScrollEnabled>
              {catArray && catArray.length > 0 ? (
                catArray.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={styles.renderHeaderContentContainer}>
                      <TouchableOpacity
                        onPress={() => this.editUnitsFun(item)}
                        style={{
                          flexDirection: 'row',
                        }}>
                        <View style={styles.boxSize}>
                          <Text style={styles.boxTextDataStyling}>
                            {item.name && item.name}
                          </Text>
                        </View>
                        <View style={styles.boxSize}>
                          <Text
                            style={styles.boxTextDataStyling}
                            numberOfLines={1}>
                            {item.systemSays && item.systemSays.toFixed(2)}{' '}
                            {item.unit}
                          </Text>
                        </View>
                        <View style={styles.boxSize}>
                          <Text style={styles.boxTextDataStyling}>
                            {item.quantity} {item.unit}
                          </Text>
                        </View>
                        <View style={styles.boxSize}>
                          <Text style={styles.boxTextDataStyling}>
                            {item.correction} {item.unit}
                          </Text>
                        </View>
                      </TouchableOpacity>
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
    this.setState(
      {
        activeSections,
        categoryLoader: true,
      },
      () => this.updateSubFun(),
    );
  };

  updateSubFun = () => {
    const {SECTIONS, activeSections, pageDate} = this.state;
    if (activeSections.length > 0) {
      const deptId = SECTIONS[activeSections].content;
      const catId = SECTIONS[activeSections].departmentId;
      getStockDataApi(deptId, catId, pageDate)
        .then(res => {
          this.setState({
            catArray: res.data,
            categoryLoader: false,
          });
        })
        .catch(err => {
          console.log('ERR', err);
        });
    } else {
      this.setState({
        activeSections: [],
        categoryLoader: false,
        catArray: [],
      });
    }
  };

  showDatePickerFun = () => {
    this.setState({
      isDatePickerVisible: true,
    });
  };

  handleConfirm = date => {
    let newdate = moment(date).format('MM/DD/YYYY');
    let finalPageDate = date.toISOString();
    this.setState(
      {
        finalDate: newdate,
        topCount: '',
        buttonStatus: '',
        pageDate: finalPageDate,
      },

      () => this.getManualLogsData(),
    );
    this.hideDatePicker();
  };
  hideDatePicker = () => {
    this.setState({
      isDatePickerVisible: false,
    });
  };

  openNewModalFun() {
    this.setState({newModalIsVisible: true});
  }

  closeNewModalFun() {
    this.setState({
      newModalIsVisible: false,
      topCount: '',
      allSelected: true,
      topSelected: false,
    });
  }

  startFun = () => {
    const {topCount} = this.state;
    let newdate = moment(new Date()).format('MM/DD/YYYY');
    const finalDate = new Date().toISOString();
    if (topCount) {
      this.setState(
        {
          recipeLoader: true,
          finalDate: newdate,
          newModalIsVisible: false,
          buttonStatus: 'Start',
          pageDate: finalDate,
        },
        () => this.getStockDataCountFun(),
      );
    } else {
      this.setState(
        {
          recipeLoader: true,
          finalDate: newdate,
          newModalIsVisible: false,
          buttonStatus: 'Start',
          pageDate: finalDate,
        },
        () => this.getStockDataFun(),
      );
    }
  };

  endFun = () => {
    const {topCount} = this.state;
    var tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    let newdate = moment(tomorrow).format('MM/DD/YYYY');
    const finalDate = tomorrow.toISOString();
    if (topCount) {
      this.setState(
        {
          recipeLoader: true,
          finalDate: newdate,
          newModalIsVisible: false,
          buttonStatus: 'End',
          pageDate: finalDate,
        },
        () => this.getStockDataCountFun(),
      );
    } else {
      this.setState(
        {
          recipeLoader: true,
          finalDate: newdate,
          newModalIsVisible: false,
          buttonStatus: 'End',
          pageDate: finalDate,
        },
        () => this.getStockDataFun(),
      );
    }
  };

  getStockDataFun = () => {
    const {departmentData, finalDate} = this.state;
    getNewStockTakeApi(departmentData.id, finalDate)
      .then(res => {
        this.setState({newStock: res.data});

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
          return {
            name: item,
            id: item,
            children: groupedCategory[item],
          };
        });

        let childrenList = [];
        let list = [...finalArray];
        let newItems = [];
        let pos = 0;
        list.map(item => {
          childrenList.push(item.children);
          newItems.push({
            name: item.name,
            id: item.id,
            position: pos,
            children: [],
            showChildren: false,
            sortedAlpha: false,
            sortedByDate: false,
          });
          pos = pos + 1;
        });
        this.setState({
          items: newItems,
          childrenList: childrenList,
          recipeLoader: false,
          itemsStatus: true,
        });
      })
      .catch(err => {
        console.warn('Err', err.response);
      });
  };

  getStockDataCountFun = () => {
    const {departmentData, finalDate, topCount} = this.state;
    getNewTopStockTakeApi(departmentData.id, finalDate, topCount)
      .then(res => {
        this.setState({newStock: res.data});

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
          return {
            name: item,
            id: item,
            children: groupedCategory[item],
          };
        });
        let childrenList = [];
        let list = [...finalArray];
        let newItems = [];
        let pos = 0;
        list.map(item => {
          childrenList.push(item.children);
          newItems.push({
            name: item.name,
            id: item.id,
            position: pos,
            children: [],
            showChildren: false,
            sortedAlpha: false,
            sortedByDate: false,
          });
          pos = pos + 1;
        });
        this.setState({
          items: newItems,
          childrenList: childrenList,
          recipeLoader: false,
          itemsStatus: true,
        });
      })
      .catch(err => {
        this.setState({
          recipeLoader: false,
        });
        console.warn('Err', err.response);
      });
  };
  render() {
    const {
      recipeLoader,
      SECTIONS,
      activeSections,
      buttonsSubHeader,
      departmentData,
      isDatePickerVisible,
      finalDate,
      subHeaderLoader,
      newModalIsVisible,
      allSelected,
      topSelected,
      topCount,
    } = this.state;

    return (
      <View style={styles.container}>
        <Header
          logoutFun={this.myProfile}
          logoFun={() => this.props.navigation.navigate('HomeScreen')}
        />
        {subHeaderLoader ? (
          <ActivityIndicator color="#94C036" size="small" />
        ) : (
          <SubHeader {...this.props} buttons={buttonsSubHeader} />
        )}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            <View style={styles.firstContainer}>
              <View style={styles.flex}>
                <Text style={styles.adminTextStyle}>
                  {translate('Stock Take')} - {departmentData.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <Text style={styles.goBackTextStyle}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View style={styles.firstContainer}>
              <TouchableOpacity
                style={styles.flex}
                onPress={() => this.openNewModalFun()}>
                <Text style={styles.adminTextStyle}>{translate('New')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={styles.goBackContainer}>
                <View>
                  <TouchableOpacity
                    onPress={() => this.showDatePickerFun()}
                    style={styles.dateContainer}>
                    <TextInput
                      placeholder="dd-mm-yy"
                      value={finalDate}
                      editable={false}
                      placeholderTextColor="black"
                    />
                    <Image
                      source={img.calenderIcon}
                      style={styles.calenderImageStyling}
                    />
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode={'date'}
                    onConfirm={this.handleConfirm}
                    onCancel={this.hideDatePicker}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {recipeLoader ? (
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
          <Modal isVisible={newModalIsVisible} backdropOpacity={0.35}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeadingContainer}>
                <View style={styles.modalHeadingTextContainer}>
                  <Text style={styles.modalHeadingTextStyling}>
                    {translate('Stock take quantity')}
                  </Text>
                </View>
                <View style={styles.modalHeadingImageContainer}>
                  <TouchableOpacity onPress={() => this.closeNewModalFun()}>
                    <Image
                      source={img.cancelIcon}
                      style={styles.modalHeadingImageStyling}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView>
                <View style={styles.modalSubContainer}>
                  <View>
                    <View style={styles.modalSubContainerText}>
                      <Text style={styles.modalSubContainerTextStyling}>
                        {translate(
                          'Stock take must be done at the start of the day or at the end of the day',
                        )}
                      </Text>
                    </View>
                    <View style={styles.checkBoxContainer}>
                      <Text style={styles.checkBoxTextStyling}>All</Text>
                      <CheckBox
                        value={allSelected}
                        onValueChange={() =>
                          this.setState({
                            allSelected: true,
                            topSelected: false,
                          })
                        }
                        style={styles.checkBoxStyling}
                      />
                    </View>
                    <View style={styles.checkBoxContainer}>
                      <Text style={styles.checkBoxTextStyling}>Top</Text>
                      <CheckBox
                        value={topSelected}
                        onValueChange={() =>
                          this.setState({
                            topSelected: true,
                            allSelected: false,
                          })
                        }
                        style={styles.checkBoxStyling}
                      />
                    </View>
                    {topSelected ? (
                      <TextInput
                        style={styles.textInputModalStyling}
                        multiline={true}
                        numberOfLines={1}
                        onChangeText={value => {
                          this.setState({
                            topCount: value,
                          });
                        }}
                        value={topCount}
                      />
                    ) : null}
                    <View style={styles.modalButtonContainer}>
                      <TouchableOpacity
                        onPress={() => this.startFun()}
                        style={styles.saveContainer}>
                        <Text style={styles.saveTextStyling}>
                          {translate('Start')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.endFun()}
                        style={styles.endContainer}>
                        <Text style={styles.saveTextStyling}>
                          {translate('End')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
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

export default connect(mapStateToProps, {UserTokenAction})(StockScreen);
