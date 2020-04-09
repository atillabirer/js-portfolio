import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {firestore,storage} from "../firebase"

export default class AllTimeScreen extends Component {

  static navigationOptions = {
    title: "Submit Photo"
  }
  constructor(props) {
    super(props);


    //to be implemented
  }

  render() {
    return (
      <View>
        <Text> Placeholder </Text>
      </View>
    );
  }
}
