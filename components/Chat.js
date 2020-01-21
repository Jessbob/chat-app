import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

export default class Chat extends React.Component {
  state = {
    messages: []
  };

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any"
          }
        }
      ]
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  // Changes title to the name entered on the start screen
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
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{ _id: 1 }}
          />
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
