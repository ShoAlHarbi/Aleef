import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native'
import firebase from './firebase';

export default class ForgetPassword extends Component {
  constructor() {
    super();
    this.state = { 
      email: '', 
    }        
  }
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }
  sendEmail = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email)
      .then(function() {
        Alert.alert('',"تم ارسال طلب إعادة تعيين كلمة المرور الرجاء تفقد البريد الإلكتروني",[{ text: 'حسناً'}]);})
      .catch(function(error) {
        Alert.alert('',"الرجاء إدخال بريد إلكتروني صحيح",[{ text: 'حسناً'}]);
      });
      this.setState({email: ""});//only to clear email input field
  };

  render() {
    return (
      <View style={styles.container}>
          <Image
          style={{ width: 300, height: 165,marginLeft:35 }}
          source={require('./assets/AleefLogo.png')}
          />
         <TextInput
          placeholder="*البريد الإلكتروني"
          placeholderTextColor="#a3a3a3"
          keyboardType='email-address'
          style={styles.inputField}
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}
         />
          <View>
          <Text style={styles.mandatoryTextStyle}>جميع الحقول المسبوقة برمز النجمة (*) مطلوبة.</Text>
          </View>
          <TouchableOpacity onPress={() => this.sendEmail()} 
           style={styles.button}>
          <Text style={styles.textStyle}>إعادة تعيين كلمة المرور</Text>
          </TouchableOpacity>
      </View>
      
    )
  }
}
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#FFFCFC',
      alignItems: 'center',
      justifyContent: 'center',
  },
  inputField: {
    borderWidth: .5,
    width: 250,
    borderColor: '#cccccc',
    borderRadius: 20,
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 2,
    marginBottom: 20,
   },
   
  button: {
    backgroundColor: '#69C4C6',
    padding: 10,
    width: 200,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 210,
    borderRadius: 20,
  },
  textStyle: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  mandatoryTextStyle: {
    color: '#FF7D4B',
    fontSize: 13,
    marginBottom: 20,
  },
});