import { StyleSheet, View, Image, TextInput, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const bgAuth = require('../../assets/bg_auth.jpeg');

const Register = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');

    const validateEmail = (inputText) => {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(inputText);
    };

    const validasiRegister = () => {
        if (email === "") {
            alert('Email cannot be empty!');
        } else if (!validateEmail(email)) {
            alert('Please enter the correct email!')
        } else if (password === "") {
            alert('Password cannot be empty!');
        } else if (confPassword === "") {
            alert('Confirm Password  cannot be empty!');
        } else if (confPassword !== password) {
            alert('Confirm password is not the same');
        } else {
            handleRegisterAPI();
        }
    };

    async function handleRegisterAPI() {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        const name = " ";
        const image = " ";

        try {
            console.log("API URL = " + apiUrl);
            const body = JSON.stringify({ email, password, image, name });
            const response = await fetch(apiUrl + '/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body
            });
            const data = await response.json();
            console.log("response =", data);
            if (response.ok) {
                navigation.replace('SelectProfile', {
                    email: email,
                });
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("There seems to be an error, please try again later");
        }
    }
    async function handleRegisterDummy() {
        try {
            let result = await SecureStore.getItemAsync("listUser");

            if (result) {
                result = JSON.parse(result);
                const found = result.find(item => item.email === email);
                if (found) {
                    alert('Email already exists!');
                    return;
                }
                result.push({
                    'email': email,
                    'password': password
                });
                const listString = JSON.stringify(result);
                await SecureStore.setItemAsync('listUser', listString);
                let result2 = await SecureStore.getItemAsync("listUser");
                console.log("DATA USER = " + result2);
                await SecureStore.setItemAsync('emailUser', email);
                navigation.replace('SelectProfile');
            } else {
                let list = [];
                list.push({
                    'email': email,
                    'password': password
                });
                const listString = JSON.stringify(list);
                await SecureStore.setItemAsync('listUser', listString);
                let result2 = await SecureStore.getItemAsync("listUser");
                console.log("DATA USER = " + result2);
                await SecureStore.setItemAsync('emailUser', email);
                navigation.replace('SelectProfile');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data.');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.overlay}>
                <Image source={bgAuth} style={styles.backgroundImage} resizeMode="cover" />
                <View style={styles.textInputContainer}>
                    <TextInput
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.textInput}
                        placeholder="Email or phone number"
                        placeholderTextColor="white"
                    />
                    <TextInput
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style={styles.textInput}
                        placeholder="Password"
                        secureTextEntry={true}
                        placeholderTextColor="white"
                    /><TextInput
                        value={confPassword}
                        onChangeText={text => setConfPassword(text)}
                        style={styles.textInput}
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                        placeholderTextColor="white"
                    />
                    <TouchableOpacity style={styles.button} onPress={validasiRegister}>
                        <Text style={{ color: 'white', fontSize: 18 }}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 100 }}>
                        <Text style={{ color: 'white' }}>Already on Netflix?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={{ color: 'red', paddingLeft: 5 }}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        opacity: 0.15,
        padding: 0
    },
    textInputContainer: {
        position: 'absolute',
        bottom: 20,
        left: 50,
        right: 50,
    },
    textInput: {
        borderColor: '#B90020',
        borderWidth: 1.5,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        color: 'white',
    },
    button: {
        backgroundColor: '#B90020',
        marginBottom: 10,
        marginTop: 10,
        width: '100%',
        padding: 10,
        alignItems: 'center',
        borderRadius: 10
    },
    logo: {
        backgroundColor: 'white',
        borderRadius: 100,
        padding: 8,
        margin: 5
    }
});

export default Register;
