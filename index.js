import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function index({ navigation }) {
    return (
        <View style={styles.container}>
            <Image
                style={{ width: 260, height: 260 }}
                source={require('./assets/AleefLogo.png')}
            />
            <TouchableOpacity onPress={() => navigation.navigate('تسجيل جديد')}
                style={styles.button}>
                <Text style={styles.textStyle}>سجّل معنا</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => navigation.navigate('تسجيل الدخول')}
                style={styles.button}>
                <Text style={styles.textStyle}>تسجيل دخول</Text>

            </TouchableOpacity>



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
        backgroundColor: '#69C4C6',
        padding: 10,
        width: 250,
        alignItems: "center",
        marginTop: 15,
        borderRadius: 20,

    },
    textStyle: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    }


});