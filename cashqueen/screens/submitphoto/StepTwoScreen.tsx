import React, { Component } from 'react';
import { View, Text,Button,Linking,StyleSheet, Alert } from 'react-native';
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import { withNavigation } from 'react-navigation';
import { withTranslation } from 'react-i18next';
import YouTube from "react-native-youtube"
import firestore from '@react-native-firebase/firestore';
import crypto from 'crypto'
import {Address} from "@dashevo/dashcore-lib"
import colors from "../../assets/styles/colors"
import ScreenWithTranslation from '../ScreenWithTranslation';
const alert = Alert.alert



class StepTwoScreen extends Component<ScreenWithTranslation> {
  static navigationOptions = {
    title: "Step Two"
  }
  state = {
    address: ""
  };

  downloads = async () => {
    await Linking.openURL("https://www.dash.org/downloads/")
  }

  navigate = () => {
      if(this.state.address.length > 0) {

        //check if its been used before
        firestore().collection("models").where("address","==",this.state.address).get().then((snapshot) => {
          if(snapshot.empty) {
            if(true) {
              this.props.navigation.push("stepThree",{address:this.state.address,
                picture: this.props.navigation.getParam("picture"),
              base64: this.props.navigation.getParam("base64")})
            } else {
              alert("Invalid address. Please check your address and make sure its a DASH address.")
            }
          } else {
            alert("This address has already been used. Please use a new one.")
          }
        })

       
      } else {
        alert("Dash address is required.")
      }    
  }

  render() {
    return (
      <ScrollView style={style.container}>
        <Text style={style.detailHead}> {this.props.i18n.t("enterAddress")}: </Text>
        <TextInput value={this.state.address} 
        onChangeText={(value) => this.setState({address:value})}
        placeholder="Dash Address"
        style={{borderWidth:1,borderColor:"#C9C9C9",fontSize:16}}
        />
        <Text style={style.detailDesc}>{this.props.i18n.t("download")}</Text>
        <Text onPress={this.downloads} style={[style.detailDesc,{color:"blue"}]}>https://www.dash.org/downloads/</Text>
        <YouTube videoId="DiYEp_Hr3Aw"  style={{ alignSelf: 'stretch', height: 400 }} />
        <Text style={style.detailHead}>{this.props.i18n.t("important")}</Text>
        <Text style={style.detailDesc}>
        {this.props.i18n.t("mustBeUnused")}
        </Text>
        <Button title={this.props.i18n.t("nextStep")}
        onPress={() => this.navigate()} />
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  detailHead: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 16,
    color: colors.darkGray,
    padding: 10
  },
  mostImp: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 20,
    color: colors.lightBlue,
    padding: 10
  },
  detailDesc: {
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    padding: 2,
    color: colors.darkGray,
  }

})

export default withNavigation(withTranslation()(StepTwoScreen))