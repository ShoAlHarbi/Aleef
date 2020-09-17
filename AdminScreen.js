import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
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
        render(){
            this.state = { 
                displayName: firebase.auth().currentUser.displayName,
                uid: firebase.auth().currentUser.uid
              }  
              return (
                <View style={styles.container}>
                    <Image
                        style={{ width: 130, height: 130, marginBottom:260, }}
                        source={require('./assets/AleefLogo.png')}
                    />
                    <View><Text style={styles.text}> {this.state.displayName}مرحباً في لوحة التحكم </Text></View>
                    <TouchableOpacity onPress={() => this.signOut()}
                       style={styles.button}>
                       <Text style={styles.textStyle}>تسجيل الخروج</Text>
                    </TouchableOpacity>
                </View>
            );
        } 
        }
    

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFCFC',
        alignItems: 'center',
        justifyContent: 'center',
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
        width: 150,
        alignItems: "center",
        marginTop: 40,
        marginBottom: 150,
        borderRadius: 20,

    }
});