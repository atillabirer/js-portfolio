import React, { Component } from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { withTranslation } from 'react-i18next';
import colors from "../assets/styles/colors"

class AboutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={style.container}>
        <Text style={style.textBold}> {this.props.i18n.t("monthlyContest")} </Text>
        <Text style={style.text}> {this.props.i18n.t("toVote")} </Text>
        <Text style={style.text}> {this.props.i18n.t("theContestant")} </Text>
        <Text style={style.text}> {this.props.i18n.t("monthlyWinners")} </Text>
        <Text style={style.text}> {this.props.i18n.t("anyoneInterested")} </Text>
        <Text onPress={() => this.props.navigation.navigate("howToUse")} style={style.links}> {this.props.i18n.t("learnHow")} </Text>
        <Text style={style.links}> {this.props.i18n.t("privacyStatement")} </Text>
        <Text style={style.links}> {this.props.i18n.t("termsAndConditions")} </Text>
        <Text style={style.text}> All rights reserved Cash Queen 2020 </Text>
      </View>
    );
  }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightBlue,
        justifyContent: "space-around",
        padding: 10
    },
    text: {
      fontFamily:"OpenSans-Regular",
      fontSize: 16,
      color: "white",
      
    },
    textBold: {
      fontFamily: "OpenSans-Bold",
      
      fontSize: 16,
      color: "white",
      
    },
    links: {
      fontFamily: "OpenSans-Bold",
      fontWeight: "bold",
      fontSize: 20,
      color: "white",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.white
    }
})

export default withTranslation()(AboutScreen)