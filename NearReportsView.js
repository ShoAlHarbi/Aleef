import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, RefreshControl, Dimensions} from 'react-native';
import firebase from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComments} from '@fortawesome/free-solid-svg-icons';
import MapView,{ Marker } from 'react-native-maps';
import { faTrashAlt, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import ToggleSwitch from 'toggle-switch-react-native' //COPY Status-----------------------------

var PostLocations= [];
var NearPosts= [];
var PostLati=0;
var PostLong=0;
export default class MissingPetPosts extends Component {
        constructor(props) {
          super(props);
          this.state = { 
            refreshing: false,
            UserLocation:{
                latitude:  24.774265,
                longitude: 46.738586,
            }    
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
        readPostData =() => {
         var ref = firebase.database().ref("MissingPetPosts");
         ref.on('value',  function (snapshot){
        var posts = snapshot.val()
        var PostsIds = Object.keys(posts);
        for(var i = 0; i< PostsIds.length;i++){
        var PostInfo = PostsIds[i];
        PostLati=posts[PostInfo].latitude;
        PostLong=posts[PostInfo].longitude;
        //I needed this array because the state is not working inside for loop
        PostLocations[i]={
          PLat: PostLati,
          PLong:PostLong,
        }
        }
        })
        PostLocations.map(element => {//map the array to calculate the distance for each user and send them notification
            var geodist = require('geodist')
            var UserLoc= {lat: this.state.UserLocation.latitude, lon: this.state.UserLocation.longitude}//this is current user location
            var reportLoc = {lat: element.PLat, lon:element.PLong}//this is the report location
            var dist = geodist(UserLoc,reportLoc,{exact: true, unit: 'km'})//calcualte distance in Km
            console.log(dist+'km')
            if(dist<=3 && element.uID!=this.state.userID){
                NearPosts.push({
                    PLat: element.PLat,
                    PLong:element.PLong,
                  })
            }
        })
            return(
                NearPosts.map(element => {//map the array to calculate the distance for each user and send them notification
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
                     >
                     <Marker coordinate={{ latitude:element.PLat,longitude: element.PLong}}/>
                     </MapView>
                })
           
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
                  >
                  </MapView>
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
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },

});