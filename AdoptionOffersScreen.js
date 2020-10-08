import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import firebase from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComments} from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'



var AdoptionPostsData= [];
var userName='';
// var offerorID = '';
export default class AdoptionOffersScreen extends Component {
        constructor(props) {
          super(props);
          //this.state = { 
          //}
        }
        AdoptionUpload = () => this.props.navigation.navigate('رفع منشور التبني')
        onPressChatIcon = (offerorID , Name) => {
          this.props.navigation.navigate('صفحة المحادثة',{
            offerorID: offerorID,
            name: Name
          })
        }
        readPostData =() => {
            var ref = firebase.database().ref("AdoptionPosts");
            ref.on('value',  function (snapshot) {
              var post = snapshot.val();
              var postKeys = Object.keys(post);// to find the post keys and put them in an array
              for(var i = 0; i< postKeys.length;i++){
                var postInfo = postKeys[i];
                //---------This to save the post info in variables----------
                var AniType= post[postInfo].AnimalType; 
                var AniSex= post[postInfo].AnimalSex; 
                var AniAge= post[postInfo].AnimalAge; 
                var AniCity= post[postInfo].City; 
                var AniPic= post[postInfo].PetPicture; 
                var UserName = post[postInfo].uName;
                var offerorID = post[postInfo].userId;  
                //----------------Adoption Posts Array-----------------------
                AdoptionPostsData[i]={
                  User: userName,
                  AnimalType: AniType,
                  AnimalSex: AniSex,
                  AnimalAge: AniAge,
                  AnimalCity: AniCity,
                  AnimalPic: AniPic,
                  Name: UserName,
                  offerorID: offerorID
                }  
              }         
            });         
            return AdoptionPostsData.map(element => {
              return (
                <View style={{ marginBottom:30}}>
                  <View style={styles.Post}>
                  <Image style={{ width: 290, height: 180 ,marginLeft:10, marginTop:12 }}
                    source={{uri: element.AnimalPic}}/>
                    <Text style={styles.text}>{"اسم صاحب العرض: "+element.Name}</Text>
                  <Text style={styles.text}>{"نوع الحيوان: "+element.AnimalType}</Text>
                  <Text style={styles.text}>{"جنس الحيوان: "+element.AnimalSex}</Text>
                  <Text style={styles.text}>{"عمر الحيوان: "+element.AnimalAge}</Text>
                  <Text style={styles.text}>{"المدينة: "+element.AnimalCity}</Text>
                  <Text/>
                  <TouchableOpacity 
                  style={styles.iconStyle}
                  onPress={()=> this.onPressChatIcon(element.offerorID,element.Name)}>
                  <FontAwesomeIcon icon={ faComments }size={36} color={"#69C4C6"}/>
                </TouchableOpacity>
                <Text/>
              
                </View>
                </View>
                
              );
            });
        }
        render(){ 
              return (
                <ScrollView style={{ backgroundColor:'#FFFCFC' }}>
                <View style={styles.container}>
                  <View style={styles.container2}>
                  <View><Image
                        style={{ width: 50, height: 50,marginBottom:10, marginTop:10 }}
                        source={require('./assets/AleefLogoCat.png')}/>
                  </View>
                  </View>
                    <TouchableOpacity 
                    style={{alignContent: "center"}}
                    onPress={() => this.AdoptionUpload()}
                       style={styles.button}>
                    <Text style={styles.textStyle}>رفع منشور التبني</Text>
                    </TouchableOpacity>
                    {this.readPostData()} 
                </View>
                </ScrollView>
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
      flexDirection: 'row'
  },
    textStyle:{
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    text:{
        color:'black',
        fontSize: 17,
        marginRight:12,
        marginBottom:5,
    },

    button: {
        backgroundColor: '#69C4C6',
        padding: 10,
        width: 150,
        alignItems: "center",
        marginBottom: 25,
        marginTop: 15,
        borderRadius: 20,

    },
    button2: {
      padding: 8,
      width: 115,
      marginLeft: 80,
      marginBottom:200
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
  width:310
  },
  iconStyle: {
    padding:20,
    left: 30
  }
});

