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
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import SubHeader from '../../../../../components/SubHeader';
import Header from '../../../../../components/Header';
import {UserTokenAction} from '../../../../../redux/actions/UserTokenAction';
import {getMyProfileApi} from '../../../../../connectivity/api';
import styles from '../style';
import {translate} from '../../../../../utils/translations';
import {WebView} from 'react-native-webview';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

class PdfView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      modalVisible: false,
      recipeLoader: false,
      buttonsSubHeader: [],
      htmlData: '',
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
        console.warn('ERr', err);
      });
  };

  componentDidMount() {
    this.getData();
    const {htmlData} = this.props.route && this.props.route.params;
    this.setState({
      htmlData,
    });
  }

  myProfile = () => {
    this.props.navigation.navigate('MyProfile');
  };

  isPermitted = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs access to Storage data',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        alert('Write permission err', err);
        return false;
      }
    } else {
      return true;
    }
  };

  createPDF = async () => {
    if (await this.isPermitted()) {
      let options = {
        //Content to print
        html: this.state.htmlData,
        //File Name
        fileName: 'order',
        //File directory
        directory: 'docs',
      };
      let file = await RNHTMLtoPDF.convert(options);
      Alert.alert('Grainz', `Pdf downloaded successfully - ${file.filePath}`, [
        {
          text: 'Okay',
          onPress: () => this.props.navigation.navigate('HomeScreen'),
        },
      ]);
    }
  };

  render() {
    const {recipeLoader, buttonsSubHeader} = this.state;

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
        <View style={styles.subContainer}>
          <View style={styles.firstContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.adminTextStyle}>Order Details</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('HomeScreen')}
              style={styles.goBackContainer}>
              <Text style={styles.goBackTextStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 3.5, backgroundColor: '#F0F4FE'}}>
          <WebView
            startInLoadingState={true}
            renderLoading={() => {
              return (
                <View style={{flex: 1}}>
                  <ActivityIndicator size="large" color="grey" />
                </View>
              );
            }}
            originWhitelist={['*']}
            source={{html: this.state.htmlData}}
            style={{
              flex: 1,
              backgroundColor: '#F0F4FE',
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          <View style={{}}>
            <TouchableOpacity onPress={() => this.createPDF()}>
              <Text style={styles.goBackTextStyle}>Download</Text>
            </TouchableOpacity>
          </View>
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

export default connect(mapStateToProps, {UserTokenAction})(PdfView);
