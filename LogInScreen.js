import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity } from 'react-native';

export default function LogInScreen() {
    return (
        <View style={styles.container}>
            <Image
                style={{ width: 200, height: 200 }}
                source={require('./assets/AleefLogo.png')}
            />
            <TextInput
                placeholder="اسم المستخدم"
                placeholderTextColor="#a3a3a3"
                style={styles.inputField}
            />
            <TextInput
                placeholder="كلمة المرور"
                placeholderTextColor="#a3a3a3"
                secureTextEntry={true}
                style={styles.inputField}
            />
            <TouchableOpacity style={styles.button}>
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
        marginTop: 40,
        marginBottom: 85,
        borderRadius: 20,

    },

    textStyle: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
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

    }
});