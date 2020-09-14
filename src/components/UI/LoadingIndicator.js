import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import Colors from '../../constants/Colors';

const LoadingIndicator = (props) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>{props.children || 'Loading'}</Text>
      <ActivityIndicator size="large" color={Colors.buttonColor2} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    paddingBottom: 10,
    fontSize: 18,
  },
});
export default LoadingIndicator;
