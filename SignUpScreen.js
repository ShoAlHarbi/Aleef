import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import firebase from './firebase';

export default class SignUpScreen extends Component {
  constructor() {
    super();
    this.state = {
      displayName: '',
      email: '',
      password: '',
      confirmPassord: '',
      isLoading: false,
      userid: '',
    }
  }
    //------------------------Get current user location--------------------------
    async componentDidMount() {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          UserLocation:{
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
          }
        })
      })
    }
//-----------------------------------------------------------------------------

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  registerUser = () => {

    const Emailexpression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    const Emailcheck = Emailexpression.test(String(this.state.email).toLowerCase());

    const strongPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    const Passcheck = strongPass.test(this.state.password);

    if (this.state.email.trim() === '' || this.state.password.trim() === '' || this.state.displayName.trim() === '' || this.state.confirmPassord.trim() === '') {
      Alert.alert('', 'يجب تعبئة جميع الحقول',[{ text: 'حسناً'}])
    } else if (Emailcheck === false) {
      Alert.alert('', 'الرجاء ادخال البريد الإلكتروني بصيغة صحيحة',[{ text: 'حسناً'}])
    } else if (Passcheck === false) {
      Alert.alert('', 'يجب ان تتكون كلمة المرور من 8 خانات أو أكثر وحرف انجليزي كبير وحرف انجليزي صغير على الأقل',[{ text: 'حسناً'}])
    } else if (this.state.password !== this.state.confirmPassord) {
      Alert.alert('', 'كلمتا المرور غير متطابقتان. الرجاء إعادة الإدخال',[{ text: 'حسناً'}])
    }
    else {
      this.setState({
        isLoading: true,
      })

      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((data) => {
          firebase.auth().onAuthStateChanged(user => {
            if (user) {
              this.userid = user.uid
              firebase.database().ref('account/' + this.userid).set(
                {
                  name: this.state.displayName.trim(),
                  Email: this.state.email,
                  profileImage: 'https://firebasestorage.googleapis.com/v0/b/aleef-4b784.appspot.com/o/images.png?alt=media&token=976e23f9-43b5-4caf-a796-8bad5947b511',
                  UserLat: this.state.UserLocation.latitude,
                  UserLong: this.state.UserLocation.longitude, 
                  Userstatus: 'enabled'
                })
              this.props.navigation.navigate('الصفحة الرئيسية')
            }
          });

        }
        )
        .catch((error) => {
          firebase.database().ref("account").orderByChild("Email").equalTo(this.state.email).once("value", snapshot => {
            if (snapshot.exists()) {
              Alert.alert('', 'البريد الإلكتروني مسجل مسبقاً، قم بتسجيل الدخول',[{ text: 'حسناً'}])
            }
          });
          this.setState({
            isLoading: false,
          })
        })
    }
  }

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
        <View >
          <Image
            style={{ width: 200, height: 200, marginBottom: 30, }}
            source={require('./assets/AleefLogo.png')}
          />
        </View>
        <TextInput
          placeholder="*الاسم"
          placeholderTextColor="#a3a3a3"
          style={styles.inputField}
          value={this.state.displayName}
          onChangeText={(val) => this.updateInputVal(val, 'displayName')}
          maxLength={20}
        />
        <TextInput
          placeholder="*البريد الإلكتروني"
          placeholderTextColor="#a3a3a3"
          keyboardType='email-address'
          style={styles.inputField}
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}
        />
        <TextInput
          placeholder="*كلمة المرور"
          placeholderTextColor="#a3a3a3"
          secureTextEntry={true}
          style={styles.inputField}
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
        />
        <TextInput
          placeholder="*تأكيد كلمة المرور"
          placeholderTextColor="#a3a3a3"
          secureTextEntry={true}
          style={styles.inputField}
          value={this.state.confirmPassord}
          onChangeText={(val) => this.updateInputVal(val, 'confirmPassord')}
        />

        <View>
          <Text style={styles.mandatoryTextStyle}>جميع الحقول المسبوقة برمز النجمة (*) مطلوبة.</Text>
        </View>

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

  },

  mandatoryTextStyle: {
    color: 'red',
    fontSize: 13,
    marginTop: 5,
  },
});