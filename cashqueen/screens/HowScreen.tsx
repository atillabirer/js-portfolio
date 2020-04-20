import React, { Component } from 'react';
import { View, Text, StyleSheet,Linking } from 'react-native';
import { withTranslation } from 'react-i18next';
import colors from "../assets/styles/colors"
import ScreenWithTranslation from './ScreenWithTranslation';
import { withNavigation } from 'react-navigation';

type HowScreenProps = ScreenWithTranslation;

const HowScreen = ({navigation,i18n}: HowScreenProps) => {
  return (
    <View style={style.container}>
      <Text style={style.textBold}> 1 - {i18n.t("download")} </Text>

      <Text style={style.text}> {i18n.t("fullList")}: </Text>
      <Text style={style.textBold} onPress={async () => await Linking.openURL("https://www.bitcoincash.org/#step-section")}>https://www.bitcoincash.org/#step-section</Text>
      <Text style={style.text}> {i18n.t("note")} </Text>
      <Text style={style.textBold}> 2 - {i18n.t("getDash")} </Text>
      <Text style={style.text}> {i18n.t("acquireDash")} </Text>
      <Text style={style.textBold} onPress={async () => await Linking.openURL("https://www.bitcoincash.org/buy-bitcoin-cash.html")}>https://www.bitcoincash.org/buy-bitcoin-cash.html</Text>

      <Text style={style.textBold}> 3 - {i18n.t("vote")} </Text>
      <Text style={style.text}> {i18n.t("clickOnVote")} </Text>
      <Text style={style.text}> {i18n.t("simplyApprove")} </Text>
      <Text style={style.text}> {i18n.t("inSomeWallets")} </Text>
    </View>
  );
}


const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBlue,
    justifyContent:"space-between",
    padding: 20
  },
  text: {
    fontFamily:"OpenSans-Regular",
    fontSize: 16,
    color: "white",
    
  },
  textBold: {
    fontFamily: "OpenSans-Bold",
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
    
  }
})

export default withTranslation()(withNavigation(HowScreen))