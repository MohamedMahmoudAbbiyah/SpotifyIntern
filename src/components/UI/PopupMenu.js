import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Entypo from 'react-native-vector-icons/Entypo';

const PopupMenu = (props) => {
  return (
    <View style={styles.container}>
      <Menu>
        <MenuTrigger>
          <Entypo name="dots-three-vertical" size={24} color="white" />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption
            onSelect={() => {
              props.onMyProfile();
            }}>
            <Text style={styles.myProfile}>My Profile</Text>
          </MenuOption>
          <MenuOption
            onSelect={() => {
              props.logoutHandler();
            }}>
            <Text style={styles.logout}>Logout</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: 10,
  },
  myProfile: {
    paddingLeft: 10,
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  logout: {
    paddingLeft: 10,
    paddingBottom: 10,
    color: 'red',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});

export default PopupMenu;
