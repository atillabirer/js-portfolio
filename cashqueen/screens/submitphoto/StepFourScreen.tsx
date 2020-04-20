import React, { Component } from 'react';
import { View, Text, Button,StyleSheet,KeyboardAvoidingView, Alert } from 'react-native';
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import CheckBox from 'react-native-check-box';
import firestore from '@react-native-firebase/firestore';
import storage, { firebase } from '@react-native-firebase/storage';
import messaging from "@react-native-firebase/messaging";
import uuid from "uuidv4";
import { decode as atob, encode as btoa } from 'base-64'
import Spinner from 'react-native-loading-spinner-overlay';
import { withNavigation } from 'react-navigation';
import { withTranslation } from 'react-i18next';
import crypto from 'crypto'
import {Address} from "@dashevo/dashcore-lib"
import colors from "../../assets/styles/colors"
import ScreenWithTranslation from '../ScreenWithTranslation';
const alert = Alert.alert


type StepFourScreenState = {
  agree: boolean,
  name: string,
  age: string,
  country: string,
  email: string,
  bio: string,
  votes: number,
  locked: boolean,
  adult: boolean,
  approved: boolean,
  spinner: boolean
};

class StepFourScreen extends Component<ScreenWithTranslation,StepFourScreenState> {
  static navigationOptions = {
    title: "Step Four"
  }
  state = {
    agree: false,
    name: "",
    age: "",
    country: "",
    email: "",
    bio: "",
    votes: 0,
    locked: false,
    adult: false,
    approved: false,
    spinner: false
  };
 
  toggleAgree = () => {
    console.log(this.state)
    this.setState((prevState) => {
      return { agree: !prevState.agree }
    })
  }
  uploadImageAsync = async (uri: string) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    return blob;
  }

  checkForm = async () => {

    let storageRef = storage().ref()

    if (this.state.name && this.state.age) {
      if (this.state.agree) {
        this.setState({spinner:true})
        try {

          let address = this.props.navigation.getParam("address")


          let position = this.props.navigation.getParam("position")

          let picture = storageRef.child(uuid() + ".jpg")
          //let blob = await this.uploadImageAsync()
          let blob = await this.uploadImageAsync(this.props.navigation.getParam("picture"))
          
          let snapshot = await picture.put(blob)

          let created = Math.floor(Date.now() / 1000)
          
          console.log(snapshot)
          let value = await firestore().collection("models").add({ position, picture: picture.fullPath, 
            created, address, ...this.state })
          console.log("Value: " + value)

          //register webhook for this address

          let postObj = {
            event: "unconfirmed-tx",
            address: address,
            url:"https://us-central1-dashqueen-18dc1.cloudfunctions.net/handleAddress"
          }

          let registerRes = await fetch("https://api.blockcypher.com/v1/bch/main/hooks?token=35f815b9a86f443587abe29cff01bbce",{
            body: JSON.stringify(postObj),
            method:"POST",
            headers: {
              "Content-type":"application/json"
            }
          })

          console.log(registerRes)

          this.setState({spinner:false})
          this.props.navigation.navigate("done")
        } catch (error) {
          this.setState({spinner:false})
          console.log(error)
          alert(error)
        }
      } else {
        alert("You must agree to the terms and conditions to enter this contest.")
      }
    } else {
      alert("All fields must be completed.")
    }
  }

  render() {
    return (
      <ScrollView style={{padding:10}}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Saving...'}
          textStyle={styles.spinnerTextStyle}
        />
        
        <Text style={styles.detailHead}>{this.props.i18n.t("name")}:</Text>
        <TextInput style={{borderWidth:1,borderColor:"#C9C9C9",fontSize:16}} value={this.state.name} onChangeText={(value) => this.setState({ name: value })} />
        <Text style={styles.detailHead}>{this.props.i18n.t("age")}:</Text>
        <TextInput style={{borderWidth:1,borderColor:"#C9C9C9",fontSize:16}} keyboardType="numeric" maxLength={2} value={this.state.age} onChangeText={(value) => this.setState({ age: value })} />
        <Text style={styles.detailHead}>{this.props.i18n.t("country")}:</Text>
        <TextInput style={{borderWidth:1,borderColor:"#C9C9C9",fontSize:16}} value={this.state.country} onChangeText={(value) => this.setState({ country: value })} />
        <Text style={styles.detailHead}>{this.props.i18n.t("email")}</Text>
        <TextInput style={{borderWidth:1,borderColor:"#C9C9C9",fontSize:16}} value={this.state.email} onChangeText={(value) => this.setState({ email: value })} />
        <Text style={styles.detailHead}>{this.props.i18n.t("bio")}:</Text>
        <TextInput style={{borderWidth:1,borderColor:"#C9C9C9",fontSize:16}} value={this.state.bio} onChangeText={(value) => this.setState({ bio: value })} multiline/>
        <CheckBox rightText={this.props.i18n.t("agree")} isChecked={this.state.agree} onClick={this.toggleAgree} />
        <Text style={styles.desc}>{this.props.i18n.t("novemberContest")}</Text>
        <Button title={this.props.i18n.t("submit")} onPress={this.checkForm} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: colors.white
  },
  detailHead: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 16,
    color: colors.darkGray,
    padding: 10
  },
  desc: {
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    color: colors.darkGray,
    padding: 10
  },
  
});

export default withNavigation(withTranslation() (StepFourScreen))