import {StyleSheet, Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const numColumns = 3;

const styles = StyleSheet.create({
  container: {
    marginTop: '10%',
    flex: 1,
    backgroundColor: '#fff',
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
});
export default styles;
