import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';

const backLogo = require('../../assets/back-logo.png');
const netflixLogo = require('../../assets/netflix-logo.jpg');

const Profile = ({ navigation }) => {
    const [nameProfile, setNameProfile] = useState('');
    const [imageProfile, setImageProfile] = useState('');
    const [emailUser, setEmailUser] = useState('');
    useEffect(() => {
        getData();
    }, []);
    async function getData() {
        try {
            let resultProfile = await SecureStore.getItemAsync("dataUser");
            if (resultProfile) {
                resultProfile = JSON.parse(resultProfile);
                setNameProfile(resultProfile.name);
                setImageProfile(resultProfile.image);
                setEmailUser(resultProfile.email);

            }
        } catch (error) {

        }
    }



    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Home')
                }}>
                    <Image source={backLogo} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
                <Image source={netflixLogo} style={{ width: 150, height: 30 }} />
                <View style={{ width: 30 }} />
            </View>
            <View style={{ alignItems: 'center' }}>
                {imageProfile ? (
                    <Image source={{ uri: imageProfile }} style={{ width: 100, height: 100, marginBottom: 20 }} />
                ) : (
                    <Text>No Profile Image Available</Text>
                )}
                <Text style={{ color: 'white', fontSize: 30, marginBottom: 10 }}>{nameProfile}</Text>
                <Text style={{ color: 'grey', fontSize: 20 }}>{emailUser}</Text>
            </View>
            <TouchableOpacity onPress={async () => {
                await SecureStore.deleteItemAsync('emailUser');
                await SecureStore.deleteItemAsync('dataUser');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            }}>
                <View style={{ backgroundColor: 'red', padding: 10, alignItems: 'center', marginHorizontal: 70, borderRadius: 10, marginBottom: 30 }}>
                    <Text style={{ color: 'white' }}>
                        Sign Out
                    </Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'space-between'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
})