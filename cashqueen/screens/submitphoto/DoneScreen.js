import React, { Component } from 'react';
import { View, Text,Button,StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { withTranslation } from 'react-i18next';

class DoneScreen extends Component {
  static navigationOptions = {
    title: "All Done!"
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={style.container}>
        
        <View style={style.blueBox}>

        <Text style={{fontFamily:"OpenSans-Regular",color:"white",fontSize:16}}> {this.props.i18n.t("allDone")} </Text>
        <Text style={{fontFamily:"Montserrat-Regular",color:"white",fontSize:33,textAlign:"center",fontWeight:"bold",fontStyle:"italic"}}> {this.props.i18n.t("areYouNext")} </Text>
        <Text style={{fontFamily:"OpenSans-Regular",color:"white",fontSize:16}}> {this.props.i18n.t("pendingApproval")} </Text>
        </View>
        
        <View style={style.whiteBox}>
          <Text style={{fontFamily:"OpenSans-Regular",fontSize:32,textAlign:"center"}}>{this.props.i18n.t("goodLuck")}</Text>
        <Button title={this.props.i18n.t("backHome")} onPress={() => this.props.navigation.navigate("tabs")}/>
        </View>
       

      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  blueBox: {
    backgroundColor: "#008DE4",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center"
  },
  whiteBox: {
    flex:1,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10
  }
})

export default withNavigation(withTranslation()(DoneScreen))