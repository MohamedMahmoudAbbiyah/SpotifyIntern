import {SET_USER_LOCATION} from '../actions/location';

const initailState = {
  latitude: '',
  longitude: '',
  altitude: '',
  timeStamp: '',
};

export default (state = initailState, actions) => {
  switch (actions.type) {
    case SET_USER_LOCATION:
      return {
        latitude: actions.latitude,
        longitude: actions.longitude,
        altitude: actions.altitude,
        timestamp: actions.timestamp,
      };
    case 'ERROR':
      return state;
    default:
      return state;
  }
};
