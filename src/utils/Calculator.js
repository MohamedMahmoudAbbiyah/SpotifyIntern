const Axios = require('axios');

export const getDistance = (position1, position2) => {
  var lat1 = position1.latitude;
  var lon1 = position1.longitude;
  var lat2 = position2.latitude;
  var lon2 = position2.longitude;
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export const countMutuals = (myTracks, otherUsersSavedTracks, myId) => {
  const mutuals = [];
  const entries = Object.entries(otherUsersSavedTracks);
  for (const [userId, tracksList] of entries) {
    let count = 0;
    myTracks.forEach((mytrack) => {
      tracksList.forEach((track) => {
        if (mytrack.id === track.id) {
          count++;
        }
      });
    });

    let mutual = {userId: userId, mutualNumber: count};
    mutuals.push(mutual);
    count = 0;
  }
  // remove my mutual from list
  for (var i = mutuals.length - 1; i >= 0; i--) {
    if (mutuals[i].userId === myId) {
      mutuals.splice(i, 1);
    }
  }
  return mutuals;
};

export const getMutuals = async (mySavedTracks, myId) => {
  try {
    const response = await Axios.get(
      'https://spotifyfriends-d6f2a.firebaseio.com/savedTracks.json',
    );
    const mutuals = countMutuals(mySavedTracks, response.data, myId);
    return mutuals;
  } catch (error) {
    console.log(error);
  }
};

export const getLocations = async (mutuals) => {
  let locations = [];
  try {
    const response = await Axios.get(
      'https://spotifyfriends-d6f2a.firebaseio.com/locations.json',
    );
    // remove my Location and all users with 0 mutual number
    const entries = Object.entries(response.data);
    for (const [userId, location] of entries) {
      mutuals.forEach((obj) => {
        if (obj.userId === userId && obj.mutualNumber != 0) {
          locations.push({userId, location, mutualNumber: obj.mutualNumber});
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
  return locations;
};
