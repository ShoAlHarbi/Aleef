import React, { useState, useEffect } from 'react';
import { GiftedChat,
  Bubble,
  Send,
  SystemMessage } from 'react-native-gifted-chat';
import firebase from './firebase';
import { IconButton } from 'react-native-paper';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import 'firebase/firestore';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications'

export default function chatScreen({ route }) {
  const { thread } = route.params;
  const [myName, setMyName] =useState('')
  const currenUID = firebase.auth().currentUser.uid
  const chatID = getChatID()
  const offerorID = route.params.offerorID
  const [offerorName, setOfferorName] = useState('')
  const [messages, setMessages] = useState([]);

  //retrieve the messages from the database
  useEffect(() => {
  
    setInfo();
    const messagesListener = firebase.firestore()
    .collection('chats')
    .doc(chatID)
    .collection('messages')
    .orderBy('createdAt', 'desc')
    .onSnapshot(querySnapshot => {
      const messages = querySnapshot.docs.map(doc => {
        const firebaseData = doc.data();
        const data = {
          _id: doc.id,
          text: '',
          createdAt: new Date().getTime(),
          ...firebaseData
        };

        if (!firebaseData.system) {
          data.user = {
            ...firebaseData.user,
            name: firebaseData.user.email
          };
        }
        return data;
      });
      setMessages(messages);
    });
    return () => messagesListener();

      }, []);



  // Generate chatID
  function getChatID(){
    console.log(offerorID)
    const chatterID = currenUID
    const chateeID = route.params.offerorID
    const chatIDpre = [];
    chatIDpre.push(chatterID);
    chatIDpre.push(chateeID);
    chatIDpre.sort();
    return chatIDpre.join('_');
  }

  //set the current user name , and the offeror name
  function setInfo(){
      firebase.database().ref('account/'+currenUID).once('value')
      .then(snapshot => {
        setMyName(snapshot.val().name)
         })

        firebase.database().ref('account/'+offerorID).once('value')
        .then(snapshot => {
          setOfferorName(snapshot.val().name)
      }) 
    }

  // andd the chatID for both the current user and the offeror
   function addChatID(){  

    const added = false
     firebase.firestore()
    .collection('userChats')
    .doc(currenUID)
    .collection('chatsID')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        if(doc.data().chatID == chatID){
          added = true
        }
      })

      if(!added){
      // andd the chatID for the current user
      firebase.firestore()
      .collection('userChats')
      .doc(currenUID)
      .collection('chatsID')
      .add({
        chatID: chatID,
        to: offerorName,
        toID: offerorID
      })
        // andd the chatID for the offeror
        firebase.firestore()
        .collection('userChats')
        .doc(offerorID)
        .collection('chatsID')
        .add({
          chatID: chatID,
          to: myName,
          toID: currenUID

        })
     
    
      console.log(myName)
    }
    })
  
  }

  // Send notification method
  function sendPushNotification(message){

    // Get the offeror push_token to send the notification
    let offerorToken
    firebase.database().ref('account/'+offerorID+'/push_token/data').on('value', (snapshot)=>{
      offerorToken = snapshot.val()
    })

    // Push the notification
    console.log('The token is '+offerorToken)
    let response = fetch('https://exp.host/--/api/v2/push/send',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: offerorToken,
        sound: 'default',
        title: myName,
        body: message
      })
    });
  }

  // helper method that is sends a message
   function handleSend(messages) {

    const text = messages[0].text;
    addChatID()
    sendPushNotification(text)
    // add the message to the database messages
    firebase.firestore()
    .collection('chats')
    .doc(chatID)
    .collection('messages')
    .add({
      text,
        createdAt: new Date().getTime(),
        user: {
          _id: currenUID,
          to: offerorID,
        }
    })
    // update the last message
     firebase.firestore()
    .collection('chats')
    .doc(chatID)
    .set(
      {
        latestMessage: {
          to: offerorID,
          text,
          createdAt: new Date().getTime()
        }
      },
      { merge: true }
    );
    
  }

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#69C4C6'
          },
          left: {
            backgroundColor:'#DAE5E5'
          },
        }}
        textStyle={{
          right: {
            color: '#fff'
          }
        }}
      />
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon='send-circle' size={32} color='#69C4C6' />
        </View>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon='chevron-double-down' size={36} color='#000000' />
      </View>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }

  return (
    <View style={{ backgroundColor: "#f5f9f9", flex: 1 }}>
    <GiftedChat
      messages={messages}
      onSend={newMessage => handleSend(newMessage)}
      placeholder= ''
      user= {{
        _id: currenUID,
        to: offerorID,
      }}

      scrollToBottom
      renderBubble={renderBubble}
      renderSend={renderSend}
      alignItems
      scrollToBottomComponent={scrollToBottomComponent}
      renderSystemMessage={renderSystemMessage}
    /></View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center', 
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  systemMessageWrapper: {
    backgroundColor: '#6646ee',
    borderRadius: 4,
    padding: 5
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  }
});