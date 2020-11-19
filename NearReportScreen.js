import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl,Alert} from 'react-native';
import firebase from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComments} from '@fortawesome/free-solid-svg-icons';
import MapView,{ Marker } from 'react-native-maps';
import { faTrashAlt, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import ToggleSwitch from 'toggle-switch-react-native' //COPY Status-----------------------------

export default class NearReportScreen extends Component {
        constructor(props) {
          super(props);
          this.state = { 
            refreshing: false,
            region: {
              latitude:  24.774265,
              longitude: 46.738586,
              latitudeDelta: 8,
              longitudeDelta: 15
            },
          }
        }
        _onRefresh = () => {
          setTimeout(() => this.setState({ refreshing: false }), 1000);
        }


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
    Alert.alert('', 'هذا البلاغ مغلق ولا يمكن إعادة إتاحته من جديد.',[{ text: 'حسناً'}])
    console.log("Do nothing")  
  }
  else if (offerStatus === 'متاح'){
    Alert.alert(
      "",
      "هل تود إغلاق هذا البلاغ؟",
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
  firebase.database().ref('/MissingPetPosts/'+postid).update({
    offerStatus: 'مغلق'
  }).then((data) => {
    this.readPostData(); 
    Alert.alert('', 'لقد تم إغلاق البلاغ بنجاح, الرجاء تحديث صفحة عروض البلاغات',[{ text: 'حسناً'}])
  });
}
//------------------------------------------------------------





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
      
            return (
              <View style={{ marginBottom:30}}>
                <View style={styles.Post}>
                <Image style={styles.PostPic}
                  source={{uri: element.AnimalPic}}/>
                    <Text style={styles.text}><Text style={styles.textTitle}>اسم صاحب البلاغ: </Text>{element.Name}</Text>
                    <Text style={styles.text}><Text style={styles.textTitle}>نوع الحيوان: </Text>{element.AnimalType}</Text>
                    <Text style={styles.text}><Text style={styles.textTitle}>حالة البلاغ: </Text>{element.offerStatus}</Text>
                    <Text style={{color:'#3fa5a6', fontSize: 17,marginRight:12,marginBottom:6}}>{"موقع اخر مشاهدة للحيوان: "}</Text>
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
    textTitle:{
      color:'#3fa5a6', 
      fontSize: 17,
      //fontWeight: 'bold',
    },
    PostPic:{
      borderRadius: 6,
      width: 290, 
      height: 160 ,
      marginLeft:10,
      marginTop:12,marginBottom:7
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
      marginBottom:3,
      left: 30
    },
    mapStyle: {
      width: 290, height: 120 ,marginLeft:10, marginBottom:7,
    },
    mandatoryTextStyle: { 
     color: 'red',
     fontSize: 13,
     marginTop: 5,
    },
      //-----------------------------------
      toggleStyle: {
        padding:8,
        left: 110,
        paddingTop: 10,
      },
    //----------------------------------
});