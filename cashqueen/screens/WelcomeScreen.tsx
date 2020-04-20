import React, { Component } from 'react';
import { View, Text, Button, AppState, StyleSheet, Image, TouchableHighlight, ImageBackground } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import i18n from "../i18n"
import { withTranslation, WithTranslation } from 'react-i18next';
import colors from "../assets/styles/colors"
import { withNavigation } from 'react-navigation';
import { NavigationStackProp, NavigationStackScreenProps } from 'react-navigation-stack';

type WelcomeScreenProps = WithTranslation & NavigationStackScreenProps;

const WelcomeScreen = ({ navigation, i18n }: WelcomeScreenProps) => {


  function languageAndGo(lang: string)  {
    i18n.changeLanguage(lang)
    navigation.navigate("tabs")
  }

  return (
    <ImageBackground style={style.container} source={require("../assets/img/model.png")} imageStyle={{ opacity: 0.2 }}>
      <Text style={{ fontFamily: "Montserrat-Bold", color: "white", fontSize: 36 }}>CashQueen</Text>
      <Text style={style.text}>Monthly beauty contest where participants around the world compete for the title of Cash Queen of the month.</Text>

      <View>
        <Text style={style.text}>Select a Language</Text>
        <TouchableHighlight
          style={style.submit}
          onPress={() => languageAndGo("en")}
          underlayColor='#fff'>
          <Text style={style.submitText}>English</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={style.submit}
          onPress={() => languageAndGo("es")}
          underlayColor='#fff'>
          <Text style={style.submitText}>Espanol</Text>
        </TouchableHighlight>

      </View>

      <View style={style.bottomBar}>
        <Text style={style.bottomText} onPress={() => navigation.push("howItWorks")}>How it Works</Text>
      </View>

    </ImageBackground>
  );



}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.lightBlue,
    padding: 20
  },
  text: {
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    color: "white",
    fontSize: 20
  },
  bottomText: {
    fontFamily: "Montserrat-MediumItalic",
    fontSize: 20,
    color: colors.white,
    textAlign: "center"
  },
  submit: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
  },
  submitText: {
    paddingLeft: 30,

    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    color: '#000',
    textAlign: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.white,
    fontFamily: "Montserrat-Regular"
  },
  bottomBar: {
    width: "100%",
    textAlign: "center",
    padding: 10
  }
})

export default withTranslation()(withNavigation(WelcomeScreen))