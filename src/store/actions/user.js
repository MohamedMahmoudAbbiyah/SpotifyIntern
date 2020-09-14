import axios from 'axios';

export const SET_CURRENT_USER_PROFILE = 'SET_CURRENT_USER_PROFILE';

export const getCurrentUserProfile = (accessToken) => {
  return async (dispatch) => {
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    };

    let options = {
      url: 'https://api.spotify.com/v1/me',
      headers: headers,
    };
    await axios(options)
      .then((response) => {
        let res = JSON.parse(response.request._response);

        let data = {
          spotifyUserId: res.id,
          name: res.display_name,
          email: res.email,
          country: res.country,
          spotifyUrl: res.external_urls.spotify,
        };

        if (res.images.length != 0) {
          data = {...data, image: res.images[0].url};
        }
        dispatch(postUserProfileToFirebase(data));
      })

      .catch((error) => {
        console.log('getCurrentUserProfile actions/user.js error: ');
        console.log(error.message);
      });
  };
};

const postUserProfileToFirebase = (data) => {
  return async (dispatch) => {
    await axios
      .put(
        `https://spotifyfriends-d6f2a.firebaseio.com/users/${data.spotifyUserId}.json`,
        data,
      )
      .then((response) => {
        dispatch({...data, type: SET_CURRENT_USER_PROFILE});
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
