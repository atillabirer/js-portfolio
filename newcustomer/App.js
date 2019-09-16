import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {createSwitchNavigator,createAppContainer, createStackNavigator, createBottomTabNavigator} from "react-navigation";

import BusinessScreen from './screens/BusinessScreen';
import ProductsScreen from "./screens/ProductsScreen";
import MyProductsScreen from "./screens/MyProductsScreen";
import {Icon} from "native-base";


const AppStack = createStackNavigator({
  Business: BusinessScreen,
  Products: ProductsScreen,

},{
  initialRouteName:"Business",
  navigationOptions: {
    tabBarIcon: ({tintColor}) => (<Icon name="home" type="FontAwesome"/>)
  }
})


const TabStack = createBottomTabNavigator(
  {
    App: AppStack,
    MyProducts: MyProductsScreen

  },{
    initialRouteName:"App"
  }
)

export default createAppContainer(TabStack)