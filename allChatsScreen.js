import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity,Image, Text } from 'react-native';
import { List, Divider } from 'react-native-paper';
// import firestore from '@react-native-firebase/firestore';
import firebase from './firebase';
import 'firebase/firestore'; 
import { faAlignRight } from '@fortawesome/free-solid-svg-icons';
// import Loading from '../components/Loading';

export default function allChatsScreen({ navigation }) {

  const [threads, setThreads] = useState([]);


  useEffect(() => {
    (async () => {
    const unsubscribe = await firebase.firestore()
      .collection('userChats')
      .doc(firebase.auth().currentUser.uid)
      .collection('chatsID')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(documentSnapshot => {
          console.log('.....')
          console.log(documentSnapshot.data().to)
          console.log('.....')
          
          return {
            _id: documentSnapshot.id,
            // give defaults
            name: documentSnapshot.data().to,
            toID: documentSnapshot.data().toID,
            unreadMsgs: documentSnapshot.data().unreadMessages,            

            latestMessage: {
              text: ''
            },
            ...documentSnapshot.data()
          };
        });

        setThreads(threads.reverse());
     
      });

    
    return () => unsubscribe();
  })();
  }, []);

  function numOfUnreadMsgs(num){
    if(num==0){
      return <Text></Text>
    }
    return <Text  style={styles.text}>{num}</Text>
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.onechat}
            onPress={() => navigation.navigate('صفحة المحادثة', 
            { thread: item,
              name:item.name,
            offerorID: item.toID})}
          >
            
            <List.Item 
              title={item.name}
              description={item.latestMessage.text}
              titleNumberOfLines={1}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              descriptionNumberOfLines={1}
            />
            
              {numOfUnreadMsgs(item.unreadMsgs)}
              
            
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFCFC',
    flex: 1, 
  },
  listTitle: {
    fontSize: 18,
    alignSelf: 'flex-end'
  },
  listDescription: {
    fontSize: 16
  }, 
  onechat: {
    borderWidth: 1,
    marginTop: 4, 
    borderColor: '#F0F0F0', 
    backgroundColor: '#FBFBFB',
    alignContent: 'center',
    justifyContent: 'center',
    // alignItems: 'center'   
    
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#69C4C6',
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 35,
    height: 35,
    borderRadius: 35/2,
    position: 'absolute',
    marginLeft: 40
  }
});