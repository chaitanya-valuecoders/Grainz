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
  flex: {flex: 1},
  dateContainer: {
    width: wp('40%'),
    borderWidth: 1,
    padding: Platform.OS === 'ios' ? 10 : 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#CFD7E2',
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  calenderImageStyling: {
    width: 17,
    height: 17,
    marginTop: Platform.OS === 'android' ? 13 : 0,
    marginRight: Platform.OS === 'android' ? 10 : 0,
    resizeMode: 'contain',
  },
  margin: {marginTop: hp('2%'), marginHorizontal: wp('5%')},
  modalContainer: {
    width: wp('80%'),
    height: hp('50%'),
    backgroundColor: '#F0F4FE',
    alignSelf: 'center',
    borderRadius: 6,
  },
  modalHeadingContainer: {
    backgroundColor: '#99C23E',
    height: hp('6%'),
    flexDirection: 'row',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  modalHeadingTextContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeadingTextStyling: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Inter-Regular',
  },
  modalHeadingImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeadingImageStyling: {
    height: 22,
    width: 22,
    tintColor: 'white',
    resizeMode: 'contain',
  },
  modalSubContainer: {padding: hp('3%')},
  modalSubContainerText: {marginBottom: 10},
  modalSubContainerTextStyling: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#000000',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  checkBoxTextStyling: {
    width: 50,
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#000000',
  },
  checkBoxStyling: {
    height: 20,
    width: 20,
  },
  textInputModalStyling: {
    paddingVertical: 10,
    borderColor: 'grey',
    borderWidth: 1,
    width: wp('20%'),
    paddingLeft: 10,
    marginTop: hp('2%'),
    borderRadius: 6,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('5%'),
    justifyContent: 'center',
  },
  saveContainer: {
    height: hp('5%'),
    backgroundColor: '#94C036',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: wp('20%'),
  },
  saveTextStyling: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
  endContainer: {
    height: hp('5%'),
    backgroundColor: '#E7943B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: wp('20%'),
    marginLeft: 15,
  },
  addContainer: {
    height: hp('6%'),
    width: wp('80%'),
    backgroundColor: '#94C036',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp('2%'),
    borderRadius: 100,
    alignSelf: 'center',
  },
  addSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addImageStyling: {
    width: 20,
    height: 20,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  addTextStyling: {
    color: 'white',
    marginLeft: 10,
    fontFamily: 'Inter-SemiBold',
  },
  paddingContainer: {
    padding: hp('2%'),
  },
  headingEditContainer: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EFFBCF',
  },
  headingSubContainer: {
    width: wp('30%'),
    alignItems: 'center',
  },
});
export default styles;
