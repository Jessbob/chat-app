import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";

const firebase = require("firebase");

export default class CustomActions extends React.Component {
  constructor() {
    super();
  }
  // Allow access to image library after asking permission
  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images"
      }).catch(error => console.log(error));
      if (!result.cancelled) {
        const imageUrl = await this.uploadImageFetch(result.uri);
        this.props.onSend({ image: imageUrl });
      }
    }
  };
  // Allow access to camera after asking for permission
  takePhoto = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL,
      Permissions.CAMERA
    );

    if (status === "granted") {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: "Images"
      }).catch(error => console.log(error));
      if (!result.cancelled) {
        const imageUrl = await this.uploadImageFetch(result.uri);
        this.props.onSend({ image: imageUrl });
      }
    }
  };
  // Allow access to geo location after asking permission
  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === "granted") {
      let result = await Location.getCurrentPositionAsync({});

      if (result) {
        this.props.onSend({
          location: {
            longitude: result.coords.longitude,
            latitude: result.coords.latitude
          }
        });
      }
    }
  };

  // Blob and fetch working to convert and upload images as blobs
  uploadImageFetch = async uri => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase
      .storage()
      .ref()
      .child("my-image");
    const snapshot = await ref.put(blob);
    return await snapshot.ref.getDownloadURL();
  };
  // Button and list to access the extra options
  onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel"
    ];
    const cancelButtonText = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonText
      },
      async buttonIndex => {
        switch (buttonIndex) {
          case 0:
            console.log("user wants to pick an image");
            return this.pickImage();
          case 1:
            console.log("user wants to take a photo");
            return this.takePhoto();
          case 2:
            console.log("user wants to get their location");
            return this.getLocation();
          default:
        }
      }
    );
  };

  render() {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="More Options"
        accessibilityHint="Lets you choose to send an image or your location."
        accessibilityRole="button"
        style={[styles.container]}
        onPress={this.onActionPress}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconText]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10
  },

  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2
  },

  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center"
  }
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func
};
