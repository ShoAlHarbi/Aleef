import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl,Alert,Modal, TouchableHighlight} from 'react-native';
import firebase from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComments} from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ToggleSwitch from 'toggle-switch-react-native' 
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from 'react-native-paper';
import { faEdit } from '@fortawesome/free-solid-svg-icons'; // --------------- Edit offer


var SellingPostsData= [];
var SellingPostsAfterCities= [];
var SellingPostsAfterType= [];
var postKeys2 = [];

export default class SellingOffersScreen extends Component {
        constructor(props) {
          super(props);
          this.state = { 
            refreshing: false,
            modalVisible: false,
            // Animal type check
            isCat: false,
            isFish: false,
            isDog: false,
            isRabbit: false,
            isBird: false,
            // City check
            isRiyadh: false,
            isQassim: false,
            isMedina: false,
            isEastern: false,
            isJeddah: false,
            isHail: false,
            isMakkah: false,
            // Offer status check
            isAvailable: false,
            isClosed: false,
          }
        }


        _onRefresh = () => {
          setTimeout(() => this.setState({ refreshing: false }), 1000);
        }

        componentDidMount = ()=>{
          this.render();
        }
        componentDidUpdate = () =>{
          this.render();
        }



//------------------------ EDIT 1 start-------------------------------------

onPressEditIcon = (postid,Name,AnimalType,AnimalSex,AnimalPic,AnimalAge,AnimalCity,AnimalPrice) => {
  this.props.navigation.navigate('تعديل عرض البيع',{
    postid: postid,
    Name: Name,
    AnimalPic: AnimalPic,
    AnimalType: AnimalType,
    AnimalSex: AnimalSex,
    AnimalAge: AnimalAge,
    AnimalCity: AnimalCity,
    AnimalPrice: AnimalPrice,
  })
}

//------------------------------EDIT 1 end----------------------------------



//------------------------------------------------------------------------------
ToggleOnOrOff = (offerStatus) => {
  if (offerStatus === 'مغلق'){
    return false;
  } else if (offerStatus === 'متاح'){
    return true;
  }
}


ToggleDisable = (offerStatus) => {
  if (offerStatus === 'مغلق'){
    return true;
  }else  if (offerStatus === 'متاح'){
    return false;
  }
}


onToggle = (isOn,offerStatus,postid) => {
  if (offerStatus === 'مغلق'){
    Alert.alert('', 'هذا العرض مغلق ولا يمكن إعادة إتاحته من جديد. أضف عرض جديد',[{ text: 'حسناً'}]) //edited based on comment from instructors.
    console.log("Do nothing")  
  }
  else if (offerStatus === 'متاح'){
    Alert.alert(
      "",
      "هل تود إغلاق هذا العرض؟",
      [
        {
          text: "لا",
          onPress: () => console.log("لا"),
          style: "cancel"
        },
        { text: "نعم", onPress: () => this.CloseOffer(postid) }
      ],
      { cancelable: false }
    );
    }
}

CloseOffer = (postid) => {
  firebase.database().ref('/SellingPosts/'+postid).update({
    offerStatus: 'مغلق'
  }).then((data) => {
    this.readPostData(); 
    Alert.alert('', 'لقد تم إغلاق عرض البيع بنجاح, الرجاء تحديث صفحة عروض البيع',[{ text: 'حسناً'}])
  });
}
//------------------------------------------------------------



        onPressTrashIcon = (postid) => { 
          Alert.alert(
            "",
            "هل تود حذف هذا العرض؟",
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
          SellingPostsData=SellingPostsData.filter(item => item.postid !== postid) //added 1
          firebase.database().ref('/SellingPosts/'+postid).remove().then((data) => {
            this.readPostData(); 
            Alert.alert('', 'لقد تم حذف عرض البيع بنجاح. الرجاء تحديث صفحة عروض البيع',[{ text: 'حسناً'}]) //added 2
          }); 
         } 



        SellingUpload = () => this.props.navigation.navigate('اضافة عرض بيع')
        onPressChatIcon = (offerorID, Name) => {
          this.props.navigation.navigate('صفحة المحادثة',{
            offerorID: offerorID,
            name: Name
          })
        }
         
        filter = () =>{
          console.log('Hi')
          SellingPostsData=[];
          console.log('Filter entered '+SellingPostsData.length)
          SellingPostsAfterType= [];
          SellingPostsAfterCities= [];
          postKeys2 = [];
          this.readPostData()
        }

        readPostData =() => {
          
          SellingPostsData=[];
          SellingPostsAfterType= [];
          SellingPostsAfterCities= [];
          postKeys2 = [];

          // Type variables
          var cat = this.state.isCat
          var dog = this.state.isDog
          var rabbit = this.state.isRabbit
          var fish = this.state.isFish
          var bird = this.state.isBird

          // City variables
          var riyadh = this.state.isRiyadh
          var qassim = this.state.isQassim
          var medina = this.state.isMedina
          var eastern = this.state.isEastern
          var jeddah = this.state.isJeddah
          var hail = this.state.isHail
          var makkah = this.state.isMakkah

          // Offer status variables
          var available= this.state.isAvailable
          var closed = this.state.isClosed

            var ref = firebase.database().ref("SellingPosts");
            ref.on('value',  function (snapshot) {
              var post = snapshot.val();
            
          //-------------------------------------------------------------------------           
          //This block of code is to prevent null error when array is empty: 
          if (post === null){
            return(
            <View style={{ marginBottom:30}}>
            <View style={styles.Post}>
            <Text style={styles.mandatoryTextStyle}>لا توجد عروض بيع حاليا.</Text>
            </View>
            </View>
             ); 
             }
          //------------------------------------------------------------------------    
              var postKeys = Object.keys(post);// to find the post keys and put them in an array
              postKeys2 = []
              var name;
              console.log(post)
              //------------------------Closed AND Available offers case-------------------------------
              if((!available && !closed) || (available && closed)){
              // ------------City cases------------
              if (riyadh || qassim || medina || eastern || jeddah || hail || makkah){
              // Riyadh case
              if(riyadh==true){
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].City !== 'الرياض')
                    continue;
                  //---------This to save the post info in variables----------
                  postKeys2.push(postKeys[i])
                  var AniType= post[postInfo].AnimalType; 
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterCities[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // end Riyadh case

              // Qassim case
              if(qassim==true){
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].City !== 'القصيم')
                    continue;
                  //---------This to save the post info in variables----------
                  postKeys2.push(postKeys[i])
                  var AniType= post[postInfo].AnimalType; 
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterCities[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // end Qassim case

              // Medina case
              if(medina==true){
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].City !== 'المدينة المنورة')
                    continue;
                  //---------This to save the post info in variables----------
                  postKeys2.push(postKeys[i])
                  var AniType= post[postInfo].AnimalType; 
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterCities[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // end Medina case 

              // Eastern region case
              if(eastern==true){
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].City !== 'المنطقة الشرقية')
                    continue;
                  //---------This to save the post info in variables----------
                  postKeys2.push(postKeys[i])
                  var AniType= post[postInfo].AnimalType; 
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterCities[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // end Eartern region case

              // Jeddah case
              if(jeddah==true){
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].City !== 'جدة')
                    continue;
                  //---------This to save the post info in variables----------
                  postKeys2.push(postKeys[i])
                  var AniType= post[postInfo].AnimalType; 
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterCities[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // end Jeddah case

              // Hail case
              if(hail==true){
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].City !== 'حائل')
                    continue;
                  //---------This to save the post info in variables----------
                  postKeys2.push(postKeys[i])
                  var AniType= post[postInfo].AnimalType; 
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterCities[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // end Hail case

              // Makkah case
              if(makkah==true){
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].City !== 'مكة المكرمة')
                    continue;
                  //---------This to save the post info in variables----------
                  postKeys2.push(postKeys[i])
                  var AniType= post[postInfo].AnimalType; 
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterCities[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // end Makkah case
              console.log('Array length '+SellingPostsAfterCities.length)
              console.log(postKeys2)
              // If no posts were found, we will assign null to AdoptionPostsAfterCities
              if(postKeys2.length==0){
                SellingPostsAfterCities = null
              }else SellingPostsData = SellingPostsAfterCities
            } // End City cases

            
              // ------------Animal type cases-------------
              // If the filter by Animal type AND City
              if(postKeys2.length>0 && (fish || cat || rabbit || bird || dog)){
                SellingPostsData = [];
              // Cat Case
              if(cat==true){
              for(var i = 0; i< postKeys2.length;i++){
                var postInfo = postKeys2[i];
                if(post[postInfo].AnimalType !== 'قط')
                  continue;
                //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterType[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                }  
              }         
            } // cat case end 

            // rabbit case
            if(rabbit==true){
              for(var i = 0; i< postKeys2.length;i++){
                var postInfo = postKeys2[i];
                if(post[postInfo].AnimalType !== 'أرنب')
                  continue;
                //---------This to save the post info in variables----------
                var AniType= post[postInfo].AnimalType; 
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterType[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                }  
              }         
            } // rabbit case end

            // Dog caase start
            if(dog==true){
              for(var i = 0; i< postKeys2.length;i++){
                var postInfo = postKeys2[i];
                if(post[postInfo].AnimalType !== 'كلب')
                  continue;
                //---------This to save the post info in variables----------
                var AniType= post[postInfo].AnimalType; 
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterType[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                }  
              }         
            } // Dog case end

            // Bird case start
            if(bird==true){
              for(var i = 0; i< postKeys2.length;i++){
                var postInfo = postKeys2[i];
                console.log(postKeys2[i])
                if(post[postInfo].AnimalType !== 'عصفور')
                  continue;
                //---------This to save the post info in variables----------
                var AniType= post[postInfo].AnimalType; 
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterType[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                }  
              }         
            } // Bird case end

            // Fish case start 
            if(fish==true){
              for(var i = 0; i< postKeys2.length;i++){
                var postInfo = postKeys2[i];
                if(post[postInfo].AnimalType !== 'سمك')
                  continue;
                //---------This to save the post info in variables----------
                var AniType= post[postInfo].AnimalType; 
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterType[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                }  
              }         
            } // Fish end start
            if(SellingPostsAfterType.length==0){
              SellingPostsAfterType = null 
            }
            else if(SellingPostsAfterType.length>0) 
              SellingPostsData = SellingPostsAfterType
            
              console.log('before Exist')
              console.log(SellingPostsAfterType)
          } 
          // If the filter only by Animal type
          else if(fish || cat || rabbit || bird || dog){
            SellingPostsData = [];
            if(cat==true){
              for(var i = 0; i< postKeys.length;i++){
                var postInfo = postKeys[i];
                if(post[postInfo].AnimalType !== 'قط')
                  continue;
                //---------This to save the post info in variables----------
                var AniType= post[postInfo].AnimalType; 
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterType[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
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
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterType[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
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
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterType[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
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
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterType[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                }  
              }         
            } // Bird case end

            // Fish case start 
            if(fish==true){
              for(var i = 0; i< postKeys.length;i++){
                var postInfo = postKeys[i];
                if(post[postInfo].AnimalType !== 'سمك')
                  continue;
                //---------This to save the post info in variables----------
                var AniType= post[postInfo].AnimalType; 
                  var AniSex= post[postInfo].AnimalSex; 
                  var AniAge= post[postInfo].AnimalAge; 
                  var AniCity= post[postInfo].City; 
                  var AniPic= post[postInfo].PetPicture; 
                  var petPrice= post[postInfo].price; 
                  var UserName = post[postInfo].uName;
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsAfterType[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                }  
              }         
            } // Fish end start
            
            if( SellingPostsAfterType.length ==0){
              SellingPostsAfterType = null
            }
            else if(SellingPostsAfterType.length>0)
              SellingPostsData = SellingPostsAfterType
          }// End filter by Animal type


          if(SellingPostsAfterType == null ){
            SellingPostsData = null
          }
          if(SellingPostsAfterCities == null ){
            SellingPostsData = null
          }else
          if(!fish && !cat && !rabbit && !bird && !dog && !riyadh && !qassim && !medina && !eastern && !jeddah && !hail && !makkah){
              // ---------No Filter case-----------
              SellingPostsData = [];
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
                  var offerorID = post[postInfo].userId;  
                  var postidentification = postInfo; 
                  var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                  firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                    name= snapshot.val()
                  })
                  //----------------Adoption Posts Array-----------------------
                  SellingPostsData[i]={
                    AnimalType: AniType,
                    AnimalSex: AniSex,
                    AnimalAge: AniAge,
                    AnimalCity: AniCity,
                    AnimalPic: AniPic,
                    AnimalPrice: petPrice,
                    Name: name,
                    offerorID: offerorID,
                    postid: postidentification,
                    offerStatus: Status,//COPY Status------------------------------
                }  
              } 
            } }else if(available){
              //--------------------------Available offers Case-----------------------------------
              // ------------City cases------------
              if (riyadh || qassim || medina || eastern || jeddah || hail || makkah){
                // Riyadh case
                if(riyadh==true){
                  for(var i = 0; i< postKeys.length;i++){
                    var postInfo = postKeys[i];
                    if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                    if(post[postInfo].City !== 'الرياض')
                      continue;
                    //---------This to save the post info in variables----------
                    postKeys2.push(postKeys[i])
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterCities[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                    }  
                  }         
                } // end Riyadh case
  
                // Qassim case
                if(qassim==true){
                  for(var i = 0; i< postKeys.length;i++){
                    var postInfo = postKeys[i];
                    if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                    if(post[postInfo].City !== 'القصيم')
                      continue;
                    //---------This to save the post info in variables----------
                    postKeys2.push(postKeys[i])
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterCities[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                    }  
                  }         
                } // end Qassim case
  
                // Medina case
                if(medina==true){
                  for(var i = 0; i< postKeys.length;i++){
                    var postInfo = postKeys[i];
                    if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                    if(post[postInfo].City !== 'المدينة المنورة')
                      continue;
                    //---------This to save the post info in variables----------
                    postKeys2.push(postKeys[i])
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterCities[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                    }  
                  }         
                } // end Medina case 
  
                // Eastern region case
                if(eastern==true){
                  for(var i = 0; i< postKeys.length;i++){
                    var postInfo = postKeys[i];
                    if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                    if(post[postInfo].City !== 'المنطقة الشرقية')
                      continue;
                    //---------This to save the post info in variables----------
                    postKeys2.push(postKeys[i])
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterCities[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                    }  
                  }         
                } // end Eartern region case
  
                // Jeddah case
                if(jeddah==true){
                  for(var i = 0; i< postKeys.length;i++){
                    var postInfo = postKeys[i];
                    if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                    if(post[postInfo].City !== 'جدة')
                      continue;
                    //---------This to save the post info in variables----------
                    postKeys2.push(postKeys[i])
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterCities[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                    }  
                  }         
                } // end Jeddah case
  
                // Hail case
                if(hail==true){
                  for(var i = 0; i< postKeys.length;i++){
                    var postInfo = postKeys[i];
                    if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                    if(post[postInfo].City !== 'حائل')
                      continue;
                    //---------This to save the post info in variables----------
                    postKeys2.push(postKeys[i])
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterCities[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                    }  
                  }         
                } // end Hail case
  
                // Makkah case
                if(makkah==true){
                  for(var i = 0; i< postKeys.length;i++){
                    var postInfo = postKeys[i];
                    if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                    if(post[postInfo].City !== 'مكة المكرمة')
                      continue;
                    //---------This to save the post info in variables----------
                    postKeys2.push(postKeys[i])
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterCities[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                    }  
                  }         
                } // end Makkah case
                console.log('Array length '+SellingPostsAfterCities.length)
                console.log(postKeys2)
                // If no posts were found, we will assign null to AdoptionPostsAfterCities
                if(postKeys2.length==0){
                  SellingPostsAfterCities = null
                }else SellingPostsData = SellingPostsAfterCities
              } // End City cases
  
              
                // ------------Animal type cases-------------
                // If the filter by Animal type AND City
                if(postKeys2.length>0 && (fish || cat || rabbit || bird || dog)){
                  SellingPostsData = [];
                // Cat Case
                if(cat==true){
                for(var i = 0; i< postKeys2.length;i++){
                  var postInfo = postKeys2[i];
                  if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                  if(post[postInfo].AnimalType !== 'قط')
                    continue;
                  //---------This to save the post info in variables----------
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // cat case end 
  
              // rabbit case
              if(rabbit==true){
                for(var i = 0; i< postKeys2.length;i++){
                  var postInfo = postKeys2[i];
                  if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                  if(post[postInfo].AnimalType !== 'أرنب')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // rabbit case end
  
              // Dog caase start
              if(dog==true){
                for(var i = 0; i< postKeys2.length;i++){
                  var postInfo = postKeys2[i];
                  if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                  if(post[postInfo].AnimalType !== 'كلب')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // Dog case end
  
              // Bird case start
              if(bird==true){
                for(var i = 0; i< postKeys2.length;i++){
                  var postInfo = postKeys2[i];
                  if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                  console.log(postKeys2[i])
                  if(post[postInfo].AnimalType !== 'عصفور')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // Bird case end
  
              // Fish case start 
              if(fish==true){
                for(var i = 0; i< postKeys2.length;i++){
                  var postInfo = postKeys2[i];
                  if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                  if(post[postInfo].AnimalType !== 'سمك')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // Fish end start
              if(SellingPostsAfterType.length==0){
                SellingPostsAfterType = null 
              }
              else if(SellingPostsAfterType.length>0) 
                SellingPostsData = SellingPostsAfterType
              
                console.log('before Exist')
                console.log(SellingPostsAfterType)
            } 
            // If the filter only by Animal type
            else if(fish || cat || rabbit || bird || dog){
              SellingPostsData = [];
              if(cat==true){
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                  if(post[postInfo].AnimalType !== 'قط')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
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
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
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
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
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
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // Bird case end
  
              // Fish case start 
              if(fish==true){
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                  if(post[postInfo].AnimalType !== 'سمك')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // Fish end start
              
              if( SellingPostsAfterType.length ==0){
                SellingPostsAfterType = null
              }
              else if(SellingPostsAfterType.length>0)
                SellingPostsData = SellingPostsAfterType
            }// End filter by Animal type
  
  
            if(SellingPostsAfterType == null ){
              SellingPostsData = null
            }
            if(SellingPostsAfterCities == null ){
              SellingPostsData = null
            }else
            if(!fish && !cat && !rabbit && !bird && !dog && !riyadh && !qassim && !medina && !eastern && !jeddah && !hail && !makkah){
                // ---------No Filter case-----------
                SellingPostsData = [];
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'متاح')
                      continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsData[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                } 
              }
            }else if(closed){
              //------------------------------Closed Offers Case------------------------------
              // ------------City cases------------
              if (riyadh || qassim || medina || eastern || jeddah || hail || makkah){
                // Riyadh case
                if(riyadh==true){
                  for(var i = 0; i< postKeys.length;i++){
                    var postInfo = postKeys[i];
                    if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                    if(post[postInfo].City !== 'الرياض')
                      continue;
                    //---------This to save the post info in variables----------
                    postKeys2.push(postKeys[i])
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterCities[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                    }  
                  }         
                } // end Riyadh case
  
                // Qassim case
                if(qassim==true){
                  for(var i = 0; i< postKeys.length;i++){
                    var postInfo = postKeys[i];
                    if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                    if(post[postInfo].City !== 'القصيم')
                      continue;
                    //---------This to save the post info in variables----------
                    postKeys2.push(postKeys[i])
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterCities[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                    }  
                  }         
                } // end Qassim case
  
                // Medina case
                if(medina==true){
                  for(var i = 0; i< postKeys.length;i++){
                    var postInfo = postKeys[i];
                    if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                    if(post[postInfo].City !== 'المدينة المنورة')
                      continue;
                    //---------This to save the post info in variables----------
                    postKeys2.push(postKeys[i])
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterCities[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                    }  
                  }         
                } // end Medina case 
  
                // Eastern region case
                if(eastern==true){
                  for(var i = 0; i< postKeys.length;i++){
                    var postInfo = postKeys[i];
                    if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                    if(post[postInfo].City !== 'المنطقة الشرقية')
                      continue;
                    //---------This to save the post info in variables----------
                    postKeys2.push(postKeys[i])
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterCities[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                    }  
                  }         
                } // end Eartern region case
  
                // Jeddah case
                if(jeddah==true){
                  for(var i = 0; i< postKeys.length;i++){
                    var postInfo = postKeys[i];
                    if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                    if(post[postInfo].City !== 'جدة')
                      continue;
                    //---------This to save the post info in variables----------
                    postKeys2.push(postKeys[i])
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterCities[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                    }  
                  }         
                } // end Jeddah case
  
                // Hail case
                if(hail==true){
                  for(var i = 0; i< postKeys.length;i++){
                    var postInfo = postKeys[i];
                    if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                    if(post[postInfo].City !== 'حائل')
                      continue;
                    //---------This to save the post info in variables----------
                    postKeys2.push(postKeys[i])
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterCities[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                    }  
                  }         
                } // end Hail case
  
                // Makkah case
                if(makkah==true){
                  for(var i = 0; i< postKeys.length;i++){
                    var postInfo = postKeys[i];
                    if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                    if(post[postInfo].City !== 'مكة المكرمة')
                      continue;
                    //---------This to save the post info in variables----------
                    postKeys2.push(postKeys[i])
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterCities[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                    }  
                  }         
                } // end Makkah case
                console.log('Array length '+SellingPostsAfterCities.length)
                console.log(postKeys2)
                // If no posts were found, we will assign null to AdoptionPostsAfterCities
                if(postKeys2.length==0){
                  SellingPostsAfterCities = null
                }else SellingPostsData = SellingPostsAfterCities
              } // End City cases
  
              
                // ------------Animal type cases-------------
                // If the filter by Animal type AND City
                if(postKeys2.length>0 && (fish || cat || rabbit || bird || dog)){
                  SellingPostsData = [];
                // Cat Case
                if(cat==true){
                for(var i = 0; i< postKeys2.length;i++){
                  var postInfo = postKeys2[i];
                  if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                  if(post[postInfo].AnimalType !== 'قط')
                    continue;
                  //---------This to save the post info in variables----------
                    var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // cat case end 
  
              // rabbit case
              if(rabbit==true){
                for(var i = 0; i< postKeys2.length;i++){
                  var postInfo = postKeys2[i];
                  if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                  if(post[postInfo].AnimalType !== 'أرنب')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // rabbit case end
  
              // Dog caase start
              if(dog==true){
                for(var i = 0; i< postKeys2.length;i++){
                  var postInfo = postKeys2[i];
                  if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                  if(post[postInfo].AnimalType !== 'كلب')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // Dog case end
  
              // Bird case start
              if(bird==true){
                for(var i = 0; i< postKeys2.length;i++){
                  var postInfo = postKeys2[i];
                  if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                  console.log(postKeys2[i])
                  if(post[postInfo].AnimalType !== 'عصفور')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // Bird case end
  
              // Fish case start 
              if(fish==true){
                for(var i = 0; i< postKeys2.length;i++){
                  var postInfo = postKeys2[i];
                  if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                  if(post[postInfo].AnimalType !== 'سمك')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // Fish end start
              if(SellingPostsAfterType.length==0){
                SellingPostsAfterType = null 
              }
              else if(SellingPostsAfterType.length>0) 
                SellingPostsData = SellingPostsAfterType
              
                console.log('before Exist')
                console.log(SellingPostsAfterType)
            } 
            // If the filter only by Animal type
            else if(fish || cat || rabbit || bird || dog){
              SellingPostsData = [];
              if(cat==true){
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                  if(post[postInfo].AnimalType !== 'قط')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
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
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
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
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
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
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // Bird case end
  
              // Fish case start 
              if(fish==true){
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                  if(post[postInfo].AnimalType !== 'سمك')
                    continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsAfterType[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                }         
              } // Fish end start
              
              if( SellingPostsAfterType.length ==0){
                SellingPostsAfterType = null
              }
              else if(SellingPostsAfterType.length>0)
                SellingPostsData = SellingPostsAfterType
            }// End filter by Animal type
  
  
            if(SellingPostsAfterType == null ){
              SellingPostsData = null
            }
            if(SellingPostsAfterCities == null ){
              SellingPostsData = null
            }else
            if(!fish && !cat && !rabbit && !bird && !dog && !riyadh && !qassim && !medina && !eastern && !jeddah && !hail && !makkah){
                // ---------No Filter case-----------
                SellingPostsData = [];
                for(var i = 0; i< postKeys.length;i++){
                  var postInfo = postKeys[i];
                  if(post[postInfo].offerStatus !== 'مغلق')
                      continue;
                  //---------This to save the post info in variables----------
                  var AniType= post[postInfo].AnimalType; 
                    var AniSex= post[postInfo].AnimalSex; 
                    var AniAge= post[postInfo].AnimalAge; 
                    var AniCity= post[postInfo].City; 
                    var AniPic= post[postInfo].PetPicture; 
                    var petPrice= post[postInfo].price; 
                    var UserName = post[postInfo].uName;
                    var offerorID = post[postInfo].userId;  
                    var postidentification = postInfo; 
                    var Status = post[postInfo].offerStatus;//COPY Status------------------------------
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Adoption Posts Array-----------------------
                    SellingPostsData[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      AnimalPrice: petPrice,
                      Name: name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,//COPY Status------------------------------
                  }  
                } 
              }
            }}
  
          ); 

          if(SellingPostsData == null || SellingPostsData.length==0){
              return(
              <View style={{ marginBottom:30}}>
              <View style={styles.Post}>
              <Text style={styles.mandatoryTextStyle}>لا توجد عروض بيع حاليا.</Text>
              </View>
              </View>
               ); 
               }else{
                return SellingPostsData.map(element => {
                  if((element.offerorID == firebase.auth().currentUser.uid) && (element.offerStatus === 'متاح')){
                    return (
                      <View style={{ marginBottom:30}}>
                        <View style={styles.Post}>
                        <Image style={styles.PostPic}
                      source={{uri: element.AnimalPic}}/>
                    <Text style={styles.textTitle}><Text style={styles.text}>اسم صاحب العرض: </Text>{element.Name}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>نوع الحيوان: </Text>{element.AnimalType}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>جنس الحيوان: </Text>{element.AnimalSex}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>عمر الحيوان: </Text>{element.AnimalAge}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>المدينة: </Text>{element.AnimalCity}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>السعر: </Text>{element.AnimalPrice +" ريال سعودي"}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>حالة العرض: </Text>{element.offerStatus}</Text>
    
                        <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity 
                         style={styles.iconStyle}
                         onPress={()=> this.onPressTrashIcon(element.postid)}>
                         <FontAwesomeIcon icon={ faTrashAlt }size={30} color={"#FF7D4B"}/>
                        </TouchableOpacity>
    
                        <TouchableOpacity 
                        style={styles.editStyle}
                        onPress={()=> this.onPressEditIcon(element.postid,element.Name,element.AnimalType,element.AnimalSex,element.AnimalPic,element.AnimalAge,element.AnimalCity,element.AnimalPrice)}>
                        <FontAwesomeIcon icon={ faEdit }size={32} color={"#69C4C6"}/>
                        </TouchableOpacity>


                        <View style={styles.toggleStyle}>
                        <ToggleSwitch
                        isOn= {this.ToggleOnOrOff(element.offerStatus)}
                        onColor="green"
                        offColor="red"
                        label="إغلاق العرض"
                        labelStyle={{ color: '#283958', fontWeight: "900" }}
                        size="small"
                        onToggle={isOn => {
                          this.onToggle(isOn,element.offerStatus,element.postid);
                        }}
                        disable={this.ToggleDisable(element.offerStatus)}
                        />
                        </View>
                        </View>
    
    
                      </View>
                      </View>
                      
                    );
                  } else if(element.offerorID == firebase.auth().currentUser.uid){
                    return (
                      <View style={{ marginBottom:30}}>
                        <View style={styles.Post}>
                        <Image style={styles.PostPic}
                      source={{uri: element.AnimalPic}}/>
                    <Text style={styles.textTitle}><Text style={styles.text}>اسم صاحب العرض: </Text>{element.Name}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>نوع الحيوان: </Text>{element.AnimalType}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>جنس الحيوان: </Text>{element.AnimalSex}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>عمر الحيوان: </Text>{element.AnimalAge}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>المدينة: </Text>{element.AnimalCity}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>السعر: </Text>{element.AnimalPrice +" ريال سعودي"}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>حالة العرض: </Text>{element.offerStatus}</Text>
    
                        <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity 
                         style={styles.iconStyle}
                         onPress={()=> this.onPressTrashIcon(element.postid)}>
                         <FontAwesomeIcon icon={ faTrashAlt }size={30} color={"#FF7D4B"}/>
                        </TouchableOpacity>
    
                        <View style={styles.toggleStyle2}>
                        <ToggleSwitch
                        isOn= {this.ToggleOnOrOff(element.offerStatus)}
                        onColor="green"
                        offColor="red"
                        label="إغلاق العرض"
                        labelStyle={{ color: '#283958', fontWeight: "900" }}
                        size="small"
                        onToggle={isOn => {
                          this.onToggle(isOn,element.offerStatus,element.postid);
                        }}
                        disable={this.ToggleDisable(element.offerStatus)}
                        />
                        </View>
                        </View>
    
    
                      </View>
                      </View>
                      
                    );
                  }
                  else if (element.offerStatus === 'متاح'){
                  return (
                    <View style={{ marginBottom:30}}>
                      <View style={styles.Post}>
                      <Image style={styles.PostPic}
                      source={{uri: element.AnimalPic}}/>
                    <Text style={styles.textTitle}><Text style={styles.text}>اسم صاحب العرض: </Text>{element.Name}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>نوع الحيوان: </Text>{element.AnimalType}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>جنس الحيوان: </Text>{element.AnimalSex}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>عمر الحيوان: </Text>{element.AnimalAge}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>المدينة: </Text>{element.AnimalCity}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>السعر: </Text>{element.AnimalPrice +" ريال سعودي"}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>حالة العرض: </Text>{element.offerStatus}</Text>
                      <TouchableOpacity 
                      style={styles.iconStyle}
                      onPress={()=> this.onPressChatIcon(element.offerorID, element.Name)}>
                      <FontAwesomeIcon icon={ faComments }size={36} color={"#69C4C6"}/>
                    </TouchableOpacity>
                    </View>
                 
                    </View>
                    
                  );}
                  else{
                    return (
                      <View style={{ marginBottom:30}}>
                        <View style={styles.Post}>
                        <Image style={styles.PostPic}
                      source={{uri: element.AnimalPic}}/>
                    <Text style={styles.textTitle}><Text style={styles.text}>اسم صاحب العرض: </Text>{element.Name}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>نوع الحيوان: </Text>{element.AnimalType}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>جنس الحيوان: </Text>{element.AnimalSex}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>عمر الحيوان: </Text>{element.AnimalAge}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>المدينة: </Text>{element.AnimalCity}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>السعر: </Text>{element.AnimalPrice +" ريال سعودي"}</Text>
                    <Text style={styles.textTitle}><Text style={styles.text}>حالة العرض: </Text>{element.offerStatus}</Text>
    
                      </View>
                   
                      </View>
                      
                    );}
                }).reverse();
            }

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
                        style={{ width: 75, height: 85,marginBottom:10, marginTop:15 }}
                        source={require('./assets/AleefLogoCat.png')}/>
                  </View>
                  </View>
                  <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                    <TouchableOpacity onPress={() => this.SellingUpload()}
                       style={styles.button}>
                    <Text style={styles.textStyle}>اضافة عرض بيع</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                     style={styles.iconStyle2}
                     onPress={()=> { this.setState({ modalVisible: true})}}>
                     <FontAwesomeIcon icon={ faFilter }size={30} color={"#69C4C6"}/>
                    </TouchableOpacity>
                    </View>

                    {this.readPostData()} 

                    <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {
                    this.setState({ modalVisible: false})
                }}>
                  <ScrollView style={{ backgroundColor:'#FFFCFC' }}>
          
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
              <Text style={styles.text1}>عصافير</Text>
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

            <View style={styles.ModalCon}>
              <Text style={styles.text1}>سمك</Text>
              <Checkbox
              color= {'#69C4C6'}
              title='optForReceipts'
              status={this.state.isFish ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ isFish: !this.state.isFish }); }}
            />
            </View>
            </View>

            <Text style={styles.modalText}>تصفية حسب المدينة</Text>
            <View style={styles.checkBoxContainer}>
            <View style={styles.ModalCon}>
              <Text style={styles.text1}>الرياض</Text>
              <Checkbox
              color= {'#69C4C6'}
              title='optForReceipts'
              status={this.state.isRiyadh ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ isRiyadh: !this.state.isRiyadh }); }}
            />
            </View>

            <View style={styles.ModalCon}>
              <Text style={styles.text1}>القصيم</Text>
              <Checkbox
              color= {'#69C4C6'}
              title='optForReceipts'
              status={this.state.isQassim ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ isQassim: !this.state.isQassim }); }}
            />
            </View>
            
            <View style={styles.ModalCon}>
              <Text style={styles.text1}>المدينة المنورة</Text>
              <Checkbox
              color= {'#69C4C6'}
              title='optForReceipts'
              status={this.state.isMedina ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ isMedina: !this.state.isMedina }); }}
            />
            </View>

            <View style={styles.ModalCon}>
              <Text style={styles.text1}>المنطقة الشرقية</Text>
              <Checkbox
              color= {'#69C4C6'}
              title='optForReceipts'
              status={this.state.isEastern ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ isEastern: !this.state.isEastern }); }}
            />
            </View>

            <View style={styles.ModalCon}>
              <Text style={styles.text1}>جدة</Text>
              <Checkbox
              color= {'#69C4C6'}
              title='optForReceipts'
              status={this.state.isJeddah ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ isJeddah: !this.state.isJeddah }); }}
            />
            </View>

            <View style={styles.ModalCon}>
              <Text style={styles.text1}>حائل</Text>
              <Checkbox
              color= {'#69C4C6'}
              title='optForReceipts'
              status={this.state.isHail ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ isHail: !this.state.isHail }); }}
            />
            </View>

            <View style={styles.ModalCon}>
              <Text style={styles.text1}>مكة المكرمة</Text>
              <Checkbox
              color= {'#69C4C6'}
              title='optForReceipts'
              status={this.state.isMakkah ? 'checked' : 'unchecked'}
              onPress={() => { this.setState({ isMakkah: !this.state.isMakkah }); }}
            />
            </View>
            </View>

            <Text style={styles.modalText}>تصفية حسب حالة العرض</Text>
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
        </ScrollView>
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
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 9,
          width:310,
          borderRadius:16
          },
        iconStyle: {
          left: 30,
          bottom:5
        },
        iconStyle2: {
          padding:8,
        },
        //-----------------------------------
          toggleStyle: {
            padding:8,
            left: 105, //--------------------------------------------- Edit offer
            paddingTop: 10,
          },
        //----------------------------------
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
          height: 745,
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
        textStyle: {
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
        },
        modalText: {
          marginBottom: 15,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 18,
          color:'#3fa5a6'
        },
        dialogContentView: {
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
        button_1: {
          width: '40%',
          height: 30,
        },
      
        ModalCon: {
          flexDirection: 'row',
          alignItems: 'center',
          
        },
        checkBoxContainer: {
          alignSelf: 'flex-end',
          alignItems: 'flex-end'
        },
        //------------------------------------------
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
          iconStyle2: {
            padding:8,
            paddingBottom:18,
          },
        //--------------------------------------------- Edit offer
              toggleStyle2: {
                padding:8,
                left: 135, 
                paddingTop: 10,
              },
              editStyle: {
                left: 45,
              },
        //--------------------------------------------- Edit offer
      
      });