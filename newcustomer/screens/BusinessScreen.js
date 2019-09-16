
import React from "react";
import { FlatList,Alert } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { Text, View, Button, Icon, Container, Header, Content, ListItem, List, Left, Body, Title, Right, StyleProvider } from "native-base";
import getTheme from "../native-base-theme/components";
import {withNavigation} from "react-navigation";


const networkUrl = "http://5.249.144.235:3000";

class BusinessHeader extends React.Component {

    constructor(props) {
        super(props)
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

    static navigationOptions = {
        title: "Businesses",
        tabBarIcon: ({tintColor}) => (<Icon name="home" type="FontAwesome"/>),
        headerStyle: { backgroundColor: "#3F51B5", color: "white" },
        headerTintColor: '#ffffff'
    }

  
    componentDidMount() {
        AsyncStorage.setItem("jwt","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTY2ODMwMjEyfQ.U9wyH9mrSrQZpyR1GW3Hl7FfGvQpnPWnVIKT6eeEQY8")
        .then(() => {

            AsyncStorage.getItem("jwt").then((jwt) => {
                this.setState({ jwt })
                //get a list of businesses and put em into state
                fetch(networkUrl + "/business/all", {
                    headers: {
                        "Authorization": "Bearer " + jwt
                    }
                }).then((response) => response.json()).then((businesses) => this.setState({ businesses }))
            }).catch((error) => {
                alert(error)
            })
        })
    }


      static navigationOptions = {
        title: "Businesses",
        headerTitle: withNavigation(BusinessHeader)
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


    toProductsScreen = (businessId) => {
        //switch to the product list screen
        this.props.navigation.navigate('Products', { businessId })
    }


    render() {

        const businesses = this.state.businesses.map((business) => {
            return (<ListItem key={business.id} onPress={() => this.toProductsScreen(business.id)}>
                <Body>
                    <Text>{business.name}</Text>
                </Body>
                <Left>

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