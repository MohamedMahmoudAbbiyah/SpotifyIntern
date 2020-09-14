import {SET_USER_SAVED_TRACKS} from '../actions/savedTracks';

const initailState = {
  userSavedTracks: [],
};

export default (state = initailState, actions) => {
  switch (actions.type) {
    case SET_USER_SAVED_TRACKS:
      return {userSavedTracks: actions.savedTracks};
    case 'ERROR':
      return state;
    default:
      return state;
  }
};
