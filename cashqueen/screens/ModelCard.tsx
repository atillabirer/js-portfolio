import React, { Component } from 'react';
import { View, Text, StyleSheet,Image,ImageBackground,TouchableHighlight } from 'react-native';
import { withNavigation, NavigationParams, NavigationScreenProp, NavigationInjectedProps } from 'react-navigation';
import QRCode from "react-native-qrcode-svg";
import colors from "../assets/styles/colors"
import { NavigationStackScreenProps, NavigationStackProp } from 'react-navigation-stack';


type ModelCardProps = {
  navigation: NavigationStackProp,
  model: any,
  index: number
}

const ModelCard = ({navigation,model,index} : ModelCardProps) => {
  if(model.approved) {
    return (
      <TouchableHighlight style={style.container} onPress={() => navigation.push("detail",{model: model,rank:index})}>
        <React.Fragment>
        <View style={style.header}>
            <View style={{flexDirection:"row"}}>
            <Text style={[style.rank,{color:"white"}]}>{index}</Text>
            <Text style={style.headerText} onPress={() => navigation.push("detail",{model: model,rank:index})}>
            {model.name}
            </Text>
            </View>
            <View style={{flexDirection:"row"}}>
              
            <Text style={[style.headerText,{margin:2, color:colors.lightBlue}]}>{model.votes.toFixed(2)}  m</Text>
            <Image source={require("../assets/img/dashicon.png")}/>
            </View>
        </View>
        {
          model.position == "top-left" && (
            
        <ImageBackground resizeMode="cover" blurRadius={(model.adult || model.locked) ? 30 : 0} key={model.picture} source={{uri:model.picture,cache:'reload'}} style={style.picture}>
        <QRCode value={model.address}/>
       </ImageBackground>
          )
        }
        
        {
          model.position == "top-right" && (
            
        <ImageBackground resizeMode="cover"  blurRadius={(model.adult || model.locked) ? 30 : 0} key={model.picture} source={{uri:model.picture,cache:'reload'}} style={style.pictureright}>
        <QRCode value={model.address}/>
       </ImageBackground>
          )
        }
        
        {
          model.position == "bottom-left" && (
            
        <ImageBackground  resizeMode="cover" blurRadius={(model.adult || model.locked) ? 30 : 0} key={model.picture} source={{uri:model.picture,cache:'reload'}} style={style.picturebottomleft}>
        <QRCode value={model.address}/>
       </ImageBackground>
          )
        }
        
        {
          model.position == "bottom-right" && (
            
        <ImageBackground  resizeMode="cover" blurRadius={(model.adult || model.locked) ? 30 : 0} key={model.picture} source={{uri:model.picture,cache:'reload'}} style={style.picturebottomright}>
        <QRCode value={model.address}/>
       </ImageBackground>
          )
        }
        </React.Fragment>
      </TouchableHighlight>
    );
  } else {
    return null;
  }
}


export default withNavigation<ModelCardProps>(ModelCard)

const style = StyleSheet.create({
    container: {
        
        width:"100%"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: colors.white,
        padding: 10
    },
    headerText: {
      color: colors.lightBlue,
      fontFamily: "OpenSans-Regular",
      fontWeight: "bold",
      fontSize: 16
      
    },
    picture: {
        minHeight: 320,
        width: "100%",
        flex: 1,
        
    },
    rank: {margin:2,backgroundColor:colors.lightBlue,fontWeight:"bold",paddingLeft:5,paddingRight:5,color:"white",borderRadius:100,fontFamily:"Montserrat-Regular",justifyContent:"center",alignItems:"center"},
    pictureright: {flex:1,width:"100%",minHeight:320,flexDirection: "row-reverse"},
    picturebottomleft: {flex:1,width:"100%",height:320,flexDirection: "column-reverse"},
    picturebottomright: {flex:1,width:"100%",height:320,flexDirection: "column-reverse",alignItems:"flex-end"}
})
