import React, { Component } from 'react';
import { Container, Content, Text, StyleProvider, Body, Header, Title, Form, Item, Input, Button } from "native-base";
import getTheme from "../native-base-theme/components";
import material from "../native-base-theme/variables/material";


const networkUrl = "http://5.249.144.235:3000";

export default class RegisterScreen extends Component {


    constructor(props) {
        super(props);
        this.state = {username:"",password:"",type:"business"}
    }
    onRegister = () => {
        //register, on success, switch to log in, on failure, alert
        fetch(`${networkUrl}/register`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        }).then((response) => response.json())
        .then((json) => {
            if(json.result == "ok") {
                this.props.navigation.navigate('Auth')
            } else {
                alert(json.error)
            }
        }).catch((error) => {
            alert(error)
        })
        
    }


    backToLogin = () => {
        this.props.navigation.navigate('Auth')
    }

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>

                    <Header>
                        <Body>
                            <Title>Register</Title>
                        </Body>
                    </Header>
                    <Content>
                        <Form>
                            <Item>
                                <Input placeholder="Username" onChangeText={(username) => this.setState({username})} value={this.state.username}/>
                            </Item>
                            <Item>
                                <Input placeholder="Password" secureTextEntry={true} onChangeText={(password) => this.setState({password})} value={this.state.password}/>
                            </Item>
                        </Form>
                        <Button block onPress={this.onRegister}><Text>Register</Text></Button>
                        <Button block warning onPress={this.backToLogin}><Text>BACK TO LOGIN</Text></Button>
                    </Content>
                </Container>
            </StyleProvider>
        );
    }
}