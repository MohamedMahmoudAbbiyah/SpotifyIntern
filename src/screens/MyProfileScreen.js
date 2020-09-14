import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const MyProfileScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Text>MyProfile Screen</Text>
    </View>
  );
};

MyProfileScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'My Profile',
    headerRight: () => {},
    headerTitleAlign: 'center',
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyProfileScreen;
