import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import firebase from './firebase';

var SellingPostsData= [];
var userName='';
export default class SellingOffersScreen extends Component {
        constructor(props) {
          super(props);
          //this.state = { 
          //}
        }

        SellingUpload = () => this.props.navigation.navigate('رفع منشور البيع')

        readPostData =() => {
            var ref = firebase.database().ref("SellingPosts");
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
                var petPrice= post[postInfo].price; 
                var UserName = post[postInfo].uName; 
                //----------------Adoption Posts Array-----------------------
                SellingPostsData[i]={
                  User: userName,
                  AnimalType: AniType,
                  AnimalSex: AniSex,
                  AnimalAge: AniAge,
                  AnimalCity: AniCity,
                  AnimalPic: AniPic,
                  AnimalPrice: petPrice,
                  Name: UserName
                }  
              }         
            });         
            return SellingPostsData.map(element => {
              return (
                <View style={{ marginBottom:30}}>
                  <View>
                  <Image style={{ width: 280, height: 180 }}
                    source={{uri: element.AnimalPic}}/>
                    <Text style={styles.text}>{"اسم صاحب العرض: "+element.Name}</Text>
                  <Text style={styles.text}>{"نوع الحيوان: "+element.AnimalType}</Text>
                  <Text style={styles.text}>{"جنس الحيوان: "+element.AnimalSex}</Text>
                  <Text style={styles.text}>{"عمر الحيوان: "+element.AnimalAge}</Text>
                  <Text style={styles.text}>{"المدينة: "+element.AnimalCity}</Text>
                  <Text style={styles.text}>{"السعر: "+element.AnimalPrice}</Text>
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
                    <TouchableOpacity onPress={() => this.SellingUpload()}
                       style={styles.button}>
                    <Text style={styles.textStyle}>رفع منشور البيع</Text>
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
  }
});

