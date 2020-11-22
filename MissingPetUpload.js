import React, { Component } from 'react';
import { Image, View, TextInput, StyleSheet , Text ,TouchableOpacity, ActivityIndicator,Alert, ScrollView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import firebase from './firebase'
import MapView,{ Marker } from 'react-native-maps';
import { RadioButton } from 'react-native-paper';
import {PermissionsAndroid} from 'react-native';
import {Picker} from '@react-native-community/picker';
import MissingPetsScreen from './MissingPetPosts';


console.disableYellowBox = true;
var Name='';
var userLati=0;
var userLong=0;
var UserLocation= [];
export default class MissingPetUpload extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      userID: firebase.auth().currentUser.uid, 
      AnimalType: 'غير محدد',
      latitude:'',
      longitude:'',
      PetImage: null,
      uploading: false,
      offerStatus: 'متاح', //-----------------new: status1
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

  PublishMissingPetPost = async () => {
        //-------------------new--------------------------                
        const ArabicExpression = /^[\u0621-\u064A\040/\s/]+$/ //Arabic letters and space only for type,sex,age and city.
        const AnimalTypecheck = ArabicExpression.test(this.state.AnimalType.trim());

        if(this.state.AnimalType === 'غير محدد'){
          Alert.alert('', 'يجب اختيار نوع حيوان  ',[{ text: 'حسناً'}])
        }
        else if (this.state.PetImage === null){
          Alert.alert('', 'يجب رفع صورة للحيوان',[{ text: 'حسناً'}])
        }
          else if(this.state.marker.latitude === -82.8187050 || this.state.marker.longitude === 34.5320631){
            Alert.alert('', 'يجب تحديد موقع اخر مشاهدة للحيوان',[{ text: 'حسناً'}])
          }
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
       longitude:this.state.longitude,
       offerStatus: this.state.offerStatus //-------------new: Status 2
      })
     })
    this.nearUsers();
    await new MissingPetsScreen().render();   
     this.props.navigation.navigate('البلاغات',{
       offerorID: this.state.userID, //also reporter ID
     })
     Alert.alert('', 'تمت اضافة البلاغ بنجاح',[{ text: 'حسناً'}])
    } 
    }
    //-----------------------To Find all near users and send notifications to them----------------------------------
    nearUsers =()=>{         
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
        var reportLoc = {lat: this.state.latitude, lon: this.state.longitude}//this is the report location
        var dist = geodist(UserLoc,reportLoc,{exact: true, unit: 'km'})//calcualte distance in Km
        console.log(dist+'km')
        if(dist<=3 && element.uID!=this.state.userID){
          firebase.database().ref('account/'+element.uID+'/push_token/data').on('value', (snapshot)=>{
            LoggedinUserToken = snapshot.val()
          })      
          // Push the notification
          console.log('The token is '+LoggedinUserToken)
          firebase.database().ref('account/'+this.state.userID).once('value').then(snapshot => {
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
    //------------------------------------------------------------------------------

  render(){ 
    let { PetImage } = this.state;
      return (
        <ScrollView style={{ backgroundColor:'#FFFCFC' }}>
        <View style={styles.container}>
        <Image
        style={{ width: 65, height: 70,marginBottom:30,marginTop:30,}}
        source={require('./assets/AleefLogoCat.png')}/>
        
        
        <Text style={{marginLeft:145, marginBottom:5,color: '#5F5F5F',fontSize: 15,}}>*نوع الحيوان:</Text>
        <Picker
        selectedValue={this.state.AnimalType}
        style={{height: 50, width: 160}}
        itemStyle={styles.itemStyle}
        onValueChange={(val) => this.updateInputVal(val, 'AnimalType')}
        >
       <Picker.Item label= "غير محدد" value= "غير محدد" />
       <Picker.Item label="أرنب" value="أرنب" />
       <Picker.Item label="عصفور" value="عصفور" />
       <Picker.Item label="قط" value="قط" />
       <Picker.Item label="كلب" value="كلب" />
       </Picker>



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
itemStyle: {
  textAlign: 'center',
}
})