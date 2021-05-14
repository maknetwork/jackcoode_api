import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

export default class FirstScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tagName: "",
      gateStatus: true,
      rfids: [],
      deviceName: "",
      isLogged: false,
      ipAddress: "",
      loading: false,
      tagNumber: "",
    };
  }
  componentDidMount() {
    this._retrieveData();
  }
  _retrieveData = async () => {
    const value = await AsyncStorage.getItem("@key");
    if (value !== null) {
      this.setState({
        isLogged: value,
      });
      this.props.navigation.navigate("ActualApp");
    } else {
      this.props.navigation.navigate("IpScreen");
    }
  };
  render() {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#000" />
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
