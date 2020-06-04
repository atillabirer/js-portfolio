import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'; // <- needed if using firestore
import 'firebase/storage';
import React from 'react';
import { Provider } from 'react-redux';
import {
  firebaseReducer,
  ReactReduxFirebaseProvider,
} from 'react-redux-firebase';
// import 'firebase/functions' // <- needed if using httpsCallable
import { combineReducers, createStore } from 'redux';
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore'; // <- needed if using firestore
import fbConfig from './fbConfig';
import Models from './Models';

// Initialize firebase instance

firebase.initializeApp(fbConfig);

firebase.firestore(); // <- needed if using firestore

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer, // <- needed if using firestore
});

// Create store with reducers and initial state
const initialState = {};
const store = createStore(rootReducer, initialState);

const rrfProps = {
  firebase,
  dispatch: store.dispatch,
  config: {},
  createFirestoreInstance, // <- needed if using firestore
};

// Setup react-redux so that connect HOC can be used
function App() {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <Models />
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default App;
