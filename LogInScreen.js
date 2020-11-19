import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import firebase from './firebase';

export default class LogInScreen extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      isLoading: false,
      displayName: '',
    }
  }
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  userLogin = () => {
    const Emailexpression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    const Emailcheck = Emailexpression.test(String(this.state.email).toLowerCase());

    if (this.state.email === '' || this.state.password === '') {
      Alert.alert('', 'الرجاء تعبئة جميع الحقول',[{ text: 'حسناً'}])
    } else if (Emailcheck === false) {
      Alert.alert('', 'الرجاء ادخال البريد الإلكتروني بصيغة صحيحة',[{ text: 'حسناً'}])
    } else {
      this.setState({
        isLoading: true,
      })
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          this.state.displayName = firebase.auth().currentUser.displayName
          console.log(res)
          console.log('تم تسجيل الدخول بنجاح')
          this.setState({
            isLoading: false,
            email: '',
            password: ''
          })
          if (firebase.auth().currentUser.email === 'admin@gmail.com') 
            this.props.navigation.navigate('لوحة التحكم')

          else {

          console.log(firebase.auth().currentUser.uid + '  heeerreee')
          let useridtemp = firebase.auth().currentUser.uid 
          firebase.database().ref('account/'+useridtemp).on("value", snapshot => {
          if (snapshot.val().Userstatus === 'disabled') {
          Alert.alert('', "يبدو بأنك انتهكت قوانين أليف، لا يمكنك تسجيل الدخول",[{ text: 'حسناً'}])
          this.setState({
            isLoading: false,
          }) 
        }
        else
          this.props.navigation.navigate('الصفحة الرئيسية')
      }) }

        })

        .catch((error) => {
          Alert.alert('', "البريد الإلكتروني أو كلمة المرور خاطئة",[{ text: 'حسناً'}])
          this.setState({
            isLoading: false,
          })  
        })
    }
  }
   //Forget password 
   ForgetPassword = () => this.props.navigation.navigate('نسيت كلمة المرور')
   //----------------
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
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
          placeholder="*البريد الإلكتروني"
          placeholderTextColor="#a3a3a3"
          style={styles.inputField}
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}

        />
        <TextInput
          placeholder="*كلمة المرور"
          placeholderTextColor="#a3a3a3"
          style={styles.inputField}
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />

        <View>
          <Text style={styles.mandatoryTextStyle}>جميع الحقول المسبوقة برمز النجمة (*) مطلوبة.</Text>
        </View>

        <TouchableOpacity onPress={() => this.userLogin()}
          style={styles.button}>
          <Text style={styles.textStyle}>تسجيل دخول</Text>
        </TouchableOpacity>
      
        <TouchableOpacity onPress={()=> this.ForgetPassword()}
            style={styles.button2}>
            <Text style={styles.textStyle2}>نسيت كلمة المرور؟</Text>
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
    marginBottom: 15,
    borderRadius: 20,

  },
  button2: {
    backgroundColor: '#FFFCFC',
    padding: 10,
    width: 250,
    alignItems: "center",
    marginBottom: 100,
    borderRadius: 20,
  },
  textStyle: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  textStyle2: {
    color: '#5F5F5F',
    fontSize: 17,
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

  },
  mandatoryTextStyle: {
    color: 'red',
    fontSize: 13,
    marginTop: 5,
  },
});