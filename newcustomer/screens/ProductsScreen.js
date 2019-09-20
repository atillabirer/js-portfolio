import React from "react";
import { Text, View, Container, Button, Grid, Row, Col, Header, Body, Content, Card, CardItem, Right, Left, Icon, Title,H3 } from "native-base";
import { Image, Alert,StyleSheet,ImageBackground } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from "react-native-gesture-handler";
import io from "socket.io-client";
import { withNavigation } from "react-navigation";
import PushNotification from "react-native-push-notification";
import moment from "moment";
import Spinner from "react-native-loading-spinner-overlay";

const networkUrl = "http://localhost";


class ProductsHeader extends React.Component {

    constructor(props) {
        super(props)
    }


    render() {
        return (
            <Content>
            <Header>
                <Left/>
                <Body>
                    <Title>Products</Title>
                </Body>
                <Right>
                </Right>
            </Header>
        </Content>
        );
    }
}

export default class ProductsScreen extends React.Component {

    static navigationOptions =  {
        title: "Products",
        headerTitle: withNavigation(ProductsHeader),headerStyle: 
        { backgroundColor: "#3F51B5", color: "white" },
        headerTintColor: '#ffffff'
    }

    constructor(props) {
        super(props)
        this.state = { jwt: "", products: [],spinner:false}
        
        this._loadProducts = this._loadProducts.bind(this)

    }
    async componentDidMount() {
        //fetch the JWT

        this._loadProducts()
        this.socket = io(networkUrl)
        this.socket.on('connect',() => {
            //set up events
            this.socket.on('create',(message) => {
                this._loadProducts()

            })
            this.socket.on('update',(message) => {
                this._loadProducts()
            })
            this.socket.on('delete',(message) => {
                this._loadProducts()

            })

            this.socket.on('processing',(message) => {
                this.setState((prevState) => {
                    prevState.products.forEach((product) => {
                        if(product.id == message.id) {
                            product.processing = true;
                        }
                        return product;
                    })
                    return prevState;
                })
            })

            this.socket.on('endprocessing',(message) => {
                this._loadProducts()
            })
        })
       this.props.navigation.addListener('didBlur',() => {
           this.props.navigation.addListener('didFocus',() => this._loadProducts())
        })
    }

    
    _loadProducts() {
        this.setState({spinner:true})
        AsyncStorage.getItem("jwt").then((jwt) => {

            this.setState({ jwt })
            const businessId = this.props.navigation.getParam("businessId")
            fetch(`${networkUrl}/products/business/${businessId}`, {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            }).then((response) => response.json())
                .then((json) => {
                    if (json.error) {
                        alert("Error in loadProducts")
                        alert(json.error)
                    } else {
                        //add mode and seconds to products
                        AsyncStorage.getItem("subscriptions").then((raw) => {
                            let decoded = [];
                            if(raw) {
                                decoded = JSON.parse(raw)
                            }
                            
                            
                            json.forEach((product) => {
                                product.mode = 0;
                                product.seconds = 0;
                                if(decoded.find((one) => one == product.id)) {
                                    product.subscribed = true;
                                } else {
                                    product.subscribed = false;
                                }
                                 
                                return product;
                               
                            })
                            console.log(JSON.stringify(json))
                            this.setState({ products: json,spinner:false })
                        })
                    }
                })
        }).catch((error) => {
            alert(error)
        })
    }

    subscribe = (id) => {
        AsyncStorage.getItem("subscriptions").then((subscriptions) => {
            if(subscriptions) {
                let decoded = JSON.parse(subscriptions)
                if(decoded.find((one) => one == id)) {
                    alert("Already subscribed to this product.")
                } else {
                    decoded.push(id)
                    AsyncStorage.setItem("subscriptions",JSON.stringify(decoded))
                   this._loadProducts()
                }
            } else {
                //create the array
                AsyncStorage.setItem("subscriptions",JSON.stringify([id]))
            }
        })
    }
    
    render() {
        
        return (
            
                <Container>
                    <Spinner visible={this.state.spinner}/>
                <Content>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap" }}>
                        
                    {this.state.products.map((product, number) => {
                        return (
                            <Card  key={product.id} style={{ flex: 1, width: 320, flexBasis: 320,flexGrow: 1 }}>
                                <CardItem header>
                                    <Body>
                                        <Text>{product.description}</Text>
                                    </Body>
                                    <Right>
                                        {
                                            product.subscribed ?
                                            (<Icon name="md-checkmark"/>) :
                                            (<Button transparent onPress={() => this.subscribe(product.id)}><Icon name="plus" type="FontAwesome"/></Button>)
                                        }
                                    </Right>
                                </CardItem>
                                <CardItem cardBody>
                                   {
                                       product.processing ?
                                       (
                                        <ImageBackground source={{ uri:"data:image/jpeg;base64," + product.picture }} style={{ minWidth: "100%", minHeight: 300,flex:1,flexDirection:"column",justifyContent:"center",opacity:0.8 }}>
                                        <H3 style={{textAlign:"center"}}>Processing...</H3>
                                    </ImageBackground>
                                       ) :
                                       (
                                        <ImageBackground source={{ uri:"data:image/jpeg;base64," + product.picture }} style={{ minWidth: "100%", minHeight: 300,flex:1,flexDirection:"column",justifyContent:"flex-end" }}>
                                       
                                        {product.processing_date && (<Text style={{color:"white",width:"100%",backgroundColor:"black"}}>Last processing: {moment.unix(product.processing_date).format("MMMM Do YYYY, h:mm:ss a")} </Text>)}
                                     </ImageBackground>
                                       )
                                   }
                                </CardItem>
                                
                            </Card>
                        );
                    })}
                    </View>
                </Content>
            </Container>
        );
    }

}
