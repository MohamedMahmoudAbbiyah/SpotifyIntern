// @refresh reset
import React, {useEffect, useState} from 'react';
import {StyleSheet, FlatList, View, Text} from 'react-native';
import {useSelector} from 'react-redux';

import * as database from '../utils/database';
import FriendCart from '../components/UI/FriendCart';
import LoadingIndicator from '../components/UI/LoadingIndicator';

const MyFriendsScreen = (props) => {
  const myId = useSelector((state) => state.user.spotifyUserId);
  const [myFriendsData, setMyFriendsData] = useState([]);
  const [isFriendExist, setIsFriendExist] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    var listener;
    (async () => {
      database.isAnyFriendExist(myId).then((result) => {
        // if there is no friend
        if (!result) {
          setIsFriendExist(result);
          setIsLoading(false);
        }
      });

      const appendNewFriend = (newFriend) => {
        setIsFriendExist((prevState) => {
          if (!prevState) {
            return true;
          }
        });
        setMyFriendsData((prevState) => {
          setIsLoading(false);
          return [...prevState, newFriend];
        });
      };
      listener = database.attachListenerToChildAdded(myId, appendNewFriend);
    })();
    return () => {
      database.detachListenerToChildAdded(myId, listener);
    };
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isFriendExist === false) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>No friend exists.</Text>
        <Text style={styles.messageText}>Try to find some...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={myFriendsData}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => {
        return (
          <FriendCart
            name={itemData.item.name}
            imageUrl={itemData.item.image}
            onClick={() => {
              props.navigation.push('ChatScreen', {userData: itemData.item});
            }}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  messageText: {
    fontSize: 22,
    textAlign: 'center',
  },
});

export default MyFriendsScreen;
