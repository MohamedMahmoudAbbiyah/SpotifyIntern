import {SET_CURRENT_USER_PROFILE} from '../actions/user';

const initailState = {
  spotifyUserId: '',
  name: '',
  image: '',
  email: '',
  country: '',
  spotifyUrl: '',
};

export default (state = initailState, actions) => {
  switch (actions.type) {
    case SET_CURRENT_USER_PROFILE:
      return {
        spotifyUserId: actions.spotifyUserId,
        name: actions.name,
        image: actions.image,
        email: actions.email,
        country: actions.country,
        spotifyUrl: actions.spotifyUrl,
      };
    case 'ERROR':
      return state;
    default:
      return state;
  }
};
