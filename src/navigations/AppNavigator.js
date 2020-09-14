import React from 'react';
import {Platform} from 'react-native';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ChatScreen from '../screens/ChatScreen';
import ChatsScreen from '../screens/ChatsScreen';
import FindNewFriendsScreen from '../screens/FindNewFriendsScreen';
import LoginScreen from '../screens/LoginScreen';
import MyFriendsScreen from '../screens/MyFriendsScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import NewFriendScreen from '../screens/NewFriendScreen';
import StartupScreen from '../screens/StartupScreen';
import LoadingScreen from '../screens/LoadingScreen';
import ImageScreen from '../screens/ImageScreen';

import Colors from '../constants/Colors';

import PopupMenu from '../components/UI/PopupMenu';

const LoginStackNavigator = createStackNavigator(
  {
    Login: LoginScreen,
  },
  {
    defaultNavigationOptions: {
      headerStatusBarHeight: 0,
      headerStyle: {
        backgroundColor: Colors.tabColor,
      },
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerTintColor: 'white',
      headerTitle: 'Authenticate',
      headerTitleAlign: 'center',
    },
  },
);

const ChatsStackNavigator = createStackNavigator({
  Chats: ChatsScreen,
});

const MyFriendsStackNavigator = createStackNavigator({
  MyFriends: MyFriendsScreen,
});

const FindNewFriendsStackNavigator = createStackNavigator({
  FindNewFriends: FindNewFriendsScreen,
});

const tabConfig = {
  Chats: {
    screen: ChatsStackNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Entypo name="chat" size={24} color="white" />;
      },
      tabBarColor: Colors.tabColor,
    },
  },
  MyFriends: {
    screen: MyFriendsStackNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <AntDesign name="contacts" size={24} color="white" />;
      },
      tabBarColor: Colors.tabColor,
    },
  },
  FindNewFriends: {
    screen: FindNewFriendsStackNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return (
          <MaterialCommunityIcons
            name="account-search"
            size={28}
            color="white"
          />
        );
      },
      tabBarColor: Colors.tabColor,
    },
  },
};

const AppTabNavigator =
  Platform.OS === 'android'
    ? createMaterialBottomTabNavigator(tabConfig, {
        activeColor: 'white',
        shifting: true,
        labeld: false,
      })
    : createBottomTabNavigator(tabConfig, {
        tabBarOptions: {
          showLabel: true,
          activeTintColor: 'white',
        },
      });

const Navigator = createStackNavigator(
  {
    AppTab: AppTabNavigator,
    MyProfile: MyProfileScreen,
    NewFriendScreen: NewFriendScreen,
    ImageScreen: ImageScreen,
    ChatScreen: ChatScreen,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      headerStatusBarHeight: 0,
      headerStyle: {
        backgroundColor: Colors.tabColor,
      },
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerTintColor: 'white',
      headerTitle: 'Spotify Friends',
      headerRight: () => {
        return (
          <PopupMenu
            logoutHandler={() => {
              navigation.navigate('Login');
            }}
            onMyProfile={() => {
              navigation.push('MyProfile');
            }}
          />
        );
      },
    }),
  },
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  LoadingScreen: LoadingScreen,
  Login: LoginStackNavigator,
  Navigator: Navigator,
});

export default createAppContainer(MainNavigator);
