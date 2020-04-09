import React, { Component } from 'react';
import { View, Text,Button,AppState } from 'react-native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-community/async-storage";
import i18n from "../i18n"
import {withTranslation} from "react-i18next";

import ModelCard from "./ModelCard"
import { ScrollView } from 'react-native-gesture-handler';

class PreviousMonthScreen extends React.Component {


 

  constructor(props) {
    super(props);
    this.state = {
      models: []
    }
  }



  async _updateView(qs) {
    try {
      let storageRef = storage().ref()
      //get all documents
      let querySnapshot = qs
      //extract objects
      let docs = querySnapshot.docs.map((doc) => doc.data())

      docs = docs.sort((a,b) => b.votes - a.votes)
      
      //check if adult key exists
      let adult = await AsyncStorage.getItem("adult")
      if(adult) {
        docs.map((doc) => {
          doc.adult = false;
          
        })
      }
      let unlock = await AsyncStorage.getItem("unlock")
      if(unlock) {
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
      this.setState({models: docs})
      return Promise.resolve()
    } catch(x) {
      console.log(x)
      return Promise.reject(x)
    }
  }

  async componentDidMount() {


    let qs = await firestore().collection("models").where("created","<","1575549383").get()
    this._updateView(qs)
    this.listener = this.props.navigation.addListener('didFocus',async () => {
      console.log("focus called")
      let qs = await firestore().collection("models").where("created","<","1575549383").get()
      await this._updateView(qs)
    })
    
    firestore().collection("models").onSnapshot(async (querySnapshot) => {
      await this._updateView(querySnapshot)
    })
    

  }

  async componentWillUnmount() {
    this.listener.remove()
  }
  

  
  render() {
    return (
      <ScrollView>
        
        {
          this.state.models.map(function (model,index) {
            return <ModelCard key={index} index={index + 1} model={model}/>
          })
        }
      </ScrollView>
    );
  }
}

export default withTranslation()(PreviousMonthScreen)
