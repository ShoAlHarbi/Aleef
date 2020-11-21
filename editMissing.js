import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl,ActivityIndicator ,Alert, TextInput,navigation} from 'react-native';
import { RadioButton } from 'react-native-paper';
import {Picker} from '@react-native-community/picker'; 
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import MapView,{ Marker } from 'react-native-maps';
import {PermissionsAndroid} from 'react-native';
import uuid from 'react-native-uuid';
import firebase from './firebase';
import { render } from 'react-dom';


var Name='';
var UserLocation= [];
//var sendNotification = false;
var userLati=0;
var userLong=0;

export default function editMissing({ route,navigation }) {

    // Information we need from the offer that needs to be edited.
    const currenUID = firebase.auth().currentUser.uid // Current user
    const { thread } = route.params;
    const Name = route.params.Name;
    const postid = route.params.postid; // Post ID
    const region = route.params.region;

    //Original offer elements to use them to compare and validate.
    const OGPic = route.params.AnimalPic;
    const OGType = route.params.AnimalType;
    const OGLat = route.params.Lat;
    const OGLong = route.params.Long;


    const [AniPic, setAnimalPic] =useState(route.params.AnimalPic) // Set new pic
    const [AniType, setAnimalType] =useState(route.params.AnimalType) // Set new type
    const [AniLat, setAniLat] =useState(route.params.Lat) // Set new lat
    const [AniLong, setAniLong] =useState(route.params.Long) // Set new long
    const [marker, setMarker] =useState(route.params.Lat,route.params.Long)
    const [uploading, setUploading] =useState(false) // For pic





    useEffect ( ()=> {
       navigator.geolocation.getCurrentPosition()
       Permissions.askAsync(Permissions.CAMERA_ROLL);
    }, []);


//-------------------------------------Image methods start---------------------------

async function SelectImage (){
  let SelectResult = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
  });
  handleImageSelected(SelectResult);
};


async function handleImageSelected (SelectResult) {
  try {
    setUploading(true);

    if (!SelectResult.cancelled) {
      const uploadUrl = await uploadImageAsync(SelectResult.uri);
      setAnimalPic(uploadUrl);
    }
  } catch (e) {
    console.log(e);
    Alert.alert('', 'فشل رفع الصورة',[{ text: 'حسناً'}])
  } finally {
    setUploading(false);
  }
};


 function RenderUploading () {
  if (uploading) {
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


 function RenderImage () {
  if (!AniPic) {
    return;
  }

  return (
    <View
      style={{
        marginTop: 30,
        width: 220,
        borderRadius: 3,
        elevation: 2,
      }}>
      <View
        style={{
          borderTopRightRadius: 3,
          borderTopLeftRadius: 3,
          shadowColor: 'rgba(0,0,0,1)',
          shadowOpacity: 0.2,
          shadowOffset: { width: 4, height: 4 },
          shadowRadius: 5,
          overflow: 'hidden',
        }}>
        <Image source={{ uri: AniPic }} style={{ width: 220, height: 180 }} />
      </View>
    </View>
  );
};


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
//-------------------------------------Image methods ends----------------------------

//-------------------------------------Notification start----------------------------
   //-----------------------To Find all near users and send notifications to them----------------------------------
   function nearUsers (){ 
    var LoggedinUserToken =''; //A possible solution because of error (cant find varible)      
    var ref = firebase.database().ref("account");
        ref.on('value',  function (snapshot){
       var accountInfo = snapshot.val()
      var userIds = Object.keys(accountInfo);// to find the acoount IDs and put them in an array
      for(var i = 0; i< userIds.length;i++){
      var userInfo = userIds[i];
      userLati=accountInfo[userInfo].UserLat;
      userLong=accountInfo[userInfo].UserLong;
      //I needed this array because the state is not working inside for loop
      UserLocation[i]={
        uLat: userLati,
        uLong:userLong,
        uID: userInfo
      }
      }
    })
   UserLocation.map(element => {//map the array to calculate the distance for each user and send them notification
      var geodist = require('geodist')
      var UserLoc= {lat: element.uLat, lon: element.uLong}//this is current user location
      var reportLoc = {lat: AniLat, lon: AniLong}//this is the report location
      var dist = geodist(UserLoc,reportLoc,{exact: true, unit: 'km'})//calcualte distance in Km
      console.log(dist+'km')
      if(dist<=3 && element.uID!=currenUID){
        firebase.database().ref('account/'+element.uID+'/push_token/data').on('value', (snapshot)=>{
            LoggedinUserToken = snapshot.val()
        })
        // Push the notification
        console.log('The token is '+LoggedinUserToken)
        firebase.database().ref('account/'+currenUID).once('value').then(snapshot => {
          Name= snapshot.val().name})
        let response = fetch('https://exp.host/--/api/v2/push/send',{
          method: 'POST',
          headers: {
            Accept: 'application/json',
           'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: LoggedinUserToken,
            sound: 'default',
            title: 'يوجد حيوان أليف مفقود بالقرب منك',
            body: 'ساعد '+Name+' لإيجاد الحيوان المفقود'
          })
        });
      }
    })
  }
//-------------------------------------Notification end------------------------------



//-------------------------------------edit methods start---------------------------

function confirmEdit (){


  if(OGType === AniType &&  OGPic === AniPic && OGLat=== AniLat && OGLong === AniLong ){
    Alert.alert('', 'لم تقم بتعديل أي من بيانات البلاغ ليتم حفظها.',[{ text: 'حسناً'}])
  }
  else if(AniType === 'غير محدد'){
    Alert.alert('', 'لا يمكنك التعديل بقيم فارغة أو غير محددة',[{ text: 'حسناً'}])
  }
else{
  Alert.alert(
    "",
    "هل تود حفظ هذه التغييرات؟",
    [
      {
        text: "لا",
        onPress: () => console.log("لا"),
        style: "cancel"
      },
      { text: "نعم", onPress: () => edit() }
    ],
    { cancelable: false }
  );
}
} 

function edit (){

  firebase.database().ref('/MissingPetPosts/'+postid).update({
    AnimalType: AniType,
    PetPicture: AniPic,
    latitude: AniLat,
    longitude: AniLong,
  }).then((data) => {
    Alert.alert('', 'تم حفظ التغييرات بنجاح، يرجى تحديث صفحة البلاغات',[{ text: 'حسناً'}])
  });
  nearUsers();   
  navigation.navigate('الإبلاغ عن حيوان مفقود')
}
//-------------------------------------edit methods ends----------------------------

        return (
        <View>
       <ScrollView style={{ backgroundColor:'#FFFCFC' }}>
       <View style={styles.container}>

        <Image
        style={{ width: 65, height: 70,marginBottom:30,marginTop:30,}}
        source={require('./assets/AleefLogoCat.png')}/>

        
        <Text style={{marginLeft:145, marginBottom:5,color: '#5F5F5F',fontSize: 15,}}>نوع الحيوان:</Text>
        <Picker
        selectedValue={AniType}
        style={{height: 50, width: 160}}
        itemStyle={styles.itemStyle}
        onValueChange={(val) => setAnimalType(val)}
        >
       <Picker.Item label= "غير محدد" value= "غير محدد" />
       <Picker.Item label="أرنب" value="أرنب" />
       <Picker.Item label="عصفور" value="عصفور" />
       <Picker.Item label="قط" value="قط" />
       <Picker.Item label="كلب" value="كلب" />
       </Picker>
        
<TouchableOpacity onPress={() => SelectImage()}
                       style={styles.buttonUploadPhoto}>
                    <Text style={styles.textStyleUploadPhoto}>تعديل صورة الحيوان</Text>
                    </TouchableOpacity>
                    {RenderImage()}
                    {RenderUploading()}


                    <Text style={{color: '#5F5F5F', fontSize: 16, marginBottom:10, marginTop:10}}>تحديد موقع اخر مشاهدة للحيوان</Text>
                        <MapView style={styles.mapStyle} 
                         initialRegion={{
                          latitude:  24.774265,
                          longitude: 46.738586,
                          latitudeDelta: 1,
                          longitudeDelta: 1
                         }}
                         provider="google"
                         showsUserLocation={true}
                         showsMyLocationButton={true}
                         zoomControlEnabled={true}
                         moveOnMarkerPress={true}
                         onMapReady={() => {
                          PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                          )
                        }}
                        onPress={(e) => {setMarker(e.nativeEvent.coordinate),setAniLong(e.nativeEvent.coordinate.longitude) ,setAniLat(e.nativeEvent.coordinate.latitude)}}
                       >
                        <Marker coordinate={{ latitude:AniLat,longitude: AniLong}}
                         onPress={e => console.log(e.nativeEvent)}
                         />
                       </MapView>



        <TouchableOpacity
         style={styles.button} onPress={() => confirmEdit()}>
         <Text style={styles.textStyle}>تعديل</Text>
         </TouchableOpacity>

        </View>
        </ScrollView>
        </View>


          );
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
  margin: 5,
},
button: {
  backgroundColor: '#69C4C6',
  padding: 10,
  width: 150,
  alignItems: "center",
  marginTop: 10,
  marginBottom: 10,
  borderRadius: 20,
},
textStyle: {
color: 'white',
fontSize: 17,
fontWeight: 'bold',
},
textStyleUploadPhoto: {
color: '#5F5F5F',
fontSize: 16,
},
buttonUploadPhoto: {
backgroundColor: '#e3e3e3',
padding: 10,
width: 150,
alignItems: "center",
marginTop: 10,
marginBottom: 10,
borderRadius: 20,
},
itemStyle: {
textAlign: 'center',
},
mapStyle: {
  width: 300,
  height: 220,
},
 });          
