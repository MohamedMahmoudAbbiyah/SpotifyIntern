import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyCIE-ZWMSjU-V8UneUfjLJERRj1mbSYtBg',
  authDomain: 'spotifyfriends-d6f2a.firebaseapp.com',
  databaseURL: 'https://spotifyfriends-d6f2a.firebaseio.com',
  projectId: 'spotifyfriends-d6f2a',
  storageBucket: 'spotifyfriends-d6f2a.appspot.com',
  messagingSenderId: '929189685332',
  appId: '1:929189685332:web:526907d00ac71a7e7425c1',
  measurementId: 'G-KRSR14J7MQ',
};

export var database;
export const initializeDB = () => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  database = firebase.database();
};

export const addNewChat = (members, lastMessageSent) => {
  let newChildRef = database.ref('chats').push({
    lastMessageSent,
    members,
    createdAt: new Date().toString(),
  });
  let userChatsRef = database.ref('userChats');
  userChatsRef.child(members[0]).update({[newChildRef.key]: true});
  userChatsRef.child(members[1]).update({[newChildRef.key]: true});
  return newChildRef.key;
};

const getChatObj = async (chatId) => {
  let chatsRef = database.ref('chats');
  let chatObj = new Promise((resolve, reject) => {
    chatsRef.child(chatId).once('value', (snap) => {
      resolve(snap.toJSON());
    });
  });
  let result = await chatObj;
  return result;
};

const getChatObjects = async (chatIds) => {
  let chatObjects = [];
  for (let i = 0; i < chatIds.length; i++) {
    let result = await getChatObj(chatIds[i]);
    chatObjects.push(result);
  }
  return chatObjects;
};

const isInclude = (selectedUser, chatObjects) => {
  let result = false;
  let length = chatObjects.length;
  for (let i = 0; i < length; i++) {
    if (chatObjects[i].members[1] === selectedUser.userId) {
      result = true;
      break;
    }
  }
  return result;
};

const getMyChats = async (myId) => {
  let myChats = new Promise((resolve, reject) => {
    database
      .ref('userChats')
      .child(myId)
      .once('value', (snap) => {
        resolve(snap.toJSON());
      });
  });
  myChats = await myChats;
  return myChats;
};

export const deleteMyFriendsFromSelectedUsers = async (myId, selectedUsers) => {
  let myChats = await getMyChats(myId);
  if (!myChats) {
    return selectedUsers;
  }
  let chatIds = Object.keys(myChats);
  let chatObjects = await getChatObjects(chatIds);

  let newSelectedUsers = [];
  selectedUsers.forEach((selectedUser) => {
    if (!isInclude(selectedUser, chatObjects)) {
      newSelectedUsers.push(selectedUser);
    }
  });
  return newSelectedUsers;
};

const getFriendData = (friendId) => {
  return new Promise((resolve) => {
    database
      .ref('users')
      .child(friendId)
      .once('value', (snap) => {
        let obj = snap.val();
        resolve({
          name: obj.name,
          image: obj.image ? obj.image : null,
          id: obj.spotifyUserId,
        });
      });
  });
};
export const isAnyFriendExist = async (myId) => {
  let result = new Promise((resolve) => {
    database
      .ref('userChats')
      .child(myId)
      .orderByKey()
      .limitToFirst(1)
      .once('value', (snap) => {
        resolve(snap.exists());
      });
  });
  return await result;
};

export const attachListenerToChildAdded = (myId, appendNewFriend) => {
  // if a new friend is added
  let ref = database.ref('userChats').child(myId);
  let listener = ref.on('child_added', async (snapshot) => {
    let chatObj = await getChatObj(snapshot.key);
    let friendId =
      chatObj.members[1] === myId ? chatObj.members[0] : chatObj.members[1];
    let friendData = await getFriendData(friendId);
    appendNewFriend({...friendData, chatId: snapshot.key});
  });
  return listener;
};

export const detachListenerToChildAdded = (myId, listener) => {
  let ref = database.ref('userChats').child(myId);
  ref.off('child_added', listener);
};
// above implementation is for MyFriendsScreen

// below implementaion is for FindNewFriendsScreen
export const attachListenerToFriendAdded = (myId, onFriendAdded) => {
  // if a new friend is added
  let ref = database.ref('userChats').child(myId);
  let listener = ref
    .endAt()
    .limitToLast(1)
    .on('child_added', async (snapshot) => {
      let chatObj = await getChatObj(snapshot.key);
      let friendId =
        chatObj.members[1] === myId ? chatObj.members[0] : chatObj.members[1];

      onFriendAdded(friendId);
    });
  return listener;
};

export const detachListenerToFriendAdded = (myId, listener) => {
  let ref = database.ref('userChats').child(myId);
  ref.off('child_added', listener);
};

// listener for chat screen

export const attachListenerToChatAdded = (myId, onChatAdded) => {
  // if a new friend is added
  let ref = database.ref('userChats').child(myId);
  let listener = ref.on('child_added', async (snapshot) => {
    let chatObj = await getChatObj(snapshot.key);
    chatObj = {...chatObj, chatId: snapshot.key};
    let friendId =
      chatObj.members[1] === myId ? chatObj.members[0] : chatObj.members[1];
    let friendData = await getFriendData(friendId);
    onChatAdded(friendData, chatObj);
  });
  return listener;
};

export const detachListenerToChatAdded = (myId, listener) => {
  let ref = database.ref('userChats').child(myId);
  ref.off('child_added', listener);
};
