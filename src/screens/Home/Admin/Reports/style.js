import {StyleSheet, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const numColumns = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FE',
  },
  subContainer: {
    marginTop: hp('2%'),
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
  itemContainer: {
    width: Dimensions.get('window').width / numColumns,
    height: Dimensions.get('window').width / numColumns,
    borderRadius: 50,
  },
  item: {
    flex: 1,
    margin: 5,
    backgroundColor: 'lightblue',
    borderRadius: 50,
  },
  firstContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp('5%'),
    marginVertical: hp('2%'),
  },
  adminTextStyle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#523622',
  },
  goBackContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  goBackTextStyle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#523622',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  itemSeparatorStyle: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#D3D3D3',
  },
  searchBarContainerStyle: {
    marginTop: 5,
    marginBottom: 10,
    flexDirection: 'row',
    height: 40,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: '#d3d3d3',
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: 25,
  },

  selectLabelTextStyle: {
    color: '#000',
    textAlign: 'left',
    width: '99%',
    padding: 10,
    flexDirection: 'row',
  },
  placeHolderTextStyle: {
    color: 'black',
    padding: 10,
    textAlign: 'left',
    width: '99%',
    flexDirection: 'row',
  },
  dropDownImageStyle: {
    marginLeft: 10,
    width: 10,
    height: 10,
    alignSelf: 'center',
  },
  listTextViewStyle: {
    color: '#000',
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: 'left',
  },
  pickerStyle: {
    marginLeft: 18,
    elevation: 3,
    paddingRight: 25,
    marginRight: 10,
    marginBottom: 2,
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 10,
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: '#d3d3d3',
    borderRadius: 5,
    flexDirection: 'row',
    paddingVertical: 8,
  },
});
export default styles;
