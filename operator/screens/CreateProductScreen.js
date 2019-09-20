import { Button, Container, Content, Form, Header, Input, Item, Label, Left, Text, Title } from "native-base";
import React, { Component } from "react";
import {  Image, TimePickerAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PhotoUpload from "react-native-photo-upload";


const networkUrl = "http://localhost";


export default class CreateProductScreen extends Component {
    //fetches the product info and updates
    static navigationOptions = {
        title: "Create Product",
        headerStyle: {backgroundColor:"#3F51B5"},
        headerTitleStyle: {color:"white"},
        headerTintColor: '#ffffff'
    }

    constructor(props) {
        super(props)
        this.state = { businessId: this.props.navigation.getParam("businessId"), jwt: "", description: "", active: 0, price: null,processing_time: 0 }
    }

    componentDidMount() {
        //fetch productId details and fill form with em
        
        AsyncStorage.getItem("jwt").then((jwt) => {
            this.setState({ jwt })

        }).catch((error) => {
            alert(error)
        })

    }



    save = () => {
        //update and send the operator back to screen
        if(this.state.description && this.state.price && this.state.processing_time) {
            fetch(`${networkUrl}/products`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.state.jwt}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ business_id: this.state.businessId, 
                    price: this.state.price,
                     description: this.state.description,
                      picture: this.state.picture,
                    processing_time: this.state.processing_time })
            }).then((response) => response.json())
                .then((response) => {
                    if (response.error) {
                        alert(response.error)
                    } else {
                        //navigate back to products screen
                        this.props.navigation.navigate("Products", { businessId: this.props.navigation.getParam("businessId") })
                    }
                })
                .catch((error) => alert(error.toString()))
        } else {
            alert("Missing parameters")
        }
    }

     piccolo = async () => {
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
              hour: 0,
              minute: 0,
              is24Hour: true, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
              // processing time: hours * 60 + minutes
              this.setState({processing_time: (hour * 60 + minute)})
              
            }
          } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
          }
    }

    render() {
        return (
            <Container>
                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Description</Label>
                            <Input value={this.state.description} onChangeText={(value) => this.setState({ description: value })} />
                        </Item>

                        <Item floatingLabel>
                            <Label>Price (Euro)</Label>
                            <Input value={this.state.price} onChangeText={(value) => this.setState({ price: value })} />
                        </Item>
                        <Item floatingLabel>
                            <Label>Processing Time (minutes and seconds)</Label>
                            <Input value={this.state.processing_time.toString()} onChangeText={(value) => this.setState({processing_time:value})} onFocus={this.piccolo}/>
                        </Item>
                        <Item>
                            <PhotoUpload floatingLabel onPhotoSelect={(avatar) => this.setState({picture:avatar})}>
                                <Label>Product Picture</Label>
                                <Image source={{ uri: networkUrl + "/images/apple.jpg" }} style={{
                                    paddingVertical: 30,
                                    width: 150,
                                    height: 150,
                                    borderRadius: 75
                                }}
                                resizeMode='cover'
                                />
                            </PhotoUpload>
                        </Item>
                        <Button full onPress={this.save}>
                            <Text>Save</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }

}
