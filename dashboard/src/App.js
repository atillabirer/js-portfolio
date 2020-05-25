import { Card, CardActions, CardContent, CardHeader, CardMedia, Container, Grid, Typography } from "@material-ui/core"
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore' // <- needed if using firestore
import React from 'react'
import { Provider, useSelector } from 'react-redux'
import { firebaseReducer, ReactReduxFirebaseProvider, useFirestoreConnect, useFirebase } from 'react-redux-firebase'
// import 'firebase/functions' // <- needed if using httpsCallable
import { combineReducers, createStore } from 'redux'
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore' // <- needed if using firestore
import fbConfig from "./fbConfig";

// Initialize firebase instance
firebase.initializeApp(fbConfig)

firebase.firestore() // <- needed if using firestore

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer // <- needed if using firestore
})

// Create store with reducers and initial state
const initialState = {}
const store = createStore(rootReducer, initialState)

const rrfProps = {
  firebase,
  dispatch: store.dispatch,
  config: {},
  createFirestoreInstance // <- needed if using firestore
}
<Card>
function ModelCard({name}) {

  //for the image url

  return (
    <Card>
      <CardHeader title={name}></CardHeader>
      <CardMedia image="https://image.shutterstock.com/image-vector/sample-stamp-grunge-texture-vector-260nw-1389188336.jpg"/>
      <CardContent></CardContent>
      <CardActions></CardActions>
    </Card>
  );
}

function Models(props) {
  
  useFirestoreConnect([{collection:"models"}]);

  const models = useSelector(state => state.firestore.ordered.models);
  
  if(!models) return <p>Error.</p>;


  if(models.length < 1) return <p>No models yet.</p>;

  return (
    <Grid container spacing={2}>
      {models.map((model) => <Grid key={model.name} item xs={4}><ModelCard name={model.name}/></Grid>)}
    </Grid>
  );
}


// Setup react-redux so that connect HOC can be used
function App() {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <Container>
          <Typography variant="h3" align="center">
            Models
          </Typography>
          <Models/>
        </Container>
      </ReactReduxFirebaseProvider>
    </Provider>
  )
}

export default App;
