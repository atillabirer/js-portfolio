import React,{Component} from "react";
import AsyncStorage from '@react-native-community/async-storage';
import { Text, Title,Content,Container,Header,Body, Button,Form,Item,Input } from "native-base";



const networkUrl = "http://5.249.144.235:3000";


export default class CreateBusinessScreen extends Component {
    //make a request to create a business using JWT
    //and go back to the business list screen
    static navigationOptions = {
        title: "Edit Business",
        headerStyle: {backgroundColor:"#3F51B5",color:"white"},
        headerTitleStyle: {color:"white"},
        headerTintColor: '#ffffff'
    }
    constructor(props) {
        super(props)
        this.state = {name:"",address:"",jwt:"",businessId:0}

    }
    componentDidMount() {
        //fetch JWT
        AsyncStorage.getItem("jwt").then((jwt) => {
            this.setState({jwt})
            //set the state to the business props
            fetch(networkUrl + "/business/" + this.props.navigation.getParam("businessId"),
            {
                headers: {
                    Authorization:`Bearer ${this.state.jwt}`
                }
            })
            .then((response) => response.json())
            .then((json) => this.setState({businessId:json.id,name:json.name,address:json.address}))
            .catch((error) => {
                alert(error)
            })
        })

    }

    save = () => {
        //save the object and navigate back to the business screen
        if(this.state.name && this.state.address) {
            fetch(networkUrl + "/business/update/" + this.props.navigation.getParam("businessId"),{
                method:"POST",
                headers: {
                    "Authorization": `Bearer ${this.state.jwt}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name:this.state.name,address:this.state.address})
            }).then((response) => {
                
                response.json()}).then((json) => {
                this.props.navigation.push('Business')
              console.log(json)
            }).catch((error) => {
             alert(error)
            })
        } else {
            alert("Missing parameters.")
        }
    }

    render() {
        return(
            <Container>
                <Content>
                    <Form>
                        <Item>
                            <Input placeholder="Business name" onChangeText={(value) => this.setState({name:value})} value={this.state.name}/>
                        </Item>

                        <Item last>
                            <Input placeholder="Address" onChangeText={(value) => this.setState({address:value})} value={this.state.address}/>
                        </Item>
                        <Button block onPress={this.save}>
                            <Text>Save</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        )
    }
 }