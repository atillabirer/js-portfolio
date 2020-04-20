import React, { Component } from 'react';
import { View, Text, Button,StyleSheet } from 'react-native';
import { firestore, storage } from "../../firebase";
import ImagePicker from 'react-native-image-picker';
import uuid from "uuidv4";
import { withNavigation } from 'react-navigation';
import { withTranslation } from 'react-i18next';
import colors from "../../assets/styles/colors"
import ScreenWithTranslation from '../ScreenWithTranslation';

type StepOneScreenProps = ScreenWithTranslation;


class StepOneScreen extends Component<StepOneScreenProps> {
  
  
  state = {
    image: ""
  };

  static navigationOptions = {
    title: "Step One"
  }


  _pickImage = async () => {

    const options = {
      title: 'Select Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.props.navigation.push("stepTwo", { picture: response.uri, base64: `data:image/jpg;base64,${response.data}` })


        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

      }
    });
  };

  
  

  render() {
    return (
      <View style={style.container}>
        <Text style={style.detailHead}> {this.props.i18n.t("upload")} </Text>
        <Text style={style.detailDesc}>{this.props.i18n.t("youCanUpload")}</Text>
        <Text style={style.mostImp}>{this.props.i18n.t("important")}:</Text>
        <Text style={style.detailHead}>{this.props.i18n.t("mustContain")}</Text>
        <Button title={this.props.i18n.t("upload")} onPress={this._pickImage} />
        <Text></Text>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  detailHead: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 16,
    color: colors.darkGray,
    padding: 10
  },
  mostImp: {
    fontFamily: "OpenSans-Regular",
    fontWeight: "bold",
    fontSize: 20,
    color: colors.lightBlue,
    padding: 10
  },
  detailDesc: {
    fontFamily: "OpenSans-Regular",
    fontSize: 16,
    color: colors.darkGray,
    padding: 10
  }

})

export default withNavigation(withTranslation()(StepOneScreen))