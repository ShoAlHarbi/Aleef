import React, { Component } from 'react';
import { Image, View, TextInput, StyleSheet , Text ,TouchableOpacity, ActivityIndicator,Alert, ScrollView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import uuid from 'react-native-uuid';
import firebase from './firebase'
console.disableYellowBox = true;
var Name='';
export default class AdoptionUpload extends Component {
  constructor() {
    super();
    this.state = { 
      AnimalType: '',
      AnimalSex: '',
      AnimalAge:'',
      City:'',
     
      userId:'',
      userID: firebase.auth().currentUser.uid,
      UserName: '',
      PetImage: null,
      uploading: false,
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }


  async componentDidMount() {
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

  PublishAdoptionPost = () => {
        //-------------------new--------------------------
        const ArabicExpression = /^[\u0621-\u064A\040/\s/g]+$/ //Arabic letters and space only for type,sex,age and city.
        const AnimalTypecheck = ArabicExpression.test(this.state.AnimalType.trim());
        const AnimalSexcheck = ArabicExpression.test(this.state.AnimalSex.trim());
        const AnimalAgecheck = ArabicExpression.test(this.state.AnimalAge.trim());
        const Citycheck = ArabicExpression.test(this.state.City.trim());

        if (this.state.AnimalType.trim() === '' || this.state.AnimalSex.trim() === '' || this.state.AnimalAge.trim() === '' || this.state.City.trim() === '') {
          Alert.alert('', 'يجب تعبئة جميع الحقول',[{ text: 'حسناً'}])}
          else if (AnimalTypecheck === false  || AnimalSexcheck === false  || Citycheck === false || AnimalAgecheck === false){
            Alert.alert('', 'يسمح بحروف اللغة العربية والمسافة فقط.',[{ text: 'حسناً'}])
          }  
         else if (this.state.PetImage === null){
            Alert.alert('', 'يجب رفع صورة للحيوان',[{ text: 'حسناً'}])
          }
       else{
      //----------------------new--------------------------    
    firebase.database().ref('account/'+this.state.userID).once('value').then(snapshot => {
     Name= snapshot.val().name
     firebase.database().ref('AdoptionPosts/').push().set(
      {
       AnimalType: this.state.AnimalType.trim(),
       AnimalSex: this.state.AnimalSex.trim(),
       AnimalAge: this.state.AnimalAge.trim(),
       City: this.state.City.trim(),
       PetPicture: this.state.PetImage,
       userId: this.state.userID,
       uName: Name
      })
     })
     this.props.navigation.navigate('عروض التبني',{
       offerorID: this.state.userID
     }) //-------------------- new
     Alert.alert('', 'تمت اضافة العرض بنجاح. الرجاء تحديث صفحة عروض التبني',[{ text: 'حسناً'}])
    } //-------------------- else 
    }

  render(){ 
    let { PetImage } = this.state;
      return (
        <ScrollView style={{ backgroundColor:'#FFFCFC' }}>
        <View style={styles.container}>

        <Image
        style={{ width: 65, height: 70,marginBottom:30,marginTop:30,}}
        source={require('./assets/AleefLogoCat.png')}/>

          <TextInput
          placeholder="*نوع الحيوان"
          placeholderTextColor="#a3a3a3"
          style={styles.inputField}
          value={this.state.AnimalType}
          onChangeText={(val) => this.updateInputVal(val, 'AnimalType')}
        />
         <TextInput
          placeholder="*جنس الحيوان"
          placeholderTextColor="#a3a3a3"
          style={styles.inputField}
          value={this.state.AnimalSex}
          onChangeText={(val) => this.updateInputVal(val, 'AnimalSex')}
        />
          <TextInput
          placeholder="*عمر الحيوان (مثال: ستة أشهر)"
          placeholderTextColor="#a3a3a3"
          style={styles.inputField}
          value={this.state.AnimalAge}
          onChangeText={(val) => this.updateInputVal(val, 'AnimalAge')}
        />
        <TextInput
          placeholder="*المدينة"
          placeholderTextColor="#a3a3a3"
          style={styles.inputField}
          value={this.state.City}
          onChangeText={(val) => this.updateInputVal(val, 'City')}
        />
                    <TouchableOpacity onPress={() => this.SelectImage()}
                       style={styles.buttonUploadPhoto}>
                    <Text style={styles.textStyleUploadPhoto}>*رفع صورة للحيوان</Text>
                    </TouchableOpacity>
                    {this.RenderImage()}
                    {this.RenderUploading()}

        <Text style={styles.mandatoryTextStyle}>جميع الحقول المسبوقة برمز النجمة (*) مطلوبة.</Text>
        <TouchableOpacity onPress={()=> this.PublishAdoptionPost()}
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
}
})