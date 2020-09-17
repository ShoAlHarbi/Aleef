import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import firebase from './firebase';


export default class SignUpScreen extends Component {
    constructor() {
        super();
        this.state = { 
          displayName: '',
          username: '',
          email: '', 
          password: '',
          confirmPassord:'',
          isLoading: false,
          userid: ''
        }
      }
      
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }
  
  registerUser = () => {

    const Emailexpression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    const Emailcheck = Emailexpression.test(String(this.state.email).toLowerCase()); 

    const Usernameexpression = /^[a-zA-Z0-9]+$/; 
    const Usernamecheck = Usernameexpression.test(this.state.username); 

    if(this.state.email === '' || this.state.password === '' || this.state.username === ''|| this.state.name === '' || this.state.confirmPassord === '') {
      Alert.alert('يجب تعبئة جميع الحقول')
    } else if (Usernamecheck === false) {
      Alert.alert('يجب أن يحتوي اسم المستخدم على حروف أو حروف وأرقام انجليزية فقط')
    } else if (Emailcheck === false){
      Alert.alert('الرجاء ادخال البريد الإلكتروني بصيغة صحيحة')
    } else if (this.state.password.length<8){
      Alert.alert('الرجاء إدخال كلمة مرور تتكون من 8 خانات كحد أدنى')  
    } else if (this.state.password !== this.state.confirmPassord){ 
      Alert.alert('كلمتا المرور غير متطابقتان. الرجاء إعادة الإدخال')
    }
    else {
      this.setState({
        isLoading: true,
      })
      
      firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then( (data) => {
      firebase.auth().onAuthStateChanged( user => {
        if (user) {
           this.userid = user.uid
           firebase.database().ref('account/'+this.userid).set(
           {
            name: this.state.displayName,
            username: this.state.username,
            Email: this.state.email, 
          })

          this.props.navigation.navigate('تسجيل الدخول')
      }
    });
      Alert.alert("تم التسجيل بنجاح، قم بتسجيل الدخول")
      }
      )
      .catch((error) => {
        console.log(error.message)
        this.setState({formErrorMsg: 'البريد الإلكتروني مسجل مسبقًا، قم بتسجيل الدخول'})
        //this.setState({errorMsgVisibilty: 'flex'})
      })   
    }
  }

  render(){
    if(this.state.isLoading){
        return(
          <View style={styles.preloader}>
            <ActivityIndicator size="large" color="#9E9E9E"/>
          </View>
        )
      }
    return (
        <View style={styles.container}>
            <View >
                <Image
                    style={{ width: 200, height: 200, marginBottom: 30, }}
                    source={require('./assets/AleefLogo.png')}
                />
            </View>

            <TextInput
                placeholder="الاسم"
                placeholderTextColor="#a3a3a3"
                style={styles.inputField}
                value={this.state.displayName}
                onChangeText={(val) => this.updateInputVal(val, 'displayName')}
                maxLength={20} 
            />
            <TextInput
                placeholder="اسم المستخدم"
                placeholderTextColor="#a3a3a3"
                style={styles.inputField}value={this.state.username}
                onChangeText={(val) => this.updateInputVal(val, 'username')}
                maxLength={10} 
            />
            <TextInput
                placeholder="البريد الالكتروني"
                placeholderTextColor="#a3a3a3"
                keyboardType='email-address'
                style={styles.inputField}
                value={this.state.email}
                onChangeText={(val) => this.updateInputVal(val, 'email')}
            />
            <TextInput
                placeholder="كلمة المرور"
                placeholderTextColor="#a3a3a3"
                secureTextEntry={true}
                style={styles.inputField}
                value={this.state.password}
                onChangeText={(val) => this.updateInputVal(val, 'password')}
            />
            <TextInput
                placeholder="تأكيد كلمة المرور"
                placeholderTextColor="#a3a3a3"
                secureTextEntry={true}
                style={styles.inputField}
                value={this.state.confirmPassord}
                onChangeText={(val) => this.updateInputVal(val, 'confirmPassord')}
            />
            <TouchableOpacity onPress={() => this.registerUser()} 
             style={styles.button}>
             <Text style={styles.textStyle}>تسجيل</Text>
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