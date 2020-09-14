import AsyncStorage from '@react-native-community/async-storage';
import {authorize, refresh} from 'react-native-app-auth';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

const spotifyAuthConfig = {
  clientId: 'aded67ea76c44bb6beb49582e426beee',
  clientSecret: '391739f84520467d9956f92ef08e4431',
  redirectUrl: 'com.spotifyfriends://oauthredirect',
  scopes: ['user-read-private', 'user-read-email', 'user-library-read'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  },
};

export const logout = () => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'tokens',
        JSON.stringify({
          accessToken: null,
          refreshToken: null,
          expirationDate: null,
        }),
      );

      dispatch({
        type: LOGOUT,
        accessToken: null,
        refreshToken: null,
        expirationDate: null,
      });
    } catch (error) {
      throw new Error(error);
    }
  };
};
export const login = () => {
  return async (dispatch) => {
    try {
      const {
        accessToken,
        refreshToken,
        accessTokenExpirationDate,
      } = await loginToSpotify();

      if (accessToken != null) {
        dispatch(
          authenticate(accessToken, refreshToken, accessTokenExpirationDate),
        );
        saveDataToStorage(accessToken, refreshToken, accessTokenExpirationDate);
        return accessToken;
      }
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const authenticate = (accessToken, refreshToken, expirationDate) => {
  return (dispatch) => {
    dispatch({
      type: LOGIN,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expirationDate: expirationDate,
    });
  };
};

const loginToSpotify = async () => {
  try {
    const result = await authorize(spotifyAuthConfig);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const saveDataToStorage = async (
  accessToken,
  refreshToken,
  expirationDate,
) => {
  try {
    await AsyncStorage.setItem(
      'tokens',
      JSON.stringify({
        accessToken: accessToken,
        refreshToken: refreshToken,
        expirationDate: expirationDate,
      }),
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const refreshLogin = async (refreshToken) => {
  try {
    const result = await refresh(spotifyAuthConfig, {
      refreshToken: refreshToken,
    });
    return result;
  } catch (error) {
    console.log('Error occurred while refreshing token');
    console.log(error);
    return 'error';
  }
};
