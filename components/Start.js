import React, { Component } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity
} from "react-native";

export default class ChatApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      color: ""
    };
  }

  render() {
    return (
      <ImageBackground
        source={require("../assets/backgroundImage.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.appTitleContainer}>
          <Text style={styles.appTitle}>ChatApp</Text>
        </View>
        <View style={styles.settingsContainer}>
          <View style={styles.nameInputContainer}>
            {/* Sets the name to be passed to the chat screen title */}
            <TextInput
              style={styles.nameInput}
              placeholder="   Your Name"
              onChangeText={name => this.setState({ name })}
              value={this.state.name}
            />
          </View>
          <View style={styles.chooseBgContainer}>
            <Text style={styles.chooseBgText}>Choose Background Color</Text>
            <View style={styles.chooseBgItemContainer}>
              {/* Sets the color to be used as background on the chat screen */}
              <TouchableOpacity
                onPress={() => this.setState({ color: "#090C08" })}
                style={[styles.chooseBgItem, styles.chooseBgItemColor1]}
              />
              <TouchableOpacity
                onPress={() => this.setState({ color: "#474056" })}
                style={[styles.chooseBgItem, styles.chooseBgItemColor2]}
              />
              <TouchableOpacity
                onPress={() => this.setState({ color: "#8A95A5" })}
                style={[styles.chooseBgItem, styles.chooseBgItemColor3]}
              />
              <TouchableOpacity
                onPress={() => this.setState({ color: "#B9C6AE" })}
                style={[styles.chooseBgItem, styles.chooseBgItemColor4]}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {/* Navigates to chat screen with current name and selcted background color. I used touchableOpacity rather than button to add more customization */}
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                  color: this.state.color
                })
              }
              style={styles.button}
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
//Styles

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    height: "100%"
  },

  appTitleContainer: {
    width: "100%",
    minHeight: "46%",
    alignItems: "center",
    marginTop: "10%"
  },

  appTitle: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#FFFFFF"
  },

  settingsContainer: {
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: "column",
    width: "88%",
    minHeight: "44%",
    maxHeight: "44%",

    alignItems: "center",

    justifyContent: "space-around",
    paddingHorizontal: "6%"
  },

  nameInputContainer: {
    height: "33%",
    width: "100%",
    justifyContent: "flex-start"
  },

  nameInput: {
    borderColor: "#757083",
    borderWidth: 2,
    height: 60,
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    marginTop: "6%"
  },

  chooseBgContainer: {
    height: "33%",
    width: "100%",
    justifyContent: "center"
  },

  chooseBgText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083"
  },
  chooseBgItemContainer: {
    flex: 4,
    flexDirection: "row",
    paddingVertical: 10
  },
  chooseBgItem: {
    height: 45,
    width: 45,
    borderRadius: 70,

    marginRight: 20
  },

  chooseBgItemColor1: {
    backgroundColor: "#090C08"
  },

  chooseBgItemColor2: {
    backgroundColor: "#474056"
  },
  chooseBgItemColor3: {
    backgroundColor: "#8A95A5"
  },
  chooseBgItemColor4: {
    backgroundColor: "#B9C6AE"
  },

  buttonContainer: {
    height: "33%",
    width: "100%",
    justifyContent: "flex-end",
    marginBottom: "6%"
  },

  button: {
    backgroundColor: "#757083",
    height: 60
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    textAlignVertical: "center",
    height: "100%"
  }
});
