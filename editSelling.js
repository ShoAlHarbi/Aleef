import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl,ActivityIndicator ,Alert, TextInput,navigation} from 'react-native';
import { RadioButton } from 'react-native-paper';
import {Picker} from '@react-native-community/picker'; 
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import uuid from 'react-native-uuid';
import firebase from './firebase';
import { render } from 'react-dom';

export default function editSelling({ route,navigation }) {

    // Information we need from the offer that needs to be edited.
    const currenUID = firebase.auth().currentUser.uid // Current user
    const { thread } = route.params;
    const Name = route.params.Name;
    const postid = route.params.postid; // Post ID

    //Original offer elements to use them to compare and validate.
    const OGPic = route.params.AnimalPic;
    const OGType = route.params.AnimalType;
    const OGSex= route.params.AnimalSex;
    const OGCity = route.params.AnimalCity;    
    const OGAge = route.params.AnimalAge;
    const OGPrice = route.params.AnimalPrice;


    const [AniPic, setAnimalPic] =useState(route.params.AnimalPic) // Set new pic
    const [AniType, setAnimalType] =useState(route.params.AnimalType) // Set new type
    const [AniSex, setAnimalSex] =useState(route.params.AnimalSex) // Set new gender
    const [AniCity, setAnimalCity] =useState(route.params.AnimalCity) // Set new city
    const [AniAge, setAnimalAge] =useState(route.params.AnimalAge) // Set new age
    const [AniPrice, setAnimalPrice] =useState(route.params.AnimalPrice) // Set new price
    const [checked, setChecked] =useState('') // For grnder
    const [uploading, setUploading] =useState(false) // For pic





    useEffect ( ()=> {
       Permissions.askAsync(Permissions.CAMERA_ROLL);
    }, []);


//-------------------------------------Image methods start---------------------------

async function SelectImage (){
  let SelectResult = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
  });
  handleImageSelected(SelectResult);
};


async function handleImageSelected (SelectResult) {
  try {
    setUploading(true);

    if (!SelectResult.cancelled) {
      const uploadUrl = await uploadImageAsync(SelectResult.uri);
      setAnimalPic(uploadUrl);
    }
  } catch (e) {
    console.log(e);
    Alert.alert('', 'فشل رفع الصورة',[{ text: 'حسناً'}])
  } finally {
    setUploading(false);
  }
};


 function RenderUploading () {
  if (uploading) {
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


 function RenderImage () {
  if (!AniPic) {
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
        <Image source={{ uri: AniPic }} style={{ width: 220, height: 180 }} />
      </View>
    </View>
  );
};


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
//-------------------------------------Image methods ends----------------------------





//-------------------------------------edit methods start---------------------------

function confirmEdit (){

  const ArabicExpression = /^[\u0621-\u064A\040/\s/]+$/ //Arabic letters and space only for type,sex,age and city.
  const AnimalAgecheck = ArabicExpression.test(AniAge);

  const Priceexpression = /^[0-9\b]+$/ //Only English numbers
  const Pricecheck = Priceexpression.test(AniPrice.trim());

  if(OGType === AniType && OGSex=== AniSex && OGAge === AniAge.trim() && OGCity=== AniCity && OGPic === AniPic && OGPrice === AniPrice.trim() ){
    Alert.alert('', 'لم تقم بتعديل أي من بيانات العرض ليتم حفظها.',[{ text: 'حسناً'}])
  }
  else if(AniType === 'غير محدد' || AniAge.trim() === '' || AniCity === 'غير محدد' || AniPrice.trim() === ''){
    Alert.alert('', 'لا يمكنك التعديل بقيم فارغة أو غير محددة',[{ text: 'حسناً'}])
  }
  else if (AnimalAgecheck === false) {
    Alert.alert('', ' يسمح بحروف اللغة العربية والمسافة فقط في خانة عمر الحيوان.',[{ text: 'حسناً'}])
  }
  else if (Pricecheck === false){
    Alert.alert('', 'يجب أن يكون السعر عدد صحيح مكون من 0-9',[{ text: 'حسناً'}])
  } 
else{
  Alert.alert(
    "",
    "هل تود حفظ هذه التغييرات؟",
    [
      {
        text: "لا",
        onPress: () => console.log("لا"),
        style: "cancel"
      },
      { text: "نعم", onPress: () => edit() }
    ],
    { cancelable: false }
  );
}
} 

function edit (){

  firebase.database().ref('/SellingPosts/'+postid).update({
    AnimalType: AniType,
    AnimalSex: AniSex,
    AnimalAge: AniAge.trim(),
    City: AniCity,
    PetPicture: AniPic,
    price: AniPrice.trim(),
  }).then((data) => {
    Alert.alert('', 'تم حفظ التغييرات بنجاح.',[{ text: 'حسناً'}])
  });
  navigation.navigate('عروض البيع')
}
//-------------------------------------edit methods ends----------------------------

        return (
        <View>
       <ScrollView style={{ backgroundColor:'#FFFCFC' }}>
       <View style={styles.container}>

        <Image
        style={{ width: 75, height: 85,marginBottom:10, marginTop:15}}
        source={require('./assets/AleefLogoCat.png')}/>

        
        <Text style={{marginLeft:155, marginBottom:5,color: '#283958',fontSize: 15,}}>نوع الحيوان:</Text>
        <Picker
        selectedValue={AniType}
        style={{height: 50, width: 160}}
        itemStyle={styles.itemStyle}
        onValueChange={(val) => setAnimalType(val)}
        >
       <Picker.Item label= "غير محدد" value= "غير محدد" />
       <Picker.Item label="أرنب" value="أرنب" />
       <Picker.Item label="سمك" value="سمك" />
       <Picker.Item label="عصفور" value="عصفور" />
       <Picker.Item label="قط" value="قط" />
       <Picker.Item label="كلب" value="كلب" />
       </Picker>
        



        <Text style={{marginLeft:148, marginBottom:5,color: '#283958',fontSize: 15,}}>جنس الحيوان:</Text>
        <View style={{flexDirection:'row'}}>
          <Text style={{color: '#283958',fontSize: 15,paddingTop:6}}>غير معروف</Text>
          <RadioButton.Group value={AniSex}>
          <RadioButton
          value="غير معروف"
          status={checked === 'غير معروف' ? 'checked' : 'unchecked'}
          color={'#69C4C6'}
          onPress={() => { setChecked('غير معروف'), setAnimalSex('غير معروف') }}
        />
        <Text style={{color: '#283958',fontSize: 15,marginLeft:12,paddingTop:6}} >ذكر</Text>
        <RadioButton
          value="ذكر"
          status={checked === 'ذكر' ? 'checked' : 'unchecked'}
          color={'#69C4C6'}
          onPress={() =>  { setChecked('ذكر'), setAnimalSex('ذكر') }}
        />
        <Text style={{color: '#283958',fontSize: 15, marginLeft:12,paddingTop:6}}>أنثى</Text>
        <RadioButton
          value="أنثى"
          status={checked === 'أنثى' ? 'checked' : 'unchecked'}
          color={'#69C4C6'}
          onPress={() =>  { setChecked('أنثى'), setAnimalSex('أنثى') }}
        />
        </RadioButton.Group>
        </View>



        <Text style={{marginLeft:154, marginBottom:5,color: '#283958',fontSize: 15,marginTop:6}}>عمر الحيوان:</Text>
          <TextInput
          placeholder="عمر الحيوان (مثال: ستة أشهر)"
          placeholderTextColor="#a3a3a3"
          style={styles.inputField}
          value={AniAge}
          onChangeText={(val) => setAnimalAge(val)}
        />



<Text style={{marginLeft:177, marginBottom:5,color: '#283958',fontSize: 15,marginTop:6}}>المدينة:</Text>
<Picker
  selectedValue={AniCity}
  style={{height: 50, width: 160}}
  itemStyle={styles.itemStyle}
  onValueChange={(val) => setAnimalCity(val)}
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

<Text style={{marginLeft:180, marginBottom:5,color: '#283958',fontSize: 15,}}>السعر:</Text>
<TextInput
          placeholder="السعر (ريال سعودي)"
          placeholderTextColor="#a3a3a3"
          style={styles.inputField}
          value={AniPrice}
          onChangeText={(val) => setAnimalPrice(val)}
          keyboardType = 'numeric'
        />


<TouchableOpacity onPress={() => SelectImage()}
                       style={styles.buttonUploadPhoto}>
                    <Text style={styles.textStyleUploadPhoto}>تعديل صورة الحيوان</Text>
                    </TouchableOpacity>
                    {RenderImage()}
                    {RenderUploading()}

        <TouchableOpacity
         style={styles.button} onPress={() => confirmEdit()}>
         <Text style={styles.textStyle}>تعديل</Text>
         </TouchableOpacity>

        </View>
        </ScrollView>
        </View>


          );
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
            marginTop:9,
            borderColor: '#cccccc',
            borderRadius: 20,
            textAlign: 'center',
            backgroundColor: 'white',
            padding: 2,
            margin: 5,
          },
          mandatoryTextStyle: {
            color: '#FF7D4B',
            fontSize: 13,
            marginTop: 5,
          },
          button: {
            backgroundColor: '#69C4C6',
            padding: 10,
            width: 150,
            alignItems: "center",
            marginTop: 22,
            marginBottom: 50,
            borderRadius: 20,
        },
        textStyle: {
          color: 'white',
          fontSize: 17,
          fontWeight: 'bold',
        },
        textStyleUploadPhoto: {
          color: '#283958',
          fontSize: 15,
        },
        buttonUploadPhoto: {
          backgroundColor: '#D4ECEC',
          padding: 10,
          width: 150,
          alignItems: "center",
          marginTop: 15,
          borderRadius: 20,
        },
        itemStyle: {
          textAlign: 'center',
        }
        })         
