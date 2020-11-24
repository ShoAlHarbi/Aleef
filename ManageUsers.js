import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'


import firebase from './firebase';

export default class ManageUsers extends Component {
        constructor() {
          super();
          this.state = { 
            AllUsers: [],
          }
        }

        componentDidMount() {
          firebase.database().ref('/account').on('value', (snapshot) =>{
            var userslist = []
            snapshot.forEach((child)=>{
             userslist.push({
              userid: child.key,
              name:child.val().name, 
              email: child.val().Email,
              status: child.val().Userstatus
            })
          })
         this.setState({
           AllUsers:userslist,
          })
        })
       }

       disoption = (userid) =>{ 
        Alert.alert(
          "",
          "هل تود إلغاء تفعيل هذا المستخدم؟",
          [
            {
              text: "لا",
              onPress: () => console.log("لا"),
              style: "cancel"
            },
            { text: "نعم", onPress: () => this.disableUser(userid) }
          ],
          { cancelable: false }
        );
       }

       enoption = (userid) =>{ 
        Alert.alert(
          "",
          "هل تود إعادة تفعيل هذا المستخدم؟",
          [
            {
              text: "لا",
              onPress: () => console.log("لا"),
              style: "cancel"
            },
            { text: "نعم", onPress: () => this.EnableUser(userid) }
          ],
          { cancelable: false }
        );
       }

       

       disableUser = (userid) => {
        firebase.database().ref('account/'+userid)
        .update({
          Userstatus: 'disabled'
        }).then((data) => {
          Alert.alert('', 'تم إلغاء تفعيل هذا المستخدم بنجاح',[{ text: 'حسناً'}])
        });
      } 
      
      EnableUser = (userid) => {
        firebase.database().ref('account/'+userid)
       .update({
         Userstatus: 'enable'
       }).then((data) => {
        Alert.alert('', 'تمت إعادة تفعيل هذا المستخدم بنجاح',[{ text: 'حسناً'}])
      });
     } 
      
        
          render(){
            
            return(
              <View style={{flex:1, alignSelf:'center', justifyContent:'center',backgroundColor:'#FFFCFC', width:380}}>
              <FlatList style={{width:'100%', marginLeft:40}}
              data={this.state.AllUsers}
              keyExtractor={(item)=>item.userid}
              renderItem={({item})=>{
              if ( item.status === 'disabled'){ 
              return(
                <View style={styles.Post} >
                   <Text style={{textAlign: 'right', fontWeight: 'bold',color:'#3fa5a6' }} >اسم المستخدم:</Text>
                   <Text style={{textAlign: 'right',color:'#283958'}} >{item.name}</Text>
                   <Text style={{textAlign: 'right', fontWeight: 'bold',color:'#3fa5a6'}} >البريد الالكتروني:</Text>
                   <Text style={{textAlign: 'right',color:'#283958'}} >{item.email}</Text>
                   <View>
                   <TouchableOpacity style={styles.button} onPress={() => this.enoption(item.userid)} > 
                   <Text style={{color:'white', fontWeight: 'bold'}}>اعادة التفعيل</Text> 
                   </TouchableOpacity>
                   </View>
                </View>)}
                else if (item.email === 'admin@gmail.com'){
                  return
                } else if (item.email === 'undefined'){ 
                  return
                }
                else{ 
                  return(
                    <View style={styles.Post} >
                       <Text style={{textAlign: 'right', fontWeight: 'bold',color:'#3fa5a6' }} >اسم المستخدم:</Text>
                       <Text style={{textAlign: 'right',color:'#283958'}} >{item.name}</Text>
                       <Text style={{textAlign: 'right', fontWeight: 'bold',color:'#3fa5a6'}} >البريد الالكتروني:</Text>
                       <Text style={{textAlign: 'right',color:'#283958'}} >{item.email}</Text>
                       <View>
                       <TouchableOpacity style={styles.button} onPress={() => this.disoption(item.userid)} > 
                       <Text style={{color:'white', fontWeight: 'bold'}}>الغاء التفعيل</Text> 
                       </TouchableOpacity>
                       </View>
                    </View>)
                }
              }}/>
              </View>
            )
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
      position: 'absolute', 
      backgroundColor: '#69C4C6',
      padding: 10,
      width: 90,
      alignItems: "center",
      borderRadius: 20,
      bottom: 15
    },
    button2: {
      padding: 8,
      width: 125,
      marginLeft: 160,
      marginTop:50
  },

  Post:{
    backgroundColor:'white',
      shadowColor: "#000",
      shadowOffset: {
      width: 0,
      height: 1,
      },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: 15,
    width:310,
    margin: 3,
    padding: 7
    },

});