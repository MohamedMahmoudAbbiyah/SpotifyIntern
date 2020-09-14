import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useDispatch} from 'react-redux';

import Colors from '../constants/Colors';
import CustomButton from '../components/UI/CustomButton';
import * as authActions from '../store/actions/auth';
import LoadingIndicator from '../components/UI/LoadingIndicator';

const LoginScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const doILogout = props.navigation.getParam('doILogout', true);

    if (doILogout) {
      dispatch(authActions.logout());
    }
  }, []);

  const onLogin = async () => {
    console.log('onLogin pressed');
    setIsLoading(true);
    let accessToken = await dispatch(authActions.login());
    setIsLoading(false);

    if (accessToken != null) {
      props.navigation.navigate('LoadingScreen');
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <View style={styles.screen}>
      <Text style={styles.welcomeText}>Welcome to Spotify Friends App</Text>

      <View style={styles.customBtn}>
        <CustomButton onPress={onLogin}>LOGIN WITH SPOTIFY</CustomButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'center',
  },
  welcomeText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 35,
    paddingHorizontal: '15%',
    lineHeight: 50,
  },
  customBtn: {
    marginVertical: '20%',
  },
});

export default LoginScreen;
