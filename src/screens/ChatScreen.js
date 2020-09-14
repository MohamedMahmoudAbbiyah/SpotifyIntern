// @refresh reset
import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSelector} from 'react-redux';

import Colors from '../constants/Colors';
import {database} from '../utils/database';

const ChatScreen = (props) => {
  const userData = props.navigation.getParam('userData');

  const myData = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const listener = database
      .ref('chatMessages')
      .child(userData.chatId)
      .orderByChild('createdAt')
      .on('child_added', (snap) => {
        let message = snap.val();
        appendMessages(message);
      });
    return () => {
      let ref = database.ref('chatMessages').child(userData.chatId);
      ref.off('child_added', listener);
    };
  }, []);

  const appendMessages = useCallback(
    (newMessages) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages),
      );
    },
    [messages],
  );

  const updateLastMessage = (lastMessage, createdAt) => {
    database
      .ref('chats')
      .child(userData.chatId)
      .update({lastMessageSent: lastMessage, createdAt});
  };

  const onSendHandler = async (newMessages) => {
    newMessages.map((m) => {
      let obj = {...m, createdAt: new Date().toString()};
      updateLastMessage(m.text, m.createdAt);
      return database
        .ref('chatMessages')
        .child(userData.chatId)
        .child(m._id)
        .set(obj);
    });
  };

  return (
    <GiftedChat
      messages={messages}
      user={{
        _id: myData.spotifyUserId,
        name: myData.name,
        avatar: myData.image,
      }}
      onSend={onSendHandler}
      showUserAvatar
      scrollToBottom
      renderLoading={() => (
        <ActivityIndicator size="large" color={Colors.buttonColor2} />
      )}
    />
  );
};

ChatScreen.navigationOptions = (navData) => {
  const userData = navData.navigation.getParam('userData');
  let name = userData.name;
  if (name.length > 20) {
    name = userData.name.substring(0, 20) + '...';
  }

  let image = (
    <Image
      style={styles.image}
      source={{
        uri: userData.image,
      }}
    />
  );

  if (!userData.image) {
    let str = userData.name;
    let matches = str.match(/\b(\w)/g);
    let acronym = matches.join('');
    image = (
      <View style={styles.imageTextContainer}>
        <Text style={styles.imageText}>{acronym.toUpperCase()}</Text>
      </View>
    );
  }
  return {
    headerStyle: {height: 60, backgroundColor: Colors.tabColor},
    headerTitle: () => (
      <View style={styles.container}>
        <View style={styles.imageContainer}>{image}</View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name.toUpperCase()}</Text>
        </View>
      </View>
    ),
    headerRight: () => {
      return (
        <View style={styles.PopupMenu}>
          <Menu>
            <MenuTrigger>
              <Entypo name="dots-three-vertical" size={24} color="white" />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption
                onSelect={() => {
                  Alert.alert('', 'This functionality is not implemented yet.');
                }}>
                <Text style={styles.block}>Block</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      );
    },
  };
};

const styles = StyleSheet.create({
  container: {width: '100%', flexDirection: 'row'},
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%',
  },
  image: {
    width: 50,
    borderRadius: 25,
    height: 50,
    borderColor: '#eee',
    borderWidth: 1,
  },
  nameContainer: {
    paddingLeft: 10,
    width: '75%',
    justifyContent: 'center',
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  PopupMenu: {
    paddingRight: 10,
  },
  block: {
    paddingTop: 8,
    paddingLeft: 10,
    paddingBottom: 10,
    color: 'red',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  imageText: {
    fontSize: 20,
    width: 50,
    height: 50,
    textAlign: 'center',
    padding: 10,
    color: 'white',
  },
  imageTextContainer: {
    backgroundColor: '#8f8e8c',
    borderRadius: 25,
    borderColor: '#eee',
    borderWidth: 1,
  },
});

export default ChatScreen;
