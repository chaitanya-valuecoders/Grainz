import {StyleSheet, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const numColumns = 3;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#EEF2FD'},
  tinyLogo: {
    width: 50,
    height: 50,
  },
  itemContainer: {
    width: Dimensions.get('window').width / numColumns,
    height: Dimensions.get('window').width / numColumns,
    borderRadius: 50,
  },
  subContainer: {
    marginTop: hp('2%'),
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
  flex: {flex: 1},
  headingContainer: {
    alignItems: 'center',
    marginHorizontal: wp('5%'),
    marginVertical: hp('2%'),
  },
  headingTextStyling: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#523622',
    textAlign: 'center',
  },
  tileContainer: {
    backgroundColor: '#fff',
    flex: 1,
    margin: 10,
    borderRadius: 8,
    padding: 10,
  },
  tileImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileImageStyling: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  tileTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileTextStyling: {
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  renderHeaderContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#F0F0F0',
    height: 60,
    marginTop: hp('2%'),
    alignItems: 'center',
    borderRadius: 6,
  },
  renderHeaderImageStyling: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    marginLeft: wp('2%'),
  },
  renderHeaderTextStyling: {
    color: '#492813',
    fontSize: 14,
    marginLeft: wp('2%'),
    fontFamily: 'Inter-Regular',
  },
  renderContentContainer: {backgroundColor: '#fff', height: hp('30%')},
  renderContentSubContainer: {
    flexDirection: 'row',
    paddingBottom: 15,
    marginHorizontal: wp('5%'),
  },
  boxSize: {width: wp('40%'), justifyContent: 'center'},
  boxTextHeadingStyling: {
    fontSize: 14,
    color: '#161C27',
    fontFamily: 'Inter-SemiBold',
  },
  renderHeaderContentContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 10,
    marginHorizontal: wp('5%'),
    borderTopColor: '#0000001A',
  },
  boxTextDataStyling: {
    fontSize: 14,
    color: '#161C27',
    fontFamily: 'Inter-Regular',
  },
  notAvailableContainer: {paddingVertical: 10, marginHorizontal: wp('5%')},
  notAvailableStyling: {color: 'red', fontFamily: 'Inter-Regular'},
});
export default styles;
