import React, { Component } from "react";
import { StyleSheet, Text, View, Platform, AsyncStorage } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";
import firebase from "firebase";
import "firebase/firestore";
import CustomActions from "./CustomActions";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";

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
      uid: 0,
      isConnected: false,
      user: {
        _id: "",
        name: "",
        avatar: ""
      }
    };
  }

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
      let data = doc.data();
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
    //console.log(this.state.messages[0]);
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text || "",
      createdAt: this.state.messages[0].createdAt,
      user: this.state.user,
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
        this.saveMessages();
      }
    );
  }
  // Load messages from local storage
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  //Save new messages to local storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }
  //Delete local storage for testing. This can be fired in the componentWillUnmount function.
  async deleteMessage() {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    //Check to see if user is online
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected == true) {
        console.log("online");
        this.setState({
          isConnected: true
        });
        // If user is online allow signing in anonymously
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async user => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }

            this.setState({
              uid: user.uid,
              user: {
                _id: user.uid,
                name: this.props.navigation.state.params.name,
                avatar: ""
              }
            });
            // If user is online get messages from firestore
            this.referenceMessageUser = firebase
              .firestore()
              .collection("messages");
            this.unsubscribeMessageUser = this.referenceMessageUser.onSnapshot(
              this.onCollectionUpdate
            );
          });
        //   Pulls name from start screen so you know who joined the chat
        this.setState({
          messages: [
            {
              _id: 1,

              text: `${this.props.navigation.state.params.name} joined the chat`,
              createdAt: new Date(),
              system: true
            }
          ]
        });
        // If user is offline get messages from local storage
      } else {
        console.log("offline");
        this.setState({
          isConnected: false
        });
        this.getMessages();
        //Let user know they are offline. NOT WORKING AS EXPECTED
        this.setState({
          messages: [
            {
              _id: 2,

              text: "You are Offline",
              createdAt: new Date(),
              system: true
            }
          ]
        });
      }
    });
  }

  componentWillUnmount() {
    // Uncomment the following line to trigger the deleteMessages function
    // this.deleteMessage();
    this.authUnsubscribe();
    this.unsubscribeMessageUser();
  }

  //Function to disable the input toolbar if user is offline.
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  // Changes title to the name entered on the start screen
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };

  renderCustomActions = props => {
    return <CustomActions {...props} />;
  };

  renderCustomView = props => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
      );
    }
    return null;
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
            renderCustomView={this.renderCustomView}
            renderActions={this.renderCustomActions.bind(this)}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={this.state.user}
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
