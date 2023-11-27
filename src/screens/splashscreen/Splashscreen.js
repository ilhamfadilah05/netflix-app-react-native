import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const logoNetflix = require('../../assets/netflix-logo.jpg');
const Splashscreen = ({ navigation }) => {
    useEffect(() => {
        const delay = 3000;

        const timeoutId = setTimeout(() => {
            getToken();
        }, delay);

        return () => clearTimeout(timeoutId);
    }, []);

    async function getToken() {
        let result = await SecureStore.getItemAsync("dataUser");
        if (result) {
            navigation.replace('Home');
        } else {
            navigation.replace('Login');
        }
    }
    return (
        <View style={styles.container}>
            <Image source={logoNetflix} style={{ width: 300, height: 100 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
})
export default Splashscreen