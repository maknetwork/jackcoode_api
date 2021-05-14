import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import {
  Card,
  ListItem,
  Button,
  Text,
  Icon,
  Chip,
  withBadge,
} from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import messaging from "@react-native-firebase/messaging";

export default class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deviceName: "",
      gateStatus: true,
      rfids: [],
      ipAddress: "",
    };
  }

  async componentDidMount() {
    const token = await messaging().sendMessage({ message: "RemoteMessage" });
    console.log(token);
    const value = await AsyncStorage.getItem("@key");
    const newValue = JSON.parse(value);
    this.setState({
      deviceName: newValue.deviceName,
      ipAddress: newValue.ipAddress,
    });

    const response = await axios.get(
      "http://" + newValue.ipAddress + ":3000/v1/rfid/"
    );
    this.setState({ rfids: response.data.results });
  }
  checkAgain = async () => {
    const response = await axios.get(
      "http://" + this.state.ipAddress + ":3000/v1/rfid/"
    );
    this.setState({ rfids: response.data.results });
  };
  deleteRfid = async (id) => {
    await axios
      .delete("http://" + this.state.ipAddress + ":3000/v1/rfid/" + id)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    this.checkAgain();
  };

  render() {
    return (
      <View>
        <View style={{ justifyContent: "center" }}></View>

        <Card>
          <View>
            <View style={{ justifyContent: "center" }}>
              <Text h3> New RFID Tag</Text>

              <Icon
                raised
                name="plus"
                onPress={() => this.props.navigation.navigate("AddRfid")}
                type="font-awesome"
                containerStyle={{
                  position: "absolute",
                  right: -4,
                }}
              ></Icon>
            </View>
          </View>
        </Card>
        <ScrollView style={{ padding: 10 }}>
          {this.state.rfids.map((u, i) => {
            return (
              <Card key={i} containerStyle={{ borderRadius: 10 }}>
                <View key={i}>
                  <View style={{ justifyContent: "center" }}>
                    <Text h4 style={{ color: "#7f8c8d" }}>
                      {" "}
                      {u.name}
                    </Text>
                    <Button
                      icon={<Icon name="delete" size={15} color="#fff" />}
                      containerStyle={{
                        position: "absolute",
                        right: -4,
                        color: "red",
                      }}
                      key={i}
                      onPress={() =>
                        Alert.alert(
                          "Are you sure you want to delete RFID named " +
                            u.name +
                            " ?",
                          "Click ok to proceed and cancel to cancel",
                          [
                            {
                              text: "Cancel",
                              onPress: () => console.log("Cancel Pressed"),
                              style: "cancel",
                            },
                            {
                              text: "OK",
                              onPress: () => this.deleteRfid(u.tagId),
                            },
                          ]
                        )
                      }
                      buttonStyle={{
                        borderRadius: 30,
                        backgroundColor: "red",
                      }}
                    />
                  </View>
                  <View style={{ paddingTop: 5 }}>
                    <Chip
                      title={u.tagId}
                      type="outline"
                      buttonStyle={{ borderRadius: 5 }}
                    />
                  </View>
                </View>
              </Card>
            );
          })}
          {/*  <View>
            <View style={{ justifyContent: "center" }}>
              <Text style={{ fontSize: 40 }}> {this.state.deviceName}</Text>
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
                onValueChange={(value) => this.toggleSwitch(value)}
                style={{ transform: [{ scaleX: 3 }, { scaleY: 3 }] }}
              />
            </View>
          </View> */}
        </ScrollView>
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
