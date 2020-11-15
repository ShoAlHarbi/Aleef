import React, { Component } from 'react'
import { Alert,StyleSheet, Text, View, Image, TouchableOpacity, Button,ScrollView,RefreshControl} from 'react-native';
import firebase from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit} from '@fortawesome/free-solid-svg-icons';
import { color } from 'react-native-reanimated';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import MapView,{ Marker } from 'react-native-maps';
import ToggleSwitch from 'toggle-switch-react-native'

var AdoptionPostsData= [];
var SellingPostsData= [];
var MissingPetPostsData= [];
export default class Profile extends Component{
    constructor(props) {
        super(props);
        this.state = { 
            userName: '',
            profileImage: '',
            activeIndex: 0,
            refreshing: false,
        }
      }

      segmentClicked(index) {
        this.setState({
            activeIndex: index
        })
    }
     

    componentDidMount(){
        firebase.database().ref('account/'+firebase.auth().currentUser.uid)
        .on('value',(snapshot)=>{
            this.setState({
                userName: snapshot.val().name,
                profileImage: snapshot.val().profileImage,
            })
            
        });
    }

    _onRefresh = () => {
      setTimeout(() => this.setState({ refreshing: false }), 1000);
    }

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
    
    
    onToggleAdoption = (isOn,offerStatus,postid) => {
      if (offerStatus === 'مغلق'){
        Alert.alert('', 'هذا العرض مغلق ولا يمكن إعادة إتاحته من جديد.',[{ text: 'حسناً'}])
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
            { text: "نعم", onPress: () => this.CloseOfferAdoption(postid) }
          ],
          { cancelable: false }
        );
        }
    }

    onToggleSelling = (isOn,offerStatus,postid) => {
      if (offerStatus === 'مغلق'){
        Alert.alert('', 'هذا العرض مغلق ولا يمكن إعادة إتاحته من جديد.',[{ text: 'حسناً'}])
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
            { text: "نعم", onPress: () => this.CloseOfferSelling(postid) }
          ],
          { cancelable: false }
        );
        }
    }

    onToggleReport = (isOn,offerStatus,postid) => {
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
            { text: "نعم", onPress: () => this.CloseOfferReport(postid) }
          ],
          { cancelable: false }
        );
        }
    }
 
    CloseOfferAdoption = (postid) => {
      firebase.database().ref('/AdoptionPosts/'+postid).update({
        offerStatus: 'مغلق'
      }).then((data) => {
        this.renderSectionZero(); 
        Alert.alert('', 'لقد تم إغلاق عرض التبني بنجاح, الرجاء تحديث الصفحة',[{ text: 'حسناً'}])
      });
    }

    CloseOfferSelling = (postid) => {
      firebase.database().ref('/SellingPosts/'+postid).update({
        offerStatus: 'مغلق'
      }).then((data) => {
        this.renderSectionOne(); 
        Alert.alert('', 'لقد تم إغلاق عرض البيع بنجاح, الرجاء تحديث الصفحة',[{ text: 'حسناً'}])
      });
    }

    CloseOfferReport = (postid) => {
      firebase.database().ref('/MissingPetPosts/'+postid).update({
        offerStatus: 'مغلق'
      }).then((data) => {
        this.renderSectionTwo(); 
        Alert.alert('', 'لقد تم إغلاق البلاغ بنجاح, الرجاء تحديث الصفحة',[{ text: 'حسناً'}])
      });
    }

    //.........Deletion adoption posts section........
    onPressTrashIcon0 = (postid) => {
        Alert.alert(
          "",
          "هل تود حذف هذا العرض؟",
          [
            {
              text: "لا",
              onPress: () => console.log("لا"),
              style: "cancel"
            },
            { text: "نعم", onPress: () => this.onPressDelete0(postid) }
          ],
          { cancelable: false }
        );
      }
      onPressDelete0 = (postid) => { // start new method
        AdoptionPostsData=AdoptionPostsData.filter(item => item.postid !== postid)
        firebase.database().ref('/AdoptionPosts/'+postid).remove().then((data) => {
          this.renderSectionZero(); 
          Alert.alert('', 'لقد تم حذف عرض التبني بنجاح.',[{ text: 'حسناً'}])
        });
       }

       //.........Deletion selling posts section........
      onPressTrashIcon1 = (postid) => {
        Alert.alert(
          "",
          "هل تود حذف هذا العرض؟",
          [
            {
              text: "لا",
              onPress: () => console.log("لا"),
              style: "cancel"
            },
            { text: "نعم", onPress: () => this.onPressDelete1(postid) }
          ],
          { cancelable: false }
        );
      }
      onPressDelete1 = (postid) => { // start new method
        SellingPostsData=SellingPostsData.filter(item => item.postid !== postid) //added 1
        firebase.database().ref('/SellingPosts/'+postid).remove().then((data) => {
          this.renderSectionOne(); 
          Alert.alert('', 'لقد تم حذف عرض البيع بنجاح. ',[{ text: 'حسناً'}]) //added 2
        }); 
       }

     //.........Deletion missing pet posts section........
    onPressTrashIcon2 = (postid) => { // start edit this method
        Alert.alert(
          "",
          "هل تود حذف هذا البلاغ؟",
          [
            {
              text: "لا",
              onPress: () => console.log("لا"),
              style: "cancel"
            },
            { text: "نعم", onPress: () => this.onPressDelete2(postid) }
          ],
          { cancelable: false }
        );
       }
       onPressDelete2 = (postid) => { //new method
        MissingPetPostsData= MissingPetPostsData.filter(item => item.postid !== postid)
         firebase.database().ref('/MissingPetPosts/'+postid).remove().then((data) => {
           this.renderSectionTwo(); 
           Alert.alert('', 'لقد تم حذف بلاغ الحيوان المفقود بنجاح.',[{ text: 'حسناً'}])
         });
       }
    // Display posts based on the activeIndex   
    renderSection() {

        if (this.state.activeIndex == 0) {
            return (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {this.renderSectionZero()}
                 </View>
            )
        }
        else if (this.state.activeIndex == 1) {
            return (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {this.renderSectionOne()}
                </View>
            )
        } else {
            return (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {this.renderSectionTwo()}
                </View>
            )
        }
    }
    // Handler عروض التبني
    renderSectionZero(){
        var currentUID = firebase.auth().currentUser.uid
        var post;
        var postKeys;
        var AdoptionPostsData=[]
        var name;
        firebase.database().ref('AdoptionPosts').orderByChild('userId').equalTo(currentUID)
        .once('value', snapshot => {
            if(snapshot.exists()){
                post = snapshot.val()
                postKeys = Object.keys(post);
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
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    }) 
                    //----------------Adoption Posts Array-----------------------
                    AdoptionPostsData[i]={
                      AnimalType: AniType,
                      AnimalSex: AniSex,
                      AnimalAge: AniAge,
                      AnimalCity: AniCity,
                      AnimalPic: AniPic,
                      Name:name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,
                    }  
                  }
              }
                
        });
        if(AdoptionPostsData.length==0){
            return(
                <View style={{ marginBottom:30}}>
                <View style={styles.Post}>
                <Text style={styles.mandatoryTextStyle}>لا توجد لديك عروض تبني.</Text>
                </View>
                </View>
                 ); 
        }
        else return AdoptionPostsData.map(element => {
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
                    <Text style={styles.text}>{"حالة العرض: "+element.offerStatus}</Text>
                    
                    <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity 
                     style={styles.iconStyle2}
                     onPress={()=> this.onPressTrashIcon0(element.postid)}>
                     <FontAwesomeIcon icon={ faTrashAlt }size={30} color={"#69C4C6"}/>
                    </TouchableOpacity>

                    <View style={styles.toggleStyle}>
                    <ToggleSwitch
                    isOn= {this.ToggleOnOrOff(element.offerStatus)}
                    onColor="green"
                    offColor="red"
                    label="إغلاق العرض"
                    labelStyle={{ color: "black", fontWeight: "900" }}
                    size="small"
                    onToggle={isOn => {
                      this.onToggleAdoption(isOn,element.offerStatus,element.postid);
                    }}
                    disable={this.ToggleDisable(element.offerStatus)}
                    />
                    </View>
                    </View>

                  </View>
                  </View>
                
              );
        }).reverse();
    }
    // Handler عروض البيع
    renderSectionOne(){
        var currentUID = firebase.auth().currentUser.uid
        var post;
        var postKeys;
        var SellingPostsData=[]
        var name;
        firebase.database().ref('SellingPosts').orderByChild('userId').equalTo(currentUID)
        .once('value', snapshot => {
            if(snapshot.exists()){
                post = snapshot.val()
                postKeys = Object.keys(post);
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
                    var Status = post[postInfo].offerStatus;
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    }) 
                    //----------------Selling Posts Array-----------------------
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
                      offerStatus: Status,
                    }  
                  }
              }
                
        });
        if(SellingPostsData.length==0){
            return(
                <View style={{ marginBottom:30}}>
                <View style={styles.Post}>
                <Text style={styles.mandatoryTextStyle}>لا توجد لديك عروض بيع.</Text>
                </View>
                </View>
                 ); 
        }
        else return SellingPostsData.map(element => {
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
                    <Text style={styles.text}>{"السعر: "+element.AnimalPrice +" ريال سعودي"}</Text>
                    <Text style={styles.text}>{"حالة العرض: "+element.offerStatus}</Text>

                    <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity 
                     style={styles.iconStyle2}
                     onPress={()=> this.onPressTrashIcon1(element.postid)}>
                     <FontAwesomeIcon icon={ faTrashAlt }size={30} color={"#69C4C6"}/>
                    </TouchableOpacity>

                    <View style={styles.toggleStyle}>
                    <ToggleSwitch
                    isOn= {this.ToggleOnOrOff(element.offerStatus)}
                    onColor="green"
                    offColor="red"
                    label="إغلاق العرض"
                    labelStyle={{ color: "black", fontWeight: "900" }}
                    size="small"
                    onToggle={isOn => {
                      this.onToggleSelling(isOn,element.offerStatus,element.postid);
                    }}
                    disable={this.ToggleDisable(element.offerStatus)}
                    />
                    </View>
                    </View>


                  </View>
                  </View>
                
              );
        }).reverse();
    }
    // Handler البلاغات
    renderSectionTwo(){
        var currentUID = firebase.auth().currentUser.uid
        var post;
        var postKeys;
        var MissingPetPostsData=[]
        var name;
        firebase.database().ref('MissingPetPosts').orderByChild('userId').equalTo(currentUID)
        .once('value', snapshot => {
            if(snapshot.exists()){
                post = snapshot.val()
                postKeys = Object.keys(post);
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
                    var Status = post[postInfo].offerStatus;
                    firebase.database().ref('account/'+offerorID+'/name').on('value',snapshot=>{
                      name= snapshot.val()
                    })
                    //----------------Missing Posts Array-----------------------
                    MissingPetPostsData[i]={
                      AnimalType: AniType,
                      AnimalPic: AniPic,
                      LongA: Long,
                      LatA: Lat,
                      Name:name,
                      offerorID: offerorID,
                      postid: postidentification,
                      offerStatus: Status,
                    }  
                  }
              }
                
        });
        if(MissingPetPostsData.length==0){
            return(
                <View style={{ marginBottom:30}}>
                <View style={styles.Post}>
                <Text style={styles.mandatoryTextStyle}>لا توجد لديك بلاغات.</Text>
                </View>
                </View>
                 ); 
        }
        else return MissingPetPostsData.map(element => {

            return (
              <View style={{ marginBottom:30}}>
              <View style={styles.Post}>
              <Image style={{ width: 290, height: 180 ,marginLeft:10, marginTop:12,}}
                source={{uri: element.AnimalPic}}/>
              <Text style={styles.text}>{"اسم صاحب البلاغ: "+element.Name}</Text>
              <Text style={styles.text}>{"نوع الحيوان: "+element.AnimalType}</Text>
              <Text style={styles.text}>{"حالة البلاغ: "+element.offerStatus}</Text>
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

              <View style={{flexDirection: 'row'}}>
              <TouchableOpacity 
                 style={styles.iconStyle2}
                 onPress={()=> this.onPressTrashIcon2(element.postid)}>
                 <FontAwesomeIcon icon={ faTrashAlt }size={30} color={"#69C4C6"}/>
                </TouchableOpacity>

                <View style={styles.toggleStyle}>
                <ToggleSwitch
                isOn= {this.ToggleOnOrOff(element.offerStatus)}
                onColor="green"
                offColor="red"
                label="إغلاق البلاغ"
                labelStyle={{ color: "black", fontWeight: "900" }}
                size="small"
                onToggle={isOn => {
                  this.onToggleReport(isOn,element.offerStatus,element.postid);
                }}
                disable={this.ToggleDisable(element.offerStatus)}
                />
                </View>
                </View>


            </View>
            </View>
              );
        }).reverse();
    }

    render(){
        return(
           
            <View style={styles.container}>
                <View>
                    <Image style={{ width: 140, height: 140, borderRadius:140/2, marginTop:20}}
                   source={{uri: this.state.profileImage}} />
                </View>
                <TouchableOpacity
                     onPress={() => this.props.navigation.navigate('تعديل صفحة المستخدم')}
                     style={styles.iconStyle}>
                     <FontAwesomeIcon icon={ faEdit }size={30} color={"#69C4C6"}/>
                    </TouchableOpacity>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                    {this.state.userName}
                    </Text>
                </View>
                
                <View style={styles.Container4}>
                        <TouchableOpacity style={styles.button3}
                        onPress={() => this.segmentClicked(2)}>
                            <Text style={this.state.activeIndex == 2 ? styles.activeText: styles.inactiveText}>بلاغات </Text>
                        </TouchableOpacity>
                    
                        <TouchableOpacity style={styles.button3}
                        onPress={() => this.segmentClicked(1)}>
                            <Text style={this.state.activeIndex == 1 ? styles.activeText: styles.inactiveText}>عروض البيع</Text>
                        </TouchableOpacity>
                    
                        <TouchableOpacity style={styles.button3}
                        onPress={() => this.segmentClicked(0)}>
                            <Text style={this.state.activeIndex == 0 ? styles.activeText: styles.inactiveText}>عروض التبني</Text>
                        </TouchableOpacity>
                </View>
                
                <ScrollView style={{ backgroundColor:'#FFFCFC' }}
                 refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                 }
                >
                
                {this.renderSection()}
                </ScrollView>
                

            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFCFC',
        alignItems: 'center',
        // justifyContent: 'center',
        flex: 1,
        
    },
    container2: {
      backgroundColor: '#FFFCFC',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      marginBottom:50,
  },
  container3: {
    backgroundColor: '#FFFCFC',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width:200,
    flexDirection: 'column',
    marginBottom: 100,
    padding:150,
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
        width: 185,
        alignItems: "center",
        marginTop: 5,
        marginBottom: 60,
        borderRadius: 20,

    },
    button2: {
      padding: 8,
      width: 125,
      marginLeft: 160,
      marginTop:50
  },
  inactiveText: {
    fontSize: 18,
    color:'black',
},
    activeText: {
        textDecorationLine: 'underline',
        fontSize: 18,
        color: '#69C4C6'
    },
    iconStyle: {
        position: 'absolute',
        padding:8,
        left: 30,
        marginLeft: 220,
        marginTop: 150
      },
      iconStyle2: {
        padding:8,
        left: 30
      },
      Container4:{
        flexDirection: 'row',
        alignContent: 'space-between',
        alignItems: 'baseline',
      },
      button3: {
        alignSelf: 'center',
        margin: 25,
        borderBottomColor: '#69C4C6',
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
    mandatoryTextStyle: { 
            textAlign: 'center',
            color: 'red',
            fontSize: 13,
            marginTop: 5,
            },
        mapStyle: {
                width: 290, height: 180 ,marginLeft:10, marginBottom:12
              },

              toggleStyle: {
                padding:8,
                left: 110,
                paddingTop: 10,
              },
    
});