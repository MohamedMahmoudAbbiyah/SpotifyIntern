import React from 'react';
import {StyleSheet, Image, View} from 'react-native';

const ImageScreen = (props) => {
  const source = props.navigation.getParam('source');
  let imageContainer = styles.imageContainer;
  let image = styles.image;
  if (source.type === 1) {
    imageContainer = styles.imageContainer2;
    image = styles.image2;
  }
  return (
    <View style={imageContainer}>
      <Image source={source.source} style={image} resizeMode="contain" />
    </View>
  );
};

ImageScreen.navigationOptions = (navData) => {
  return {header: () => null};
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    aspectRatio: 0.3,
  },
  imageContainer2: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  image2: {
    aspectRatio: 1,
  },
});

export default ImageScreen;
