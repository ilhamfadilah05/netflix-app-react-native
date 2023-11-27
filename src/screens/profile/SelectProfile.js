import { StyleSheet, View, SafeAreaView, Image, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store';
import { useRoute } from '@react-navigation/native';

const netflixLogo = require('../../assets/netflix-logo.jpg');

const SelectProfile = ({ navigation }) => {
    const route = useRoute();

    const { email } = route.params;

    const [dataProfile, setDataProfile] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDataProfile();
    }, []);

    async function getDataProfile() {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;

        try {
            const response = await fetch(apiUrl + '/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log("response =", data);
            if (response.ok) {
                if (data.data) {
                    setDataProfile(data.data);
                    setLoading(false);
                } else {
                    console.error("Data is missing in the response");
                }
            } else {
                getDataProfile()
            }
        } catch (error) {
            getDataProfile()
        } finally {
            setLoading(false);
        }
    }


    async function handleNavigation(name, image) {
        try {
            await SecureStore.setItemAsync('dataUser', JSON.stringify({
                'email': email,
                'name': name,
                'image': image
            }));

            navigation.replace('Home');
        } catch (error) {
            console.error('Error handling profile:', error);
        }
    }

    async function handleUpdateUser(name, image) {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        try {
            const response = await fetch(apiUrl + '/auth/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name, image })
            });
            const data = await response.json();
            if (response.ok) {
                await SecureStore.setItemAsync('dataUser', JSON.stringify({
                    'email': email,
                    'name': name,
                    'image': image
                }));
                navigation.replace('Home');
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert(error);
        }
    }
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => handleUpdateUser(item.name, item.image)}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        marginBottom: 4,
                    }}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: 'white' }}>{item.name}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{ paddingHorizontal: 50, paddingVertical: 10, justifyContent: 'center' }}>
                <View style={styles.header}>
                    <Image source={netflixLogo} style={{ width: 150, height: 30 }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                    <Text style={{ color: 'white', fontSize: 20 }}>
                        Who's Watching?
                    </Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="white" /> // Display loading indicator
                ) : (
                    <FlatList
                        data={dataProfile}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `item-name-${index}`}
                        numColumns={2}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'black'
    },
    header: {
        flexDirection: 'row', justifyContent: 'center', marginBottom: 50
    },

})

export default SelectProfile;