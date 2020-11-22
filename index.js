import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity,ImageBackground } from 'react-native';

export default function index({ navigation }) {
    return (
        
        <View style={styles.container}>
         <ImageBackground
         style={{ width: 457, height: 700, marginLeft:5}}
         source={require('./assets/background.png')}>   
         <View style={{marginTop:470, marginLeft:105}}>
         <TouchableOpacity onPress={() => navigation.navigate('تسجيل جديد')}
                style={styles.button}>
                <Text style={styles.textStyle}>سجّل معنا</Text>
                <View></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('تسجيل الدخول')}
                style={styles.button}>
                <Text style={styles.textStyle}>تسجيل دخول</Text>
            </TouchableOpacity>  
         </View>
             
         </ImageBackground>



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

    button: {
        backgroundColor: '#D4ECEC',
        padding: 10,
        width: 250,
        alignItems: "center",
        marginTop: 30,
        borderRadius: 20,

    },
    textStyle: {
        color: '#283958',
        fontSize: 17,
        fontWeight: 'bold',
    }


});