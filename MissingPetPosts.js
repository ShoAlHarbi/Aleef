import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl,Alert} from 'react-native';
import firebase from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComments} from '@fortawesome/free-solid-svg-icons';
import MapView,{ Marker } from 'react-native-maps';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import * as Permissions from 'expo-permissions'; //Copied from chatScreen
import * as Notifications from 'expo-notifications' //Copied from chatScreen

var MissingPetPostsData= [];
//-----------------------------------------------
// 1- Global varibles: intially zero but then set them to marker cooordinates (lat and long) of recent report:
var reportLocationLat= 0;
var reportLocationLong= 0;
var reportPosterID =''; // need this to make sure that current user != offeror
//var reportAnimalType =''; //need this later to make msg in notification more costumized.  
//-----------------------------------------------

export default class MissingPetPosts extends Component {
        constructor(props) {
          super(props);
          this.state = { 
            LoggedinUserID: firebase.auth().currentUser.uid, // need this to make sure that current user != offeror
            refreshing: false,
            region: {
              latitude:  24.774265,
              longitude: 46.738586,
              latitudeDelta: 8,
              longitudeDelta: 15
            },
            //--------------Inital points------------------
            UserLocation:{
              latitude:  0,
              longitude: 0,
            },
            //---------------------------------------------
          }
        }
        _onRefresh = () => {
          setTimeout(() => this.setState({ refreshing: false }), 1000);
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

        //---------------------Calcualte distance between 2 locations-------------------
        nearUsers =()=>{
          var geodist = require('geodist')
          var LoggedinUserLoc= {lat: this.state.UserLocation.latitude, lon: this.state.UserLocation.longitude}//this is current user location
          console.log("1- Inside nearUsers: LoggedinUserLoc: lat:"+LoggedinUserLoc.lat + " lon:"+LoggedinUserLoc.lon)
          var reportLoc = {lat: reportLocationLat, lon: reportLocationLong}
          console.log("2- Inside nearUsers: reportLoc lat: "+reportLoc.lat+ " lon: "+reportLoc.lon)
          var dist = geodist(LoggedinUserLoc,reportLoc,{exact: true, unit: 'km'})//calcualte distance in Km
          console.log("3- Inside nearUsers: The distance is: "+dist)
          console.log("--------------------------------------------")
          // If the report is of 4 KM of loggedinuser and the loggedinuser is NOT who posted the report:
          if( (dist < 4) && (this.state.LoggedinUserID != reportPosterID) ){  //Should we add not equal to admin?
          this.sendPushNotification();
          console.log("Call 'send' method here.")}
        }
        //------------------------------------------------------------------------------
         
    sendPushNotification=()=>{
    // Get the offeror push_token to send the notification
    let LoggedinUserToken
    firebase.database().ref('account/'+this.state.LoggedinUserID+'/push_token/data').on('value', (snapshot)=>{
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

        onPressTrashIcon = (postid) => {
          Alert.alert(
            "",
            "هل تود حذف هذا البلاغ؟",
            [
              {
                text: "لا",
                onPress: () => console.log("لا"),
                style: "cancel"
              },
              { text: "نعم", onPress: () => this.onPressDelete(postid) }
            ],
            { cancelable: false }
          );
         }

         onPressDelete = (postid) => {
          MissingPetPostsData= MissingPetPostsData.filter(item => item.postid !== postid)
           firebase.database().ref('/MissingPetPosts/'+postid).remove().then((data) => {
             this.readPostData(); 
             Alert.alert('', 'لقد تم حذف بلاغ الحيوان المفقود بنجاح. الرجاء تحديث صفحة البلاغات',[{ text: 'حسناً'}])
           });
         }

        MissingPetUpload = () => this.props.navigation.navigate('اضافة بلاغ')

        onPressChatIcon = (offerorID, Name) => {
          this.props.navigation.navigate('صفحة المحادثة',{
            offerorID: offerorID,
            name: Name
          })
        }

        readPostData =() => {
          var ref = firebase.database().ref("MissingPetPosts");
          ref.on('value',  function (snapshot) {
            var post = snapshot.val();
            //-------------------------------------------------------------------------           
            //This block of code is to prevent null error when array is empty: 
            if (post === null){
              return(
              <View style={{ marginBottom:30}}>
              <View style={styles.Post}>
              <Text style={styles.mandatoryTextStyle}>لا توجد بلاغات حاليا.</Text>
              </View>
              </View>
               ); 
               }
            //------------------------------------------------------------------------ 
            var postKeys = Object.keys(post);// to find the post keys and put them in an array
            for(var i = 0; i< postKeys.length;i++){
              var postInfo = postKeys[i];
              //---------This to save the post info in variables----------
              var AniType= post[postInfo].AnimalType; 
              var AniPic= post[postInfo].PetPicture; 
              var Long= post[postInfo].longitude; 
              var Lat= post[postInfo].latitude;
              var UserName = post[postInfo].uName;
              var offerorID = post[postInfo].userId;  
              var postidentification = postInfo;  
              //----------------Adoption Posts Array-----------------------
              MissingPetPostsData[i]={
                AnimalType: AniType,
                AnimalPic: AniPic,
                LongA: Long,
                LatA: Lat,
                Name:UserName,
                offerorID: offerorID,
                postid: postidentification
              }  
              //-----------------------------------------------
              // 3- The goal here: Set the value of the last report coordinates to the global varibles.
              if (  i  == (postKeys.length-1)  ){ // to get the last element in array = most recent report.
                reportLocationLat= post[postInfo].latitude; // set value of lat (from databse) of the most recent report to reportLocationLat
                reportLocationLong= post[postInfo].longitude; // set value of long (from databse) of the most recent report to reportLocationLong
                reportPosterID = post[postInfo].userId;
                console.log("4- Inside if: reportLocationLat: "+reportLocationLat+ " reportLocationLong: "+reportLocationLong)
              }
              //-----------------------------------------------

            }         
          });         
          return MissingPetPostsData.map(element => {
            if(element.offerorID == firebase.auth().currentUser.uid){
              return (
                <View style={{ marginBottom:30}}>
                  <View style={styles.Post}>
                  <Image style={{ width: 290, height: 180 ,marginLeft:10, marginTop:12,}}
                    source={{uri: element.AnimalPic}}/>
                    <Text style={styles.text}>{"اسم صاحب العرض: "+element.Name}</Text>
                  <Text style={styles.text}>{"نوع الحيوان: "+element.AnimalType}</Text>
                  <Text style={styles.text}>{"موقع اخر مشاهدة للحيوان: "}</Text>
                  <MapView style={styles.mapStyle}
                  region={{
                    latitude: element.LatA,
                    longitude: element.LongA,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                  }}
                  provider="google"
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  zoomControlEnabled={true}
                  moveOnMarkerPress={true}
                  >
                  <Marker coordinate={{ latitude:element.LatA,longitude: element.LongA}}/>
                  </MapView>
                  <TouchableOpacity 
                     style={styles.iconStyle}
                     onPress={()=> this.onPressTrashIcon(element.postid)}>
                     <FontAwesomeIcon icon={ faTrashAlt }size={30} color={"#69C4C6"}/>
                    </TouchableOpacity>
                </View>
                </View>          
              );
            }
            else{
            return (
              <View style={{ marginBottom:30}}>
                <View style={styles.Post}>
                <Image style={{ width: 290, height: 180 ,marginLeft:10, marginTop:12,}}
                  source={{uri: element.AnimalPic}}/>
                  <Text style={styles.text}>{"اسم صاحب العرض: "+element.Name}</Text>
                  <Text style={styles.text}>{"نوع الحيوان: "+element.AnimalType}</Text>
                  <Text style={styles.text}>{"موقع اخر مشاهدة للحيوان: "}</Text>
                  <MapView style={styles.mapStyle}
                  region={{
                    latitude: element.LatA,
                    longitude: element.LongA,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                  }}
                  provider="google"
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  zoomControlEnabled={true}
                  moveOnMarkerPress={true}
                  >
                  <Marker coordinate={{ latitude:element.LatA,longitude: element.LongA}}/>
                  </MapView>
                <TouchableOpacity 
                style={styles.iconStyle}
                onPress={()=> this.onPressChatIcon(element.offerorID, element.Name)}>
                <FontAwesomeIcon icon={ faComments }size={36} color={"#69C4C6"}/>
              </TouchableOpacity>
              </View>
           
              </View>
              
            );}
          }).reverse();
      }
        render(){ 
              return (
                <ScrollView style={{ backgroundColor:'#FFFCFC' }}
                refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
                }
                >
                <View style={styles.container}>
                
                  <View style={styles.container2}>
                  <View><Image
                        style={{ width: 65, height: 70,marginBottom:10, marginTop:30 }}
                        source={require('./assets/AleefLogoCat.png')}/>
                  </View>
                  </View>
                    <TouchableOpacity onPress={() => this.MissingPetUpload()}
                       style={styles.button}>
                    <Text style={styles.textStyle}>اضافة بلاغ</Text>
                    </TouchableOpacity>
                    {this.readPostData()}
                    {this.nearUsers()}

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
      padding:8,
      left: 30
    },
    mapStyle: {
      width: 290, height: 180 ,marginLeft:10, marginBottom:12
    },
    mandatoryTextStyle: { 
     color: 'red',
     fontSize: 13,
     marginTop: 5,
    }
});