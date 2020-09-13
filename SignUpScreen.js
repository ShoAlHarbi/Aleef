import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity } from 'react-native';

export default function SignUpScreen() {
    return (
        <View style={styles.container}>
            <View >
                <Image
                    style={{ width: 200, height: 200, marginBottom: 30, }}
                    source={require('./assets/AleefLogo.png')}
                />
            </View>

            <TextInput
                placeholder="الاسم"
                placeholderTextColor="#a3a3a3"
                style={styles.inputField}
            />
            <TextInput
                placeholder="اسم المستخدم"
                placeholderTextColor="#a3a3a3"
                style={styles.inputField}
            />
            <TextInput
                placeholder="البريد الالكتروني"
                placeholderTextColor="#a3a3a3"
                keyboardType='email-address'
                style={styles.inputField}
            />
            <TextInput
                placeholder="كلمة المرور"
                placeholderTextColor="#a3a3a3"
                secureTextEntry={true}
                style={styles.inputField}
            />
            <TextInput
                placeholder="تأكيد كلمة المرور"
                placeholderTextColor="#a3a3a3"
                secureTextEntry={true}
                style={styles.inputField}
            />
            <TouchableOpacity style={styles.button}>
                <Text style={styles.textStyle}>تسجيل</Text>
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
