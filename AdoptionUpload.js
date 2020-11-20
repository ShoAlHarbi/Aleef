import React, { Component } from 'react';
import { Image, View, TextInput, StyleSheet , Text ,TouchableOpacity, ActivityIndicator,Alert, ScrollView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import uuid from 'react-native-uuid';
import firebase from './firebase'
import { RadioButton } from 'react-native-paper';
import {Picker} from '@react-native-community/picker'; 
import AdoptionOffersScreen from './AdoptionOffersScreen';
console.disableYellowBox = true;

var Name='';
export default class AdoptionUpload extends Component {
  constructor() {
    super();
    this.state = { 
      AnimalType: 'غير محدد',
      AnimalSex: '',
      AnimalAge:'',
      City:'غير محدد',
      checked:'',
      userId:'',
      userID: firebase.auth().currentUser.uid,
      UserName: '',
      PetImage: null,
      uploading: false,
      offerStatus: 'متاح', //-----------------Status1
      //checked: 'first',
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

  PublishAdoptionPost = async () => {
        //-------------------new--------------------------                
        const ArabicExpression = /^[\u0621-\u064A\040/\s/]+$/ //Arabic letters and space only for type,sex,age and city.
        const AnimalAgecheck = ArabicExpression.test(this.state.AnimalAge.trim());

           if(this.state.AnimalType === 'غير محدد'){
            Alert.alert('', 'يجب اختيار نوع حيوان  ',[{ text: 'حسناً'}])
          }
          else if(this.state.AnimalSex === ''){
            Alert.alert('', 'يجب تحديد جنس الحيوان',[{ text: 'حسناً'}])
          }
          else if (this.state.AnimalAge.trim() === '') {
            Alert.alert('', 'يجب تعبئة حقل عمر الحيوان',[{ text: 'حسناً'}])
          }
          else if (AnimalAgecheck === false){
            Alert.alert('', 'يسمح بحروف اللغة العربية والمسافة فقط.',[{ text: 'حسناً'}])
          }  
          else if(this.state.City === 'غير محدد'){
            Alert.alert('', 'يجب اختيار مدينة  ',[{ text: 'حسناً'}])
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
       uName: Name,
       offerStatus: this.state.offerStatus //-------------new: Status 2
      })
     })
     await new AdoptionOffersScreen().render();
     this.props.navigation.navigate('عروض التبني',{
       offerorID: this.state.userID
     })
     Alert.alert('', 'تمت اضافة العرض بنجاح. الرجاء تحديث صفحة عروض التبني',[{ text: 'حسناً'}])
    }
    }

  render(){ 
    const { checked } = this.state;
    let { PetImage } = this.state;
      return (
        <ScrollView style={{ backgroundColor:'#FFFCFC' }}>
        <View style={styles.container}>

        <Image
        style={{ width: 65, height: 70,marginBottom:30,marginTop:30,}}
        source={require('./assets/AleefLogoCat.png')}/>

        
        <Text style={{marginLeft:145, marginBottom:5,color: '#5F5F5F',fontSize: 15,}}>*نوع الحيوان:</Text>
        <Picker
        selectedValue={this.state.AnimalType}
        style={{height: 50, width: 160}}
        itemStyle={styles.itemStyle}
        onValueChange={(val) => this.updateInputVal(val, 'AnimalType')}
        >
       <Picker.Item label= "غير محدد" value= "غير محدد" />
       <Picker.Item label="أرنب" value="أرنب" />
       <Picker.Item label="سمك" value="سمك" />
       <Picker.Item label="عصفور" value="عصفور" />
       <Picker.Item label="قط" value="قط" />
       <Picker.Item label="كلب" value="كلب" />
       </Picker>
        
        <Text style={{marginLeft:145, marginBottom:5,color: '#5F5F5F',fontSize: 15,}}>*جنس الحيوان:</Text>
        <View style={{flexDirection:'row'}}>
          <Text style={{color: '#5F5F5F',fontSize: 15,paddingTop:6}}>غير معروف</Text>
          <RadioButton
          value="غير معروف"
          status={checked === 'غير معروف' ? 'checked' : 'unchecked'}
          color={'#69C4C6'}
          onPress={() => { this.setState({ checked: 'غير معروف', AnimalSex: 'غير معروف'}); }}
        />
        <Text style={{color: '#5F5F5F',fontSize: 15,marginLeft:12,paddingTop:6}} >ذكر</Text>
        <RadioButton
          value="ذكر"
          status={checked === 'ذكر' ? 'checked' : 'unchecked'}
          color={'#69C4C6'}
          onPress={() => { this.setState({ checked: 'ذكر', AnimalSex: 'ذكر' }); }}
        />
        <Text style={{color: '#5F5F5F',fontSize: 15, marginLeft:12,paddingTop:6}}>أنثى</Text>
        <RadioButton
          value="أنثى"
          status={checked === 'أنثى' ? 'checked' : 'unchecked'}
          color={'#69C4C6'}
          onPress={() => { this.setState({ checked: 'أنثى',AnimalSex: 'أنثى'  }); }}
        />
        </View>
          <TextInput
          placeholder="*عمر الحيوان (مثال: ستة أشهر)"
          placeholderTextColor="#a3a3a3"
          style={styles.inputField}
          value={this.state.AnimalAge}
          onChangeText={(val) => this.updateInputVal(val, 'AnimalAge')}
        />
<Text style={{marginLeft:145, marginBottom:5,color: '#5F5F5F',fontSize: 15,}}>*المدينة:</Text>
<Picker
  selectedValue={this.state.City}
  style={{height: 50, width: 160}}
  itemStyle={styles.itemStyle}
  onValueChange={(val) => this.updateInputVal(val, 'City')}
>
  <Picker.Item label= "غير محدد" value= "غير محدد" />
  <Picker.Item label="الرياض" value="الرياض" />
  <Picker.Item label="القصيم" value="القصيم" />
  <Picker.Item label="المدينة المنورة" value="المدينة المنورة" />
  <Picker.Item label="المنطقة الشرقية" value="المنطقة الشرقية" />
  <Picker.Item label="جدة" value="جدة" />
  <Picker.Item label="حائل" value="حائل" />
  <Picker.Item label="مكة المكرمة" value="مكة المكرمة" />
</Picker>
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
},
itemStyle: {
  textAlign: 'center',
}
})