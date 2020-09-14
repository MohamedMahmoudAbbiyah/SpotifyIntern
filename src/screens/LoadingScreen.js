import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';

import * as userActions from '../store/actions/user';
import * as locationActions from '../store/actions/location';
import * as savedTracksActions from '../store/actions/savedTracks';
import LoadingIndicator from '../components/UI/LoadingIndicator';

export const exitApp = () => {
  BackHandler.exitApp();
  return true;
};

const LoadingScreen = (props) => {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const dispatch = useDispatch();

  let accessToken = useSelector((state) => state.auth.accessToken);
  let hasPermission = false;

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', exitApp);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', exitApp);
    };
  }, []);

  const alertUser = () => {
    Alert.alert(
      '',
      'In order to use the app, you must grant location permission. Please edit your device setting...',
      [
        {
          title: 'Okay',
          onPress: () => {
            exitApp();
          },
        },
      ],
    );
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This App needs to access your location.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        hasPermission = true;
      } else {
        alertUser();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const loadLocation = () => {
    if (hasPermission) {
      setIsLocationLoading(true);
      Geolocation.getCurrentPosition(
        async (position) => {
          await dispatch(locationActions.setUserLocation(position));
          setTimeout(() => {
            setIsLocationLoading(false);
            props.navigation.navigate('Chats');
          }, 1000);
        },
        (error) => {
          Alert.alert(
            "Can't load your location:",
            'Please make sure your device location is enabled and has Internet access.',
            [
              {
                text: 'Exit App',
                onPress: () => exitApp(),
                style: 'cancel',
              },
              {
                text: 'Try Again',
                onPress: () => loadLocation(),
              },
            ],
            {cancelable: false},
          );
          setIsLocationLoading(false);
        },
        {enableHighAccuracy: false, timeout: 20000},
      );
    } else {
      alertUser();
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      setIsLoadingData(true);
      await dispatch(userActions.getCurrentUserProfile(accessToken));
      setTimeout(async () => {
        await dispatch(savedTracksActions.getUserSavedTracks(accessToken));
        setIsLoadingData(false);
        await requestLocationPermission();
        loadLocation();
      }, 2000);
    };
    getUserData();
  }, []);

  if (isLoadingData) {
    return <LoadingIndicator>Loading Data...</LoadingIndicator>;
  }
  if (isLocationLoading) {
    return <LoadingIndicator>Loading Location...</LoadingIndicator>;
  }
  return (
    <View style={styles.screen}>
      <Text>Chats Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
