import React, { Component } from 'react';
import { Image, View, TextInput, StyleSheet , Text ,TouchableOpacity, ActivityIndicator,Alert, ScrollView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import firebase from './firebase'
import MapView,{ Marker } from 'react-native-maps';
import { RadioButton } from 'react-native-paper';
import {PermissionsAndroid} from 'react-native';

// When you want to reset => Upload from Github.
console.disableYellowBox = true;
var Name='';
var userLati=0;//inital global variable to store user latitude from DB
var userLong=0;//inital global variable to store user longtitude from DB

export default class MissingPetUpload extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      userID: firebase.auth().currentUser.uid, 
      AnimalType:'',
      latitude:'',
      longitude:'',
      PetImage: null,
      uploading: false,
      //--------------------
      marker:
      {latitude: -82.8187050,
      longitude: 34.5320631},   
      userId:'',
      userID: firebase.auth().currentUser.uid,
      UserName: '',
      PetImage: null,
      uploading: false,
      region: {
        latitude:  24.774265,
        longitude: 46.738586,
        latitudeDelta: 1,
        longitudeDelta: 1
      },
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition()
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
  }


  SelectImage = async () => {
    let SelectResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    this.handleImageSelected(SelectResult);
  };


  handleImageSelected = async SelectResult => {
    try {
      this.setState({ uploading: true });

      if (!SelectResult.cancelled) {
        const uploadUrl = await uploadImageAsync(SelectResult.uri);
        this.setState({ PetImage: uploadUrl });
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


  RenderImage = () => {
    let { PetImage } = this.state;
    if (!PetImage) {
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
          <Image source={{ uri: PetImage }} style={{ width: 220, height: 180 }} />
        </View>
      </View>
    );
  };

  PublishMissingPetPost = () => {
        //-------------------new--------------------------
         //Previous regex: /^[\u0621-\u064A\040/\s/g]+$/ problem with g
                
        const ArabicExpression = /^[\u0621-\u064A\040/\s/]+$/ //Arabic letters and space only for type,sex,age and city.
        const AnimalTypecheck = ArabicExpression.test(this.state.AnimalType.trim());

        if (this.state.AnimalType.trim() === '') {
          Alert.alert('', 'يجب تعبئة حقل نوع الحيوان',[{ text: 'حسناً'}])}
          else if(this.state.marker.latitude === -82.8187050 || this.state.marker.longitude === 34.5320631){
            Alert.alert('', 'يجب تحديد موقع اخر مشاهدة للحيوان',[{ text: 'حسناً'}])
          }
          else if (AnimalTypecheck === false){
            Alert.alert('', 'يسمح بحروف اللغة العربية والمسافة فقط.',[{ text: 'حسناً'}])
          }
          /*else if (this.state.PetImage === null){
            Alert.alert('', 'يجب رفع صورة للحيوان',[{ text: 'حسناً'}])
          }*/
       else{
      //----------------------new--------------------------    
    firebase.database().ref('account/'+this.state.userID).once('value').then(snapshot => {
     Name= snapshot.val().name
     firebase.database().ref('MissingPetPosts/').push().set(
      {
       AnimalType: this.state.AnimalType.trim(),
       PetPicture: this.state.PetImage,
       userId: this.state.userID,
       uName: Name,
       latitude:this.state.latitude,
       longitude:this.state.longitude
      })
     })
    this.nearUsers();
     // /CANCEL/ at reports because we need to differ current and reporter.
     // (X) so maybe at line 168 send imortnant info (marker coords and name and id of reporter and maybe type of animal) to the reports page and work there.
     // if marker coords and current user location coords are near and current user is NOT OG reporter:
     // then send notification to current user with a normal paramter String like "A pet near you is missing" 
     // we can custimize the message like concact type of animal to to the string so its "A cat near you is missing"
     // maybe push token to userID (since he/she is the current user and not the reporter)
     // END
   
     this.props.navigation.navigate('الإبلاغ عن حيوان مفقود',{
       offerorID: this.state.userID, // also reporter ID
     })
     Alert.alert('', 'تمت اضافة البلاغ بنجاح. الرجاء تحديث صفحة البلاغات',[{ text: 'حسناً'}])
    } 
    }

    //-------------------------To Find all near users----------------------------------------
    nearUsers =()=>{         
      let userInfo
      firebase.database().ref('account/TBvi5x2sTTWWzP6XsplIQhaX5ce2').on('value', (snapshot)=>{
        userInfo = snapshot.val()
        userLati=userInfo.UserLat;
        userLong=userInfo.UserLong;
      })
      var geodist = require('geodist')
      var LoggedinUserLoc= {lat: userLati, lon: userLong}//this is current user location
      var reportLoc = {lat: this.state.latitude, lon: this.state.longitude}
      var dist = geodist(LoggedinUserLoc,reportLoc,{exact: true, unit: 'km'})//calcualte distance in Km
      console.log(dist+'km') 
      // If the report is of 4 KM of loggedinuser and the loggedinuser is NOT who posted the report:
      if( (dist < 4)){ //here we need to check that the user is not the offeror i deleted it for now...
      this.sendPushNotification();
      console.log("Call 'send' method here.")}
    }

    //------------------------------------------------------------------------------

    sendPushNotification=()=>{ //i think we can get user id by sending it from method near users!
      // Get the offeror push_token to send the notification
      let LoggedinUserToken
      //this is a temp id to try the method
      firebase.database().ref('account/TBvi5x2sTTWWzP6XsplIQhaX5ce2/push_token/data').on('value', (snapshot)=>{
        LoggedinUserToken = snapshot.val()
      })
  
      // Push the notification
      console.log('The token is '+LoggedinUserToken)
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
          //body: message
        })
      });
    }
  render(){ 
    let { PetImage } = this.state;
      return (
        <ScrollView style={{ backgroundColor:'#FFFCFC' }}>
        <View style={styles.container}>
        <Image
        style={{ width: 65, height: 70,marginBottom:30,marginTop:30,}}
        source={require('./assets/AleefLogoCat.png')}/>
        <TextInput
          placeholder="*نوع الحيوان"
          placeholderTextColor="#a3a3a3"
          style={styles.inputField}
          value={this.state.AnimalType}
          maxLength={20} //---------------------------------------------------------------
          onChangeText={(val) => this.updateInputVal(val, 'AnimalType')
        }
        />
         <TouchableOpacity onPress={() => this.SelectImage()}
                       style={styles.buttonUploadPhoto}>
                    <Text style={styles.textStyleUploadPhoto}>*رفع صورة للحيوان</Text>
                    </TouchableOpacity>
                    {this.RenderImage()}
                    {this.RenderUploading()}
                    <Text style={{color: '#5F5F5F', fontSize: 16, marginBottom:10, marginTop:10}}>*تحديد موقع اخر مشاهدة للحيوان</Text>
                        <MapView style={styles.mapStyle} 
                         initialRegion={this.state.region}
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
                        onPress={(e) => this.setState({ marker: e.nativeEvent.coordinate, longitude:e.nativeEvent.coordinate.longitude, latitude:e.nativeEvent.coordinate.latitude})}
                       >
                        <Marker coordinate={this.state.marker} 
                         onPress={e => console.log(e.nativeEvent)}
                         />
                       </MapView>
                       
        <Text style={styles.mandatoryTextStyle}>جميع الحقول المسبوقة برمز النجمة (*) مطلوبة.</Text>
        <TouchableOpacity onPress={()=> this.PublishMissingPetPost()}
         style={styles.button}>
         <Text style={styles.textStyle}>نشر</Text>
         </TouchableOpacity>
        </View>
        </ScrollView>
    );
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
  mandatoryTextStyle: {
    color: 'red',
    fontSize: 13,
    marginTop: 5,
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
mapStyle: {
  width: 300,
  height: 220,
},
})