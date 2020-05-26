import { Card, CardActions, CardContent, CardHeader, CardMedia, Container, Grid, Typography, List, ListItem, ListItemText, Button } from "@material-ui/core"
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore' // <- needed if using firestore
import "firebase/storage"
import React, { useState,useEffect } from 'react'
import { Provider, useSelector } from 'react-redux'
import { firebaseReducer, ReactReduxFirebaseProvider, useFirestoreConnect, useFirebase, useFirestore } from 'react-redux-firebase'
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

function ModelCard({model}) {

  const firebase = useFirebase();
  const firestore = useFirestore();
  const [picture, setPicture] = useState("");
  

  //for the image url
  useEffect(() => {
    firebase.storage().ref().child(model.picture).getDownloadURL().then((url) => {
      setPicture(url);
    }).catch((error) => {
      console.log(error)
    });
  },[picture]);

  async function setField(field,value) {
    try {
      await firestore.collection("models").doc(model.id).update({[field]:value})
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <Card>
      <CardHeader title={model.name}></CardHeader>
      <CardMedia image={picture} style={{padding:"20%"}}/>
      <CardContent>
        <ul>
          <li><b>Name:</b>{model.name}</li>
        </ul>
      </CardContent>
      <CardActions alignItems="center">
        <Button size="small" onClick={() => setField("approved",!model.approved)}>{model.approved ? "reject" : "approve"}</Button>

        <Button size="small" onClick={() => setField("locked",!model.locked)}>{model.locked ? "unlock" : "lock"}</Button>

          <Button size="small" onClick={() => setField("adult",!model.adult)}>{model.adult ? "unadult" : "adult"}</Button>

        <Button size="small">Delete</Button>
      </CardActions>
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
      {models.map((model) => <Grid key={model.name} item xs={4}><ModelCard model={model}/></Grid>)}
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
