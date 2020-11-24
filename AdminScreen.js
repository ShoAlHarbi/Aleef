import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity,ImageBackground } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { faUsersCog } from '@fortawesome/free-solid-svg-icons'


import firebase from './firebase';

export default class AdminScreen extends Component {
        constructor() {
          super();
          this.state = { 
            uid: ''
          }
        }
        signOut = () => {
            firebase.auth().signOut().then(() => {
              this.props.navigation.navigate('مرحباً في أليف')
            })
            .catch(error => this.setState({ errorMessage: error.message }))
          }  

          AdoptionOffers = () => this.props.navigation.navigate('جميع عروض التبني')
          SellingOffers = () => this.props.navigation.navigate('جميع عروض البيع')
          MissingPetPosts = () => this.props.navigation.navigate('جميع البلاغات')
          MangeAllUsers = () => this.props.navigation.navigate('ادارة المستخدمين')


          render(){
            this.state = { 
              displayName: firebase.auth().currentUser.displayName,
                uid: firebase.auth().currentUser.uid
              }  
              return (
                <View style={styles.container}>
                  <View style={styles.container2}>
                  <View><TouchableOpacity  onPress={() => this.signOut()} style={styles.button2}>
                      <FontAwesomeIcon icon={ faSignOutAlt }size={40} color={"#283958"}/>
                    </TouchableOpacity>
                  </View>
                  <Image style={{ width: 75, height: 85,marginTop:50, marginRight:195,}}
                   source={require('./assets/AleefLogoCat.png')}/>   
                  </View>

                   <View style={styles.container3}>
                   <TouchableOpacity onPress={() => this.AdoptionOffers()}
                       style={styles.button}>
                   <ImageBackground
                       style={{ width:200, height: 80, }}
                       source={require('./assets/Adopt.png')} 
                     >
                       <Text style={styles.textStyle}>عروض التبني</Text>
                     </ImageBackground>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.SellingOffers()}
                       style={styles.button}>
                    <ImageBackground
                       style={{ width:200, height: 80, }}
                       source={require('./assets/Buy.png')} 
                     >
                       <Text style={styles.textStyle}>عروض البيع</Text>
                     </ImageBackground>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => this.MissingPetPosts()}
                       style={styles.button}>
                     <ImageBackground
                       style={{ width:200, height: 80, }}
                       source={require('./assets/lost.png')} 
                     >
                       <Text style={styles.textStyle}>البلاغات</Text>
                     </ImageBackground>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.MangeAllUsers()}>
                    <FontAwesomeIcon icon={ faUsersCog }size={65} color={"#283958"}/>
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
      marginBottom:100,
  },
  container3: {
    backgroundColor: '#FFFCFC',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width:200,
    flexDirection: 'column',
    marginBottom: 10,
    padding:150,
},
textStyle:{
  color: '#283958',
  fontSize: 19,
  fontWeight: 'bold',
  marginTop:27,
  marginRight:10
},
    text:{
        color:'black',
        fontSize: 20,
        marginBottom: 80,
    },

    button: {
      backgroundColor: '#D4ECEC',
      padding: 10,
      alignItems: "center",
      marginTop: 5,
      marginBottom: 40,
      borderRadius: 20,
      height: 95,
      justifyContent: 'center',
      width: 220
      
  },
    button2: {
      padding: 8,
      width: 125,
      marginLeft: 160,
      marginTop:50
  }
});