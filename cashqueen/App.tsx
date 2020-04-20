import React from 'react';
import { StyleSheet, Text, View, Button, Image, Alert,Linking } from 'react-native';
import { createAppContainer } from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import WelcomeScreen from './screens/WelcomeScreen';
import PreviousMonthScreen from './screens/ThisMonthScreen';
import ModelDetailScreen from './screens/ModelDetailScreen';
import VotingScreen from './screens/VotingScreen';
import EnterContestScreen from "./screens/submitphoto/EnterContestScreen";
import StepOneScreen from './screens/submitphoto/StepOneScreen';
import StepTwoScreen from './screens/submitphoto/StepTwoScreen';
import { decode, encode } from 'base-64'
import StepThreeScreen from './screens/submitphoto/StepThreeScreen';
import StepFourScreen from './screens/submitphoto/StepFourScreen';
import DoneScreen from './screens/submitphoto/DoneScreen';
import ThisMonthScreen from "./screens/ThisMonthScreen"
import i18n from './i18n';
import { Translation, withTranslation, Trans } from "react-i18next";
import HowScreen from './screens/HowScreen';
import AboutScreen from './screens/AboutScreen';
import HeaderComponent from "./HeaderComponent"
import AsyncStorage from '@react-native-community/async-storage';
import colors from "./assets/styles/colors"
const alert = Alert.alert


const modelTabs = createMaterialTopTabNavigator({
  thisMonth: {
    screen: ThisMonthScreen,
    navigationOptions: {
      tabBarLabel: (<Translation>
        {
          (t, { i18n }) => <Text style={{ color: colors.lightBlue, fontFamily: "Montserrat-SemiBold" }}>{t("thisMonth")}</Text>
        }
      </Translation>)
    }
  },
  previousMonth: {
    screen: PreviousMonthScreen,
    navigationOptions: {
      tabBarLabel: (<Translation>
        {
          (t, { i18n }) => <Text style={{ color: colors.lightBlue, fontFamily: "Montserrat-SemiBold" }}>{t("previousMonth")}</Text>
        }
      </Translation>),
       tabBarOnPress: async ({ navigation, defaultHandler }) => {
        let unlock = await AsyncStorage.getItem("unlock")
        if (unlock) {
          defaultHandler()
        } else {
          Alert.alert("Restricted content",
            "Click Unlock to unlock this page (valid for 30 days or until you delete the app / clear your cookies).",
            [
              {text: "Cancel", onPress: () => console.log('Cancel Pressed'),style: 'cancel'},

              {text: "Unlock", onPress: async () => {
                let canOpen = await Linking.canOpenURL(`dash:XcXigBGNKZrdPSu5uL6FmvL1WnsBXnhRSi?amount=0.2`)
                if(canOpen) {
                  try {
                    await Linking.openURL(`dash:XnHamZFHhYbmR1NHEqNTqwfjzZsgA4EEvZ?amount=0.01`)
                  } catch(error) {
                    alert("You must install Dash Android or Dash iOS wallet.")
                  }
                } else {
                  alert("You must install Dash Android or Dash iOS wallet.")
                }
              }}
            ]
          )
        }
      }
    }
  },
  allTime: {
    screen: ThisMonthScreen,
    navigationOptions: {
      tabBarLabel: (<Translation>
        {
          (t, { i18n }) => <Text style={{ color: colors.lightBlue, fontFamily: "Montserrat-SemiBold" }}>{t("allTime")}</Text>
        }
      </Translation>),
      tabBarOnPress: async ({ navigation, defaultHandler }) => {
        let unlock = await AsyncStorage.getItem("unlock")
        if (unlock) {
          defaultHandler()
        } else {
          Alert.alert("Restricted content",
            "Click Unlock to unlock this page (valid for 30 days or until you delete the app / clear your cookies).",
            [
              {text: "Cancel", onPress: () => console.log('Cancel Pressed'),style: 'cancel'},

              {text: "Unlock", onPress: async () => {
                let canOpen = await Linking.canOpenURL(`bitcoincash:XnHamZFHhYbmR1NHEqNTqwfjzZsgA4EEvZ?amount=0.01`)
                if(canOpen) {
                  try {
                    await Linking.openURL(`bitcoincash:XnHamZFHhYbmR1NHEqNTqwfjzZsgA4EEvZ?amount=0.01`)
                  } catch(error) {
                    alert("You must install Dash Android or Dash iOS wallet.")
                  }
                } else {
                  alert("You must install Dash Android or Dash iOS wallet.")
                }
              }}
            ]
          )
        }
      }
    }
  },
  submitPhoto: {
    screen: () => <View></View>,
    navigationOptions: {
      tabBarLabel: (<Translation>
        {
          (t, { i18n }) => <Text style={{ color: colors.lightBlue, fontFamily: "Montserrat-SemiBold" }}>{t("submitPhoto")}</Text>
        }
      </Translation>),
      tabBarOnPress: ({ navigation }) => {
        navigation.navigate("enterContest")
      }
    }
  }

}, {
  "initialRouteName": "thisMonth",
  tabBarOptions: {
    style: {
      backgroundColor: "#FFFFFF",
    },
    indicatorStyle: {
      backgroundColor: "#FFF"
    }
  }
})

const appStack = createStackNavigator({
  welcome: {
    screen: WelcomeScreen,
    navigationOptions: ({ navigation }) => {
      return { headerStyle: { backgroundColor: colors.lightBlue, border: 0 }, header: null }
    }
  },
  tabs: {
    screen: modelTabs,
    navigationOptions: {
      header: (props) => <HeaderComponent />
    }
  },
  detail: {
    screen: ModelDetailScreen,
    navigationOptions: ({ navigation }) => {
      return {
        title: navigation.state.params.model.name,
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: colors.lightBlue
        },
        headerTitleStyle: {
          fontFamily: "Montserrat-MediumItalic",
          padding: 5,
          color: "white"
        },
        headerRight: <Text style={{
          fontFamily: "Montserrat-MediumItalic",
          fontWeight: "bold",
          padding: 10,
          fontSize: 16,
          color: "white"
        }}>#{navigation.state.params.rank}</Text>
      }
    }
  },
  voting: {
    screen: VotingScreen,
    navigationOptions: ({ navigation }) => {
      return {
        title: "Bitcoin Cash Voting",
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: colors.lightBlue
        },
        headerTitleStyle: {
          fontFamily: "Montserrat-MediumItalic",
          padding: 5,
          color: "white"
        },
      }
    }
  },
  enterContest: {
    screen: EnterContestScreen,
    navigationOptions: () => {
      return {
        title: i18n.t("enterContest"),
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: colors.lightBlue
        },
        headerTitleStyle: {
          fontFamily: "Montserrat-MediumItalic",
          padding: 5,
          color: "white"
        }
      }
    }
  },
  stepOne: {
    screen: StepOneScreen,
    navigationOptions: () => {
      return {
        title: i18n.t("enterContest"),
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: colors.lightBlue
        },
        headerTitleStyle: {
          fontFamily: "Montserrat-MediumItalic",
          padding: 5,
          color: "white"
        },
        headerRight: <Text style={{
          fontFamily: "Montserrat-MediumItalic",
          fontWeight: "bold",
          padding: 10,
          fontSize: 16,
          color: "white"
        }}>{i18n.t("step1")}</Text>
      }
    }
  },
  stepTwo: {
    screen: StepTwoScreen,
    navigationOptions: () => {
      return {
        title: i18n.t("enterContest"),
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: colors.lightBlue
        },
        headerTitleStyle: {
          fontFamily: "Montserrat-MediumItalic",
          padding: 5,
          color: "white"
        },
        headerRight: <Text style={{
          fontFamily: "Montserrat-MediumItalic",

          padding: 10,
          fontSize: 16,
          color: "white"
        }}>{i18n.t("step2")}</Text>
      }
    }
  },
  stepThree: {
    screen: StepThreeScreen,
    navigationOptions: () => {
      return {
        title: i18n.t("enterContest"),
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: colors.lightBlue
        },
        headerTitleStyle: {
          fontFamily: "Montserrat-Regular",
          padding: 5,
          color: "white"
        },
        headerRight: <Text style={{
          fontFamily: "Montserrat-MediumItalic",
          padding: 10,
          fontSize: 16,
          color: "white"
        }}>{i18n.t("step3")}</Text>
      }
    }
  },
  stepFour: {
    screen: StepFourScreen,
    navigationOptions: () => {
      return {
        title: i18n.t("enterContest"),
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: colors.lightBlue
        },
        headerTitleStyle: {
          fontFamily: "Montserrat-Regular",
          padding: 5,
          color: "white"
        },
        headerRight: <Text style={{
          fontFamily: "Montserrat-MediumItalic",
          padding: 10,
          fontSize: 16,
          color: "white"
        }}>{i18n.t("step4")}</Text>
      }
    }
  },
  done: {
    screen: DoneScreen,
    navigationOptions: () => {
      return {
        title: i18n.t("done"),
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: colors.lightBlue
        },
        header: null
      }
    }
  },
  howItWorks: {
    screen: AboutScreen,
    navigationOptions: ({ navigation }) => {
      return {
        title: i18n.t("howItWorks"),
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: colors.lightBlue
        }

      }
    }
  },
  howToUse: {
    screen: HowScreen,
    navigationOptions: ({ navigation }) => {
      return {
        title: i18n.t("howToUse"),
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: colors.lightBlue,
        }

      }

    }
  }
}, {
  initialRouteName: "welcome"
})


export default createAppContainer(appStack)

