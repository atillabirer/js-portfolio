import React, { Component } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView ,Image, StyleSheet, Button, Linking, AppState, Clipboard,TouchableHighlight } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { firebase } from '@react-native-firebase/firestore';
import { withNavigation } from 'react-navigation';
import { withTranslation } from 'react-i18next';
import FlashMessage from "react-native-flash-message";
import { showMessage,hideMessage } from "react-native-flash-message";
import colors from "../assets/styles/colors"


class VotingScreen extends Component {


  constructor(props) {
    super(props);
    this.state = {
      amount: 0.01,
      appState: AppState.currentState
    };
  }
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      try {
        console.log('App has come to the foreground!');
        //check if we have a vote with this address 
        let tx = await AsyncStorage.getItem("tx")
        if (tx) {
          let txParsed = JSON.parse(tx)
          if (tx.address == this.props.navigation.getParam("address")) {
            alert("Thanks for the vote! Redirecting to frontpage...")
            this.props.navigation.navigate("tabs")
          }
        }
      } catch (error) {
        console.log("Error in votingscreen:")
        console.log(error)
      }
    }
    this.setState({ appState: nextAppState });
  };

  openWallet = (address) => {
    Linking.openURL(`bitcoincash:${address}?amount=${this.state.amount}`).then((value) => {

    }).catch((error) => {
      alert(error)
    })
  }

  copyAdress = (address) => {
    Clipboard.setString(address)
    showMessage({
      autoHide: true,
      message: "Copied to clipboard!",
      duration:1000,
      textStyle: {
        fontSize:20
      }
    })
  }

  render() {
    let { picture, name, age, country, bio, address } = this.props.navigation.getParam("model")
    return (
      <KeyboardAvoidingView enabled behavior="padding" style={{ flex: 1, flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
        <View enabled style={style.blueBox}>

          <Text style={style.blueBoxHeader}>{this.props.i18n.t("theAmount")}</Text>
          <View style={style.whiteBox}>
            <Image style={style.picture} source={{ uri: picture }} resizeMode="cover" />
            <View style={style.textBox}>
              <View style={style.detailRow}>
                <Text style={style.detailHead}>{this.props.i18n.t("name")}: </Text>
                <Text style={style.detailDesc}>{name}</Text>
              </View>
              <View style={style.detailRow}>
                <Text style={style.detailHead}>{this.props.i18n.t("age")}: </Text>
                <Text style={style.detailDesc}>{age}</Text>
              </View>
              <View style={style.detailRow}>
                <Text style={style.detailHead}>{this.props.i18n.t("country")}: </Text>
                <Text style={style.detailDesc}>{country}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={style.pageText}>{this.props.i18n.t("modelsDash")}:</Text>
        <Text style={style.address}>{address}</Text>
        <Text style={style.pageText}>{this.props.i18n.t("allFunds")}</Text>
        <Text style={[style.pageText, { fontWeight: "bold" }]}>{this.props.i18n.t("dashAmount")}:</Text>
        <View enabled style={{width:"100%",padding:10}}>
        <TextInput keyboardType="numeric"
          value={String(this.state.amount)}
          placeholder="DASH"
          onChangeText={(value) => this.setState({ amount: value })}
          style={{ borderWidth: 1, borderColor: "#C9C9C9", borderRadius: 10, width: "100%", textAlign: "center", fontSize: 16,margin:2 }} />
        <TouchableHighlight onPress={() => this.openWallet(address)} style={{ borderWidth: 0, margin: 2,padding: 10, borderRadius: 100, backgroundColor: colors.lightBlue,width:"100%" }}>
          <Text style={{ textAlign: "center", color: "white", fontFamily: "OpenSans-SemiBold", fontSize: 16 }}>
          {this.props.i18n.t("openWallet")}
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.copyAdress(address)} style={{ borderWidth: 0, padding: 10, margin:2, borderRadius: 100, backgroundColor: colors.darkBlue,width:"100%" }}>
          <Text style={{ textAlign: "center", color: "white", fontFamily: "OpenSans-SemiBold", fontSize: 16 }}>
          Copy BCH Address to Clipboard
          </Text>
        </TouchableHighlight>
        
        <TouchableHighlight onPress={() => this.props.navigation.navigate("howItWorks")} style={{ borderWidth: 1, margin:2, padding: 10, borderRadius: 100, backgroundColor: "white",width:"100%" }}>
          <Text style={{ textAlign: "center", color: "black", fontFamily: "OpenSans-SemiBold", fontSize: 16 }}>
          {this.props.i18n.t("howItWorks")}
          </Text>
        </TouchableHighlight>
        </View>
        <FlashMessage position="top" />
      </KeyboardAvoidingView>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  blueBox: {
    backgroundColor: colors.darkBlue,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 10,
    paddingBottom: 0,
    flex: 1
  },
  blueBoxHeader: {
    fontFamily: "Montserrat-MediumItalic",
    color: "white",
    fontSize: 24,
    textAlign: "center"
  },
  whiteBox: {
    backgroundColor: colors.white,
    width: "90%",
    padding: 15,
    flexDirection: "row",
    
  },
  textBox: {
    flexDirection: "column",
    padding: 10
  },
  detailRow: {
    flexDirection: "row",
    padding: 5
  },
  detailHead: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 16,
    color: colors.darkGray
  },
  detailDesc: {
    fontFamily: "OpenSans-Regular",
    fontSize: 16,
    color: colors.darkGray
  },
  pageText: {
    fontFamily: "OpenSans-Regular",
    fontSize: 18,
    color: colors.darkGray,
    textAlign: "center"
  },
  address: {
    color: colors.lightBlue,
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 18
  },
  picture: {
    flex: 1
  }
})

export default withTranslation()(VotingScreen)