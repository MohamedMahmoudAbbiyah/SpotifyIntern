// @refresh reset
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import * as database from '../utils/database';
import {useSelector} from 'react-redux';
import ChatCart from '../components/UI/ChatCart';
import LoadingIndicator from '../components/UI/LoadingIndicator';

const ChatsScreen = (props) => {
  const myId = useSelector((state) => state.user.spotifyUserId);
  const [myChats, setMyChats] = useState([]);
  const [isAnyChat, setIsAnyChat] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    var listener;
    const onChatAdded = (friendData, chatObj) => {
      setIsAnyChat((prevState) => {
        if (prevState === false) {
          return true;
        } else {
          return prevState;
        }
      });
      let obj = {...friendData, chatObj};
      setMyChats((prevState) => [...prevState, obj]);
    };

    (async () => {
      database.isAnyFriendExist(myId).then((result) => {
        // if there is no friend
        if (!result) {
          setIsAnyChat(result);
        } else {
          setIsAnyChat(true);
        }
        setIsLoading(false);
      });
      listener = await database.attachListenerToChatAdded(myId, onChatAdded);
    })();
    return () => {
      database.detachListenerToChatAdded(myId, listener);
    };
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isAnyChat === false) {
    return (
      <View style={styles.screen}>
        <Text style={styles.text}>No Chat Found.</Text>
        <Text style={styles.text}>You may add some...</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={myChats}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => {
        return (
          <ChatCart
            name={itemData.item.name}
            imageUrl={itemData.item.image}
            lastMessage={itemData.item.chatObj.lastMessageSent}
            date={itemData.item.chatObj.createdAt}
            onClick={() => {
              props.navigation.navigate('ChatScreen', {
                userData: {
                  name: itemData.item.name,
                  image: itemData.item.image,
                  chatId: itemData.item.chatObj.chatId,
                },
              });
            }}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default ChatsScreen;
