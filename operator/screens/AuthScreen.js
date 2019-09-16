import React from "react";
import AsyncStorage from '@react-native-community/async-storage';
import { View, Text, StyleProvider, Container, Header, Content, Form, Item, Input, Title, Body, Button } from "native-base";
import getTheme from "../native-base-theme/components";
import material from "../native-base-theme/variables/material"
import { TouchableOpacity, TouchableHighlight } from "react-native-gesture-handler";
import {withNavigation} from "react-navigation";


const networkUrl = "http://5.249.144.235:3000";

export default class AuthScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {username:"",password:""}
    }

    signIn = () => {
        //check credentials, depending on response switch screen or alert
        fetch(networkUrl + "/token",{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(this.state)
        }).then((response) => response.json())
        .then((value) => {
            if(value.error) {
                alert(value.error)
            } else {
                //accepted
                //save token and switch to another thing
                AsyncStorage.setItem("jwt",value.token).then(() => {
                    this.props.navigation.navigate('Business')
                })
            }
        }).catch((error) => {
            alert(error)
        })
    }

    goToRegister = () => {
        this.props.navigation.navigate('Register')
    }

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header>
                        <Body>
                            <Title>Sign in to Operator UI</Title>
                        </Body>
                    </Header>
                    <Content>
                        <Form>
                            <Item>
                                <Input placeholder="Username" onChangeText={(username) => this.setState({username})}/>
                            </Item>
                            <Item>
                                <Input placeholder="Password" secureTextEntry={true} onChangeText={(password) => this.setState({password})}/>
                            </Item>
                        </Form>
                        <Button block success onPress={this.signIn}><Text>SIGN IN</Text></Button>
                        <Button block warning onPress={this.goToRegister}><Text>REGISTER</Text></Button>
                    </Content>
                </Container>
            </StyleProvider>
        );
    }
}