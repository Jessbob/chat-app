import React, { Component } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";
import firebase from "firebase";
import "firebase/firestore";

export default class Chat extends React.Component {
  constructor() {
    super();

    // Initalize firebase and connect to messages collection
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyB0xUZLd1wcF77NsUV63REDHSPUlig5isA",
        authDomain: "chat-8996f.firebaseapp.com",
        databaseURL: "https://chat-8996f.firebaseio.com",
        projectId: "chat-8996f",
        storageBucket: "chat-8996f.appspot.com",
        messagingSenderId: "981157758065",
        appId: "1:981157758065:web:7572bf50e8960c028147d0",
        measurementId: "G-BS0Z0F8EGJ"
      });
    }

    this.referenceMessageUser = null;
    this.referenceMessages = firebase.firestore().collection("messages");

    this.state = {
      messages: [],
      uid: 0
    };
  }

  //   Add system message and mock message data to start OLD MOCK DATA
  // componentDidMount() {
  //   this.setState({
  //     messages: [
  //       {
  //         _id: 1,
  //         text: "Hello developer",
  //         createdAt: new Date(),
  //         user: {
  //           _id: 2,
  //           name: "React Native",
  //           avatar: "https://placeimg.com/140/140/any"
  //         }
  //       },
  //       {
  //         _id: 2,
  //         //   Pulls name from start screen so you know who joined the chat
  //         text: `${this.props.navigation.state.params.name} joined the chat`,
  //         createdAt: new Date(),
  //         system: true
  //       }
  //     ]
  //   });
  // }

  // Gets user info
  get user() {
    return {
      name: this.props.navigation.state.params.name,
      _id: this.state.uid,
      id: this.state.uid
    };
  }

  //Takes snapshots and keeps them updated when new documents are added
  onCollectionUpdate = querySnapshot => {
    const messages = [];
    querySnapshot.forEach(doc => {
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image,
        location: data.location
      });
    });
    this.setState({
      messages
    });
  };

  //Function to add a new message document to firebase
  addMessage() {
    console.log(this.state.messages[0]);
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text || "",
      createdAt: this.state.messages[0].createdAt,
      user: [this.state.uid, this.props.navigation.state.params.name, ""],
      image: this.state.messages[0].image || "",
      location: this.state.messages[0].location || null,
      uid: this.state.uid
    });
  }

  // Button to send messages
  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      () => {
        this.addMessage();
      }
    );
  }

  // Allows users to log in anonymously
  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }

      this.setState({
        uid: user.uid
      });

      this.referenceMessageUser = firebase.firestore().collection("messages");
      this.unsubscribeMessageUser = this.referenceMessageUser.onSnapshot(
        this.onCollectionUpdate
      );
    });
    this.setState({
      messages: [
        {
          _id: 1,
          //   Pulls name from start screen so you know who joined the chat
          text: `${this.props.navigation.state.params.name} joined the chat`,
          createdAt: new Date(),
          system: true
        }
      ]
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribeMessageUser();
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
            user={this.user}
          />
          {/* checks os platform if andriod it enables KeyboardSpacer */}
          {Platform.OS === "android" ? <KeyboardSpacer /> : null}
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
