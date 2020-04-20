import React from 'react';
import {Component} from "react";
import { View, Text,StyleSheet,Image } from 'react-native';
import { withTranslation } from 'react-i18next';
import colors from "./assets/styles/colors"



const HeaderComponent = () => (
  <View style={style.container}>
  <Text style={{fontFamily:"Montserrat-Bold",color:"white",fontSize:36}}>CashQueen</Text>
   <Text style={style.title}>March beauty contest</Text>
 </View>
);

const style = StyleSheet.create({
    container: {
        padding:10,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.lightBlue
    },
    title: {
        fontFamily: "Montserrat-Regular",
        color: "#fff",
        fontSize: 16
    }
})

export default withTranslation()(HeaderComponent)