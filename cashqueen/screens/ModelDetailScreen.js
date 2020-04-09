import React, { Component } from 'react';
import { Button, ImageBackground, StyleSheet, Text, View, Linking, AppState,TouchableHighlight,Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg';
import firebase from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-community/async-storage";
import publicIP from 'react-native-public-ip';
import i18n from "../i18n"
import {withTranslation} from "react-i18next";
import { withNavigation } from 'react-navigation';
import colors from "../assets/styles/colors"



class ModelDetailScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      adult: this.props.navigation.getParam("model").adult,
      locked: this.props.navigation.getParam("model").locked
    };
    
    console.log(this.state)
  }

  componentDidMount() {
    //unlock on wake
    
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
      console.log("ModelDetailScreen in foreground now")
      //see if there are any cookies
      let tx = await AsyncStorage.getItem("tx")
      let txParsed = JSON.parse(tx)
      if (txParsed) {
        console.log(txParsed)
        if (txParsed.address == this.props.navigation.getParam("model").address) {
          if (this.state.adult) {
            await AsyncStorage.setItem("adult", JSON.stringify({ expiryDate: Date.now() / 1000 * 2592000 }))
            this.setState({ adult: false, locked: false })
            await AsyncStorage.removeItem("tx")
          }
          if (this.state.locked) {
            console.log("unlocking")
            await AsyncStorage.setItem("unlock", JSON.stringify({ expiryDate: Date.now() / 1000 * 2592000 }))
            this.setState({ adult: false, locked: false })
            await AsyncStorage.removeItem("tx")
          }
        } else {
          console.log("Addresses not equal")
        }

      }

    }
    this.setState({ appState: nextAppState });
  };

  getDashPrice = async () => {
    //get continent first
    try {
      let ip = await publicIP()
      let res = await fetch(`https://api.ipgeolocationapi.com/geolocate/${ip}`)
      let resJson = await res.json()
      //fetch the USD price for the continent
      let snapshot = await firestore().collection("prices").where("continent","==",resJson.continent).get()
      if(snapshot.empty) {
        console.log("No continent")
        return Promise.reject()
      }
      snapshot.forEach(async (doc) => {
        //use convert API
        let usd = await doc.get("usd")
        let res = await fetch(`https://pro-api.coinmarketcap.com/v1/tools/price-conversion?id=2781&amount=${usd}&convert=BCH`,{
          headers: {
            "X-CMC_PRO_API_KEY":"388e4b22-1b20-4a88-8ca8-9329abb9be0e"
          }
        })
        let resJson = await res.json()
        let amount = resJson.data.quote.BCH.price.toFixed(8)
        let address = this.props.navigation.getParam("model").address
        let canOpen = await Linking.canOpenURL(`bitcoincash:${address}?amount=${amount}`)
        if(canOpen) {
          await Linking.openURL(`bitcoincash:${address}?amount=${amount}`)
        } else {
          alert("You must install Bitcoin Cash Android or iOS wallet.")
        }
      })

    } catch (error) {
      alert(error)
    }
  }

  buttonHandler = (isLocked) => {
    if (isLocked) {

      this.getDashPrice()
      
    } else {
      this.props.navigation.push("voting", { model: this.props.navigation.getParam("model") })
    }
  }

  report = () => {
    Alert.alert("Reporting this model","Are you sure you want to report this model?",[
      {text:"Cancel"},
      {text:"I am sure",onPress:() => alert("Thanks for the report! We will look into this submission shortly.")}
    ])
  }

  render() {
    let { picture, name, age, country, bio, address, position } = this.props.navigation.getParam("model")

    return (
      <View style={style.container}>
             <ScrollView>
        {
          this.state.adult && (

            <ImageBackground source={{ uri: picture }} style={style.pictureLocked} blurRadius={30}  resizeMode="cover" >
              <View style={style.lockBox}>
                <Text style={style.lockBoxText}>{this.props.i18n.t("restricted")}</Text>
                <QRCode value={address} />
                <Text style={style.lockBoxText}>{this.props.i18n.t("nudity")}</Text>
                <Text style={style.lockBoxAdd}>For 30 days or until</Text>
                <Text style={style.lockBoxAdd}>you delete app / clear cookies</Text>
              </View>
            </ImageBackground>
          )
        }
        {
          this.state.locked && (

            <ImageBackground source={{ uri: picture }} style={style.pictureLocked} blurRadius={30} resizeMode="cover" >
              <View style={style.lockBox}>
                <Text style={style.lockBoxText}>{this.props.i18n.t("restricted")}</Text>
                <QRCode value={address} />
                <Text style={style.lockBoxText}>{this.props.i18n.t("unlockView")}</Text>
                <Text style={style.lockBoxAdd}>For 30 days or until</Text>
                <Text style={style.lockBoxAdd}>you delete app / clear cookies</Text>
                
              </View>
            </ImageBackground>
          )
        }
        {
          position == "top-left" && !this.state.locked && !this.state.adult && (

            <ImageBackground source={{ uri: picture }} style={style.picture} resizeMode="cover" >
              <QRCode value={address} />
            </ImageBackground>
          )
        }

        {
          position == "top-right" && !this.state.locked && !this.state.adult && (

            <ImageBackground source={{ uri: picture }} style={style.pictureright} resizeMode="cover" >
              <QRCode value={this.address} />
            </ImageBackground>
          )
        }

        {
          position == "bottom-left" && !this.state.locked && !this.state.adult && (

            <ImageBackground source={{ uri: picture }} style={style.picturebottomleft} resizeMode="cover" >
              <QRCode value={address} />
            </ImageBackground>
          )
        }

        {
          position == "bottom-right" && !this.state.locked && !this.state.adult && (

            <ImageBackground source={{ uri: picture }} style={style.picturebottomright} resizeMode="cover" >
              <QRCode value={address} />
            </ImageBackground>
          )
        }
        <View style={style.contentBox}>
        <TouchableHighlight onPress={() => this.buttonHandler((this.state.adult || this.state.locked))} style={style.btnHandler}>
          <Text style={{textAlign:"center",color:"white",fontFamily:"OpenSans-SemiBoldItalic",fontSize:20}}>
            {(this.state.adult || this.state.locked) ? this.props.i18n.t("unlock") : this.props.i18n.t("vote")}
            </Text>
        </TouchableHighlight>
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
        <View style={style.detailRow}>
        <Text style={style.detailHead}>Bio: </Text>
        <Text style={style.detailDesc}>{bio}</Text>
        </View>
        </View>
        
      </ScrollView>
      <View style={style.bottomBar}>
        <Text style={style.bottomText} onPress={() => this.props.navigation.navigate("howItWorks")}>About Bitcoin Cash</Text>
        <Text style={style.bottomText} onPress={() => this.props.navigation.navigate("howToUse")}>Learn More</Text>
        <Text style={style.bottomText} onPress={this.report}>Report as inappropiate</Text>
      </View>
      </View>
    );
  }
}

export default withTranslation()(ModelDetailScreen)

const style = StyleSheet.create({
  container: {
    flex: 1,
    
    flexDirection: "column",
    justifyContent: "space-around"
  },
  picture: {
    minHeight: 320,
    width: "100%",
  },
  pictureLocked: {
    minHeight: 320,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  contentBox: {
    flex:1,
    padding: 10
  },
  lockBox: {
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  lockBoxText: {
    fontFamily: "OpenSans-Regular",
    fontSize: 18,
    color: colors.darkBlue,
    fontWeight: "bold",
    padding: 10
  },
  lockBoxAdd: {
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    color: colors.darkBlue,
    textAlign:"center",
    
  },
  bottomBar: {
    flexDirection: "row",
    backgroundColor: colors.lightBlue,
    padding: 5
  },
  bottomText: {
    borderRightWidth: 1,
    borderRightColor: "white",
    padding: 5,
    color: "white",
    flexGrow: 1,
    textAlign: "center",
    fontFamily:"OpenSans-Regular",
    fontSize: 14
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
  pictureright: { flex: 1, width: "100%", minHeight: 320, flexDirection: "row-reverse" },
  picturebottomleft: { flex: 1, width: "100%", height: 320, flexDirection: "column-reverse"},
  picturebottomright: { flex: 1, width: "100%", height: 320, flexDirection: "column-reverse", alignItems: "flex-end" },
  btnHandler: {borderWidth:0,padding: 10,borderRadius:100,backgroundColor:colors.lightBlue}
})
