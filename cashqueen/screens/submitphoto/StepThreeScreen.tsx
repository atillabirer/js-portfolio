import React, { Component } from 'react';
import {ScrollView, View, Text,Button,StyleSheet,Image,ImageBackground } from 'react-native';
import QRCode from "react-native-qrcode-svg";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { withNavigation } from 'react-navigation';
import { withTranslation } from 'react-i18next';
import ScreenWithTranslation from '../ScreenWithTranslation';

type StepThreeScreenProps = ScreenWithTranslation;

class StepThreeScreen extends Component<StepThreeScreenProps> {

  static navigationOptions = {
    title: "Step Three"
  }
  state = {
    imgstyle: {flex:1,width:"100%",height:500},
    position: "top-left"
  };
  radioProps = [
    {label: "Top Left",value:0},
    {label: "Top Right",value:1},
    {label: "Bottom Left",value:2},
    {label: "Bottom Right",value:3},
  ]


  positionHandler = (value: number,index: number) => {
    if(value == 0) {
      this.setState({imgstyle:{flex:1,width:"100%",height:500},position:"top-left"})
    }
    if(value == 1) {
      this.setState({imgstyle:{flex:1,width:"100%",height:500,flexDirection: "row-reverse"},position:"top-right"})
    }
    
    if(value == 2) {
      this.setState({imgstyle:{flex:1,width:"100%",height:500,flexDirection: "column-reverse"},position:"bottom-left"})
    }
    
    if(value == 3) {
      this.setState({imgstyle:{flex:1,width:"100%",height:500,flexDirection: "column-reverse",alignItems:"flex-end"},position:"bottom-right"})
    }

  }
  
  render() {
    return (
      <ScrollView style={{padding: 10}}>
        <Text style={{
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 16,
    color: "#707070",
    padding: 10
  }}> {this.props.i18n.t("placeCode")}</Text>
        <ImageBackground style={[this.state.imgstyle,{padding:10}]} resizeMode='cover' source={{uri:this.props.navigation.getParam("picture")}}>
    <QRCode text={this.props.navigation.getParam("address")}/>
  </ImageBackground>
  <RadioForm formHorizontal={true} radio_props={this.radioProps} initial={0} onPress={this.positionHandler}/>
        <Button title={this.props.i18n.t("nextStep")}
        onPress={() => this.props.navigation.push("stepFour",
        {picture:this.props.navigation.getParam("picture"),
        address: this.props.navigation.getParam("address"),
        position: this.state.position
        })}/>
      </ScrollView>
    );
  }
}

export default withNavigation(withTranslation()(StepThreeScreen))