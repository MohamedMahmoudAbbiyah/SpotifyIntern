import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../constants/Colors';

const CustomButton = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.btnContainer}>
      <Text style={styles.btnText}>{props.children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: Colors.buttonColor2,
    paddingVertical: '4%',
    paddingHorizontal: '8%',
    borderRadius: 15,
    alignSelf: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CustomButton;
