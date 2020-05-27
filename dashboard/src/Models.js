import { Container, Grid, Typography } from "@material-ui/core";
import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import ModelCard from "./ModelCard";


export default function Models(props) {

    useFirestoreConnect([{ collection: "models" }]);
  
    const models = useSelector(state => state.firestore.ordered.models);
  
    if (!models) return <p>Error.</p>;
  
  
    if (models.length < 1) return <p>No models yet.</p>;
  
    return (
      <Container>
      <Typography variant="h3" align="center">
        Models
      </Typography>
    
      <Grid container spacing={2}>
        {models.map((model) => <Grid key={model.name} item xs={12} sm={4}><ModelCard model={model} /></Grid>)}
      </Grid>
    </Container>
    );
  }