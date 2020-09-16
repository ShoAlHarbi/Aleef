import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import firebase from './firebase';

export default class LogInScreen extends Component {
    constructor() {
        super();
        this.state = { 
          email: '', 
          password: '',
          username: '', 
          isLoading: false
        }
      }
    
      updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
      }
    
      userLogin = () => {
        if(this.state.email === '' || this.state.password === '') {
          Alert.alert('الرجاء تعبئة جميع الخانات')
        } else {
          this.setState({
            isLoading: true,
          })
          firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password)
          .then((res) => {
            console.log(res)
            console.log('تم تسجيل الخروج بنجاح')
            this.setState({
              isLoading: false,
              email: '', 
              password: ''
            })
            this.props.navigation.navigate('الصفحة الرئيسية')
          })
          .catch(error => this.setState({ errorMessage: error.message }))
        }
      }
    
      render() {
        if(this.state.isLoading){
          return(
            <View style={styles.preloader}>
              <ActivityIndicator size="large" color="#9E9E9E"/>
            </View>
          )
        }   
    
    return (
        <View style={styles.container}>
            <Image
                style={{ width: 200, height: 200 }}
                source={require('./assets/AleefLogo.png')}
            />
            <TextInput
                placeholder="الايميل"
                placeholderTextColor="#a3a3a3"
                style={styles.inputField}
                value={this.state.email}
                onChangeText={(val) => this.updateInputVal(val, 'email')}
       
            />
            <TextInput
                placeholder="كلمة المرور"
                placeholderTextColor="#a3a3a3"
                style={styles.inputField}
                value={this.state.password}
                onChangeText={(val) => this.updateInputVal(val, 'password')}
                maxLength={15}
                secureTextEntry={true}
            />
            <TouchableOpacity onPress={() => this.userLogin()}
              style={styles.button}>
              <Text style={styles.textStyle}>تسجيل دخول</Text>
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

    button: {
        backgroundColor: '#69C4C6',
        padding: 10,
        width: 250,
        alignItems: "center",
        marginTop: 40,
        marginBottom: 85,
        borderRadius: 20,

    },

    textStyle: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },

    inputField: {
        borderWidth: .5,
        width: 250,
        borderColor: '#cccccc',
        borderRadius: 20,
        textAlign: 'center',
        backgroundColor: 'white',
        padding: 2,
        margin: 5,

    }
});