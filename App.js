import React, {Component} from 'react';
import {LogBox} from 'react-native';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import {MenuProvider} from 'react-native-popup-menu';

import AppNavigator from './src/navigations/AppNavigator';
import authReducer from './src/store/reducers/auth';
import userReducer from './src/store/reducers/user';
import savedTracksReducer from './src/store/reducers/savedTracks';
import locationReducer from './src/store/reducers/location';
import * as database from './src/utils/database';

database.initializeDB();

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  savedTracks: savedTracksReducer,
  location: locationReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

class App extends Component {
  render() {
    LogBox.ignoreLogs(['Setting a timer', 'Require cycle:']);

    return (
      <MenuProvider>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </MenuProvider>
    );
  }
}

export default App;
