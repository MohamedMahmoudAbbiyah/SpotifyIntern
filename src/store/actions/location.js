import axios from 'axios';
export const SET_USER_LOCATION = 'SET_USER_LOCATION';

// SET USER LOCAION MEANS SAVE USER LOCATION BOTH ON FIREBASE AND RAM
export const setUserLocation = (position) => {
  return (dispatch, getState) => {
    const spotifyUserId = getState().user.spotifyUserId;
    if (spotifyUserId) {
      const data = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        timeStamp: new Date(position.timestamp).toLocaleString(),
      };
      axios
        .put(
          `https://spotifyfriends-d6f2a.firebaseio.com/locations/${spotifyUserId}.json`,
          data,
        )
        .then((response) => {
          dispatch({...data, type: SET_USER_LOCATION});
        })
        .catch((error) => {
          console.log('error while setting user location');
        });
    } else {
      dispatch({type: 'ERROR'});
    }
  };
};
