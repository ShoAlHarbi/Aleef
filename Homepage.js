import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity,} from 'react-native';
import firebase from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt, faComment, faUser } from '@fortawesome/free-solid-svg-icons';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import AdoptionOffersScreen from './AdoptionOffersScreen';
import SellingOffersScreen from './SellingOffersScreen';
import MissingPetsScreen from './MissingPetPosts';


 
export default class Homepage extends Component {
        constructor() {
          global.numUnreadChats = 0,
          super();
          this.state = { 
            uid: '',
            displayName: '',
          }
        }
        
        async componentDidMount(){
          currenUID = firebase.auth().currentUser.uid
          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          let finalStatus = existingStatus;
          if (existingStatus !== "granted") {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
          }
          if (finalStatus !== "granted") {
            return false;
          }
          try{
            // Generate the token and store it in the database
            let token = await Notifications.getExpoPushTokenAsync();
            console.log(token)
            firebase.database().ref('account/'+currenUID+'/push_token')
            .set(token)
          } catch(error){
            console.log(error)
          }
          this.unreadChats()
      
      }

      unreadChats = async () =>{
        var numOfUnreadChats=0;
          global.unreadChats = 0;
           await firebase.firestore()
            .collection('userChats')
            .doc(firebase.auth().currentUser.uid)
            .collection('chatsID')
            .onSnapshot(querySnapshot => {
                querySnapshot.docs.map(documentSnapshot => {
                console.log('.....')
                console.log(documentSnapshot.data().to)
                console.log('.....')
                
                if(documentSnapshot.data().unreadMessages>=1){
                  global.unreadChats = 0;
                  numOfUnreadChats = Number(numOfUnreadChats+1)
                  global.unreadChats = numOfUnreadChats
                  console.log('inside loop'+numOfUnreadChats)
                }
              });
              console.log("before setState"+numOfUnreadChats)
              console.log('Global '+global.unreadChats)
              console.log('after setState'+numOfUnreadChats)
            });
            console.log('before exit async '+numOfUnreadChats)
            console.log('Global2 '+global.unreadChats)
      }
        // This function retrives the posts in all screens
        renderOffers = async () =>{
          await new AdoptionOffersScreen().render();
          await new SellingOffersScreen().render();
          await new MissingPetsScreen().render();
        }  
        signOut = () => {
            firebase.auth().signOut().then(() => {
              this.props.navigation.navigate('مرحباً في أليف')
            })
            .catch(error => this.setState({ errorMessage: error.message }))
          }  
          AdoptionOffers = () => this.props.navigation.navigate('عروض التبني')
          SellingOffers = () => this.props.navigation.navigate('عروض البيع')
          AllChats = () => this.props.navigation.navigate('جميع المحادثات')
          MissingPetPosts = () => this.props.navigation.navigate('البلاغات')
           render(){
            this.state = { 
              displayName: firebase.database().ref('account/'+firebase.auth().currentUser.uid+'/name'),
                uid: firebase.auth().currentUser.uid
              }
              // call the function to retrive posts
              {this.renderOffers()}
              return (
                <View style={styles.container}>
                  <View style={styles.container2}>
                  <View><TouchableOpacity  onPress={() => this.signOut()} style={styles.button2}>
                      <FontAwesomeIcon icon={ faSignOutAlt }size={40} color={"#5F5F5F"}/>
                    </TouchableOpacity>                 
                  </View>
                  <Image style={{ width: 65, height: 70,marginTop:50, marginRight:195,}}
                   source={require('./assets/AleefLogoCat.png')}/>   
                  </View>
                 
                   <View style={styles.container3}>
                   <TouchableOpacity onPress={() => this.AdoptionOffers()}
                       style={styles.button}>
                    <Text style={styles.textStyle}>عروض التبني</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.SellingOffers()}
                       style={styles.button}>
                    <Text style={styles.textStyle}>عروض البيع</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => this.MissingPetPosts()}
                       style={styles.button}>
                    <Text style={styles.textStyle}>الإبلاغ عن حيوان مفقود</Text>
                    </TouchableOpacity>

                   </View>
                   <View style={{ flexDirection: 'row', position:'absolute', top:625 }} >
                   <TouchableOpacity onPress={() => this.props.navigation.navigate('جميع المحادثات')} style = {styles.sideIcons}>
                    <FontAwesomeIcon icon={ faComment }size={40} color={"#5F5F5F"} />
                    <Text style={global.unreadChats==0?styles.text3: styles.text2}>{global.unreadChats}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('الصفحة الشخصية')} style = {styles.sideIcons}>
                     <FontAwesomeIcon  icon={ faUser }size={40} color={"#5F5F5F"}/>
                  </TouchableOpacity>
                   </View>
                </View>
            );
        } 
        }

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFCFC',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    container2: {
      backgroundColor: '#FFFCFC',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      marginBottom:50,
  },
  container3: {
    backgroundColor: '#FFFCFC',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width:200,
    flexDirection: 'column',
    marginBottom: 100,
    padding:150,
},
    textStyle:{
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
      
    },
    text:{
        color:'black',
        fontSize: 20,
        marginBottom: 80,
    },

    button: {
        backgroundColor: '#69C4C6',
        padding: 10,
        // width: 185,
        alignItems: "center",
        marginTop: 5,
        marginBottom: 60,
        borderRadius: 20,

        height: 80,
        justifyContent: 'center',
        width: 200
    },
    button2: {
      padding: 8,
      width: 125,
      marginLeft: 160,
      marginTop:50
  }, 

  sideIcons: { 
    //padding: 8
    margin: 20, 
    borderColor: 'black', 
  },
  text2: {
    color: '#ff6600',
    fontSize: 25,
    fontWeight: 'bold',
    // backgroundColor: '#69C4C6',
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 35,
    height: 35,
    borderRadius: 35/2,
    position: 'absolute',
    marginLeft: 3
  },
  text3: {
    color: '#5F5F5F',
    fontSize: 25,
    fontWeight: 'bold',
    // backgroundColor: '#69C4C6',
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 35,
    height: 35,
    borderRadius: 35/2,
    position: 'absolute',
    marginLeft: 3
  }

});


