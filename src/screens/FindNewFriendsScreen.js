// @refresh reset
import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import Axios from 'axios';

import {getMutuals, getLocations, getDistance} from '../utils/Calculator';
import UserCart from '../components/UI/UserCart';
import {FlatList} from 'react-native-gesture-handler';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import * as database from '../utils/database';

const FindNewFriendsScreen = (props) => {
  const myId = useSelector((state) => state.user.spotifyUserId);
  const mySavedTracks = useSelector(
    (state) => state.savedTracks.userSavedTracks,
  );
  const myLocation = useSelector((state) => state.location);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestedFriendsLength, setSuggestedFriendsLength] = useState();

  const calculateDistances = (myLocation, locations) => {
    var distances = [];
    locations.forEach((obj) => {
      let distance = getDistance(myLocation, obj.location);
      distances.push({
        distance: distance.toFixed(4),
        userId: obj.userId,
        mutualNumber: obj.mutualNumber,
        latitude: obj.location.latitude,
        longitude: obj.location.longitude,
      });
    });
    return distances;
  };

  const prepareSuggestedFriends = useCallback(async (distances) => {
    distances = await database.deleteMyFriendsFromSelectedUsers(
      myId,
      distances,
    );
    // if there is no element in distances list, it meanse show alert
    if (distances.length === 0) {
      setSuggestedFriendsLength(0);
      return;
    }
    distances.forEach(async (obj) => {
      try {
        let response = await Axios.get(
          `https://spotifyfriends-d6f2a.firebaseio.com/users/${obj.userId}.json`,
        );
        let suggestedFriend = {
          ...obj,
          name: response.data.name,
          image: response.data.image ? response.data.image : null,
        };

        setSuggestedFriends((prevState) => [...prevState, suggestedFriend]);
      } catch (error) {
        console.log('Error getting user data');
        console.log(error);
      }
    });
  }, []);

  const refreshSuggestedFriends = (userId) => {
    setSuggestedFriends((prevSuggestedFriends) => {
      let newList = prevSuggestedFriends.filter((suggestedFriend) => {
        return suggestedFriend.userId != userId;
      });
      if (newList.length === 0) {
        setSuggestedFriendsLength(0);
      }
      return newList;
    });
  };

  useEffect(() => {
    let listener;
    (async () => {
      setIsSearching(true);
      const mutuals = await getMutuals(mySavedTracks, myId);
      const locations = await getLocations(mutuals);
      const distances = calculateDistances(myLocation, locations);
      distances.sort((a, b) => a.distance.localeCompare(b.distance));
      await prepareSuggestedFriends(distances);
      listener = await database.attachListenerToFriendAdded(
        myId,
        refreshSuggestedFriends,
      );
      setIsSearching(false);
    })();

    return () => {
      database.detachListenerToFriendAdded(myId, listener);
    };
  }, []);

  if (isSearching) {
    return <LoadingIndicator>Searching New Friends</LoadingIndicator>;
  }
  if (suggestedFriendsLength == 0) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          Sorry, couldn't find enough liked mutual songs.
        </Text>
        <Text style={styles.messageText}>
          Please like more songs on Spotify to find new friends.
        </Text>
      </View>
    );
  }

  const onClickHandler = (data) => {
    props.navigation.push('NewFriendScreen', {
      data: data,
    });
  };
  return (
    <FlatList
      data={suggestedFriends}
      keyExtractor={(item) => item.userId}
      renderItem={(itemData) => {
        return (
          <UserCart
            name={itemData.item.name}
            number={itemData.item.mutualNumber}
            imageUrl={itemData.item.image}
            onClick={() => {
              onClickHandler(itemData.item);
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
export default FindNewFriendsScreen;
