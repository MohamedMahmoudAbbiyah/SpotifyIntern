import axios from 'axios';

export const SET_USER_SAVED_TRACKS = 'SET_USER_SAVED_TRACKS';

export const getUserSavedTracks = (accessToken) => {
  return (dispatch, getState) => {
    const spotifyUserId = getState().user.spotifyUserId;
    if (spotifyUserId) {
      let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      };

      let options = {
        url: 'https://api.spotify.com/v1/me/tracks?&limit=50&offset=0',
        headers: headers,
      };

      axios(options)
        .then((response) => {
          const transformedData = JSON.parse(response.request._response);
          let length = transformedData.items.length;
          const savedTracks = [];
          for (let i = 0; i < length; i++) {
            savedTracks.push({
              id: transformedData.items[i].track.id,
              name: transformedData.items[i].track.name,
            });
          }
          dispatch(postUserSavedTracksToFirebase(savedTracks));
        })
        .catch((error) => {
          console.log('getUserSavedTracks user.js actions error');
          console.log(error.message);
        });
    }
  };
};

const postUserSavedTracksToFirebase = (savedTracks) => {
  return (dispatch, getState) => {
    const spotifyUserId = getState().user.spotifyUserId;

    const data = {...savedTracks};
    axios
      .put(
        `https://spotifyfriends-d6f2a.firebaseio.com/savedTracks/${spotifyUserId}.json`,
        data,
      )
      .then((response) => {
        dispatch({type: SET_USER_SAVED_TRACKS, savedTracks: savedTracks});
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
