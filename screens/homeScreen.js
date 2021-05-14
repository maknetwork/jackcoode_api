import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import {
  Card,
  Icon,
  Chip,
  Text,
  Avatar,
  Button,
  Badge,
  Switch,
  withBadge,
} from "react-native-elements";
import axios from "axios";
import moment from "moment";
import messaging from "@react-native-firebase/messaging";

import AsyncStorage from "@react-native-community/async-storage";

export default class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deviceName: "",
      gateStatus: true,
      ipAddress: "",
      rfids: [],
    };
  }

  async componentDidMount() {
    const value = await AsyncStorage.getItem("@key");
    const newValue = JSON.parse(value);
    this.setState({
      deviceName: newValue.deviceName,
      ipAddress: newValue.ipAddress,
    });
    try {
      const resp = await axios.get("http://" + newValue.ipAddress + ":5000/");
      console.log(resp.data);
      if (resp.data == "closed") {
        console.log("asdsadsadsda");
        this.setState({ gateStatus: false });
      } else {
        this.setState({ gateStatus: true });
      }
    } catch {
      console.log("hehas");
    }
    try {
      const resp = await axios.get(
        "http://" + newValue.ipAddress + ":3000/v1/rfid/?sortBy=updated_at:desc"
      );
      console.log(resp.data.results);
      this.setState({ rfids: resp.data.results });
    } catch {
      console.log("hehas");
    }

    this.timer = setInterval(async () => {
      try {
        const response = await axios.get(
          "http://" +
            newValue.ipAddress +
            ":3000/v1/rfid/?sortBy=updated_at:desc"
        );
        console.log(response.data.results);
        this.setState({ rfids: response.data.results });
      } catch {
        console.log("An error occured");
      }
    }, 5000);
    this.timer2 = setInterval(async () => {
      try {
        const resp = await axios.get("http://" + newValue.ipAddress + ":5000/");
        console.log(resp.data);
        if (resp.data == "closed") {
          console.log("asdsadsadsda");
          this.setState({ gateStatus: false });
        } else {
          this.setState({ gateStatus: true });
        }
      } catch {
        console.log("hehas");
      }
    }, 5000);
  }
  stopTimer = () => {
    console.log("stoooop");
    clearInterval(this.timer);
    clearInterval(this.timer2);
  };
  getToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
    } else {
      console.log("no Token");
      // user doesn't have a device token yet
    }
  };
  componentWillUnmount() {
    this.stopTimer();
  }

  /* 
  async UNSAFE_componentWillMount() {
    const value = await AsyncStorage.getItem("@key");
    const newValue = JSON.parse(value);

    const url = "http://" + newValue.ipAddress + ":5000/";
    console.log(url);

    setTimeout(async () => {
      let response = await fetch(url);
      const status = await response.text();
      if (status == "closed") {
        this.setState({ gateStatus: false });
      } else {
        this.setState({ gateStatus: true });
      }
    }, 1000);
  } */
  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  ConvertDate(str) {
    return moment(str).fromNow();
  }

  toggleSwitch = async (value) => {
    console.log("values is " + value);
    const ip = this.state.ipAddress;
    console.log("ip si s" + ip);
    if (value) {
      this.setState({ gateStatus: true });

      try {
        let response = await fetch("http://" + ip + ":5000/stepperRotateOpen");

        const status = await response.text();
        console.log(status);
      } catch {
        Alert("An error occured");
        this.setState({ gateStatus: false });
      }
    } else {
      this.setState({ gateStatus: false });
      try {
        let response = await fetch("http://" + ip + ":5000/stepperRotateClose");
        const status = await response.text();
      } catch {
        Alert("Device seems to be offline");
        this.setState({ gateStatus: true });
      }
    }
  };

  render() {
    return (
      <ScrollView>
        <View>
          <Card containerStyle={{ borderRadius: 10 }}>
            <View>
              <View style={{ justifyContent: "center" }}>
                <Text h1>{this.state.deviceName}</Text>
                <Badge
                  status="success"
                  value={
                    <Text
                      style={{ fontWeight: "bold", padding: 10, color: "#000" }}
                    >
                      Online
                    </Text>
                  }
                  containerStyle={{ position: "absolute", right: -4 }}
                />
              </View>
              <Card.Divider />
              <View style={{ alignItems: "center", padding: 40 }}>
                <Switch
                  value={this.state.gateStatus}
                  style={{ transform: [{ scaleX: 4 }, { scaleY: 4 }] }}
                  onValueChange={(val) => this.toggleSwitch(val)}
                />
              </View>
              <View>
                <Button
                  title="Entry Only "
                  onPress={() => this.getToken()}
                  containerStyle={{ paddingLeft: 40, paddingRight: 40 }}
                />
              </View>
            </View>
          </Card>
          <View style={{ padding: 10 }}>
            {this.state.rfids.map((u, i) => {
              return (
                <Card key={i} containerStyle={{ borderRadius: 10 }}>
                  <View key={i}>
                    <View style={{ justifyContent: "center" }}>
                      <Text h4 style={{ color: "#7f8c8d" }}>
                        {this.Capitalize(u.name)}
                      </Text>

                      <Chip
                        title={u.catInside ? "Inside" : "outside"}
                        containerStyle={{
                          position: "absolute",
                          right: -4,
                          color: "#511281",
                          borderRadius: 5,
                        }}
                        icon={
                          u.catInside
                            ? {
                                name: "sign-in",
                                type: "font-awesome",
                                size: 20,
                                color: "#44bd32",
                              }
                            : {
                                name: "sign-out",
                                type: "font-awesome",
                                size: 20,
                                color: "rgba(255, 0, 0, 0.9)",
                              }
                        }
                        titleStyle={
                          u.catInside
                            ? {
                                color: "#44bd32",
                              }
                            : {
                                color: "rgba(255, 0, 0, 0.9)",
                              }
                        }
                        buttonStyle={
                          u.catInside
                            ? {
                                backgroundColor: "rgba(0, 255, 0, 0.2)",
                                borderRadius: 5,
                              }
                            : {
                                backgroundColor: "rgba(255, 0, 0, 0.2)",
                                borderRadius: 5,
                              }
                        }
                      />
                    </View>
                    <View>
                      <Text>{this.ConvertDate(u.updated_at)}</Text>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
