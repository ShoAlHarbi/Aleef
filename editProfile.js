import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput} from 'react-native';
import firebase from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusSquare} from '@fortawesome/free-solid-svg-icons';
import * as ImagePicker from 'expo-image-picker';


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
        }
      }
     

    componentDidMount(){
        firebase.database().ref('account/'+firebase.auth().currentUser.uid)
        .on('value',(snapshot)=>{
            this.setState({
                userName: snapshot.val().name,
                profileImage: snapshot.val().profileImage,
                email: snapshot.val().Email,
            })
            
        });
    }

    SelectImage = async () => {
        let SelectResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [2, 2],
        });
        this.handleImageSelected(SelectResult);
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

      handleImageSelected = async SelectResult => {
        try {
          this.setState({ uploading: true });
    
          if (!SelectResult.cancelled) {
            const uploadUrl = await uploadImageAsync(SelectResult.uri);
            this.setState({ profileImage: uploadUrl });
          }
        } catch (e) {
          console.log(e);
          Alert.alert('', 'فشل رفع الصورة',[{ text: 'حسناً'}])
        } finally {
          this.setState({ uploading: false });
        }
      };

      RenderImage = () => {
        let { profileImage } = this.state;
        if (!profileImage) {
          return;
        }
    
        // return (
        //   <View
        //     style={{
        //       marginTop: 30,
        //       width: 220,
        //       borderRadius: 3,
        //       elevation: 2,
        //     }}>
        //     <View
        //       style={{
        //         borderTopRightRadius: 3,
        //         borderTopLeftRadius: 3,
        //         shadowColor: 'rgba(0,0,0,1)',
        //         shadowOpacity: 0.2,
        //         shadowOffset: { width: 4, height: 4 },
        //         shadowRadius: 5,
        //         overflow: 'hidden',
        //       }}>
        //       <Image source={{ uri: profileImage }} style={{ width: 140, height: 140, borderRadius:140/2, marginTop:20}} />
        //     </View>
        //   </View>
        // );
      };

    updateInfo = ()=>{
        
    }

    render(){
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
                    {this.RenderImage()}
                    {/* {this.RenderUploading()} */}
                    
                    <TextInput
                    defaultValue = {this.state.userName}
                    style={styles.inputField1}
                    />
                    <TextInput
                    defaultValue = {this.state.email}
                    keyboardType='email-address'
                    style={styles.inputField}
                    />
                    <TextInput
                    placeholder= 'كلمة المرور'
                    placeholderTextColor="#a3a3a3"
                    secureTextEntry={true}
                    style={styles.inputField}
                    value={this.state.password}
                    />
                    <TextInput
                    placeholder= 'تأكيد كلمة المرور'
                    placeholderTextColor="#a3a3a3"
                    secureTextEntry={true}
                    style={styles.inputField}
                    value={this.state.confirmPassord}
                    />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.textStyle}>حفظ التغييرات</Text>
                    </TouchableOpacity>
                  
            </View>
        )
    }
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