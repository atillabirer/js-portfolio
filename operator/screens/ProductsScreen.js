import React from "react";
import { Text, View, Container, Button, Grid, Row, Col, Header, Body, Content, Card, CardItem, Right, Left, Icon, Title } from "native-base";
import { Image, Alert, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import Processing from "../components/Processing";
import io from "socket.io-client";
import { withNavigation } from "react-navigation";
import { createStore } from "redux";
import Spinner from 'react-native-loading-spinner-overlay';


const networkUrl = "http://localhost";


function toggle(state = true, action) {
    return !state;
}

let store = createStore(toggle)


class ProductsHeader extends React.Component {

    constructor(props) {
        super(props)
        this.state = { isLocked: true }
    }
    componentDidMount() {
        store.subscribe(() => this.setState({ isLocked: store.getState() }))

    }

    logOut = () => {
        Alert.alert(
            'Logging Out',
            'Are you sure you want to log out?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Log out', onPress: () => this.props.navigation.navigate('Auth') },
            ],
            { cancelable: false },
        );
    }

    render() {
        return (
            <Content>
                <Header>
                    <Left />
                    <Body>
                        <Title>Products</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.props.navigation.push('Create', { businessId: this.props.navigation.getParam("businessId") })}><Icon name="add" /></Button>
                        <Button transparent onPress={() => this.props.navigation.navigate('Shelf',{ businessId: this.props.navigation.getParam("businessId") })}><Icon name="table" type="FontAwesome5"/></Button>
                        <Button transparent onPress={() => store.dispatch({ type: 'TOGGLE' })}><Icon name={this.state.isLocked ? "lock" : "unlock"} /></Button>
                        <Button transparent onPress={this.logOut}><Icon name="log-out" /></Button>
                    </Right>
                </Header>
            </Content>
        );
    }
}

export default class ProductsScreen extends React.Component {

    static navigationOptions = {
        title: "Products",
        headerTitle: withNavigation(ProductsHeader),
        headerStyle: { backgroundColor: "#3F51B5", color: "white" },
        headerTintColor: '#ffffff'
    }

    constructor(props) {
        super(props)
        this.state = { jwt: "", products: [], isLocked: true, spinner: false }
        this._delete = this._delete.bind(this)
        this._loadProducts = this._loadProducts.bind(this)
        this.countUp = this.countUp.bind(this)
        this.timeOut = [] //each id has it's own timeout

    }
    async componentDidMount() {
        //fetch the JWT

        store.subscribe(() => this.setState({ isLocked: store.getState() }))

        this._loadProducts()
        this.socket = io(networkUrl)
        this.socket.on('connect', () => {
            //set up events
            this.socket.on('create', (message) => {
                this._loadProducts()
            })
            this.socket.on('update', (message) => {
                this._loadProducts()
            })
            this.socket.on('delete', (message) => {
                this._loadProducts()
            })



            this.socket.on('endprocessing', (message) => {
                this._loadProducts()
            })
        })

        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            this._loadProducts()
          });
    }

    toggleLock = () => {
        this.setState((prevState) => {
            return { isLocked: !prevState.isLocked }
        })
        alert(this.state.isLocked)
    }

    _loadProducts() {

        AsyncStorage.getItem("jwt").then((jwt) => {

            this.setState({ jwt })
            const businessId = this.props.navigation.getParam("businessId")
            this.setState({ spinner: true })
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
                        //sort
                        json.sort((a,b) => {
                            return a.description - b.description
                        })
                        //add mode and seconds to products
                        json.forEach((product) => {
                            product.mode = 0;
                            product.seconds = 0;
                            return product;
                        })
                        this.setState({ products: json,spinner:false })
                    }
                })
        }).catch((error) => {
            alert(error)
        })
    }

    async _delete(productId) {

        //alert + delete if yes
        //go thru with the deletion an reload the list
        try {
            const result = await fetch(`${networkUrl}/products/delete/${productId}`, {
                headers: {
                    "Authorization": `Bearer ${this.state.jwt}`
                }
            })
            const json = await result.json()
            if (json.result == "ok") {
                this._loadProducts()
            } else {
                alert(this.state.jwt)
                alert(JSON.stringify(json))
            }
        } catch (error) {
            alert(error)
        }
    }

    _edit(productId) {
        //send user to edit page with product
        this.props.navigation.navigate('Edit', { productId, businessId: this.props.navigation.getParam("businessId") })
    }

    create = () => {
        this.props.navigation.navigate("Create", { businessId: this.props.navigation.getParam("businessId") })

    }

    countUp(id, processing_time, timeOut) {
        //call process on id
        fetch(`${networkUrl}/products/process/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.state.jwt}`
            },
            body: JSON.stringify({ a: "1" })
        }).then((response) => {
            setTimeout(() => {
                this.stopCountUp(id)
            }, processing_time * 1000)
        }).catch((error) => {
            alert(error)
        })
    }


    countDown = (id) => {
        //change mode for product to 1, in 10 seconds fire the countup
        this.setState((prevState) => {
            //find product by id, change it's mode
            prevState.products.forEach((product) => {
                if (product.id == id) {
                    product.mode = 1;
                }
            })
            this.timeOut[id] = setTimeout(() => {
                this.setState((prevState) => {
                    //find product by id, change it's mode
                    prevState.products.forEach((product) => {
                        if (product.id == id) {
                            product.mode = 2;
                            this.countUp(id, product.processing_time);
                        }
                    })
                    return prevState;
                })
            }, 10000)

            return prevState;
        })

    }

    stopCountUp = (id) => {
        //end processing and call loadProducts
        fetch(networkUrl + "/products/endprocess/" + id, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.state.jwt}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ a: "b" })
        }).then((response) => response.json())
            .then((response) => {

                this._loadProducts()
            })
            .catch((error) => {
                alert(error)
            })

    }

    stopCountDown = (id) => {

        this.setState((prevState) => {
            prevState.products.forEach((product) => {
                if (product.id == id) {
                    product.mode = 0
                    clearTimeout(this.timeOut[id])
                }
                return product;
            })
            return prevState;
        })

    }
    componentWillUnmount() {
        clearInterval(this.interval)
        clearTimeout(this.timeout)
    }

    shelf = (id) => {
        fetch(`${networkUrl}/products/shelf/${id}`, {
            
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.state.jwt}`
            }
            
        }).then((response) => {
            this._loadProducts()
        }).catch((error) => {
            alert(error)
        })
    }

    render() {

        return (
            <Container>
                <Spinner visible={this.state.spinner} textContent="Loading..." textStyle={{ color: "#FFF" }} />
                <Content>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap" }}>

                        {this.state.products.map((product, number) => {
                            return (
                                <Card key={product.id} style={{ flex: 1, width: 320, flexBasis: 320,flexGrow:1 }}>
                                    <CardItem header>
                                        <Body>
                                            <Text onPress={() => this.countDown(product.id)}>{product.description}</Text>

                                        </Body>
{
    product.shelf ? (<Icon name="check" type="FontAwesome5"/>) : (<Button transparent onPress={() => this.shelf(product.id)}><Icon name="table" type="FontAwesome5"/></Button>)
}
                                        {
                                            this.state.isLocked || (
                                                <React.Fragment>

                                                    <TouchableHighlight>

                                                        <Icon name="edit" type="FontAwesome" onPress={() => this._edit(product.id)} />
                                                    </TouchableHighlight>
                                                    <TouchableHighlight>
                                                        <Icon name="close" type="FontAwesome" onPress={() => this._delete(product.id)} />
                                                    </TouchableHighlight>
                                                </React.Fragment>
                                            )
                                        }
                                        
                                    </CardItem>
                                    <CardItem cardBody>
                                        <Processing
                                            mode={product.mode}
                                            seconds={product.seconds}
                                            id={product.id}
                                            countDown={this.countDown}
                                            stopCountDown={this.stopCountDown}
                                            stopCountUp={this.stopCountUp}
                                            processingDate={product.processing_date}
                                            imageUri={"data:image/jpeg;base64," + product.picture}
                                        />
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
