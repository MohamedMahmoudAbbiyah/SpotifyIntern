import React from 'react';
import {View, Image, TouchableOpacity, Text, StyleSheet} from 'react-native';

const ChatCart = (props) => {
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

  const getLastMessage = () => {
    let lastMessage = props.lastMessage;
    if (lastMessage.length > 30) {
      lastMessage = lastMessage.substring(0, 30) + ' ...';
    }
    return lastMessage;
  };
  const getName = () => {
    let chatName = props.name;
    if (chatName.length > 12) {
      chatName = chatName.substring(0, 12) + ' ...';
    }
    return chatName;
  };
  const lastMessageSent = getLastMessage();
  const name = getName();

  const getDate = (givenDate) => {
    givenDate = new Date(givenDate);
    const today = new Date();
    if (givenDate.toLocaleDateString() === today.toLocaleDateString()) {
      return givenDate.toLocaleTimeString();
    } else {
      return givenDate.toLocaleDateString();
    }
  };
  const date = getDate(props.date);
  return (
    <TouchableOpacity style={styles.container} onPress={props.onClick}>
      <View style={styles.imageContainer}>{image}</View>
      <View style={styles.textsContainer}>
        <View style={styles.nameAndDateContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{name}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
        <View style={styles.lastMessageContainer}>
          <Text style={styles.lastMessage}>{lastMessageSent}</Text>
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
  nameAndDateContainer: {
    flexDirection: 'row',
  },
  nameContainer: {
    paddingBottom: 5,
    width: '70%',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateContainer: {
    paddingTop: 5,
  },
  date: {
    fontSize: 12,
    color: '#8c8c8c',
  },
  lastMessage: {
    color: '#4d4d4d',
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

export default ChatCart;
