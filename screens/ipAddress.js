import React from "react";
import { View, StyleSheet, SafeAreaView, Image, Alert } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import messaging from "@react-native-firebase/messaging";

import { Formik } from "formik";
import * as yup from "yup";
const setupValidationSchema = yup.object().shape({
  deviceName: yup.string().required("Device name is Required"),
  ipAddress: yup.string().required("IP Address is required"),
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  tinyLogo: {
    width: 95,
    height: 95,
  },
  title: {
    fontSize: 20,
  },
  logo: {
    width: 66,
    height: 58,
  },
});
export default class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      devices: [],
      device: [],
      enable: false,
    };
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",

          justifyContent: "center",
        }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text h1>Device Setup</Text>
        </View>
        <Formik
          initialValues={{ ipAddress: "", deviceName: "" }}
          validationSchema={setupValidationSchema}
          onSubmit={async (values) => {
            console.log(values);
            const jsonValue = JSON.stringify(values);
            await AsyncStorage.setItem("@key", jsonValue);
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
              console.log("The fcm token is ", fcmToken);
              axios
                .post("http://" + values.ipAddress + ":3000/v1/extra", {
                  deviceToken: fcmToken,
                })
                .then(
                  (response) => {
                    console.log(response.data);
                  },
                  (error) => {
                    console.log(error);
                  }
                );
            } else {
              console.log("no Token");
              // user doesn't have a device token yet
            }

            this.props.navigation.reset({
              index: 0,
              routes: [{ name: "FirstScreen" }],
            });
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            isValid,
          }) => (
            <>
              <Input
                placeholder="Eg. CAT PI"
                label="Name the device"
                name="deviceName"
                onChangeText={handleChange("deviceName")}
                onBlur={handleBlur("deviceName")}
                errorMessage={errors.deviceName}
                value={values.deviceName}
              />
              <Input
                placeholder="Eg. 192.168.1.4"
                label="IP ADDRESS"
                name="ipAddress"
                onChangeText={handleChange("ipAddress")}
                onBlur={handleBlur("ipAddress")}
                errorMessage={errors.ipAddress}
                value={values.ipAddress}
              />
              <Button
                title="Proceed"
                titleStyle={styles.title}
                onPress={handleSubmit}
                raised
                disabled={!isValid}
              />
            </>
          )}
        </Formik>
      </View>
    );
  }
}
