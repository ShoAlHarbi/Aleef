import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComments} from '@fortawesome/free-solid-svg-icons';
import MapView,{ Marker } from 'react-native-maps';

export default class NearReportScreen extends Component {
        constructor(props) {
          super(props);
          this.state = { 
    
          }
        }
        onPressChatIcon = (ReporterID, Reporter) => {
          this.props.navigation.navigate('صفحة المحادثة',{
            offerorID: ReporterID,
            name: Reporter
          })
        }
   
        render(){ 
          const {ReportPic}=this.props.route.params;
          const {Reporter}=this.props.route.params;
          const {ReporterID}=this.props.route.params;
          const {AniType}=this.props.route.params;
          const {ReportState}=this.props.route.params;
          const {latitude}=this.props.route.params;
          const {longitude}=this.props.route.params;
              return (
                <View style={styles.container}>
                  <View><Image
                        style={{  width: 75, height: 85,marginBottom:10, marginTop:50}}
                        source={require('./assets/AleefLogoCat.png')}/>
                  </View>
                  <View style={styles.Post}>
                  <Image style={styles.PostPic}
                    source={{uri: ReportPic}}/>
                  <Text style={styles.textTitle}><Text style={styles.text}>   اسم صاحب البلاغ: </Text>{Reporter}</Text>
                  <Text style={styles.textTitle}><Text style={styles.text}>   نوع الحيوان: </Text>{AniType}</Text>
                  <Text style={styles.textTitle}><Text style={styles.text}>   حالة البلاغ: </Text>{ReportState}</Text>
                  <Text style={{color:'#283958', fontSize: 17,marginRight:12,marginBottom:6}}>{"موقع اخر مشاهدة للحيوان: "}</Text>
                  <MapView style={styles.mapStyle}
                  region={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                  }}
                  provider="google"
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  zoomControlEnabled={true}
                  moveOnMarkerPress={true}
                  >
                  <Marker coordinate={{ latitude:latitude,longitude: longitude}}/>
                  </MapView>
                  <TouchableOpacity 
                style={styles.iconStyle}
                onPress={()=> this.onPressChatIcon(ReporterID, Reporter)}>
                <FontAwesomeIcon icon={ faComments }size={36} color={"#69C4C6"}/>
              </TouchableOpacity>
                  </View>
              
                  </View>
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
    text:{
      color:'#283958',
      fontSize: 17,
      marginRight:12,
      marginBottom:5,
    },
    textTitle:{
      color:'#3fa5a6', 
      fontSize: 17,
    },
    PostPic:{
      borderRadius: 6,
      width: 290, 
      height: 160 ,
      marginLeft:10,
      marginTop:12,marginBottom:7
      },
   
  Post:{
    backgroundColor:'white',
    marginBottom:80,
    marginTop:10,
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
      width: 290, height: 125 ,marginLeft:10, marginBottom:8
    },
});