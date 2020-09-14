import React from 'react';
import {View, Image, TouchableOpacity, Text, StyleSheet} from 'react-native';

const FriendCart = (props) => {
  let image = (
    <Image
      style={styles.image}
      source={{
        uri: props.imageUrl,
      }}
    />
  );

  if (!props.imageUrl) {
    let str = props.name;
    let matches = str.match(/\b(\w)/g);
    let acronym = matches.join('');
    image = (
      <View style={styles.imageTextContainer}>
        <Text style={styles.imageText}>{acronym.toUpperCase()}</Text>
      </View>
    );
  }
  return (
    <TouchableOpacity style={styles.container} onPress={props.onClick}>
      <View style={styles.imageContainer}>{image}</View>
      <View style={styles.textsContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{props.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 5,
    height: 70,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%',
    borderColor: '#eee',
    borderRightWidth: 1,
  },
  image: {
    width: 60,
    borderRadius: 30,
    height: 60,
    borderColor: '#eee',
    borderWidth: 1,
  },
  textsContainer: {
    flexDirection: 'column',
    width: '75%',
    paddingVertical: 20,
    paddingLeft: 20,
  },
  nameContainer: {
    paddingBottom: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageText: {
    fontSize: 20,
    width: 60,
    height: 60,
    textAlign: 'center',
    paddingTop: 15,
  },
  imageTextContainer: {
    backgroundColor: '#8f8e8c',
    borderRadius: 30,
    borderColor: '#eee',
    borderWidth: 1,
  },
});

export default FriendCart;
