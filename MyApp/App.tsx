import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar, FlatList, Alert, Dimensions, ActivityIndicator, Button, TouchableHighlight, TouchableOpacity
} from 'react-native';
import AuthorList from './AuthorList';
import BooksList from './BooksList';
import { RootStackParamList } from './types';



const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Authors">
        <Stack.Screen component={AuthorList} name="Authors" options={{title:"Author List"}}/>
        <Stack.Screen component={BooksList} name="BooksList"/>
      </Stack.Navigator>
    </NavigationContainer>
  );

};


export default App;
