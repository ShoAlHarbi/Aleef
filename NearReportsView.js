import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, RefreshControl, Dimensions,Text,Image,TouchableOpacity} from 'react-native';
import { Callout } from 'react-native-maps';
import firebase from './firebase';
import MapView,{ Marker } from 'react-native-maps';

var PostLocations= [];
var PostLati=0;
var PostLong=0;
var ReporterID=0;
var ReporterName='';
var ReportPic='';
export default class NearReportsView extends Component {
        constructor(props) {
          super(props);
          this.state = { 
            refreshing: false,
            NearPosts: [],
            userID: firebase.auth().currentUser.uid, 
            UserLocation:{
                latitude:  24.774265,
                longitude: 46.738586,
            } ,
          }
        }
        _onRefresh = () => {
          setTimeout(() => this.setState({ refreshing: false }), 1000);
        }
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

        GoToReport = () => this.props.navigation.navigate('صفحة البلاغ')

        GetNearMarkers =() => {
        var ref = firebase.database().ref("MissingPetPosts");
        ref.on('value',  function (snapshot){
        var posts = snapshot.val()
        var PostsIds = Object.keys(posts);
        for(var i = 0; i< PostsIds.length;i++){
        var PostInfo = PostsIds[i];
        PostLati=posts[PostInfo].latitude;
        PostLong=posts[PostInfo].longitude;
        ReporterID=posts[PostInfo].userId;
        ReporterName=posts[PostInfo].uName;
        ReportPic=posts[PostInfo].PetPicture;
        PostLocations[i]={
          PLat: PostLati,
          PLong:PostLong,
          UID: ReporterID,
          RepName:ReporterName,
          PetPic:ReportPic,
        }
        }
        })
        PostLocations.map(element => {//map the array to calculate the distance for each user and send them notification
            var geodist = require('geodist')
            var UserLoc= {lat: this.state.UserLocation.latitude, lon: this.state.UserLocation.longitude}//this is current user location
            var reportLoc = {lat: element.PLat, lon:element.PLong}//this is the report location
            var dist = geodist(UserLoc,reportLoc,{exact: true, unit: 'km'})//calcualte distance in Km
            console.log(dist+'km')
            if(dist<=3 && this.state.userID!=element.UID){
                this.state.NearPosts.push({
                    PLat: element.PLat,
                    PLong:element.PLong,
                    RName:element.RepName,
                    RPic:element.PetPic
                  })
            }
        });
            return this.state.NearPosts.map(element => //map the array to calculate the distance for each user and send them notification
             <Marker 
             coordinate={{ latitude:element.PLat ,longitude:element.PLong}}>
              
             <Callout tooltip={true}>
             <TouchableOpacity onPress={() => this.GoToReport()}>
             <Text><Image style={styles.PostPic} source={{uri: element.RPic}}/></Text>
             </TouchableOpacity>
             </Callout>
             </Marker>
               )
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
                <MapView style={styles.mapStyle}
                    region={{
                       latitude: this.state.UserLocation.latitude,
                       longitude: this.state.UserLocation.longitude,
                       latitudeDelta: 0.009,
                       longitudeDelta: 0.009
                     }}
                     provider="google"
                     showsUserLocation={true}
                     showsMyLocationButton={true}
                     zoomControlEnabled={true}
                     moveOnMarkerPress={true}
                     >
                    {this.GetNearMarkers()} 
                    </MapView>
                       
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
    mapStyle: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    PostPic:{
      height:170,
      width:120,   
      borderRadius:16
    },
    MarkerTip:{
    backgroundColor:'white',
    width:170,
    height:100,
    borderRadius:16
    },
    Text:{
      marginBottom:10
    }
});