import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

// Changes title to the name entered on the start screen
export default class Chat extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };

  render() {
    return (
      <View style={styles.container}>
        {/* Sets the background color chosen on start screen */}
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: this.props.navigation.state.params.color
          }}
        >
          <Text style={{ color: "#FFFFFF" }}>This is your chat screen</Text>
        </View>
      </View>
    );
  }
}
// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
