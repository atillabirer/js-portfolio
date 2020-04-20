import React, { Component, useState, useEffect } from 'react';
import { View, Text,Button,AppState } from 'react-native';
import firebase from '@react-native-firebase/app';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-community/async-storage";
import i18n from "../i18n"
import {withTranslation, WithTranslation} from "react-i18next";

import ModelCard from "./ModelCard"
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { withNavigation } from 'react-navigation';
import ScreenWithTranslation from './ScreenWithTranslation';

type PreviousMonthScreenProps = ScreenWithTranslation;

function PreviousMonthScreen({ i18n, navigation } : PreviousMonthScreenProps) {

  const [models, setModels] = useState([{}])

  const _updateView = async (qs: FirebaseFirestoreTypes.QuerySnapshot) => {
    try {
      let storageRef = storage().ref()
      //get all documents
      let querySnapshot = qs
      //extract objects
      let docs = querySnapshot.docs.map((doc) => doc.data())

      docs = docs.sort((a, b) => b.votes - a.votes)

      //check if adult key exists
      let adult = await AsyncStorage.getItem("adult")
      if (adult) {
        docs.map((doc) => {
          doc.adult = false;

        })
      }
      let unlock = await AsyncStorage.getItem("unlock")
      if (unlock) {
        docs.map((doc) => {
          doc.locked = false;

        })
      }
      //create promises for all
      let urls = await Promise.all(docs.map((doc) => {
        return storageRef.child(doc.picture).getDownloadURL()
      }))
      docs.map((doc) => {
        doc.picture = urls.shift()

      })
      setModels(docs)
     
    } catch (x) {
      console.log(x)
     
    }
  }

  useEffect(() => {
    
    let listener = navigation.addListener('didFocus', async () => {
      console.log("focus called")
      let qs = await firestore().collection("models").where("created","<","1575549383").get()
      await _updateView(qs)
    })

    firestore().collection("models").onSnapshot(async (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
      await _updateView(querySnapshot)
    })
    return () => {
      listener.remove()
    }

  })
  
  return (
    <ScrollView>

      {
        models.map(function (model, index) {
          return <ModelCard key={index} index={index + 1} model={model} />
        })
      }
    </ScrollView>
  );

}


export default withTranslation()(withNavigation(PreviousMonthScreen))
