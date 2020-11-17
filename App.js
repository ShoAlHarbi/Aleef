import * as React from 'react';
import { StyleSheet, View, Text, TextInput, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './SignUpScreen';
import index from './index';
import LogInScreen from './LogInScreen';
import Homepage from './Homepage';
import { color } from 'react-native-reanimated';
import AdminScreen from './AdminScreen';
import forgetPassword from './forgetPassword'
import AdoptionOffers from './AdoptionOffersScreen'
import AdoptionUpload from './AdoptionUpload'
import SellingOffers from './SellingOffersScreen'
import SellingUpload from './SellingUpload'
import MissingPetPosts from './MissingPetPosts'
import MissingPetUpload from './MissingPetUpload'
import AdoptionAdminScreen from './AdoptionAdminScreen'
import MissingPetAdmin from './MissingPetAdmin'; 
import chatScreen from './chatScreen';
import allChatsScreen from './allChatsScreen';
import SellingAdminScreen from './SellingAdminScreen';
import profile from './profile' ;
import editProfile from './editProfile';
import editAdoption from './editAdoption'; //----------------- EDIT 1
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComments} from '@fortawesome/free-solid-svg-icons';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications'

const Stack = createStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="index">
        <Stack.Screen options={{
          headerShown: false
        }} name="مرحباً في أليف" component={index} />
        
        <Stack.Screen options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        }} name="تسجيل جديد" component={SignUpScreen} />

        <Stack.Screen
          backgroundColor='#FFFCFC'
          options={{
          headerShown: true,
          headerStyle: {
          backgroundColor: '#FFFCFC',
          shadowColor: '#FFFCFC',
          },
      }} name="تسجيل الدخول" component={LogInScreen} />

      <Stack.Screen
       backgroundColor='#FFFCFC'
       options={{
       headerShown: false,
       headerStyle: {
       backgroundColor: '#FFFCFC',
      shadowColor: '#FFFCFC',
      },
      }} name="الصفحة الرئيسية" component={Homepage} />

      <Stack.Screen
       backgroundColor='#FFFCFC'
       options={{
       headerShown: false,
       headerStyle: {
       backgroundColor: '#FFFCFC',
      shadowColor: '#FFFCFC',
      },
      }} name="لوحة التحكم" component={AdminScreen} />

          <Stack.Screen options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        }} name="نسيت كلمة المرور" component={forgetPassword} />  
  
        <Stack.Screen options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        }} name="عروض التبني" component={AdoptionOffers} /> 

        <Stack.Screen options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        }} name="جميع عروض التبني" component={AdoptionAdminScreen} /> 

         <Stack.Screen options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        }} name="اضافة عرض تبني" component={AdoptionUpload} />  

         <Stack.Screen options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        }} name="عروض البيع" component={SellingOffers} /> 
        <Stack.Screen options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        }} name="اضافة عرض بيع" component={SellingUpload} /> 

        <Stack.Screen options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        }} name="جميع عروض البيع" component={SellingAdminScreen} />

        <Stack.Screen options={({route})=>({
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
         title: route.params.name,  
         headerTitleAlign: "center"
        })} name="صفحة المحادثة" component={chatScreen} />

        <Stack.Screen options={({route})=>({
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        //  title: route.params.thread.name 
        })} name="جميع المحادثات" component={allChatsScreen} />

        <Stack.Screen options={({route})=>({
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        })} name="الإبلاغ عن حيوان مفقود" component={MissingPetPosts} />

         <Stack.Screen options={({route})=>({
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        })} name="اضافة بلاغ" component={MissingPetUpload} />

       <Stack.Screen options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        }} name="جميع البلاغات" component={MissingPetAdmin} />
        <Stack.Screen options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        }} name="الصفحة الشخصية" component={profile} /> 
         <Stack.Screen options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        }} name="تعديل صفحة المستخدم" component={editProfile} />    




       <Stack.Screen options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        }} name="تعديل عرض التبني" component={editAdoption} /> 
        
        </Stack.Navigator>





    </NavigationContainer>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;