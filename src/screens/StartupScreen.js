import React, {useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch} from 'react-redux';

import * as authActions from '../store/actions/auth';
import Colors from '../constants/Colors';

const StartupScreen = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      try {
        const tokens = await AsyncStorage.getItem('tokens');
        // user is using the app for the first time, navigate to Login page
        if (!tokens) {
          props.navigation.navigate('Login', {doILogout: false});
          return;
        }

        const transformedData = JSON.parse(tokens);
        const {accessToken, refreshToken, expirationDate} = transformedData;

        // if user logged out, so ask for login again
        if (!accessToken || !refreshToken) {
          props.navigation.navigate('Login', {doILogout: false});
          return;
        }

        // if accessToken expired, then refresh the accessToken
        const currentDate = new Date().getTime();
        const expiryDate = new Date(expirationDate).getTime();

        if (expiryDate < currentDate) {
          const result = await authActions.refreshLogin(refreshToken);

          if (result === 'error') {
            props.navigation.navigate('Login', {doILogout: false});
            return;
          } else {
            dispatch(
              authActions.authenticate(
                result.accessToken,
                result.refreshToken,
                result.accessTokenExpirationDate,
              ),
            );
            authActions.saveDataToStorage(
              result.accessToken,
              result.refreshToken,
              result.accessTokenExpirationDate,
            );
            props.navigation.navigate('LoadingScreen');
          }
        } else {
          await dispatch(
            authActions.authenticate(accessToken, refreshToken, expirationDate),
          );
          props.navigation.navigate('LoadingScreen');
        }
      } catch (error) {
        console.log('Error loading storage');
        console.log(error);
      }
    };
    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.buttonColor2} />
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

export default StartupScreen;
