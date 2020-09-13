import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';

export default function Homepage() {
    return (
        <View style={styles.container}>
            <Image
                style={{ width: 130, height: 130, marginBottom:250, }}
                source={require('./assets/AleefLogo.png')}
            />
            <View><Text style={styles.textStyle}>الصفحة الرئيسية</Text></View>
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
    textStyle:{
    fontSize:20,
    marginBottom:300,
    color:'#5F5F5F',
    }
});