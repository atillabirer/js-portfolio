/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {createSwitchNavigator,createAppContainer, createStackNavigator, createBottomTabNavigator} from "react-navigation";
import AuthScreen from "./screens/AuthScreen";
import BusinessScreen from './screens/BusinessScreen';
import ProductsScreen from "./screens/ProductsScreen";
import CreateProductScreen from './screens/CreateProductScreen';
import EditProductScreen from './screens/EditProductScreen';
import CreateBusinessScreen from "./screens/CreateBusinessScreen"
import EditBusinessScreen from "./screens/EditBusinessScreen"
import RegisterScreen from "./screens/RegisterScreen"
import ShelfProductsScreen from "./screens/ShelfProductsScreen";



const AppStack = createStackNavigator({

  Business: BusinessScreen,
  Products: ProductsScreen,
  Shelf: ShelfProductsScreen,
  Create: CreateProductScreen,
  Edit: EditProductScreen,
  CreateBusiness: CreateBusinessScreen,
  EditBusiness: EditBusinessScreen
}, {
  initialRouteName: "Business"
})

const AuthStack = createSwitchNavigator({
  Auth: AuthScreen,
  Register: RegisterScreen
})


export default createAppContainer(createSwitchNavigator({
  Auth: AuthStack,
  App: AppStack
},{
  initialRouteName: "Auth"
}))