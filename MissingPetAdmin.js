import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl,Alert, Modal, TouchableHighlight} from 'react-native';
import firebase from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComments} from '@fortawesome/free-solid-svg-icons';
import MapView,{ Marker } from 'react-native-maps';
import { faTrashAlt, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from 'react-native-paper';


var MissingPetPostsData= [];
var MissingPetPostsAfterCities= [];
var MissingPetPostsAfterType= [];
var postKeys2 = [];

export default class MissingPetAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      refreshing: false,
      region: {
        latitude:  24.774265,
        longitude: 46.738586,
        latitudeDelta: 8,
        longitudeDelta: 15,
      },
      modalVisible: false,
        // Animal type check
        isCat: false,
        isDog: false,
        isRabbit: false,
        isBird: false,
        // Offer status check
        isAvailable: false,
        isClosed: false,
        
    }
  }
        _onRefresh = () => {
          setTimeout(() => this.setState({ refreshing: false }), 1000);
        }

        onPressTrashIcon = (postid) => { // start edit this method
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
         } // end of edit this method

         onPressDelete = (postid) => { //new method
          MissingPetPostsData= MissingPetPostsData.filter(item => item.postid !== postid)
           firebase.database().ref('/MissingPetPosts/'+postid).remove().then(async (data) => {
            await this._onRefresh();
             this.readPostData(); 
             Alert.alert('', 'لقد تم حذف بلاغ الحيوان المفقود بنجاح.',[{ text: 'حسناً'}])
           });
         }  //new method

         filter = () =>{
          console.log('Hi')
          MissingPetPostsData=[];
          console.log('Filter entered '+MissingPetPostsData.length)
          MissingPetPostsAfterType= [];
          MissingPetPostsAfterCities= [];
          postKeys2 = [];
          this.readPostData()
        }


        readPostData =() => {
          MissingPetPostsData=[];
          MissingPetPostsAfterType= [];
          MissingPetPostsAfterCities= [];
          postKeys2 = [];

          // Type variables
          var cat = this.state.isCat
          var dog = this.state.isDog
          var rabbit = this.state.isRabbit
          var bird = this.state.isBird

          // Offer status variables
          var available= this.state.isAvailable
          var closed = this.state.isClosed


          var ref = firebase.database().ref("MissingPetPosts");
          ref.on('value',  function (snapshot) {
            var post = snapshot.val();
            var name;
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
            postKeys2 = []

            // -----------------------Available AND Closed offers case--------------------------
            if((!available && !closed) || (available && closed)){
            // ------------Animal type cases-------------
               if(cat || rabbit || bird || dog){
              MissingPetPostsData = [];
              if(cat==true){
                for(var i = 0; i< postKeys.length;i++){
                var postInfo = postKeys[i];
                if(post[postInfo].AnimalType !== 'قط')
                  continue;
                //---------This to save the post info in variables----------
                var AniType= post[postInfo].AnimalType; 
                  var AniPic= post[postInfo].PetPicture; 
                  var Long= post[postInfo].longitude; 
                  var Lat= post[postInfo].latitude;
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo;  
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  MissingPetPostsAfterType[i]={
                    AnimalType: AniType,
                    AnimalPic: AniPic,
                    LongA: Long,
                    LatA: Lat,
                    Name:name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                }  
              }         
            } // cat case end 

            // rabbit case
            if(rabbit==true){
              for(var i = 0; i< postKeys.length;i++){
                var postInfo = postKeys[i];
                if(post[postInfo].AnimalType !== 'أرنب')
                  continue;
                //---------This to save the post info in variables----------
                var AniType= post[postInfo].AnimalType; 
                  var AniPic= post[postInfo].PetPicture; 
                  var Long= post[postInfo].longitude; 
                  var Lat= post[postInfo].latitude;
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo;  
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  MissingPetPostsAfterType[i]={
                    AnimalType: AniType,
                    AnimalPic: AniPic,
                    LongA: Long,
                    LatA: Lat,
                    Name:name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                }  
              }         
            } // rabbit case end

            // Dog caase start
            if(dog==true){
              for(var i = 0; i< postKeys.length;i++){
                var postInfo = postKeys[i];
                if(post[postInfo].AnimalType !== 'كلب')
                  continue;
                //---------This to save the post info in variables----------
                var AniType= post[postInfo].AnimalType; 
                  var AniPic= post[postInfo].PetPicture; 
                  var Long= post[postInfo].longitude; 
                  var Lat= post[postInfo].latitude;
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo;  
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  MissingPetPostsAfterType[i]={
                    AnimalType: AniType,
                    AnimalPic: AniPic,
                    LongA: Long,
                    LatA: Lat,
                    Name:name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                }  
              }         
            } // Dog case end

            // Bird case start
            if(bird==true){
              console.log('Bird is true')
              for(var i = 0; i< postKeys.length;i++){
                var postInfo = postKeys[i];
                if(post[postInfo].AnimalType !== 'عصفور')
                  continue;
                //---------This to save the post info in variables----------
                var AniType= post[postInfo].AnimalType; 
                  var AniPic= post[postInfo].PetPicture; 
                  var Long= post[postInfo].longitude; 
                  var Lat= post[postInfo].latitude;
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo;  
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  MissingPetPostsAfterType[i]={
                    AnimalType: AniType,
                    AnimalPic: AniPic,
                    LongA: Long,
                    LatA: Lat,
                    Name:name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                }  
              }         
            } // Bird case end

            
            if( MissingPetPostsAfterType.length ==0){
              MissingPetPostsAfterType = null
            }
            else if(MissingPetPostsAfterType.length>0)
              MissingPetPostsData = MissingPetPostsAfterType
          }// End filter by Animal type

          if(MissingPetPostsAfterType == null ){
            MissingPetPostsData = null
          }
          
          if(!cat && !rabbit && !bird && !dog ){
              // ---------No Filter case-----------
              MissingPetPostsData = [];
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
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  MissingPetPostsData[i]={
                    AnimalType: AniType,
                    AnimalPic: AniPic,
                    LongA: Long,
                    LatA: Lat,
                    Name:name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                }  
              } 
            } }
            // --------------------------Available Reports case--------------------------
            else if(available){
              if(cat || rabbit || bird || dog){
                MissingPetPostsData = [];
                if(cat==true){
                  for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                  if(post[postInfo].AnimalType !== 'قط')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniPic= post[postInfo].PetPicture; 
                    var Long= post[postInfo].longitude; 
                    var Lat= post[postInfo].latitude;
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo;  
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    MissingPetPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalPic: AniPic,
                      LongA: Long,
                      LatA: Lat,
                      Name:name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // cat case end 
  
              // rabbit case
              if(rabbit==true){
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                  if(post[postInfo].AnimalType !== 'أرنب')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniPic= post[postInfo].PetPicture; 
                    var Long= post[postInfo].longitude; 
                    var Lat= post[postInfo].latitude;
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo;  
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    MissingPetPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalPic: AniPic,
                      LongA: Long,
                      LatA: Lat,
                      Name:name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // rabbit case end
  
              // Dog caase start
              if(dog==true){
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                  if(post[postInfo].AnimalType !== 'كلب')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniPic= post[postInfo].PetPicture; 
                    var Long= post[postInfo].longitude; 
                    var Lat= post[postInfo].latitude;
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo;  
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    MissingPetPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalPic: AniPic,
                      LongA: Long,
                      LatA: Lat,
                      Name:name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // Dog case end
  
              // Bird case start
              if(bird==true){
                console.log('Bird is true')
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                  if(post[postInfo].AnimalType !== 'عصفور')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniPic= post[postInfo].PetPicture; 
                    var Long= post[postInfo].longitude; 
                    var Lat= post[postInfo].latitude;
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo;  
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    MissingPetPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalPic: AniPic,
                      LongA: Long,
                      LatA: Lat,
                      Name:name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // Bird case end
  

              
              if( MissingPetPostsAfterType.length ==0){
                MissingPetPostsAfterType = null
              }
              else if(MissingPetPostsAfterType.length>0)
                MissingPetPostsData = MissingPetPostsAfterType
            }// End filter by Animal type
  
            if(MissingPetPostsAfterType == null ){
              MissingPetPostsData = null
            }
            
            if(!cat && !rabbit && !bird && !dog ){
                // ---------No Filter case-----------
                MissingPetPostsData = [];
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniPic= post[postInfo].PetPicture; 
                    var Long= post[postInfo].longitude; 
                    var Lat= post[postInfo].latitude;
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo;  
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    MissingPetPostsData[i]={
                      AnimalType: AniType,
                      AnimalPic: AniPic,
                      LongA: Long,
                      LatA: Lat,
                      Name:name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                } 
              }
            } 
            //----------------------------------------Closed Reports Case------------------------------
            else if(closed){
              if(cat || rabbit || bird || dog){
                MissingPetPostsData = [];
                if(cat==true){
                  for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                  if(post[postInfo].AnimalType !== 'قط')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniPic= post[postInfo].PetPicture; 
                    var Long= post[postInfo].longitude; 
                    var Lat= post[postInfo].latitude;
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo;  
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    MissingPetPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalPic: AniPic,
                      LongA: Long,
                      LatA: Lat,
                      Name:name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // cat case end 
  
              // rabbit case
              if(rabbit==true){
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                  if(post[postInfo].AnimalType !== 'أرنب')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniPic= post[postInfo].PetPicture; 
                    var Long= post[postInfo].longitude; 
                    var Lat= post[postInfo].latitude;
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo;  
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    MissingPetPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalPic: AniPic,
                      LongA: Long,
                      LatA: Lat,
                      Name:name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // rabbit case end
  
              // Dog caase start
              if(dog==true){
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                  if(post[postInfo].AnimalType !== 'كلب')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniPic= post[postInfo].PetPicture; 
                    var Long= post[postInfo].longitude; 
                    var Lat= post[postInfo].latitude;
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo;  
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    MissingPetPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalPic: AniPic,
                      LongA: Long,
                      LatA: Lat,
                      Name:name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // Dog case end
  
              // Bird case start
              if(bird==true){
                console.log('Bird is true')
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                  if(post[postInfo].AnimalType !== 'عصفور')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniPic= post[postInfo].PetPicture; 
                    var Long= post[postInfo].longitude; 
                    var Lat= post[postInfo].latitude;
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo;  
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    MissingPetPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalPic: AniPic,
                      LongA: Long,
                      LatA: Lat,
                      Name:name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // Bird case end
  
              
              if( MissingPetPostsAfterType.length ==0){
                MissingPetPostsAfterType = null
              }
              else if(MissingPetPostsAfterType.length>0)
                MissingPetPostsData = MissingPetPostsAfterType
            }// End filter by Animal type
  
            if(MissingPetPostsAfterType == null ){
              MissingPetPostsData = null
            }
            
            if(!cat && !rabbit && !bird && !dog ){
                // ---------No Filter case-----------
                MissingPetPostsData = [];
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniPic= post[postInfo].PetPicture; 
                    var Long= post[postInfo].longitude; 
                    var Lat= post[postInfo].latitude;
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo;  
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    MissingPetPostsData[i]={
                      AnimalType: AniType,
                      AnimalPic: AniPic,
                      LongA: Long,
                      LatA: Lat,
                      Name:name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                } 
              }
            }
            
            
          }); 
          if(MissingPetPostsData == null){
            return(
            <View style={{ marginBottom:30}}>
            <View style={styles.Post}>
            <Text style={styles.mandatoryTextStyle}>لا توجد بلاغات حاليا.</Text>
            </View>
            </View>
             ); 
             }else{      
          return MissingPetPostsData.map(element => {
             if (element.offerStatus === 'متاح'){
            return (
              <View style={{ marginBottom:30}}>
                <View style={styles.Post}>
                <Image style={styles.PostPic}
                    source={{uri: element.AnimalPic}}/>
                    <Text style={styles.textTitle}><Text style={styles.text}>اسم صاحب البلاغ: </Text>{element.Name}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>نوع الحيوان: </Text>{element.AnimalType}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>حالة البلاغ: </Text>{element.offerStatus}</Text>
                    <Text style={{color:'#283958', fontSize: 17,marginRight:12,marginBottom:6}}>{"موقع اخر مشاهدة للحيوان: "}</Text>
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
                     <FontAwesomeIcon icon={ faTrashAlt }size={30} color={"#FF7D4B"}/>
                    </TouchableOpacity>
              </View>
           
              </View>
              
            );} else{
              return (
                <View style={{ marginBottom:30}}>
                  <View style={styles.Post}>
                  <Image style={styles.PostPic}
                    source={{uri: element.AnimalPic}}/>
                    <Text style={styles.textTitle}><Text style={styles.text}>اسم صاحب البلاغ: </Text>{element.Name}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>نوع الحيوان: </Text>{element.AnimalType}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>حالة البلاغ: </Text>{element.offerStatus}</Text>
                    <Text style={{color:'#283958', fontSize: 17,marginRight:12,marginBottom:6}}>{"موقع اخر مشاهدة للحيوان: "}</Text>
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
                     <FontAwesomeIcon icon={ faTrashAlt }size={30} color={"#FF7D4B"}/>
                    </TouchableOpacity>
                </View>
             
                </View>
                
              );}
          }).reverse();}
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
                  style={{  width: 75, height: 85,marginBottom:10, marginTop:15 }}
                  source={require('./assets/AleefLogoCat.png')}/>
            </View>
            </View>
            <TouchableOpacity 
               style={styles.iconStyle2}
               onPress={()=> { this.setState({ modalVisible: true})}}>
               <FontAwesomeIcon icon={ faFilter }size={30} color={"#69C4C6"}/>
              </TouchableOpacity>
              {this.readPostData()} 

              <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setState({ modalVisible: false})
        }}>
          
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            
          <View style={{
              flexDirection:'row'
            }}>

            <TouchableOpacity 
                style={{
                  left: -40
                }}
                onPress={()=> { this.setState({ modalVisible: false})}}>
                <FontAwesomeIcon icon={ faTimes }size={30} color={"#a6a6a6"}/>
            </TouchableOpacity>

            <Text style={styles.modalText}>تصفية حسب نوع الحيوان</Text>
            </View>
            
            <View style={styles.checkBoxContainer}>
            <View style={styles.ModalCon}>
              <Text style={styles.text1}>قطط</Text>
              <Checkbox
              color= {'#69C4C6'}
              title='optForReceipts'
              status={this.state.isCat ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ isCat: !this.state.isCat }); }}
            />
            </View>

            <View style={styles.ModalCon}>
              <Text style={styles.text1}>كلاب</Text>
              <Checkbox
              color= {'#69C4C6'}
              title='optForReceipts'
              status={this.state.isDog ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ isDog: !this.state.isDog }); }}
            />
            </View>
            
            <View style={styles.ModalCon}>
              <Text>عصافير</Text>
              <Checkbox
              color= {'#69C4C6'}
              title='optForReceipts'
              status={this.state.isBird ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ isBird: !this.state.isBird }); }}
            />
            </View>

            <View style={styles.ModalCon}>
              <Text style={styles.text1}>أرانب</Text>
              <Checkbox
              color= {'#69C4C6'}
              title='optForReceipts'
              status={this.state.isRabbit ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ isRabbit: !this.state.isRabbit }); }}
            />
            </View>


            </View>

            <Text style={styles.modalText}>تصفية حسب حالة البلاغ</Text>
            <View style={styles.checkBoxContainer}>
            <View style={styles.ModalCon}>
              <Text style={styles.text1}>متاح</Text>
              <Checkbox
              color= {'#69C4C6'}
              title='optForReceipts'
              status={this.state.isAvailable ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ isAvailable: !this.state.isAvailable }); }}
            />
            </View>

            <View style={styles.ModalCon}>
              <Text style={styles.text1}>مغلق</Text>
              <Checkbox
              color= {'#69C4C6'}
              title='optForReceipts'
              status={this.state.isClosed ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ isClosed: !this.state.isClosed }); }}
            />
            </View>
            </View>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#69C4C6' }}
              onPress={() => {
                this.setState({
                  modalVisible: !this.state.modalVisible
                })
                {this.filter()}
              }}>
              <Text style={styles.textStyle}>تصفية</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

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
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      height: 450,
      width: 350,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    openButton: {
      backgroundColor: '#F194FF',
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      margin: 20,
      width: 150,
    },

    button: {
      backgroundColor: '#69C4C6',
      padding: 10,
      width: 150,
      alignItems: "center",
      marginBottom: 25,
      marginTop: 15,
      borderRadius: 20,
      marginLeft:42

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
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 9,
    width:310,
    borderRadius:16
    },
    iconStyle: {
      padding:8,
      left: 30
    },
    mapStyle: {
      width: 290, height: 125 ,marginLeft:10, marginBottom:8
    },

    mandatoryTextStyle: { 
     color: '#FF7D4B',
     fontSize: 13,
     marginTop: 5,
     textAlign: 'center'
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      },
      
      text:{
        color:'#283958',
        fontSize: 17,
        marginRight:12,
        marginBottom:5,
      },
      text1:{
        color:'#283958',
        fontSize: 15,
        marginRight:12,
        marginBottom:5,
      },
    textTitle:{
      color:'#3fa5a6', 
      fontSize: 17,
      marginRight:12,
      marginBottom:5,
    },
    PostPic:{
      borderRadius: 6,
      width: 290, 
      height: 160 ,
      marginLeft:10,
      marginTop:12,marginBottom:7
      },
      openButton: {
backgroundColor: '#F194FF',
borderRadius: 20,
padding: 10,
elevation: 2,
margin: 20,
width: 150,
},
iconStyle2: {
  padding:8,
  marginBottom:10,
  left:120
  },

        ModalCon: {
          flexDirection: 'row',
          alignItems: 'center',
          
        },

        checkBoxContainer: {
          alignSelf: 'flex-end',
          alignItems: 'flex-end'
        },
        modalText: {
          marginBottom: 15,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 18,
          color:'#3fa5a6'
          },

});