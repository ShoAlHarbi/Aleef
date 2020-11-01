import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert} from 'react-native';
import firebase from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusSquare} from '@fortawesome/free-solid-svg-icons';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import { database } from 'firebase';



export default class editProfile extends Component{
    
    constructor(props) {
        super(props);
        this.state = { 
            userName: '',
            profileImage: null,
            email:'',
            newName: '',
            newEmail: '',
            password: '',
            confirmPassword: '',
            uploading: false,
            newProfileImage: null,
        }
      }


     retrieveInfo = () => { 
      firebase.database().ref('account/'+firebase.auth().currentUser.uid)
      .on('value',(snapshot)=>{
          this.setState({
              userName: snapshot.val().name,
              profileImage: snapshot.val().profileImage,
              email: snapshot.val().Email,
          })
          
      });
     }

     async componentDidMount(){
      this.retrieveInfo(); 
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }

    SelectImage = async () => {
      let SelectResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [2, 2],
      });
      this.handleImageSelected(SelectResult);
    };

    handleImageSelected = async SelectResult => {
      try {
        this.setState({ uploading: true });
  
        if (!SelectResult.cancelled) {
          const uploadUrl = await uploadImageAsync(SelectResult.uri);
          this.setState({ profileImage: uploadUrl,
          newProfileImage: uploadUrl});
        }
      } catch (e) {
        console.log(e);
        Alert.alert('', 'فشل رفع الصورة',[{ text: 'حسناً'}])
      } finally {
        this.setState({ uploading: false });
      }
    };

    RenderUploading = () => {
      if (this.state.uploading) {
        return (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: 'rgba(0,0,0,0.4)',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}>
            <ActivityIndicator color="#fff" animating size="large" />
          </View>
        );
      }
    };

    updateInputVal1 = (val, prop1, prop2) => {
      const state = this.state;
      state[prop1] = val;
      state[prop2] = val;
      this.setState(state);
    }

    updateInputVal2 = (val, prop1) => {
      const state = this.state;
      state[prop1] = val;
      this.setState(state);
    }

    updateInfo = ()=>{
      const Emailexpression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      const Emailcheck = Emailexpression.test(String(this.state.newEmail).toLowerCase());

      const strongPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
      const Passcheck = strongPass.test(this.state.password);
      if(this.state.newProfileImage!==null||this.state.newName!==''||this.state.newEmail!==''||this.state.password!== ''){
      if(this.state.newProfileImage!==null){
      firebase.database().ref('account/'+firebase.auth().currentUser.uid)
      .update({
        profileImage: this.state.profileImage
      });
    }

      if(this.state.newName.trim()!==''){
        firebase.database().ref('account/'+firebase.auth().currentUser.uid)
        .update({
          name: this.state.newName.trim()
        })
        Alert.alert('', 'test1',[{ text: 'حسناً'}])
      }

      if(this.state.newEmail.trim()!==''){
        if (Emailcheck === false) {
          Alert.alert('', 'الرجاء ادخال البريد الإلكتروني بصيغة صحيحة',[{ text: 'حسناً'}])
        }else{
        firebase.database().ref('account/'+firebase.auth().currentUser.uid)
      .update({
        Email: this.state.newEmail
      });
      firebase.auth().currentUser
      .updateEmail(this.state.newEmail)
      Alert.alert('', 'test2',[{ text: 'حسناً'}])
    }
    
      }
      if(this.state.password.trim() !== ''){
        if (Passcheck === false) {
          Alert.alert('', 'يجب ان تتكون كلمة المرور من 8 خانات أو أكثر وحرف انجليزي كبير وحرف انجليزي صغير على الأقل',[{ text: 'حسناً'}])
        } else if (this.state.password !== this.state.confirmPassword) {
          Alert.alert('', 'كلمتا المرور غير متطابقتان. الرجاء إعادة الإدخال',[{ text: 'حسناً'}])
        }else{
          firebase.auth().currentUser
          .updatePassword(this.state.password)
          Alert.alert('', 'test3',[{ text: 'حسناً'}])
        }
      }
      Alert.alert('', 'تم حفظ التغييرات',[{ text: 'حسناً'}])
    }
    }

    render(){
      let { profileImage } = this.state;
      let { newProfileImage } = this.state;
        return(
            <View style={styles.container}>
                <View>
                    <Image style={{ width: 140, height: 140, borderRadius:140/2, marginTop:20}}
                   source={{uri: this.state.profileImage}} />
                </View>
                <TouchableOpacity
                     onPress={() => this.SelectImage()}
                     style={styles.iconStyle}>
                     <FontAwesomeIcon icon={ faPlusSquare }size={30} color={"#69C4C6"}/>
                    </TouchableOpacity>
                    {/* {this.RenderImage()} */}
                    {this.RenderUploading()}
                    
                    <TextInput
                    defaultValue = {this.state.userName}
                    style={styles.inputField1}
                    onChangeText={(val) => this.updateInputVal1(val,'userName','newName')}
                    />
                    <TextInput
                    defaultValue = {this.state.email}
                    keyboardType='email-address'
                    style={styles.inputField}
                    onChangeText={(val) => this.updateInputVal1(val, 'email','newEmail')}
                    />
                    <TextInput
                    placeholder= 'كلمة المرور'
                    placeholderTextColor="#a3a3a3"
                    secureTextEntry={true}
                    style={styles.inputField}
                    onChangeText={(val) => this.updateInputVal2(val, 'password')}
                    />
                    <TextInput
                    placeholder= 'تأكيد كلمة المرور'
                    placeholderTextColor="#a3a3a3"
                    secureTextEntry={true}
                    style={styles.inputField}
                    onChangeText={(val) => this.updateInputVal2(val, 'confirmPassword')}
                    />
                    <TouchableOpacity style={styles.button}
                    onPress={() => this.updateInfo()}>
                        <Text style={styles.textStyle}>حفظ التغييرات</Text>
                    </TouchableOpacity>
                  
            </View>
        )
    }
}

async function uploadImageAsync(uri) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError('فشل الطلب'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child(uuid.v4());
  const snapshot = await ref.put(blob);
  blob.close();

  return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFCFC',
        alignItems: 'center',
        // justifyContent: 'center',
        flex: 1,
    },
    container2: {
      backgroundColor: '#FFFCFC',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      marginBottom: 150
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
        fontSize: 30,
        // marginBottom: 80,
    },

    button: {
        backgroundColor: '#69C4C6',
        padding: 10,
        width: 185,
        alignItems: "center",
        marginTop: 50,
        marginBottom: 60,
        borderRadius: 20,

    },
    button2: {
      padding: 8,
      width: 125,
      marginLeft: 160,
      marginTop:50
  },
    text2: {
        textDecorationLine: 'underline',
        fontSize: 16
    },
    iconStyle: {
        position: 'absolute',
        padding:8,
        left: 30,
        marginLeft: 200,
        marginTop: 125
      },
      Container4:{
        flexDirection: 'row',
        alignContent: 'space-between',
        alignItems: 'baseline'
      },
      button3: {
        alignSelf: 'center',
        margin: 25,
        borderBottomColor: '#69C4C6',
    },
    inputField1: {
        borderWidth: .5,
        width: 250,
        borderColor: '#cccccc',
        borderRadius: 10,
        textAlign: 'center',
        backgroundColor: 'white',
        padding: 2,
        margin: 5,
        marginTop: 70,   
      },
      inputField: {
        borderWidth: .5,
        width: 250,
        borderColor: '#cccccc',
        borderRadius: 10,
        textAlign: 'center',
        backgroundColor: 'white',
        padding: 2,
        margin: 5,    
      },
});