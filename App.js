import * as React from 'react';
import { StyleSheet, View, Text, TextInput, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './SignUpScreen';
import index from './index';
import LogInScreen from './LogInScreen';
import Homepage from './Homepage';
import { color } from 'react-native-reanimated';


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