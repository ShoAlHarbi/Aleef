import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import firebase from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

export default class Homepage extends Component {
        constructor() {
          super();
          this.state = { 
            uid: '',
            displayName: ''
          }
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
          MissingPetPosts = () => this.props.navigation.navigate('الإبلاغ عن حيوان مفقود')
        render(){
            this.state = { 
              displayName: firebase.auth().currentUser.displayName,
                uid: firebase.auth().currentUser.uid
              }  
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

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('جميع المحادثات')}
                       style={styles.button}>
                    <Text style={styles.textStyle}>المحادثات</Text>
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
        width: 185,
        alignItems: "center",
        marginTop: 5,
        marginBottom: 60,
        borderRadius: 20,

    },
    button2: {
      padding: 8,
      width: 125,
      marginLeft: 160,
      marginTop:50
  }
});


