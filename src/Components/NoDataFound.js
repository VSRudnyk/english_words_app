import { StyleSheet, View, Image } from 'react-native';

export const NoDataFound = () => {
  return (
    <View style={styles.noDataFoundCont}>
      <Image
        style={styles.noDataFoundImg}
        source={require('../../image/no-data-found.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  noDataFoundCont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataFoundImg: {
    borderRadius: 8,
    width: 250,
    height: 150,
    resizeMode: 'contain',
  },
});
