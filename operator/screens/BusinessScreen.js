
import React from "react";
import { FlatList,Alert } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { Text, View, Button, Icon, Container, Header, Content, ListItem, List, Left, Body, Title, Right, StyleProvider } from "native-base";
import getTheme from "../native-base-theme/components";
import {withNavigation} from "react-navigation";


const networkUrl = "http://localhost";

class BusinessHeader extends React.Component {

    constructor(props) {
        super(props)
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
              {text: 'Log out', onPress: () => this.props.navigation.navigate('Auth')},
            ],
            {cancelable: false},
          );
    }
    
    render() {
      return (
          <Content>
              <Header>
                  <Left/>
                  <Body>
                      <Title>Businesses</Title>
                  </Body>
                  <Right>
                      <Button transparent onPress={() => this.props.navigation.push('CreateBusiness')}><Icon name="add"/></Button>
                      <Button transparent onPress={this.logOut}><Icon name="log-out"/></Button>
                  </Right>
              </Header>
          </Content>
      );
    }
  }


export default class BusinessScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = { jwt: "", businesses: [] }
    }
  
    componentDidMount() {
        AsyncStorage.getItem("jwt").then((jwt) => {
            this.setState({ jwt })
            //get a list of businesses and put em into state
            fetch(networkUrl + "/business", {
                headers: {
                    "Authorization": "Bearer " + jwt
                }
            }).then((response) => response.json()).then((businesses) => this.setState({ businesses }))
        }).catch((error) => {
            alert(error)
        })
    }


      static navigationOptions = {
        title: "Businesses",
        headerTitle: withNavigation(BusinessHeader),
        headerStyle: { backgroundColor: "#3F51B5", color: "white" },
        headerTintColor: '#ffffff'
    }

    getProducts = () => {
        fetch(networkUrl + "/business", {
            headers: {
                "Authorization": `Bearer ${this.state.jwt}`
            }
        }).then((response) => response.json()).then((businesses) => this.setState({ businesses })).catch((error) => {
            alert(error)
        })
    }

    deleteDialog = (id) => {
        // Works on both iOS and Android
        Alert.alert(
            'Confirmation',
            'Do you want to delete this business?',
            [
                { text: 'Yes', onPress: () => this.delete(id) },
                {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                }
            ],
            { cancelable: false },
        );

    }

    toProductsScreen = (businessId) => {
        //switch to the product list screen
        this.props.navigation.navigate('Products', { businessId })
    }

    delete = (id) => {

        if (this.state.jwt) {
            fetch(networkUrl + "/business/delete/" + id, {
                headers: {
                    "Authorization": `Bearer ${this.state.jwt}`
                }
            }).then((response) => response.json())
                .then((json) => {
                   
                    this.getProducts()

                }).catch((error) => {
                    alert(error)
                })

        }
    }


    render() {

        const businesses = this.state.businesses.map((business) => {
            return (<ListItem key={business.id} onPress={() => this.toProductsScreen(business.id)}>
                <Body>
                    <Text>{business.name}</Text>
                </Body>
                <Left>
                    <Button transparent onPress={() => this.props.navigation.navigate('EditBusiness', { businessId: business.id })}><Icon name="edit" type="FontAwesome"></Icon></Button>
                    <Button transparent onPress={() => this.deleteDialog(business.id)}><Icon name="trash" type="FontAwesome"></Icon></Button>

                </Left>
            </ListItem>)
        })
        return (
            <StyleProvider style={getTheme()}>
            <Container>
                <Content>
                    <List>
                        {businesses}
                    </List>
                </Content>
            </Container>
            </StyleProvider>
        );
    }

}
