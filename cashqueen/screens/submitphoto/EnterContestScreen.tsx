import React, { Component } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import CheckBox from "react-native-check-box";
import { withTranslation } from 'react-i18next';
import { withNavigation } from 'react-navigation';
import YouTube from 'react-native-youtube';
import { NavigationStackProp } from 'react-navigation-stack';
import ScreenWithTranslation from '../ScreenWithTranslation';


type EnterContestScreenState = {
  myself: boolean,
  eighteen: boolean
}

class EnterContestScreen extends Component<ScreenWithTranslation,EnterContestScreenState>{
  

  state: EnterContestScreenState = {
    myself: false,
    eighteen: false
  }
  
  toggleEighteen = () => {
    this.setState((prevState) => {
      
      console.log(this.state)
      return {eighteen: !prevState.eighteen}
    })
  }
  toggleMyself = () => {
    this.setState((prevState) => {
      
      console.log(this.state)
      return {myself: !prevState.myself}
    })
  }

  checks = () => {
    if(!this.state.eighteen) {
      Alert.alert("you must be 18 to enter this competition")
      return
    }
    if(!this.state.myself) {
      Alert.alert("you can only apply for yourself")
      return
    }
    this.props.navigation.push("stepOne")
  }


  render() {
    return (
      <View style={{flex:1,padding:10,justifyContent:"space-around"}}>
        <Text style={ {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 16,
    color: "#707070"
  }}> {this.props.i18n.t("howItWorks")}: </Text>
        
        <YouTube videoId="DiYEp_Hr3Aw"  style={{ alignSelf: 'stretch', height: 300 }} />
        <CheckBox onClick={this.toggleEighteen}
        isChecked={this.state.eighteen}
        rightText={this.props.i18n.t("over18")}
        />
        <CheckBox onClick={this.toggleMyself}
        isChecked={this.state.myself}
        rightText={this.props.i18n.t("myself")}
        />
        <Button title={this.props.i18n.t("enterContest")} onPress={this.checks}/>
      </View>
    );
  }
}

export default withNavigation(withTranslation()(EnterContestScreen))