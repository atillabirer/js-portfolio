import React, { Component } from "react";
import { Text, Button, View, Body, H3 } from "native-base";
import { Image,ImageBackground } from "react-native";
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";
import * as moment from "moment";

class Processing extends Component {
    //Processing is a component with 3 states: image display (0), cancel countdown (1) and processing count-up (2)
    render() {
        let date = moment.unix(this.props.processingDate).format("MMMM Do YYYY, h:mm:ss a")
        if (this.props.mode == 0) {
            return (
                <ImageBackground source={{ uri: this.props.imageUri }} style={{ minWidth: "100%", minHeight: 300, flex: 1,flexDirection:"column",justifyContent:"flex-end" }}>
                    {this.props.processingDate && (<Text style={{color:"white",width:"100%",backgroundColor:"black"}}>Last processing: {date}</Text>)}
                </ImageBackground>
            );
        } else if (this.props.mode == 1) {
            //show 10 sec countdown with cancel button
            
            return (
                <ImageBackground source={{ uri: this.props.imageUri }} style={{ minWidth: "100%", minHeight: 300,flex:1,flexDirection:"column",justifyContent:"center" }}>
                    <H3 style={{textAlign:"center",opacity:1,color:"white"}}>Processing starts in 10 seconds...</H3>
                    <Button style={{opacity:1}} block onPress={() => this.props.stopCountDown(this.props.id)}><Text>Cancel</Text></Button>
                </ImageBackground>

            )
        } else {
            //show countup with stop button
            return (

                <ImageBackground source={{ uri: this.props.imageUri }} style={{ minWidth: "100%", minHeight: 300,flex:1,flexDirection:"column",justifyContent:"center",opacity:0.8 }}>
                    <H3 style={{textAlign:"center",opacity:1}}>Processing...</H3>
                </ImageBackground>
            )
        }
    }
}

export default Processing;