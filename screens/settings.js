import React from "react";
import { View, StyleSheet, SafeAreaView, Image, Alert } from "react-native";
import { Card, ListItem, Button, Switch, Text } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

export default class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tagName: "",
      gateStatus: true,
      rfids: [],
      deviceName: "",
      dark: false,
      ipAddress: "",
      loading: false,
      tagNumber: "",
    };
  }
  async componentDidMount() {
    /*   const value = await AsyncStorage.getItem("@key");
    const newValue = JSON.parse(value);
    this.setState({
      deviceName: newValue.deviceName,
      ipAddress: newValue.ipAddress,
    }); */
    try {
      const value = await AsyncStorage.getItem("theme");
      if (value !== null) {
        if (value == "true") {
          this.setState({ dark: true });
        }
      } else {
        console.log("sjsadjn nbsan");
      }
    } catch (e) {
      // error reading value
    }
  }

  setTheme = async (value) => {
    try {
      await AsyncStorage.setItem("theme", String(value));
      console.log("ajsjdjsbhb hasbdh");
      this.setState({ dark: value });
    } catch (e) {
      console.log(e);
      // saving error
    }
  };
  removeItem = async () => {
    console.log("asdsa");
    await AsyncStorage.removeItem("@key");
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: "FirstScreen" }],
    });
  };
  render() {
    return (
      <View>
        <View style={{ justifyContent: "center", marginTop: 20 }}></View>

        <Card>
          <View>
            <Button
              title="Reset App"
              buttonStyle={{ backgroundColor: "#dc3545" }}
              icon={<Icon name="retweet" size={15} color="white" />}
              onPress={() => {
                Alert.alert(
                  "Are you sure you want to reset the app?",
                  "Continuing will reset the app. Please proceed with caution.",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    { text: "OK", onPress: () => this.removeItem() },
                  ]
                );
              }}
            />
          </View>
          <View style={{ padding: 20, flexDirection: "column" }}>
            <View style={{ flex: 1 }}>
              <Text> Dark Mode : </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Switch
                value={this.state.dark}
                onValueChange={(val) => this.setTheme(val)}
              />
            </View>
          </View>
        </Card>
      </View>
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
