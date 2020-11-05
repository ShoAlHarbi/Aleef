import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import firebase from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';


var AdoptionPostsData= [];

export default class AdoptionAdminScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      refreshing: false,
    }
  }

  _onRefresh = () => {
    setTimeout(() => this.setState({ refreshing: false }), 1000);
  }

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

  onPressDelete = (postid) => { // start new method
    AdoptionPostsData=AdoptionPostsData.filter(item => item.postid !== postid)
    firebase.database().ref('/AdoptionPosts/'+postid).remove().then((data) => {
      this.readPostData(); 
      Alert.alert('', 'لقد تم حذف عرض التبني بنجاح, الرجاء تحديث صفحة عروض التبني',[{ text: 'حسناً'}])
    });
   }  //end new method


  readPostData =() => {
      var ref = firebase.database().ref("AdoptionPosts"); 
      ref.on('value',  function (snapshot) {
        var post = snapshot.val();
        //-------------------------------------------------------------------------           
        //This block of code is to prevent null error when array is empty: 
          if (post === null){
            return(
            <View style={{ marginBottom:30}}>
            <View style={styles.Post}>
            <Text style={styles.mandatoryTextStyle}>لا توجد عروض تبني حاليا.</Text>
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
          var AniSex= post[postInfo].AnimalSex; 
          var AniAge= post[postInfo].AnimalAge; 
          var AniCity= post[postInfo].City; 
          var AniPic= post[postInfo].PetPicture; 
          var UserName = post[postInfo].uName;
          var offerorID = post[postInfo].userId; 
          var postidentification = postInfo; 
          var Status = post[postInfo].offerStatus;
          //----------------Adoption Posts Array-----------------------
          AdoptionPostsData[i]={
            AnimalType: AniType,
            AnimalSex: AniSex,
            AnimalAge: AniAge,
            AnimalCity: AniCity,
            AnimalPic: AniPic,
            Name: UserName,
            offerorID: offerorID, 
            postid: postidentification,
            offerStatus: Status
          } 
        }         
      }); 
      

      return AdoptionPostsData.map(element => {
          return (
            <View style={{ marginBottom:30}}>
              <View style={styles.Post}>
              <Image style={{ width: 290, height: 180 ,marginLeft:10, marginTop:12,}}
                source={{uri: element.AnimalPic}}/>
                <Text style={styles.text}>{"اسم صاحب العرض: "+element.Name}</Text>
              <Text style={styles.text}>{"نوع الحيوان: "+element.AnimalType}</Text>
              <Text style={styles.text}>{"جنس الحيوان: "+element.AnimalSex}</Text>
              <Text style={styles.text}>{"عمر الحيوان: "+element.AnimalAge}</Text>
              <Text style={styles.text}>{"المدينة: "+element.AnimalCity}</Text>
              <Text style={styles.text}>{"حالة الطلب: "+element.offerStatus}</Text>

            <TouchableOpacity 
            style={styles.iconStyle}
            onPress={()=> this.onPressTrashIcon(element.postid)}>
            <FontAwesomeIcon icon={ faTrashAlt }size={30} color={"#69C4C6"}/>
            </TouchableOpacity>
          
            </View>
            </View>
            
          );              
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
},
//--------------------------------------
   mandatoryTextStyle: { 
    color: 'red',
    fontSize: 13,
    marginTop: 5,
    }
///--------------------------------------
});