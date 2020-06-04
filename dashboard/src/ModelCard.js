import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, List, ListItem, ListItemText, Typography } from "@material-ui/core"
import React, { useEffect, useState } from 'react'
import { useFirebase, useFirestore } from 'react-redux-firebase'


export default function ModelCard({ model }) {

    const firebase = useFirebase();
    const firestore = useFirestore();
    const [picture, setPicture] = useState();
  
  
    //for the image url
    useEffect(() => {
  
      async function updatePicture() {
  
        const picture = await firebase.storage().ref().child(model.picture).getDownloadURL();
        console.log(picture)
        setPicture(picture);
  
      }
      updatePicture();
    }, [firebase,model.picture]);
  
    async function setField(field, value) {
      try {
        await firestore.collection("models").doc(model.id).update({ [field]: value })
      } catch (error) {
        console.log(error)
      }
    }
  
    return (
      <Card data-testid="modelcard">
        <CardHeader title={model.name}></CardHeader>
        <CardMedia image={picture} style={{ padding: "56.25%" }} />
        <CardContent>
          <List>
            <ListItem alignItems="flex-start">
              <ListItemText secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" color="textPrimary">
                    Name:&nbsp;
                 </Typography>
                  {model.name}
                </React.Fragment>
              } />
            </ListItem>
  
            <ListItem alignItems="flex-start">
              <ListItemText secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" color="textPrimary">
                    Age:&nbsp;
                 </Typography>
                  {model.age}
                </React.Fragment>
              } />
            </ListItem>
  
            <ListItem alignItems="flex-start">
              <ListItemText secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" color="textPrimary">
                    Bio:&nbsp;
                 </Typography>
                  {model.bio}
                </React.Fragment>
              } />
            </ListItem>
          </List>
        </CardContent>
        <CardActions spacing={10}>
          <Button size="small" className="approvedBtn" onClick={() => setField("approved", !model.approved)}>{model.approved ? "reject" : "approve"}</Button>
  
          <Button size="small" data-testid="lockedBtn" className="lockedBtn" onClick={() => setField("locked", !model.locked)}>{model.locked ? "unlock" : "lock"}</Button>
  
          <Button size="small" className="adultBtn" onClick={() => setField("adult", !model.adult)}>{model.adult ? "unadult" : "adult"}</Button>
  
          <Button size="small">Delete</Button>
        </CardActions>
      </Card>
    );
  }
  
  
