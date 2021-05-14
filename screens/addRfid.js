import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { Card, ListItem, Button, Icon, Input } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";

import { Formik } from "formik";
import * as yup from "yup";

const setupValidationSchema = yup.object().shape({
  tagName: yup.string().required("Tag Name is Required"),
  tagNumber: yup
    .number("Please correct format")
    .required("Tag number is required"),
  tagNumber2: yup
    .number()
    .oneOf([yup.ref("tagNumber"), null], "Tag Number must match")
    .required("Confirm Tag Number"),
});
export default class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tagName: "",
      gateStatus: true,
      rfids: [],
      deviceName: "",

      ipAddress: "",
      loading: false,
      tagNumber: "",
    };
  }
  async componentDidMount() {
    const value = await AsyncStorage.getItem("@key");
    const newValue = JSON.parse(value);
    this.setState({
      deviceName: newValue.deviceName,
      ipAddress: newValue.ipAddress,
    });
  }
  render() {
    return (
      <View>
        <View style={{ justifyContent: "center", marginTop: 20 }}></View>

        <Card>
          <View>
            <Formik
              initialValues={{ tagNumber: "", tagName: "", tagNumber2: "" }}
              validationSchema={setupValidationSchema}
              onSubmit={async (values, setFieldError) => {
                this.setState({ loading: true });

                axios
                  .post("http://" + this.state.ipAddress + ":3000/v1/rfid", {
                    name: values.tagName,
                    tagId: values.tagNumber,
                  })
                  .then((response) => {
                    console.log(response);
                    this.setState({ loading: false });
                  })
                  .catch((error) => {
                    this.setState({ loading: false });
                    console.log(error.response);
                    Alert.alert("An error occured", "Please try again", [
                      {
                        text: "OK",
                        onPress: () => console.log("OK Pressed"),
                      },
                    ]);
                  });
              }}
            >
              {({
                handleChange,
                handleBlur,
                setFieldError,
                handleSubmit,
                values,
                errors,
                isValid,
              }) => (
                <>
                  <Input
                    placeholder="Eg. Mittens"
                    label="Name the RFID Tag"
                    name="tagName"
                    onChangeText={handleChange("tagName")}
                    onBlur={handleBlur("tagName")}
                    errorMessage={errors.tagName}
                    value={values.tagName}
                  />
                  <Input
                    label="RFID Number"
                    name="tagNumber"
                    onChangeText={handleChange("tagNumber")}
                    onBlur={handleBlur("tagNumber")}
                    errorMessage={errors.tagNumber}
                    secureTextEntry
                    value={values.tagNumber}
                  />
                  <Input
                    label="Confirm RFID Number"
                    name="tagNumber2"
                    onChangeText={handleChange("tagNumber2")}
                    onBlur={handleBlur("tagNumber2")}
                    errorMessage={errors.tagNumber2}
                    value={values.tagNumber2}
                  />
                  <Button
                    title="Proceed"
                    titleStyle={styles.title}
                    onPress={handleSubmit}
                    raised
                    loading={this.state.loading}
                    disabled={!isValid || this.state.loading}
                  />
                </>
              )}
            </Formik>
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
