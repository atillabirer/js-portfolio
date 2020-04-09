import React, { Component } from 'react';
import { View, Text, StyleSheet,Linking } from 'react-native';
import { withTranslation } from 'react-i18next';
import colors from "../assets/styles/colors"


class HowScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={style.container}>
        <Text style={style.textBold}> 1 - {this.props.i18n.t("download")} </Text>

        <Text style={style.text}> {this.props.i18n.t("fullList")}: </Text>
        <Text onPress={this.downloads} style={style.textBold} onPress={async () => await Linking.openURL("https://www.bitcoincash.org/#step-section")}>https://www.bitcoincash.org/#step-section</Text>
        <Text style={style.text}> {this.props.i18n.t("note")} </Text>
        <Text style={style.textBold}> 2 - {this.props.i18n.t("getDash")} </Text>
        <Text style={style.text}> {this.props.i18n.t("acquireDash")} </Text>
        <Text onPress={this.downloads} style={style.textBold} onPress={async () => await Linking.openURL("https://www.bitcoincash.org/buy-bitcoin-cash.html")}>https://www.bitcoincash.org/buy-bitcoin-cash.html</Text>

        <Text style={style.textBold}> 3 - {this.props.i18n.t("vote")} </Text>
        <Text style={style.text}> {this.props.i18n.t("clickOnVote")} </Text>
        <Text style={style.text}> {this.props.i18n.t("simplyApprove")} </Text>
        <Text style={style.text}> {this.props.i18n.t("inSomeWallets")} </Text>
      </View>
    );
  }
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

export default withTranslation()(HowScreen)