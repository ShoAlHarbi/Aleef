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
import AdoptionUpload from './AdoptionUpload'
import AdoptionOffersScreen from './AdoptionOffersScreen';


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
        }} name="رفع منشور التبني" component={AdoptionUpload} />

<Stack.Screen options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFCFC',
            shadowColor: '#FFFCFC',
          },
        }} name="عروض التبني" component={AdoptionOffersScreen} />

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