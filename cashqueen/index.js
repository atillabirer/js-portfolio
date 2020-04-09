/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import firebase from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-community/async-storage";
import './shim'

global.Buffer = global.Buffer || require('buffer').Buffer


//register token on startup
firebase.messaging().getToken().then(async (token) => {
    console.log('Token: ' + token)
    //query if this token already exists
    let snapshot = await firestore().collection("tokens").where("token", "==", token).get()
    if (snapshot.empty) {
        firestore().collection("tokens").add({ token })
    }
   
}).catch((error) => {
    console.log(error)
})

const backgroundHandler = async (message) => {
    // handle your message
    try {
        console.log("Backgroundhandler:")
        console.log(message)
        if(message.data.address) {
            await AsyncStorage.setItem("tx",JSON.stringify({address:message.data.address}))
        } else {
            console.log("no address in fcm message")
        }
    } catch (error) {
        console.log("Error in index.js:")
        console.log(error)
    }
    return Promise.resolve();
}
//check if any expired tokens
AsyncStorage.getItem("adult").then(async (adult) => {
    if(adult) {
        console.log("Adult cookie present")
        let parsed = JSON.parse(adult)
        if(Date.now() / 1000 > parsed.expiryDate) {
            await AsyncStorage.removeItem("adult")
        }
    }
})
AsyncStorage.getItem("unlock").then(async (unlock) => {

    if(unlock) {
        console.log("Unlock cookie present")
        let parsed = JSON.parse(unlock)
        if(Date.now() / 1000 > parsed.expiryDate) {
            await AsyncStorage.removeItem("unlock")
        }
    }
})

AppRegistry.registerComponent(appName, () => App);


firebase.messaging().setBackgroundMessageHandler(backgroundHandler);