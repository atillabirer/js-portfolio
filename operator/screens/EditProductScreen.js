import React,{Component} from "react";
import { Text, Container, Header, Content, Item,Form,Input, Title, Body,Left, Picker, Label,Button } from "native-base";
import {YellowBox,Image,TimePickerAndroid} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PhotoUpload from "react-native-photo-upload";


const networkUrl = "http://5.249.144.235:3000";


export default class EditProductScreen extends Component {
    //fetches the product info and updates

    constructor(props) {
        super(props)
        this.state = {productId: this.props.navigation.getParam("productId"),jwt:"",description:"",price:"",picture:"",processing_time:""}
    }
    static navigationOptions = {
        title: "Edit Product",
        headerStyle: {backgroundColor:"#3F51B5",color:"white"},
        headerTitleStyle: {color:"white"},
        headerTintColor: '#ffffff'
    }

    componentDidMount() {
        //fetch productId details and fill form with em
        AsyncStorage.getItem("jwt").then((jwt) => {
            this.setState({jwt})
            
            fetch(`${networkUrl}/products/${this.state.productId}`,{
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }).then((response) => response.json())
            .then((response) => {
                if(!response.error) {

                this.setState({description: response.description,price:response.price,picture:response.picture,processing_time:response.processing_time})
                } else {
                    alert(response.error)
                }
            }).catch((error) => {
                alert(error)
            })
        }).catch((error) => {
            alert(error)
        })
        
    }


    onValueChange2(value) {
        this.setState({
        active: value
        });
    }

    save = () => {
        //update and send the operator back to screen
        fetch(`${networkUrl}/products/update/${this.state.productId}`,{
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.state.jwt}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({description:this.state.description,price:this.state.price,picture:this.state.picture,processing_time:this.state.processing_time})
        }).then((response) => response.json())
        .then((response) => {
            if(response.error) {
                alert(response.error)
            } else {
                //navigate back to products screen
                this.props.navigation.goBack()
            }
        })
        .catch((error) => alert(error.toString()))
    }

    piccolo = async () => {
        
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
              hour: 0,
              minute: 0,
              is24Hour: true, 
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
                            <Input value={this.state.description} onChangeText={(value) => this.setState({description:value})}/>
                        </Item>

                        <Item floatingLabel>
                            <Label>Price (Euro)</Label>
                            <Input value={this.state.price.toString()} onChangeText={(value) => this.setState({price:value})}/>
                        </Item>

                        <Item>
                            <PhotoUpload floatingLabel onPhotoSelect={(avatar) => this.setState({picture:avatar})}>
                                <Label>Product Picture</Label>
                                <Image source={{ uri: "data:image/jpeg;base64," + this.state.picture}} style={{
                                    paddingVertical: 30,
                                    width: 150,
                                    height: 150,
                                    borderRadius: 75
                                }}
                                resizeMode='cover'
                                />
                            </PhotoUpload>
                        </Item>
                        <Item floatingLabel>
                            <Label>Processing Time (minutes and seconds)</Label>
                            <Input value={this.state.processing_time.toString()} onChangeText={(value) => this.setState({processing_time:value})} onFocus={this.piccolo}/>
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