import "react-native-gesture-handler";
import React, { Component, useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-community/async-storage";

import { Button, ThemeProvider } from "react-native-elements";
import { StyleSheet, View, Alert } from "react-native";
import FirstScreen from "./screens/firstScreen";
import IpScreen from "./screens/ipAddress";
import HomeScreen from "./screens/homeScreen";
import RfidScreen from "./screens/rfidScreen";
import AddRfid from "./screens/addRfid";
import Settings from "./screens/settings";

const HomeStack = createStackNavigator();

function HomeStacked() {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerTitleStyle: { color: "#004078", fontSize: 30 } }}
    >
      <HomeStack.Screen
        name="Home"
        options={{ title: "Home", headerLeft: null }}
        component={HomeScreen}
      />
    </HomeStack.Navigator>
  );
}

const RfidStack = createStackNavigator();

function RfidStacked() {
  return (
    <RfidStack.Navigator
      screenOptions={{ headerTitleStyle: { color: "#004078", fontSize: 30 } }}
    >
      <RfidStack.Screen
        name="ListRfid"
        options={{ title: "RFID", headerLeft: null }}
        component={RfidScreen}
      />
      <RfidStack.Screen
        name="AddRfid"
        component={AddRfid}
        options={{ title: "Add RFID" }}
      />
    </RfidStack.Navigator>
  );
}
const SettingsStack = createStackNavigator();

function SettingsStacked() {
  return (
    <SettingsStack.Navigator
      screenOptions={{ headerTitleStyle: { color: "#004078", fontSize: 30 } }}
    >
      <SettingsStack.Screen
        name="Settings"
        options={{ title: "Settings", headerLeft: null }}
        component={Settings}
      />
    </SettingsStack.Navigator>
  );
}
const Drawer = createDrawerNavigator();

class ActualApp extends Component {
  render() {
    return (
      <Drawer.Navigator initialRouteName="HomeStacked">
        <Drawer.Screen
          name="HomeStacked"
          options={{ title: "Home" }}
          component={HomeStacked}
        />

        <Drawer.Screen name="Rfid" component={RfidStacked} />
        <Drawer.Screen
          name="SettingsStacked"
          alterTheme={this.props.alterTheme}
          options={{ title: "Settings" }}
          component={SettingsStacked}
        />
      </Drawer.Navigator>
    );
  }
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Solid Button" />
    </View>
  );
}
const Stack = createStackNavigator();

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dark: false,
    };
  }

  alterTheme = () => {
    if (this.state.dark) {
      this.setState({ dark: false });
    } else {
      this.setState({ dark: true });
    }
  };

  async componentDidMount() {
    try {
      const value = await AsyncStorage.getItem("theme");
      if (value !== null) {
        if (value == "true") {
          this.setState({ dark: value });
        }
      } else {
        console.log("sjsadjn nbsan");
      }
    } catch (e) {
      // error reading value
    }
    return messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        "Notifcation!",
        JSON.stringify(remoteMessage.notification.title)
      );
    });
  }
  render() {
    return (
      <ThemeProvider useDark={this.state.dark}>
        <SafeAreaProvider>
          <NavigationContainer
            theme={
              this.state.darak
                ? {
                    colors: { ...DefaultTheme.colors, background: "#1f1b24" },
                  }
                : {
                    colors: { ...DefaultTheme.colors },
                  }
            }
          >
            <Stack.Navigator>
              <Stack.Screen
                name="FirstScreen"
                component={FirstScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="IpScreen"
                options={{ headerShown: false }}
                component={IpScreen}
              />

              <Stack.Screen
                name="ActualApp"
                options={{ headerShown: false }}
                component={ActualApp}
                alterTheme={this.alterTheme}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default App;
